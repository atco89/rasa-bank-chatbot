# --------------------------------------------------
# Variables
# --------------------------------------------------

MAKEFLAGS 				+= --no-print-directory
DOCKER_DIR         		:= $(RBC_DIR)/docker
ENV_FILE_PATH      		:= $(DOCKER_DIR)/.env
APP_PLATFORM 			:= linux/$(shell uname -m | sed 's/^x86_64/amd64/;s/^aarch64/arm64/')

-include $(ENV_FILE_PATH)

# --------------------------------------------------
# Utility Functions
# --------------------------------------------------

define line_break
	printf "%0.s-" {1..100}; echo
endef

define ensure_directory
	@if [ ! -d $1 ]; then \
		mkdir -m 0777 -p $1; \
	fi
endef

define check_required_variable
	@if [ -z "$($(strip $1))" ]; then \
		$(call line_break); \
		echo "Error: Environment variable '$1' is not set."; \
		$(call line_break); \
		exit 1; \
	fi
endef

# --------------------------------------------------
# Validation
# --------------------------------------------------

.PHONY: validate # Validate required .env variables are set and not empty.
validate:
	@if [ ! -f $(ENV_FILE_PATH) ]; then \
		$(call line_break); \
		echo "Error: .env file not found at $(ENV_FILE_PATH)"; \
		$(call line_break); \
		exit 1; \
	fi; \
	missing_vars=0; \
	required_vars="\
		POSTGRES_DB \
		POSTGRES_USER \
		POSTGRES_PASSWORD \
		OPENAI_API_KEY \
		RASA_PRO_LICENSE \
	"; \
	for var in $$required_vars; do \
		value=$$(grep -E "^$$var=" $(ENV_FILE_PATH) | cut -d'=' -f2-); \
		if [ -z "$$value" ]; then \
			[ $$missing_vars -eq 0 ] && { $(call line_break); }; \
			echo "Error: '$$var' is missing or empty."; \
			missing_vars=$$((missing_vars + 1)); \
		fi; \
	done; \
	if [ $$missing_vars -gt 0 ]; then \
		echo "Please define the missing variables or reach out to dev@fitpassgroup.com for assistance"; \
		$(call line_break); \
		exit 1; \
	else \
	  	$(call line_break); \
		echo "All required environment variables are valid."; \
		$(call line_break); \
	fi

# --------------------------------------------------
# Help command
# --------------------------------------------------

.PHONY: help # Display all available commands.
help:
	@clear
	@$(call line_break)
	@echo "LIST OF AVAILABLE COMMANDS"
	@$(call line_break)
	@grep '^.PHONY: .* #' Makefile | sed 's/\.PHONY: \(.*\) # \(.*\)/\1:\t\2/' | column -ts "$$(printf '\t')"
	@$(call line_break)

# --------------------------------------------------
# Cleanup commands
# --------------------------------------------------

.PHONY: clean # Remove all Docker containers, volumes, and networks.
clean:
	- docker kill $$(docker ps -q) || true
	- docker volume rm $$(docker volume ls -q) || true
	- docker system prune -a -f --volumes || true
	- docker network rm $$(docker network ls -q) || true

.PHONY: remove # Delete project-generated files and caches.
remove:
	rm -rf \
		$(DOCKER_DIR)/database/postgres \
		$(RBC_DIR)/rasa/.cache \
		$(RBC_DIR)/rasa/.config \
		$(RBC_DIR)/rasa/.keras \
		$(RBC_DIR)/rasa/.rasa \
		$(RBC_DIR)/rasa/out.log \
		$(RBC_DIR)/webchat/node_modules \
		$(RBC_DIR)/webchat/public

.PHONY: set-secure-permissions # Set correct file and directory permissions.
set-secure-permissions:
	@echo "Applying secure permissions to $(RBC_DIR)..."
	@chown -R $(shell whoami):$(shell id -gn) $(RBC_DIR) \
		|| sudo chown -R $(shell whoami):$(shell id -gn) $(RBC_DIR)
	@find $(RBC_DIR) -type f -exec chmod 0644 {} \;
	@find $(RBC_DIR) -type d -exec chmod 0755 {} \;
	@find $(RBC_DIR) -type f \( -name "*.key" -o -name "*.env" \) -exec chmod 0640 {} \;
	@echo "Secure permissions applied successfully."

# --------------------------------------------------
# Docker management commands
# --------------------------------------------------

.PHONY: setup # Initialize the application environment.
setup:
	@read -p "This command will remove all containers, images, networks, and volumes from this machine. Are you sure you want to proceed? (y/yes): " confirmation; \
	if [ "$$confirmation" != "y" ] && [ "$$confirmation" != "yes" ]; then \
		echo "Action canceled."; \
		exit 1; \
	fi; \
	$(MAKE) validate clean || exit 1; \
	if [ "$$h" = "1" ]; then \
		$(MAKE) remove || exit 1; \
	fi; \
	$(MAKE) build


.PHONY: build # Build and start Docker containers.
build:
	DOCKER_BUILDKIT=1 \
	APP_PLATFORM=$(APP_PLATFORM) \
	docker compose \
		--project-name rbc \
		--file $(DOCKER_DIR)/docker-compose.yml \
		--env-file $(ENV_FILE_PATH) \
		--compatibility up \
		--detach \
		--build

.PHONY: status # Display Docker container, image, and volume status.
status:
	@$(call line_break)
	docker ps -a
	@$(call line_break)
	docker images
	@$(call line_break)
	docker volume ls
	@$(call line_break)
	docker network ls
	@$(call line_break)

.PHONY: exec # Open a shell session in a specified container.
exec:
	$(call check_required_variable, c)
	docker exec -it $(c) sh

.PHONY: logs # Display logs for a specific container.
logs:
	$(call check_required_variable, c)
	docker logs $(c)

.PHONY: restart # Restart a specified container.
restart:
	APP_PLATFORM=$(APP_PLATFORM) \
	docker compose \
		--project-name rbc \
		--file $(DOCKER_DIR)/docker-compose.yml \
		--env-file $(ENV_FILE_PATH) restart

.PHONY: down # Stop a specific container.
down:
	APP_PLATFORM=$(APP_PLATFORM) \
	docker compose \
		--project-name rbc \
		--file $(DOCKER_DIR)/docker-compose.yml \
		--env-file $(ENV_FILE_PATH) down

.PHONY: up # Start a specific container.
up:
	APP_PLATFORM=$(APP_PLATFORM) \
	docker compose \
		--project-name rbc \
		--file $(DOCKER_DIR)/docker-compose.yml \
		--env-file $(ENV_FILE_PATH) up \
		--detach

.PHONY: platform # Show the current system architecture.
platform:
	@echo $(APP_PLATFORM)

.PHONY: inspect|c # Inspect a container or image details.
inspect:
	$(call check_required_variable, c)
	docker inspect $(c)

.PHONY: about # Show detailed project environment information.
about:
	@docker exec rasa-pro sh -c "\
		echo '[x] OS VERSION:' && cat /etc/os-release | grep PRETTY_NAME | cut -d '=' -f 2 | tr -d '\"' && \
		echo '[x] CPU ARCHITECTURE:' && uname -m && \
		echo '[x] RASA VERSION:' && rasa --version \
	"
