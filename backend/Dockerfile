# Backend Dockerfile
FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma and build tools for Sharp
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start server
CMD ["pnpm", "run", "dev"]
