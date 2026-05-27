# aura-fhe — Go client

Standard library only. Works against any server that speaks the Aura FHE
protocol ([`../../docs/PROTOCOL.md`](../../docs/PROTOCOL.md)).

This client is available directly from the repo today. Until the first tagged
release lands, pin it to `@main`.

```bash
go get github.com/aurafhe/aura-sdk/clients/go@main
```

```go
package main

import (
    "context"
    "fmt"
    "log"

    afhe "github.com/aurafhe/aura-sdk/clients/go"
)

func main() {
    ctx := context.Background()
    fhe, err := afhe.Connect(ctx, afhe.ConnectOptions{
        BaseURL: "https://api.afhe.io:8443",
    })
    if err != nil { log.Fatal(err) }

    a, _   := fhe.EncryptInt(ctx, "25")
    b, _   := fhe.EncryptInt(ctx, "17")
    sum, _ := fhe.AddInt(ctx, a, b)
    pt, _  := fhe.DecryptInt(ctx, sum)
    fmt.Println(pt) // "42"
}
```

## Connect

`Connect(ctx, ConnectOptions{...})` handles:

| Option | Default | Notes |
|---|---|---|
| `BaseURL` | `$AFHE_API_URL` or `https://api.afhe.io:8443` | Server URL |
| `InsecureTLS` | `true` iff host is localhost | Insecure TLS is only allowed on localhost |
| `AutoLoad` | `true` | Server-side `POST /load` with the standard key paths |
| `Keys` | `file/skb` / `file/pkb` / `file/dictb` | Override individual paths |
| `HealthCheck` | `true` | Probe `GET /health` before returning |
| `Timeout` | 600 s | Per-request timeout |
| `ExtraHeaders` | – | Sent on every request |

## Full control

If `Connect` is too magical, build the client by hand:

```go
c, _ := afhe.NewClient(afhe.ClientOptions{
    BaseURL:    "https://api.example.com:8443",
    HTTPClient: &http.Client{Timeout: 30 * time.Second},
})
c.Load(ctx, afhe.LoadOptions{SKB: "/etc/afhe/skb", PKB: "/etc/afhe/pkb", DictB: "/etc/afhe/dictb"})
```

## Surface

| Group | Methods |
|---|---|
| Lifecycle | `Health`, `Functions`, `Init`, `Keygen`, `Load` |
| Encrypt (private) | `EncryptInt`, `EncryptFloat`, `EncryptString`, `EncryptBinary` |
| Encrypt (public) | `EncryptPublicInt`, `EncryptPublicFloat`, `EncryptPublicString`, `EncryptPublicBinary` |
| Decrypt | `DecryptInt`, `DecryptFloat`, `DecryptString`, `DecryptBinary` |
| Int arithmetic | `AddInt`, `SubInt`, `MulInt`, `DivInt`, `ModInt`, `CompareInt`, `MapInt` |
| Float arithmetic | `AddFloat`, `SubFloat`, `MulFloat`, `DivFloat` |
| Bitwise | `Xor`, `And`, `Or`, `Not` |
| Shift / Rotate | `ShiftLeft`, `ShiftRight`, `RotateLeft`, `RotateRight` |
| Ternary | `CMux` |
| String | `CompareString`, `SubstringString`, `ToUpperString`, `ToLowerString`, `MapSm3String` |
| Sign / Verify | `Verify` |
| Escape hatch | `Call(fn, args)` |

## Testing

```bash
cd clients/go
export AFHE_API_URL=https://localhost:8443     # or wherever your server runs
go test -v -count=1 ./...
```

## Recommended keygen profile

```go
delta := 0.001
m := 2
n := 4
q := 2147483647
p := 512

opts := afhe.KeygenOptions{
    M:     &m,
    N:     &n,
    Q:     &q,
    P:     &p,
    Delta: &delta,
}
```

## Caveats

Keep the same keygen profile across environments. See
[`../../docs/KEY_MANAGEMENT.md`](../../docs/KEY_MANAGEMENT.md) for the
recommended values and rotation flow.
