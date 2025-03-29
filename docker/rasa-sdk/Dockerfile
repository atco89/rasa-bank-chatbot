# ----------------------------------------------------------------------
# Use a specific version of Rasa SDK for reproducibility.
# ----------------------------------------------------------------------
FROM rasa/rasa-sdk:3.11.0

# ----------------------------------------------------------------------
# Metadata: Maintainer of the Dockerfile.
# ----------------------------------------------------------------------
LABEL maintainer="Aleksandar Rakić <aleksandar.rakic@yahoo.com>"

# ----------------------------------------------------------------------
# Switch to the root user to perform installations.
# ----------------------------------------------------------------------
USER root

# ----------------------------------------------------------------------
# Define build-time arguments with default values.
# ----------------------------------------------------------------------
ARG HOMEDIR="/app"

# ----------------------------------------------------------------------
# Set environment variables.
# ----------------------------------------------------------------------
ENV HOMEDIR=$HOMEDIR

# ----------------------------------------------------------------------
# Set the working directory.
# ----------------------------------------------------------------------
WORKDIR $HOMEDIR

# ----------------------------------------------------------------------
# Copy the requirements.txt file into the container's working directory.
# ----------------------------------------------------------------------
COPY ./rasa-sdk/requirements.txt "$HOMEDIR/requirements.txt"

# ----------------------------------------------------------------------
# Upgrade pip, install system dependencies and Python packages,
# and clean up apt caches to reduce image size.
# ----------------------------------------------------------------------
RUN apt-get update && \
    apt-get dist-upgrade -y --no-install-recommends curl && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r "$HOMEDIR/requirements.txt"

# ----------------------------------------------------------------------
# Switch back to a non-root user for enhanced security.
# ----------------------------------------------------------------------
USER 1001
