.PHONY: help init copy-env build up db down

help: ## Shows help
	@printf "\033[33m%s:\033[0m\n" 'Use: make <command> where <command> one of the following'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[32m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init: ## Initializes the project
	@make copy-env
	@make up

copy-env: ## Copies .env.template file to .env
	cp .env.template .env

build: ## Builds the containers
	docker compose build

up: ## Starts the containers
	docker compose up -d --build

db: ## Starts only data storage containers
	docker compose up -d --build postgres redis

down: ## Stops the containers
	docker compose down --remove-orphans

ps: ## Shows containers status
	docker compose ps

logs: ## Shows logs of node container
	docker compose logs node -f
