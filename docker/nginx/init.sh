#!/bin/sh

set -eux

# ----------------------------------------------------------------------
# Script arguments
# ----------------------------------------------------------------------
CUSTOM_DIR=${CUSTOM_DIR:-/etc/nginx/custom}
CERTS_DIR=${CERTS_DIR:-/etc/nginx/certs}
OPENSSL_CONF_DIR=${OPENSSL_CONF_DIR:-/etc/nginx/openssl}

# ----------------------------------------------------------------------
# ECDSA key
# ----------------------------------------------------------------------
openssl ecparam \
  -name prime256v1 \
  -genkey \
  -noout \
  -out "${CERTS_DIR}/nginx.key"

# ----------------------------------------------------------------------
# CSR based on openssl.cnf
# ----------------------------------------------------------------------
openssl req \
  -new \
  -key "${CERTS_DIR}/nginx.key" \
  -out "${CERTS_DIR}/csr.pem" \
  -config "${OPENSSL_CONF_DIR}/openssl.cnf"

# ----------------------------------------------------------------------
# Self-signed certificate
# ----------------------------------------------------------------------
openssl x509 \
  -req \
  -days 365 \
  -sha256 \
  -extensions v3_ca \
  -key "${CERTS_DIR}/nginx.key" \
  -in "${CERTS_DIR}/csr.pem" \
  -out "${CERTS_DIR}/nginx.pem"

# ----------------------------------------------------------------------
# Additional ECDH key (for testing or extra encryption scenarios)
# ----------------------------------------------------------------------
openssl ecparam \
  -genkey \
  -name prime256v1 \
  -noout \
  -out "${CERTS_DIR}/ecdh.key"

# ----------------------------------------------------------------------
# Extract public ECDH key
# ----------------------------------------------------------------------
openssl ec \
  -in "${CERTS_DIR}/ecdh.key" \
  -pubout \
  -out "${CERTS_DIR}/ecdh_public.pem"

# ----------------------------------------------------------------------
# Restrict permissions on private keys
# ----------------------------------------------------------------------
chmod 0600 \
  "${CERTS_DIR}/nginx.key" \
  "${CERTS_DIR}/ecdh.key"

# ----------------------------------------------------------------------
# Start nginx
# ----------------------------------------------------------------------
nginx -g 'daemon off;'
