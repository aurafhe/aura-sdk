# Architecture

Four layers, one stable contract.

```text
Application
  ↓
Client SDK (this repo)
  ↓
Aura FHE HTTP protocol
  ↓
Coprocessor server
  ↓
Cryptographic engine
```

## Layer 3 — Application

Your code calls language-native helpers such as:

- `encryptInt`
- `addInt`
- `decryptInt`
- `verify`

The application does not need to know the raw HTTP routes.

## Layer 2 — Client SDK

This repo contains:

- TypeScript
- Go
- Python
- CLI

Each client does the same jobs:

1. speaks the Aura FHE HTTP protocol
2. provides typed helpers for common operations
3. exposes `connect()` for fast startup
4. exposes `call(fn, args)` as the escape hatch

## Layer 1 — Coprocessor server

The coprocessor owns the loaded key material for the running process and
exposes the protocol routes:

- `/health`
- `/functions`
- `/init`
- `/keygen`
- `/load`
- `/encrypt/{domain}`
- `/decrypt/{domain}`
- `/call`
- `/verify`

The server is the boundary between application code and FHE execution.

## Layer 0 — Cryptographic engine

The cryptographic engine performs the actual FHE operations over ciphertexts.
It is hidden behind the coprocessor API.

## Why the layering matters

- clients can evolve without changing app code
- server builds can change without changing the wire contract
- new SDKs only need the HTTP protocol, not private implementation details
- key custody stays explicit: `SKB` with the data owner, `PKB` and `DictB` on
  the compute side
