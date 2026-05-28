# @aura/fhe-client

TypeScript client for the Aura Fully Homomorphic Encryption coprocessor.
**Zero dependencies. Isomorphic.** CI verifies Node 18+; modern browsers should
work anywhere a WHATWG `fetch` implementation is available.

Published on npm from the [aura-sdk](https://github.com/aurafhe/aura-sdk) monorepo
(`clients/typescript/`).

```bash
npm install @aura/fhe-client
```

To hack on the client itself, clone the repo and work in `clients/typescript/`:

```bash
git clone https://github.com/aurafhe/aura-sdk.git
cd aura-sdk/clients/typescript
npm install
npm test
```

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect({
  baseUrl: process.env.AFHE_API_URL ?? 'https://api.afhe.io:8443',
})                                          // auto-TLS, auto-load keys
const sum = await fhe.addInt(
  await fhe.encryptInt(25),
  await fhe.encryptInt(17),
)
console.log(await fhe.decryptInt(sum))       // "42"
```

That's the whole quickstart. The rest of this README documents the surface.

---

## `connect(opts?)`

The one-line entry point. Returns a ready-to-use `AfheClient`.

```ts
const fhe = await connect({
  baseUrl:      'https://api.example.com:8443',  // default: $AFHE_API_URL or https://api.afhe.io:8443
  insecureTLS:  false,                            // only allowed for localhost
  autoLoad:     true,                             // default: true — POSTs /load with the standard key paths
  keys: {                                         // override the key paths
    skb:   'file/skb',
    pkb:   'file/pkb',
    dictb: 'file/dictb',
  },
  healthCheck:  true,                             // default: true — fails fast if server is down
  timeoutMs:    600_000,                          // default: 600s
  retries:      0,                                // default: 0
  headers:      { 'X-Tenant': 'acme' },
})
```

Self-signed TLS is supported only on localhost. For any other host, install a
real certificate before connecting.

---

## `new AfheClient(opts)`

If you need full control over the lifecycle (e.g. custom auth flow, your own
load orchestration), construct the client directly:

```ts
import { AfheClient } from '@aura/fhe-client'

const fhe = new AfheClient({
  baseUrl: 'https://api.example.com:8443',
  timeoutMs: 30_000,
})

await fhe.load({ skb: 'file/skb', pkb: 'file/pkb', dictb: 'file/dictb' })
```

| Option | Type | Default | Notes |
|---|---|---|---|
| `baseUrl` | string | **required** | Server URL |
| `fetch` | `typeof fetch` | `globalThis.fetch` | Custom fetch (e.g. signed requests) |
| `headers` | record | `{}` | Sent on every request |
| `signal` | `AbortSignal` | – | Default cancellation signal |
| `timeoutMs` | number | – | Per-request timeout |
| `retries` | number | `0` | Exponential-backoff retries on 5xx / network errors |

---

## Surface

```
fhe.health()                       fhe.functions()                fhe.init()
fhe.keygen(opts?)                  fhe.load(paths)

fhe.encryptInt(v)                  fhe.encryptFloat(v)            fhe.encryptString(v)         fhe.encryptBinary(v)
fhe.encryptPublicInt(v)            fhe.encryptPublicFloat(v)      fhe.encryptPublicString(v)   fhe.encryptPublicBinary(v)
fhe.decryptInt(c)                  fhe.decryptFloat(c)            fhe.decryptString(c)         fhe.decryptBinary(c)

fhe.addInt(a,b)                    fhe.addFloat(a,b)
fhe.subInt(a,b)                    fhe.subFloat(a,b)
fhe.mulInt(a,b)                    fhe.mulFloat(a,b)
fhe.divInt(a,b)                    fhe.divFloat(a,b)

fhe.xor(a,b)   fhe.and(a,b)   fhe.or(a,b)   fhe.not(a)
fhe.shiftLeft(c, n)   fhe.shiftRight(c, n)
fhe.rotateLeft(c, n)  fhe.rotateRight(c, n)
fhe.cmux(sel, a, b)

fhe.compare(a, b)                  fhe.abs(c)
fhe.concatString(a, b)             fhe.substring(s, start, end)

fhe.sqrt(c)   fhe.log(c)   fhe.exp(c)
fhe.sin(c)    fhe.cos(c)   fhe.tan(c)
fhe.asin(c)   fhe.acos(c)  fhe.atan(c)
fhe.sinh(c)   fhe.cosh(c)  fhe.tanh(c)
fhe.asinh(c)  fhe.acosh(c) fhe.atanh(c)
fhe.power(c, n, m)

fhe.genSign(message)               fhe.verifySign(message, sig)

fhe.call(fnName, args)             // escape hatch for any operation
```

Each method returns a `Promise`. Branded `Ciphertext` types prevent you from
passing plaintext where a ciphertext is expected.

---

## Domains and key requirements

| Operation group | Domains | Key blocks |
|---|---|---|
| Encrypt (private) / Decrypt / Sign | int, float, string, binary | SKB |
| Encrypt (public) | int, float, string, binary | PKB |
| Add / Sub / Mul / Div | int, float | DictB |
| Compare / Abs | int, float, string, binary | DictB |
| XOR / AND / OR / NOT / Shift / Rotate / CMux | binary | DictB |
| Concat / Substring | string | DictB |
| Scientific (sqrt, log, sin, …) | float | PKB + DictB |
| Verify | bytes | DictB |

---

## Errors

```ts
import { AfheClient, AfheApiError, connect } from '@aura/fhe-client'

try {
  const fhe = await connect()
  await fhe.call('NotARealFunction', [])
} catch (err) {
  if (err instanceof AfheApiError) {
    console.error(`HTTP ${err.status}: ${err.message}`)
    console.error(err.body)
  }
}
```

| Status | Cause |
|---|---|
| `0`   | Network error, DNS failure, TLS error, timeout |
| `400` | Unknown function, wrong arity, invalid domain, malformed JSON |
| `404` | Unknown route |
| `500` | Server error (op not supported by build, keys not loaded, …) |

---

## Recommended keygen profile

```ts
await fhe.keygen({
  m: 2,
  n: 4,
  q: 2147483647,
  p: 512,
  delta: 0.001,
  force: false,
})
```

---

## Examples

- [01-hello-fhe-node](../../examples/01-hello-fhe-node/) — encrypt → add → decrypt
- [04-browser](../../examples/04-browser/) — same demo in a single HTML file
- [06-secure-sum](../../examples/06-secure-sum/) — two-party encrypted sum

---

## License

MIT
