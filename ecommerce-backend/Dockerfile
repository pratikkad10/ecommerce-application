# Stage 1: Build 
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (dev + prod)
COPY package*.json ./
RUN npm ci

# Copy source code, prisma schema, and config
COPY . .

# Generate Prisma Client (needs a dummy URL because prisma.config.ts demands it,
# but prisma generate never actually connects to the database)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Compile TypeScript → JavaScript into /app/dist
RUN npm run build

# Stage 2: Production 
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy prisma schema (needed if you ever run migrations at container startup)
COPY --from=builder /app/prisma ./prisma

# Run as non-root user for security
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
