# Installing `aura-fhe` Locally

This guide covers how to install the Python SDK from a local copy of this repository.

---

## Option 1 — Install from the source directory (recommended for development)

From any project folder:

```bash
pip install /path/to/aura-sdk/clients/python
```

This installs the package directly from source. If you are actively editing the SDK, use the editable mode below instead.

---

## Option 2 — Install from a built wheel

### 1. Build the wheel

```bash
cd clients/python
python -m build
```

This produces two files in `dist/`:

- `aura_fhe-<version>.tar.gz` — source distribution
- `aura_fhe-<version>-py3-none-any.whl` — universal wheel

### 2. Install the wheel in your project

```bash
cd /path/to/your-project
pip install /path/to/aura-sdk/clients/python/dist/aura_fhe-0.3.0-py3-none-any.whl
```

Wheels are the fastest installation method because they do not require running the build step on the target machine.

---

## Option 3 — Editable install (active development)

Use an editable install when you are simultaneously editing the SDK source and a consumer project:

```bash
cd /path/to/your-project
pip install -e /path/to/aura-sdk/clients/python
```

Any change you make in `clients/python/aura_fhe/` will be reflected immediately without reinstalling.

---

## Verify the installation

```python
from aura_fhe import connect, AfheClient

print(connect)      # <function connect at 0x...>
print(AfheClient)   # <class 'aura_fhe.client.AfheClient'>
```

If the imports succeed, the local installation is working.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'aura_fhe'` | Ensure you installed the correct directory (`clients/python/`, not the repo root). |
| `python -m build` fails with `No module named build` | Run `pip install build` first. |
| Changes are not reflected (editable install) | Restart your Python interpreter; editable installs do not require re-installation. |
| `pip install .` inside `clients/python` works but `import aura_fhe` fails | Check that your virtual environment is activated and that `pip` and `python` point to the same environment. |
