#!/bin/bash
echo "=== Memory Book Hindi Edition ==="
echo ""
echo "Starting backend on port 8001..."
cd "$(dirname "$0")/backend"
python -m uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
echo ""
echo "==================================="
echo "Frontend: http://localhost:5175"
echo "Backend:  http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo "==================================="
echo ""
echo "Press Ctrl+C to stop"
wait $BACKEND_PID
