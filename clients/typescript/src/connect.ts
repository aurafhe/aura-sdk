/**
 * One-liner connect helper.
 *
 *   import { connect } from '@aura/fhe-client'
 *   const fhe = await connect()
 *
 * Handles the three things every new user trips over:
 *   1. Default base URL = process.env.AFHE_API_URL ?? 'https://api.afhe.io:8443'.
 *   2. Self-signed TLS — auto-accepted when the host is localhost / 127.0.0.1.
 *      (In Node only; browsers trust the system CA store.)
 *   3. Auto-load — tells the server to load the standard key paths
 *      ('file/skb', 'file/pkb', 'file/dictb') before returning. Skip with
 *      `autoLoad: false` and call `client.load(...)` yourself.
 */

import { AfheClient, type AfheClientOptions, AfheApiError } from "./index";

export interface ConnectOptions extends Partial<AfheClientOptions> {
  /**
   * Trust self-signed TLS certificates on localhost. Defaults to `true` for
   * localhost, `false` for any other host. Only effective in Node.js
   * (browsers use the system CA store).
   */
  insecureTLS?: boolean;
  /**
   * Auto-load standard key blocks on the server before returning. Defaults
   * to `true`. Set to `false` to manage key loading explicitly.
   */
  autoLoad?: boolean;
  /**
   * Override the key block paths sent to the server's `POST /load`. The
   * defaults match the standard Aura FHE server layout.
   */
  keys?: { skb?: string; pkb?: string; dictb?: string };
  /**
   * Health-check the server before returning. Defaults to `true`. Failure
   * throws an `AfheApiError`.
   */
  healthCheck?: boolean;
}

const DEFAULT_BASE_URL = "https://api.afhe.io:8443";
const DEFAULT_KEYS = { skb: "file/skb", pkb: "file/pkb", dictb: "file/dictb" } as const;

/**
 * Connect to an Aura FHE coprocessor and return a ready-to-use client.
 *
 * Reads `AFHE_API_URL` from the environment if `baseUrl` is not given.
 * Tolerates the self-signed certificate that the reference local server
 * ships with, but only for localhost.
 */
export async function connect(opts: ConnectOptions = {}): Promise<AfheClient> {
  const baseUrl = opts.baseUrl ?? readEnv("AFHE_API_URL") ?? DEFAULT_BASE_URL;
  if (opts.insecureTLS === true && !isLocalhost(baseUrl)) {
    throw new Error("connect(): insecureTLS is only allowed for localhost");
  }
  const insecureTLS = opts.insecureTLS ?? isLocalhost(baseUrl);
  const autoLoad = opts.autoLoad ?? true;

  const fetchImpl = opts.fetch ?? (await buildFetch(insecureTLS));

  const client = new AfheClient({
    baseUrl,
    fetch: fetchImpl,
    headers: opts.headers,
    signal: opts.signal,
    timeoutMs: opts.timeoutMs ?? 600_000,
    retries: opts.retries ?? 0,
  });

  if (opts.healthCheck ?? true) {
    const res = await client.health().catch((err) => {
      throw new AfheApiError(
        `cannot reach Aura FHE coprocessor at ${baseUrl}: ${err.message ?? String(err)}`,
        0,
        err,
      );
    });
    if (res.status !== "ok") {
      throw new AfheApiError(
        `Aura FHE coprocessor at ${baseUrl} returned unhealthy status: ${res.status}`,
        0,
        res,
      );
    }
  }

  if (autoLoad) {
    const keys = { ...DEFAULT_KEYS, ...opts.keys };
    await client.load(keys);
  }

  return client;
}

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

function readEnv(name: string): string | undefined {
  // Node / Deno / Bun all set globalThis.process.env. Safe in browsers
  // because typeof checks short-circuit before touching the property.
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[name];
}

function isLocalhost(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]";
  } catch {
    return false;
  }
}

/**
 * Build a fetch that ignores TLS verification when `insecure` is set. In Node
 * we wrap `undici`'s default dispatcher with `rejectUnauthorized: false`. In
 * browsers / Deno / Bun / Workers, TLS verification is handled by the
 * runtime and cannot be relaxed from JS, so we return the global fetch
 * unchanged.
 */
async function buildFetch(insecure: boolean): Promise<typeof fetch> {
  const f = globalThis.fetch?.bind(globalThis);
  if (!f) {
    throw new Error("connect(): no global fetch available — pass `fetch:` explicitly");
  }
  if (!insecure) return f;

  // Node 18+ ships undici as the global fetch. We can scope the relaxed TLS
  // to one Agent without polluting the rest of the program.
  const isNode =
    typeof process !== "undefined" &&
    process.versions != null &&
    typeof (process.versions as { node?: string }).node === "string";
  if (!isNode) return f;

  try {
    // Dynamic import keeps this out of the browser bundle.
    const undici = await import(/* webpackIgnore: true */ "undici").catch(() => null);
    if (!undici) return f;
    const Agent = (undici as { Agent: new (opts: unknown) => unknown }).Agent;
    const agent = new Agent({ connect: { rejectUnauthorized: false } });
    return ((input: RequestInfo | URL, init: RequestInit = {}) => {
      return (undici as { fetch: typeof fetch }).fetch(input, {
        ...init,
        // undici accepts a `dispatcher` field on RequestInit.
        dispatcher: agent,
      } as RequestInit);
    }) as typeof fetch;
  } catch {
    return f;
  }
}
