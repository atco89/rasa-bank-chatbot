# ----------------------------------------------------------------------
# Start from the Rasa Pro full version image.
# ----------------------------------------------------------------------
FROM rasa/rasa-pro:3.11.4

# ----------------------------------------------------------------------
# Metadata: Maintainer of the Dockerfile.
# ----------------------------------------------------------------------
LABEL maintainer="Aleksandar Rakić <aleksandar.rakic@yahoo.com>"

# ----------------------------------------------------------------------
# Switch to the root user to perform installations and configuration.
# ----------------------------------------------------------------------
USER root

# ----------------------------------------------------------------------
# Define build-time arguments with default values.
# ----------------------------------------------------------------------
ARG OPENAI_API_KEY=""
ARG RASA_PRO_LICENSE=""
ARG HOMEDIR="/app"

# ----------------------------------------------------------------------
# Set environment variables.
# ----------------------------------------------------------------------
ENV OPENAI_API_KEY=$OPENAI_API_KEY \
    RASA_PRO_LICENSE=$RASA_PRO_LICENSE \
    LLM_API_HEALTH_CHECK=true \
    HOMEDIR=$HOMEDIR

# ----------------------------------------------------------------------
# Create and set the working directory.
# ----------------------------------------------------------------------
WORKDIR $HOMEDIR

# ----------------------------------------------------------------------
# Revert to the default non-root Rasa user for running the application.
# ----------------------------------------------------------------------
USER 1001

# ----------------------------------------------------------------------
# Define the entrypoint for the container.
# This allows the container to be run with additional arguments if needed.
# ----------------------------------------------------------------------
ENTRYPOINT ["rasa"]

# ----------------------------------------------------------------------
# Set the default command for the container.
# This command starts the Rasa server with logging, CORS enabled,
# API access enabled, and debug mode on.
# ----------------------------------------------------------------------
CMD ["run", "--log-file", "out.log", "--cors", "*", "--enable-api", "--debug"]
