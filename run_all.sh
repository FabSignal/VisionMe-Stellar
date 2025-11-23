#!/usr/bin/env bash
set -euo pipefail

# Detect root directory of the repo (this script's directory)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_DIR="$ROOT_DIR/apps/backend"
FRONTEND_DIR="$ROOT_DIR/apps/frontend-flow-test"

echo "========================================"
echo " VisionMe - Backend + Frontend launcher"
echo " Root:        $ROOT_DIR"
echo " Backend:     $BACKEND_DIR"
echo " Frontend:    $FRONTEND_DIR"
echo "========================================"
echo

# ---- Backend ----
echo "[1/4] Installing backend dependencies (if needed)..."
cd "$BACKEND_DIR"
npm install

echo "[2/4] Starting backend (port 3001) with detailed logs..."
# Logs a archivo + consola
NODE_ENV=development npm run dev 2>&1 | tee "$ROOT_DIR/backend.log" &
BACKEND_PID=$!
echo "    Backend PID: $BACKEND_PID"
echo "    Logs:        $ROOT_DIR/backend.log"
echo

# ---- Frontend ----
echo "[3/4] Installing frontend dependencies (if needed)..."
cd "$FRONTEND_DIR"
npm install

echo "[4/4] Starting frontend (port 5173) with detailed logs..."
npm run dev 2>&1 | tee "$ROOT_DIR/frontend.log" &
FRONTEND_PID=$!
echo "    Frontend PID: $FRONTEND_PID"
echo "    Logs:         $ROOT_DIR/frontend.log"
echo

echo "========================================"
echo " Everything is starting up."
echo
echo "  Backend API:   http://localhost:3001/api"
echo "  Frontend UI:   http://localhost:5173/"
echo
echo "  Use CTRL+C here to stop both processes."
echo "========================================"

# Manejar Ctrl+C y terminar ambos procesos
trap 'echo; echo "Stopping processes..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0' SIGINT SIGTERM

# Esperar a que alguno de los dos termine
wait