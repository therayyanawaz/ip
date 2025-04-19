# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Enable standalone output (using ES module syntax)
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Only copy standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]