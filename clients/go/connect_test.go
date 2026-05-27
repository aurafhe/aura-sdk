package afhe

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

func TestConnectAutoLoadsDefaultKeys(t *testing.T) {
	t.Helper()

	var paths []string
	var loaded LoadOptions

	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		paths = append(paths, r.URL.Path)

		switch r.URL.Path {
		case "/health":
			_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
		case "/load":
			if err := json.NewDecoder(r.Body).Decode(&loaded); err != nil {
				t.Fatalf("decode load body: %v", err)
			}
			_ = json.NewEncoder(w).Encode(map[string][]string{"loaded": {"skb", "pkb", "dictb"}})
		default:
			http.NotFound(w, r)
		}
	}))
	defer srv.Close()

	client, err := Connect(context.Background(), ConnectOptions{
		BaseURL:     srv.URL,
		InsecureTLS: Bool(true),
	})
	if err != nil {
		t.Fatalf("Connect: %v", err)
	}
	if client == nil {
		t.Fatal("Connect returned nil client")
	}

	if !reflect.DeepEqual(paths, []string{"/health", "/load"}) {
		t.Fatalf("unexpected request order: %#v", paths)
	}
	if loaded != (LoadOptions{SKB: "file/skb", PKB: "file/pkb", DictB: "file/dictb"}) {
		t.Fatalf("unexpected load options: %#v", loaded)
	}
}

func TestConnectRejectsRemoteInsecureTLS(t *testing.T) {
	t.Helper()

	_, err := Connect(context.Background(), ConnectOptions{
		BaseURL:     "https://api.example.com:8443",
		InsecureTLS: Bool(true),
		HealthCheck: Bool(false),
		AutoLoad:    Bool(false),
	})
	if err == nil {
		t.Fatal("expected insecure remote TLS to be rejected")
	}
}
