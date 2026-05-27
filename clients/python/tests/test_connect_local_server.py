import json
import threading
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from aura_fhe import AfheClient, connect


@contextmanager
def run_server(handler_cls):
    server = HTTPServer(("127.0.0.1", 0), handler_cls)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}"
    finally:
        server.shutdown()
        thread.join()
        server.server_close()


def test_connect_health_checks_and_loads_default_keys():
    calls = []
    load_body = {}

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_args):  # pragma: no cover - test noise only
            return

        def do_GET(self):
            calls.append(self.path)
            if self.path == "/health":
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok"}).encode("utf-8"))
                return
            self.send_error(404)

        def do_POST(self):
            calls.append(self.path)
            if self.path == "/load":
                size = int(self.headers.get("Content-Length", "0"))
                load_body.update(json.loads(self.rfile.read(size).decode("utf-8")))
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"loaded": ["skb", "pkb", "dictb"]}).encode("utf-8"))
                return
            self.send_error(404)

    with run_server(Handler) as base_url:
        client = connect(base_url=base_url)

    assert client.base_url == base_url
    assert calls == ["/health", "/load"]
    assert load_body == {"skb": "file/skb", "pkb": "file/pkb", "dictb": "file/dictb"}


def test_client_rejects_remote_insecure_tls():
    with pytest.raises(ValueError, match="localhost"):
        AfheClient(base_url="https://api.example.com:8443", insecure_tls=True)
