import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliDir = join(__dirname, "..");
const cliEntrypoint = join(cliDir, "bin", "fhe.js");

function runCli(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cliEntrypoint, ...args], {
      cwd: cliDir,
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

test("fhe --help prints usage", async () => {
  const result = await runCli(["--help"]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /shell access to the Aura FHE coprocessor/i);
});

test("fhe health works against a local server", async () => {
  let healthCalls = 0;

  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      healthCalls += 1;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const result = await runCli(["--url", baseUrl, "--no-autoload", "health"]);
    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /"status":"ok"/);
    assert.equal(healthCalls, 2);
  } finally {
    server.close();
  }
});
