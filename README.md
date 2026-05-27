# Aura FHE SDK

HTTP clients for the Aura FHE coprocessor.

This repo is SDK-only: TypeScript, Go, Python, and CLI clients that all speak
the same HTTPS+JSON protocol.

> Start with [WALKTHROUGH](docs/WALKTHROUGH.md), then keep
> [QUICKSTART](docs/QUICKSTART.md) open beside your editor.

---

## Install status

This repo is **build from source for now**.

- `@aura/fhe-client` is not published on npm yet
- `@aura/fhe-cli` is not published on npm yet
- `aura-fhe` is not published on PyPI yet
- the Go client is usable from the repo, but does not have a stable tagged release yet

Clone the repo, build the client you need, and point it at:

```bash
export AFHE_API_URL=https://api.afhe.io:8443
```

## Quickstart

### TypeScript

```bash
git clone https://github.com/aurafhe/aura-sdk.git
cd aura-sdk/clients/typescript
npm install
npm run build
# in your app: npm install /path/to/aura-sdk/clients/typescript
```

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect({
  baseUrl: process.env.AFHE_API_URL ?? 'https://api.afhe.io:8443',
})
const a = await fhe.encryptInt(25)
const b = await fhe.encryptInt(17)
const sum = await fhe.addInt(a, b)

console.log(await fhe.decryptInt(sum)) // "42"
```

### Go

```bash
go get github.com/aurafhe/aura-sdk/clients/go@main
```

```go
import afhe "github.com/aurafhe/aura-sdk/clients/go"

c, _ := afhe.Connect(ctx, afhe.ConnectOptions{
    BaseURL: "https://api.afhe.io:8443",
})
a, _ := c.EncryptInt(ctx, "25")
b, _ := c.EncryptInt(ctx, "17")
sum, _ := c.AddInt(ctx, a, b)
pt, _ := c.DecryptInt(ctx, sum)

fmt.Println(pt) // "42"
```

### Python

```bash
git clone https://github.com/aurafhe/aura-sdk.git
pip install ./aura-sdk/clients/python
```

```python
from aura_fhe import connect

fhe = connect(base_url="https://api.afhe.io:8443")
a = fhe.encrypt_int(25)
b = fhe.encrypt_int(17)

print(fhe.decrypt_int(fhe.add_int(a, b)))  # "42"
```

### CLI

```bash
git clone https://github.com/aurafhe/aura-sdk.git
cd aura-sdk/clients/cli
npm install ../typescript
npm install
npm link

fhe connect --url https://api.afhe.io:8443
fhe enc int 25 > a.ct
fhe enc int 17 > b.ct
fhe add int "$(cat a.ct)" "$(cat b.ct)" | fhe dec int
```

---

## What the SDK covers

- Encrypt / decrypt for `int`, `float`, `string`, `binary`
- Public-key encryption
- Arithmetic, bitwise, compare, string, and scientific operations
- Signing / verification
- Generic escape hatch: `call(fn, args)`

All clients expose the same protocol surface in language-idiomatic form.

---

## Recommended keygen profile

Use the same profile everywhere unless your deployment team tells you otherwise:

```json
{
  "m": 2,
  "n": 4,
  "q": 2147483647,
  "p": 512,
  "delta": 0.001
}
```

Full details: [docs/KEY_MANAGEMENT.md](docs/KEY_MANAGEMENT.md)

---

## Repository layout

```text
clients/
  typescript/   @aura/fhe-client
  go/           github.com/aurafhe/aura-sdk/clients/go
  python/       aura-fhe
  cli/          @aura/fhe-cli

examples/
  01-hello-fhe-node/
  02-hello-fhe-go/
  03-hello-fhe-python/
  04-browser/
  05-cli/
  06-secure-sum/

docs/
  QUICKSTART.md
  WALKTHROUGH.md
  PROTOCOL.md
  KEY_MANAGEMENT.md
  ARCHITECTURE.md
  SECURITY.md
```

---

## Running against a server

Point the SDK at any compatible Aura FHE coprocessor:

- default: `https://api.afhe.io:8443`
- local dev: `export AFHE_API_URL=https://localhost:8443`
- or pass `baseUrl` / `BaseURL` / `base_url`

`connect()` also auto-loads the standard key paths by default:

- `file/skb`
- `file/pkb`
- `file/dictb`

---

## Links

- Docs: [docs.afhe.io](https://docs.afhe.io)
- Project: [afhe.io](https://afhe.io)
- Issues: [github.com/aurafhe/aura-sdk/issues](https://github.com/aurafhe/aura-sdk/issues)

## License

MIT
