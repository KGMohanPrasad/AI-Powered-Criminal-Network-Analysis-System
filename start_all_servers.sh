#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================================"
echo "Aegis Intel - Criminal Network Analysis Server Launcher"
echo "========================================================"

# Auto-detect JDK 21
if [ -z "$JAVA_HOME" ] || [ ! -x "$JAVA_HOME/bin/javac" ]; then
    if [ -x "/home/vsp/.antigravity-ide/extensions/redhat.java-1.56.0-linux-x64/jre/21.0.12.1-linux-x86_64/bin/javac" ]; then
        export JAVA_HOME="/home/vsp/.antigravity-ide/extensions/redhat.java-1.56.0-linux-x64/jre/21.0.12.1-linux-x86_64"
    elif [ -x "/home/vsp/.jaenvtix/jdk-21/bin/javac" ]; then
        export JAVA_HOME="/home/vsp/.jaenvtix/jdk-21"
    fi
fi
if [ -n "$JAVA_HOME" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
fi

mkdir -p "$SCRIPT_DIR/logs"

# 1. AI Microservice (Port 8000)
if ss -tulpn | grep -q ":8000 "; then
    echo "[INFO] AI Microservice is ALREADY running on http://127.0.0.1:8000"
else
    echo "[INFO] Starting AI Microservice on port 8000..."
    (
        cd "$SCRIPT_DIR/ai-service"
        exec "$SCRIPT_DIR/.venv/bin/python" -m uvicorn app:app --host 127.0.0.1 --port 8000
    ) > "$SCRIPT_DIR/logs/ai-service.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/logs/ai-service.pid"
fi

# 2. Backend Spring Boot (Port 8080)
if ss -tulpn | grep -q ":8080 "; then
    echo "[INFO] Backend is ALREADY running on http://localhost:8080"
else
    echo "[INFO] Starting Backend on port 8080..."
    (
        cd "$SCRIPT_DIR/backend"
        exec mvn spring-boot:run
    ) > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/logs/backend.pid"
fi

# 3. Frontend Vite Dev Server (Port 5173)
if ss -tulpn | grep -q ":5173 "; then
    echo "[INFO] Frontend is ALREADY running on http://localhost:5173"
else
    echo "[INFO] Starting Frontend on port 5173..."
    (
        cd "$SCRIPT_DIR/frontend"
        exec npm run dev
    ) > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
    echo $! > "$SCRIPT_DIR/logs/frontend.pid"
fi

echo ""
echo "========================================================"
echo "Servers running:"
echo "  Web Application: http://localhost:5173"
echo "  REST API:        http://localhost:8080"
echo "  AI Microservice: http://127.0.0.1:8000/docs"
echo "========================================================"
