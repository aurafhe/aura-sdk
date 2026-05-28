# Quickstart

Five minutes from clone to first decrypted result.

TypeScript installs from npm (`@aura/fhe-client`). Go, Python, and CLI still
install from this repo until their registry releases ship.

---

## 1. Point at a coprocessor

```bash
export AFHE_API_URL=https://api.afhe.io:8443
```

You need a compatible Aura FHE coprocessor reachable over HTTPS.

Clients default to `https://api.afhe.io:8443`. For a local coprocessor, use:

```text
export AFHE_API_URL=https://localhost:8443
```

Health check:

```bash
curl -fsSL "$AFHE_API_URL/health"
```

You can override the URL with `AFHE_API_URL` or a client-specific `baseUrl`
option. For a first remote connection, use `https://api.afhe.io:8443`.

---

## 2. Pick a client

### TypeScript

```bash
npm install @aura/fhe-client
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
c, _ := afhe.Connect(ctx, afhe.ConnectOptions{
    BaseURL: "https://api.afhe.io:8443",
})
a, _ := c.EncryptInt(ctx, "25")
b, _ := c.EncryptInt(ctx, "17")
sum, _ := c.AddInt(ctx, a, b)
pt, _ := c.DecryptInt(ctx, sum)
```

### Python

```bash
pip install ./clients/python
```

```python
from aura_fhe import connect

fhe = connect(base_url="https://api.afhe.io:8443")
print(fhe.decrypt_int(fhe.add_int(fhe.encrypt_int(25), fhe.encrypt_int(17))))
```

### CLI

```bash
cd clients/cli
npm install ../typescript
npm install
npm link

fhe connect --url https://api.afhe.io:8443
fhe enc int 25 > a.ct
fhe enc int 17 > b.ct
fhe add int "$(cat a.ct)" "$(cat b.ct)" | fhe dec int
```

---

## 3. Generate and load keys

Recommended keygen profile:

```json
{
  "m": 2,
  "n": 4,
  "q": 2147483647,
  "p": 512,
  "delta": 0.001
}
```

See [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md) for the exact request bodies and
loading flow.

---

## 4. Common pitfalls

### TLS errors on localhost

The SDK auto-trusts self-signed certificates only for `localhost`. If you point
at another host, install a valid certificate there first.

### Keys not loaded

`connect()` auto-loads:

- `file/skb`
- `file/pkb`
- `file/dictb`

If your files live elsewhere, pass explicit key paths.

### Domain mismatch

Do not mix `int`, `float`, `string`, and `binary` ciphertexts in one operation.

---

## Next steps

- Examples: [`examples/`](../examples/)
- Protocol: [PROTOCOL.md](PROTOCOL.md)
- Key custody: [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md)
- Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
