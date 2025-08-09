# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set proper permissions
RUN chown -R nodeuser:nodejs /usr/share/nginx/html && \
    chown -R nodeuser:nodejs /var/cache/nginx && \
    chown -R nodeuser:nodejs /var/log/nginx && \
    chown -R nodeuser:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nodeuser:nodejs /var/run/nginx.pid

USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
