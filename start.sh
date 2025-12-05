#!/bin/bash

echo "🚀 Starting Beauty Shop..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is running
check_backend() {
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend is NOT running${NC}"
        return 1
    fi
}

# Start backend
start_backend() {
    echo -e "${YELLOW}📦 Starting Backend...${NC}"
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Check if database exists and has data
    if [ ! -f "prisma/dev.db" ] || [ $(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Product;" 2>/dev/null) -eq 0 ]; then
        echo "Setting up database..."
        npx prisma migrate dev --name init
        npx prisma db seed
    fi
    
    echo -e "${GREEN}✅ Backend ready! Starting server...${NC}"
    npm run dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait for backend to start
    echo "Waiting for backend to start..."
    for i in {1..30}; do
        if check_backend; then
            break
        fi
        sleep 1
    done
    
    cd ..
}

# Main
echo "Checking backend status..."
if ! check_backend; then
    start_backend
else
    echo -e "${GREEN}Backend is already running!${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Backend: http://localhost:5000/api/health"
echo "2. Frontend: cd next-app && npm run dev"
echo "3. Admin Panel: cd admin-panel && npm run dev"
echo ""
echo "Press Ctrl+C to stop backend"

# Wait for user to stop
wait $BACKEND_PID





