#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping Aegis Intel servers..."

for pidfile in "$SCRIPT_DIR/logs"/*.pid; do
    if [ -f "$pidfile" ]; then
        pid=$(cat "$pidfile")
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            echo "Stopping PID $pid ($(basename "$pidfile" .pid))..."
            kill "$pid" 2>/dev/null || true
        fi
        rm -f "$pidfile"
    fi
done

# Kill anything remaining on ports 8000, 8080, 5173
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 8080/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true

echo "All servers stopped."
