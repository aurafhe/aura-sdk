# Examples

Each folder is a self-contained, runnable example. They all assume a
coprocessor is reachable at `https://localhost:8443` — start one with
your preferred Aura FHE server or point them at any other URL via the
`AFHE_API_URL` env var.

| # | Folder | Language | What it shows |
|---|---|---|---|
| 01 | [01-hello-fhe-node](./01-hello-fhe-node/) | Node.js | Encrypt → add → decrypt |
| 02 | [02-hello-fhe-go](./02-hello-fhe-go/) | Go | Same demo, Go |
| 03 | [03-hello-fhe-python](./03-hello-fhe-python/) | Python | Same demo, Python |
| 04 | [04-browser](./04-browser/) | HTML + ESM | Same demo, single HTML file |
| 05 | [05-cli](./05-cli/) | Shell | `fhe enc \| fhe call \| fhe dec` |
| 06 | [06-secure-sum](./06-secure-sum/) | Node.js | Two parties, encrypted addition, neither sees the other's input |
