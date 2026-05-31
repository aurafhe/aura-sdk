# @aura/fhe-cli

Shell access to the Aura FHE coprocessor.

This package is **build from source for now**. Clone the repo, install the local
TypeScript client first, then link the CLI from this directory. See
[INSTALL.md](./INSTALL.md) for tarball and global install options.

```bash
git clone https://github.com/aurafhe/aura-sdk.git
cd aura-sdk/clients/cli
npm install ../typescript
npm install
npm link
```

```bash
fhe connect --url https://api.afhe.io:8443   # one-time setup, saved to ~/.aura-fhe/config.json
fhe health                                  # {"status":"ok"}

# Encrypt → add → decrypt
fhe enc int 25 > a.ct
fhe enc int 17 > b.ct
fhe add int "$(cat a.ct)" "$(cat b.ct)" | fhe dec int
# 42
```

`fhe call <fnName> <args>...` reaches every operation the server exposes;
typed shortcuts (`fhe add`, `fhe xor`, `fhe sqrt`, …) cover the common ones.

Stdin is accepted as `-` in any argument position:

```bash
fhe enc binary 12 | fhe call NOTCipher - | fhe dec binary
```

Run `fhe --help` for the full reference.
