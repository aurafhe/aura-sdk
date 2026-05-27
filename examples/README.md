# Examples

Each folder is a self-contained, runnable example. Clone the repo first, then
point the client at your coprocessor:

```bash
export AFHE_API_URL=https://api.afhe.io:8443
```

For local development, the clients still default to `https://localhost:8443`.

| # | Folder | Language | What it shows |
|---|---|---|---|
| 01 | [01-hello-fhe-node](./01-hello-fhe-node/) | Node.js | Encrypt → add → decrypt |
| 02 | [02-hello-fhe-go](./02-hello-fhe-go/) | Go | Same demo, Go |
| 03 | [03-hello-fhe-python](./03-hello-fhe-python/) | Python | Same demo, Python |
| 04 | [04-browser](./04-browser/) | HTML + ESM | Same demo, single HTML file |
| 05 | [05-cli](./05-cli/) | Shell | `fhe enc \| fhe call \| fhe dec` |
| 06 | [06-secure-sum](./06-secure-sum/) | Node.js | Two parties, encrypted addition, neither sees the other's input |
