# 04 — Browser demo

A single-file HTML demo that connects to the coprocessor straight from the
browser. Plaintext values are typed into the page; only ciphertext leaves the
page.

```bash
# 1. Start the coprocessor on https://localhost:8443
# 2. Serve this directory:
npx serve .
# 3. Open http://localhost:3000 in your browser (or whatever port serve picked).
```

Notes:

- The browser cannot accept self-signed certificates without a manual click-through
  in chrome://settings. Either install a real cert on the coprocessor or visit
  `https://localhost:8443/health` first and accept the warning.
- The current HTML file still points at `https://esm.sh/@aura/fhe-client@0.3.0`,
  which will only work after the npm package is published. Until then, treat this
  example as a reference UI and bundle the TypeScript client from source in your
  own app.
