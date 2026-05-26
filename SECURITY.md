# Security policy

## Reporting a vulnerability

Email **security@afhe.io** with the details.

Please do not open public issues for security reports.

## Threat model

| Asset | Held by | Trust assumption |
|---|---|---|
| **SKB** | Data owner | Anyone with it can decrypt ciphertexts created under that key. |
| **PKB** | Compute side | Public-key material. |
| **DictB** | Compute side | Evaluation material for homomorphic compute. |
| Ciphertexts | Either side | Opaque without the SKB. |
| Network channel | Public | Use TLS for transport confidentiality and integrity. |

## What FHE protects

- plaintext values
- encrypted intermediate state
- encrypted outputs

## What FHE does not protect by itself

- which operations were called
- timing and other side channels
- compromised endpoints
- ciphertext authenticity or freshness

Use signatures where authenticity matters.

## Operational reminders

- never share `SKB`
- rotate keys deliberately
- treat shared or demo key material as non-production
- back up `SKB` securely
