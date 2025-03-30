# ----------------------------------------------------------------------
# Switch to the root user to perform installations and configuration.
# ----------------------------------------------------------------------
USER root

# ----------------------------------------------------------------------
# Promeni vlasništvo direktorijuma pypred tako da non-root korisnik ima pristup.
# ----------------------------------------------------------------------
RUN chown -R 1001:1001 /opt/venv/lib/python3.10/site-packages/pypred

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
    RASA_PRO_BETA_E2E_ASSERTIONS=true \
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
# ----------------------------------------------------------------------
ENTRYPOINT ["rasa"]

# ----------------------------------------------------------------------
# Set the default command for the container.
# ----------------------------------------------------------------------
CMD ["run", "--log-file", "out.log", "--cors", "*", "--enable-api", "--debug"]
