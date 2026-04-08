# Atmos Repository

This repository brings together the two main Atmos projects in a single place:

- `atmos-server`: the Python runtime/API that validates and executes Atmos specifications
- `atmos-interface`: the React + TypeScript frontend used to author specs and visualize results

The repository structure makes it easier to clone, install, and run both projects side by side.

## Repository structure

```text
atmos/
├── atmos-server/
└── atmos-interface/
```

## Prerequisites

Install these before getting started:

- **Git**
- **Python 3.10+**
- **Node.js** and **npm**

## 1) Clone the repository

```bash
git clone https://github.com/urban-toolkit/atmos.git
cd atmos
```

## 2) Install and run `atmos-server`

`atmos-server` is the backend runtime. It is a Python project that validates Atmos specs, runs the data pipeline, and serves generated artifacts.

### Create and activate a virtual environment

#### macOS / Linux

```bash
cd atmos-server
python3 -m venv .venv
source .venv/bin/activate
```

#### Windows (PowerShell)

```powershell
cd atmos-server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Install dependencies

```bash
pip install --upgrade pip
pip install -e .
```

### Start the API server

```bash
uvicorn atmos_server.api.app:app --reload --port 8000
```

The backend will be available at:

- API health check: `http://localhost:8000/api/health`
- Generated artifacts: `http://localhost:8000/artifacts/...`

### Optional: use the CLI

The package also exposes an `atmos-server` command. Example usage:

```bash
atmos-server versions
atmos-server validate path/to/spec.json --version v0.1
atmos-server run path/to/spec.json --version v0.1 --out artifacts/manual-run
```

> Keep the backend running while you start the frontend in a second terminal.

## 3) Install and run `atmos-interface`

`atmos-interface` is the frontend application built with React, TypeScript, and Vite.

Open a **new terminal** and go to the frontend directory:

```bash
cd atmos/atmos-interface
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173/
```

Open that URL in your browser.

## How the frontend connects to the backend

The Vite dev server is configured to proxy these paths to the backend running on port `8000`:

- `/api`
- `/artifacts`

That means the recommended local development setup is:

- `atmos-server` running at `http://localhost:8000`
- `atmos-interface` running at `http://localhost:5173`

## Typical local workflow

From the repository root:

### Terminal 1 — backend

```bash
cd atmos-server
source .venv/bin/activate   # macOS/Linux
# or .\.venv\Scripts\Activate.ps1 on Windows
uvicorn atmos_server.api.app:app --reload --port 8000
```

### Terminal 2 — frontend

```bash
cd atmos-interface
npm install
npm run dev
```

Then open the frontend URL shown by Vite.

## Build for production

### Frontend build

```bash
cd atmos-interface
npm run build
```

The production build will be written to `dist/`.

## Troubleshooting

### Frontend loads, but no data appears

Make sure the backend is running on port `8000`, since the frontend proxy points there during local development.

### `npm install` fails

Make sure you are using a recent Node.js version. If needed, delete `node_modules` and `package-lock.json`, then reinstall.

### `pip install -e .` fails

Make sure your virtual environment is activated and that you are running the command inside `atmos-server`.

### Port already in use

If port `8000` or `5173` is busy, stop the conflicting process or change the port manually.

## Notes

- The server writes run outputs under `atmos-server/artifacts/runs/`.
- The frontend README currently contains the default Vite template text, so this top-level README is the recommended place to start for repository setup.

