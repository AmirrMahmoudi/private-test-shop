# Admin Panel Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Expose port
EXPOSE 3001

# Development startup script
# This will install dependencies and then start the dev server on port 3001
CMD sh -c "pnpm install && PORT=3001 pnpm run dev"
