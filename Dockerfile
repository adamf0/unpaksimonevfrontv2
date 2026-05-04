# =========================
# Build Stage
# =========================
FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder

WORKDIR /src

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
 
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# =========================
# Runtime Stage
# =========================
FROM registry.access.redhat.com/ubi9/nodejs-22-minimal:latest

WORKDIR /app

# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ=Asia/Jakarta
ENV TZ=Asia/Jakarta

COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static
COPY --from=builder /src/public ./public

RUN mkdir -p /app/.next/cache \
    && chown -R 1001:0 /app \
    && chmod -R 755 /app
    
USER 1001

EXPOSE 3000

CMD ["node", "server.js"]