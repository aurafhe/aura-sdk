import { connect } from "./connect";

describe("connect()", () => {
  test("health-checks and auto-loads default keys", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "ok" }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ loaded: ["skb", "pkb", "dictb"] }), { status: 200 }),
      );

    const client = await connect({
      baseUrl: "https://localhost:8443",
      fetch: fetchMock as unknown as typeof fetch,
    });

    expect(client).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("https://localhost:8443/health");
    expect(fetchMock.mock.calls[1][0]).toBe("https://localhost:8443/load");
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      skb: "file/skb",
      pkb: "file/pkb",
      dictb: "file/dictb",
    });
  });

  test("rejects insecure TLS outside localhost", async () => {
    await expect(
      connect({
        baseUrl: "https://api.example.com:8443",
        insecureTLS: true,
      }),
    ).rejects.toThrow("insecureTLS is only allowed for localhost");
  });
});
