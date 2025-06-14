SHELL:=/usr/bin/env bash
VENDOR_NAME ?= scitarc
name = blazar-frontend
CONTAINER_NAME = $(name)
NODE_VERSION ?= 16.20.0
APPLICATION_PORT ?= 80
GIT_HASH ?= $(shell git log --format="%h" -n 1)
NVM_EXISTS:=$(shell if [ -d "${HOME}/.nvm/.git" ]; then echo 0;fi)
BOLD=$(shell tput setaf bold)
RED=$(shell tput setaf 1)
BRED=$(shell tput setab 0)
ENDEFFECT=$(shell tput setab sgr0)
GREEN=$(shell tput setaf 2)
YELLOW=$(shell tput setaf 3)
ENDCOLOR=$(shell tput setaf 8)
D=docker
DC=${D} compose

help: ## All arguments described above are optional.
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

stop: ## Stop all running containers.
	${D} stop $$(${D} ps -aq) || true

prune: stop ## remove all docker data from host. CAUTION!
	${D} system prune -af

build: ## Build blazar-frontend. Args CONTAINER_NAME
	${D} build -t ${CONTAINER_NAME} .

run: ## run containers. Args: CONTAINER_NAME, APPLICATION_PORT (port that will be binded from container to host)
	${D} run --env-file=.env --name ${CONTAINER_NAME} -d -p 3000:80 --rm ${CONTAINER_NAME}

prod: ## build the production artifact and run the container.
	$(MAKE) build
	$(MAKE) run

dev: check-nvm npm-install ## start development version of the application.
	${DC} up -d --force-recreate
	@echo -e "${GREEN}Your environment is ready little grasshopper, now go and do something amazing!${ENDCOLOR}"

exec: ## Goes inside the container. Args CONTAINER_NAME
	${D} exec -it ${CONTAINER_NAME} sh

check-nvm: ## Verify if NVM is installed and if it's not, will install. Args NODE_VERSION
		@if [ "$(NVM_EXISTS)" != 0 ]; then \
  		@echo -e "${YELLOW}We need to install NVM. Let's Go!${ENDCOLOR}"; \
			$(MAKE) nvm-install; \
		fi

		@echo -e "${GREEN}NVM installed, let's proceed.${ENDCOLOR}"; \
		echo "Setting node version to ${NODE_VERSION}"; \
		NVM_DIR="$${HOME}/.nvm" && . "$${NVM_DIR}/nvm.sh" && \. "$$NVM_DIR/bash_completion"  && nvm install ${NODE_VERSION}; \
		exit 0; \

nvm-install: ## Install nvm
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
		export NVM_DIR="$${HOME}/.nvm"; \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh"; \
		[ -s "$$NVM_DIR/bash_completion" ] && \. "$$NVM_DIR/bash_completion" ; \
		exit 0

npm-install: ## install NODE dependencies.
	@echo -e "${GREEN}Start installing NODE dependencies...${ENDCOLOR}"; \
	npm install;
	@echo -e "${GREEN}End installing NODE dependencies.${ENDCOLOR}"; \

ps: ## show running containners
	${D} ps --no-trunc

lint: ## Verify linter
	npm run lint

lint-fix: ## Run lint automatic fix
	npm run lint-fix

logs: ## display and follow container logs
	${D} logs ${CONTAINER_NAME} --follow
