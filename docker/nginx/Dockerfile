# ----------------------------------------------------------------------
# Based on the official Nginx 1.27.3 Alpine image
# ----------------------------------------------------------------------
FROM nginx:1.27.3-alpine3.20

# ----------------------------------------------------------------------
# Maintainer information
# ----------------------------------------------------------------------
LABEL maintainer="Aleksandar Rakić <aleksandar.rakic@yahoo.com>"

# ----------------------------------------------------------------------
# Definition of environment variables
# ----------------------------------------------------------------------
ENV CUSTOM_DIR=/etc/nginx/custom \
    CERTS_DIR=/etc/nginx/certs \
    OPENSSL_CONF_DIR=/etc/nginx/openssl \
    NGINX_PID=/var/run/nginx.pid \
    NGINX_LOG=/var/log/nginx \
    NGINX_CACHE=/var/cache/nginx \
    USER=nginx

# ----------------------------------------------------------------------
# Install openssl, create required directories, set ownership and permissions
# ----------------------------------------------------------------------
RUN apk add --no-cache \
        bash \
        openssl &&  \
    mkdir -p \
        "$CUSTOM_DIR" \
        "$CERTS_DIR" \
        "$OPENSSL_CONF_DIR" \
        "$NGINX_LOG" \
        "$NGINX_CACHE" && \
    touch \
        "$NGINX_PID" && \
    chown -R "$USER:$USER" \
        "$NGINX_PID" \
        "$CUSTOM_DIR" \
        "$CERTS_DIR" \
        "$OPENSSL_CONF_DIR" \
        "$NGINX_CACHE" \
        "$NGINX_LOG" && \
    chmod -R 0755 \
        "$NGINX_LOG"

# ----------------------------------------------------------------------
# Copy the openssl.cnf and Nginx configuration files
# ----------------------------------------------------------------------
COPY ./nginx/openssl/openssl.cnf "$OPENSSL_CONF_DIR/openssl.cnf"
COPY ./nginx/conf.d/custom "$CUSTOM_DIR"
COPY ./nginx/conf.d/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/init.sh /init.sh

# ----------------------------------------------------------------------
# Switch to the non-root user (nginx)
# ----------------------------------------------------------------------
USER "$USER"

# ----------------------------------------------------------------------
# Start the container (entrypoint)
# ----------------------------------------------------------------------
CMD ["bash", "/init.sh"]
