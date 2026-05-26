# Key management

Aura FHE uses three key blocks. Who holds them defines the trust model.

| Key block | Held by | Used for |
|---|---|---|
| **SKB** — Secret Key Block | **Data owner only** | Private-key encrypt, decrypt, sign |
| **PKB** — Public Key Block | Compute side | Public-key encrypt |
| **DictB** — Dictionary / Evaluation Block | Compute side | Homomorphic computation |

The compute side can work on ciphertext without the SKB. The SKB must never be
shared.

---

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

Keep the profile consistent across environments. If you regenerate keys with a
different profile, load the matching SKB / PKB / DictB set together.

---

## Generate keys

Server-side keygen:

```ts
import { connect } from '@aura/fhe-client'

const fhe = await connect({ autoLoad: false })

await fhe.keygen({
  m: 2,
  n: 4,
  q: 2147483647,
  p: 512,
  delta: 0.001,
  force: false,
})

await fhe.load({
  skb: 'file/skb',
  pkb: 'file/pkb',
  dictb: 'file/dictb',
})
```

Direct `POST /keygen` body:

```json
{
  "m": 2,
  "n": 4,
  "q": 2147483647,
  "p": 512,
  "delta": 0.001,
  "skb_file": "file/skb",
  "pkb_file": "file/pkb",
  "dictb_file": "file/dictb",
  "force": false
}
```

`force: false` skips regeneration when the files already exist. Set
`force: true` only when you intentionally want a fresh key triplet.

---

## Distribution

- Keep `skb` with the data owner only.
- Share `pkb` and `dictb` only with the compute side that needs to encrypt or
  evaluate.
- Back up `skb` securely. Losing it means losing the ability to decrypt data
  written under that key.

---

## Rotation

There is no automatic rotation.

To rotate keys:

1. Stop writes that depend on the current keyset.
2. Generate a fresh SKB / PKB / DictB triplet with the agreed profile.
3. Re-encrypt any retained data that must survive the rotation.
4. Cut over all services to the new key files.
5. Retire the old SKB securely.
