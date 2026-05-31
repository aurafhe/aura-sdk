# Installing `@aura/fhe-cli` Locally

This guide covers how to install the CLI from a local copy of this repository.

---

## Prerequisites

- **Node.js 18+** (verified on Node 18.x and 20.x)
- The CLI depends on `@aura/fhe-client`. The local tarball bundles it automatically, so no separate install is required.

---

## Option 1 — Global install (recommended)

Installs the `fhe` command into your global npm bin path:

```bash
npm install -g /path/to/aura-sdk/clients/cli/aura-fhe-cli-0.3.0.tgz
```

After installation, `fhe` is available everywhere:

```bash
fhe --help
fhe connect --url https://api.afhe.io:8443
```

---

## Option 2 — Local project install

Installs the CLI into a specific project without polluting your global environment:

```bash
cd /path/to/your-project
npm install /path/to/aura-sdk/clients/cli/aura-fhe-cli-0.3.0.tgz
```

Run it via `npx`:

```bash
npx fhe --help
npx fhe connect --url https://api.afhe.io:8443
```

Or add a script to `package.json`:

```json
{
  "scripts": {
    "fhe": "fhe"
  }
}
```

```bash
npm run fhe -- --help
```

---

## Option 3 — Run without installing

Use `npx` to execute the tarball directly without any persistent install:

```bash
npx /path/to/aura-sdk/clients/cli/aura-fhe-cli-0.3.0.tgz --help
```

This is useful for one-off commands or CI pipelines.

---

## Option 4 — Link for active development

When you are simultaneously editing the CLI source and testing changes:

```bash
# 1. Register the local CLI globally
cd /path/to/aura-sdk/clients/cli
npm link

# 2. Use it anywhere
fhe --help
```

Any change you make in `clients/cli/bin/fhe.js` is reflected immediately.

---

## Verify the installation

```bash
fhe --help
```

You should see the full help text, including lifecycle commands (`connect`, `health`, `functions`), encrypt/decrypt shortcuts, and compute operations.

Test against the live coprocessor:

```bash
fhe connect --url https://api.afhe.io:8443
fhe health
```

If `fhe health` returns `{"status":"ok"}`, the CLI is fully operational.

---

## Building the tarball yourself

If you modified the CLI or the TypeScript client and need a fresh package:

```bash
# 1. Build and pack the TypeScript client first
cd clients/typescript
npm run build
npm pack

# 2. Bundle it into the CLI and pack
cd ../cli
npm pack
```

The resulting `aura-fhe-cli-0.3.0.tgz` is self-contained and can be shared or installed offline.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `command not found: fhe` | Ensure the global npm bin directory is in your `PATH`, or use `npx fhe`. |
| `Cannot find module '@aura/fhe-client'` | Rebuild the CLI tarball — the bundled dependency may be stale. Follow "Building the tarball yourself" above. |
| `fhe` shows old behavior after editing source | If globally linked, run `npm link` again in `clients/cli/`. If globally installed, reinstall the new tarball. |
| Self-signed TLS errors on localhost | Pass `--insecure` to `fhe connect`: `fhe connect --url https://localhost:8443 --insecure` |
