# =========================
# Build Stage
# =========================
FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder

WORKDIR /src

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
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

USER 1001

EXPOSE 3000

CMD ["node", "server.js"]