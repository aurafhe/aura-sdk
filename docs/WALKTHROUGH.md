# Walkthrough

Two questions matter:

1. What is this repo?
2. What do I need for a working encrypted round-trip?

This document answers both.

## What this repo is

This repo contains client SDKs for the Aura FHE coprocessor.

Every client speaks the same HTTP protocol:

- `GET /health`
- `GET /functions`
- `POST /init`
- `POST /keygen`
- `POST /load`
- `POST /encrypt/{domain}`
- `POST /decrypt/{domain}`
- `POST /call`
- `POST /verify`

Your app talks to the SDK. The SDK talks to the coprocessor. The coprocessor
works on ciphertext.

## Key custody

Three key blocks matter:

- `SKB`: secret key block, required to decrypt
- `PKB`: public key block, required for public-key encryption
- `DictB`: evaluation block, required for homomorphic computation

Keep `SKB` with the data owner.

## The few lines

### TypeScript

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect()
const sum = await fhe.addInt(await fhe.encryptInt(2), await fhe.encryptInt(1))

console.log(await fhe.decryptInt(sum)) // "3"
```

### Go

```go
fhe, _ := afhe.Connect(ctx)
a, _ := fhe.EncryptInt(ctx, "2")
b, _ := fhe.EncryptInt(ctx, "1")
sum, _ := fhe.AddInt(ctx, a, b)
pt, _ := fhe.DecryptInt(ctx, sum)
```

### Python

```python
from aura_fhe import connect

fhe = connect()
print(fhe.decrypt_int(fhe.add_int(fhe.encrypt_int(2), fhe.encrypt_int(1))))
```

### Shell

```bash
fhe enc int 2 > a.ct
fhe enc int 1 > b.ct
fhe add int "$(cat a.ct)" "$(cat b.ct)" | fhe dec int
```

`connect()` defaults to `https://localhost:8443`, handles localhost TLS, and
auto-loads `file/skb`, `file/pkb`, and `file/dictb`.

## Where to point it

Point the SDK at any compatible Aura FHE coprocessor.

Default:

```text
https://localhost:8443
```

Health check:

```bash
curl -k https://localhost:8443/health
```

## Recommended keygen profile

Use this profile unless your deployment team gives you a different one:

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

## Surface area

All clients expose the same operation families:

- private-key encrypt / decrypt
- public-key encrypt
- arithmetic
- bitwise / shift / rotate / cmux
- compare / abs
- string operations
- scientific operations
- sign / verify
- `call(fn, args)` for anything not wrapped yet

If an operation is missing from the typed surface, `functions()` is the server
truth.

## Common mistakes

- wrong `baseUrl`
- keys not loaded
- mixed ciphertext domains
- mismatched key profiles across environments

## Suggested reading order

1. [QUICKSTART.md](QUICKSTART.md)
2. [KEY_MANAGEMENT.md](KEY_MANAGEMENT.md)
3. [PROTOCOL.md](PROTOCOL.md)
4. [ARCHITECTURE.md](ARCHITECTURE.md)
5. [SECURITY.md](../SECURITY.md)
