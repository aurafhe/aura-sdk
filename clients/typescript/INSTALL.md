# Installing `@aura/fhe-client` Locally

This guide covers how to install the TypeScript SDK from a local copy of this repository.

---

## Option 1 — Install from the local directory (recommended for development)

From the root of this repo, or any project folder:

```bash
npm install /path/to/aura-sdk/clients/typescript
```

The package has a `prepare` script that automatically runs `npm run build`, so the `dist/` output is always up to date.

---

## Option 2 — Install from a packed tarball

### 1. Build and pack

```bash
cd clients/typescript
npm run build        # compiles TypeScript to dist/
npm pack             # creates aura-fhe-client-<version>.tgz
```

You will see a file like `aura-fhe-client-0.3.0.tgz` in the directory.

### 2. Install the tarball in your project

```bash
cd /path/to/your-project
npm install /path/to/aura-sdk/clients/typescript/aura-fhe-client-0.3.0.tgz
```

---

## Option 3 — Link for active development

Use `npm link` when you are simultaneously editing the SDK source and a consumer project:

```bash
# 1. Register the local package globally
cd clients/typescript
npm link

# 2. Link it into your consumer project
cd /path/to/your-project
npm link @aura/fhe-client
```

Any change you make in `clients/typescript/src/` will be reflected in your project after rebuilding (`npm run build` or `npm run dev`).

---

## Verify the installation

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect()
console.log(await fhe.health())  // { status: "ok" }
```

If the import resolves and `connect()` runs, the local installation is working.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `Cannot find module '@aura/fhe-client'` | Ensure `npm run build` produced `dist/index.js` and `dist/index.d.ts`. |
| `dist/` is missing | Run `npm run build` inside `clients/typescript/`. The `prepare` script usually handles this automatically. |
| Changes are not reflected (linked package) | Re-run `npm run build` in the SDK directory after editing source files. |
