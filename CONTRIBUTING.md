# Contributing

Thanks for helping make encrypted computation easier.

## Reporting bugs

Please open an issue with:
- Which client (TS / Go / Python / CLI)
- Server build (commit or release tag)
- Minimal reproduction
- What you expected vs what you got

## Development

This is a polyglot monorepo. Each client lives under `clients/` and has its own
build / test commands:

```bash
# TypeScript
cd clients/typescript && npm install && npm test

# Go
cd clients/go && go test -v ./...

# Python
cd clients/python && pip install -e . && pytest

# CLI
cd clients/cli && npm install && npm test
```

All clients target the same HTTP protocol (see `docs/PROTOCOL.md`). When you add
a new operation, add it to **every** client to keep them in lockstep.

## Pull requests

- One topic per PR.
- Update the README + per-client README if you add a new top-level capability.
- Add a test that fails before your change and passes after.

## Security

Please do **not** open public issues for security reports. See `SECURITY.md`.
