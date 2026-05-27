#!/usr/bin/env bash
# 05-cli — encrypt, compute, decrypt from the shell.
#
# Prerequisite:
#   git clone https://github.com/aurafhe/aura-sdk.git
#   cd aura-sdk/clients/cli
#   npm install ../typescript
#   npm install
#   npm link
#   fhe connect --url https://api.afhe.io:8443

set -euo pipefail

echo ">> health"
fhe health

echo ">> encrypt two binary values"
A=$(fhe enc binary 25)
B=$(fhe enc binary 10)

echo ">> homomorphic XOR"
X=$(fhe xor "$A" "$B")

echo ">> decrypt"
PT=$(fhe dec binary "$X")
echo "25 XOR 10 = $PT"

echo ">> negation via stdin pipe"
fhe enc binary 12 | fhe call NOTCipher - | fhe dec binary
