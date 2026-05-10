# Makefile — Aradhi local development (AWS)
MAKEFLAGS += --silent

# ── Variables ──────────────────────────────────────────────────
GIT_BRANCH     := $(shell git name-rev --name-only HEAD | sed 's/[^a-zA-Z0-9]/-/g')
AWS_REGION     := us-east-1
AWS_ACCOUNT_ID := $(shell aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY   := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
IMAGE_NAME     := $(ECR_REGISTRY)/aradhi-backend
LOCAL_TAG      := test-local-$(USER)-$(GIT_BRANCH)
DOCKER_FULL    := $(IMAGE_NAME):$(LOCAL_TAG)

DOCKER_COMPOSE_DEV := docker-compose -f docker-compose.dev.yml

# ── Help ───────────────────────────────────────────────────────
help: ## Show all available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort \
	  | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ── Build ──────────────────────────────────────────────────────
build-dev: ## Build the development Docker image
	$(DOCKER_COMPOSE_DEV) build aradhi-backend-test

rebuild-dev: ## Force rebuild the dev Docker image (no cache)
	$(DOCKER_COMPOSE_DEV) build --no-cache aradhi-backend-test

build-prod: ## Build the production Docker image
	docker build -t $(DOCKER_FULL) -f docker/Dockerfile .

rebuild-prod: ## Force rebuild production image (no cache)
	docker build --no-cache -t $(DOCKER_FULL) -f docker/Dockerfile .

# ── AWS ECR ────────────────────────────────────────────────────
ecr-login: ## Login Docker to Amazon ECR
	aws ecr get-login-password --region $(AWS_REGION) \
	  | docker login --username AWS --password-stdin $(ECR_REGISTRY)

ecr-create: ## Create the ECR repository (une seule fois)
	aws ecr create-repository \
	  --repository-name aradhi-backend \
	  --region $(AWS_REGION)

push: build-prod ecr-login ## Build and push image to ECR
	docker push $(DOCKER_FULL)

# ── Run ────────────────────────────────────────────────────────
run-api: build-dev ## Run the backend API locally with hot reload
	$(DOCKER_COMPOSE_DEV) up aradhi-backend

run-frontend: ## Run the Vite frontend dev server
	$(DOCKER_COMPOSE_DEV) up aradhi-frontend

run-all: ## Run backend + frontend together
	$(DOCKER_COMPOSE_DEV) up aradhi-backend aradhi-frontend

# ── Tests ──────────────────────────────────────────────────────
test: ## Run pytest inside Docker
	$(DOCKER_COMPOSE_DEV) run --rm aradhi-backend-test pytest

test-local: ## Run pytest locally (nécessite Poetry)
	poetry run pytest tests/ -v

# ── Lint ───────────────────────────────────────────────────────
lint-code: ## Run flake8 on backend code
	$(DOCKER_COMPOSE_DEV) run --rm aradhi-backend-test flake8 backend/

lint-test: ## Run flake8 on test files
	$(DOCKER_COMPOSE_DEV) run --rm aradhi-backend-test flake8 tests/

lint: lint-code lint-test ## Run flake8 on everything

lint-frontend: ## Run ESLint on frontend
	npm run lint

# ── Utilities ──────────────────────────────────────────────────
shell: ## Open a shell inside the dev container
	$(DOCKER_COMPOSE_DEV) run --rm aradhi-backend /bin/bash

lock: ## Regenerate poetry.lock
	$(DOCKER_COMPOSE_DEV) run --rm lock

build-frontend: ## Build the React/Vite frontend
	npm ci && npm run build

down: ## Stop and remove all containers and volumes
	$(DOCKER_COMPOSE_DEV) down

# ── Deploy manuel ──────────────────────────────────────────────
deploy-backend: ## Force redeploy ECS service
	aws ecs update-service \
	  --cluster aradhi-cluster \
	  --service aradhi-backend-service \
	  --force-new-deployment \
	  --region $(AWS_REGION)

deploy-frontend: build-frontend ## Deploy frontend to S3
	aws s3 sync dist/ s3://aradhi-frontend --delete
	aws cloudfront create-invalidation \
	  --distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) \
	  --paths "/*"
