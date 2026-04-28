# =========================
# Build Stage - Next.js 16
# =========================
FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS builder

WORKDIR /src

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# dependency files
COPY package.json package-lock.json* ./

# install dependency
RUN npm ci

# source
COPY . .

# build standalone nextjs
RUN npm run build


# =========================
# Runtime Stage (Hardened)
# =========================
FROM registry.access.redhat.com/ubi9/ubi-micro:latest

# timezone + ssl cert
COPY --from=builder /usr/share/zoneinfo/Asia/Jakarta /usr/share/zoneinfo/Asia/Jakarta
COPY --from=builder /etc/ssl/certs /etc/ssl/certs

ENV TZ=Asia/Jakarta \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    HOME=/nonexistent \
    PATH=/app

# user non-root hardened
COPY <<EOF /etc/passwd
root:x:0:0:root:/root:/sbin/nologin
user:x:10001:10001:Next User:/nonexistent:/sbin/nologin
EOF

COPY <<EOF /etc/group
root:x:0:
user:x:10001:
EOF

COPY <<EOF /sbin/nologin
#!/bin/sh
echo "This account is not available."
exit 1
EOF

WORKDIR /app

# next standalone runtime
COPY --from=builder --chown=10001:10001 /src/.next/standalone ./
COPY --from=builder --chown=10001:10001 /src/.next/static ./.next/static
COPY --from=builder --chown=10001:10001 /src/public ./public

USER 10001:10001

EXPOSE 3000/tcp

ENTRYPOINT ["node","server.js"]