# 05 — CLI demo

No code. Just shell.

```bash
git clone https://github.com/aurafhe/aura-sdk.git
cd aura-sdk/clients/cli
npm install ../typescript
npm install
npm link

fhe connect --url https://api.afhe.io:8443
bash demo.sh
```

Expected:

```
>> health
{"status":"ok"}
>> encrypt two binary values
>> homomorphic XOR
>> decrypt
25 XOR 10 = 19
>> negation via stdin pipe
...
```
