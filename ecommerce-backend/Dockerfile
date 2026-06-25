# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production Stage
FROM node:20-alpine AS production

# Set Node environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

# Use a non-root user for security (comes pre-created in node alpine images)
USER node

# Expose the port your app runs on (adjust if you use a different port)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
