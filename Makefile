# Sonolo Makefile
#
# Targets are placeholders until app scaffolding lands (see docs/TASK_BOARD.md).
# Each target prints what it will do once the corresponding workstream exists.

.PHONY: help setup backend mobile web test

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-8s %s\n", $$1, $$2}'

setup: ## Install toolchains and dependencies for all workstreams
	@echo "setup: placeholder - no dependencies yet (see docs/TASK_BOARD.md)"

backend: ## Run the FastAPI backend locally
	@echo "backend: placeholder - no backend code yet (see docs/TASK_BOARD.md)"

mobile: ## Run the Expo mobile app
	@echo "mobile: placeholder - no mobile app yet (see docs/TASK_BOARD.md)"

web: ## Run the Next.js web app
	@echo "web: placeholder - no web app yet (see docs/TASK_BOARD.md)"

test: ## Run all tests
	@echo "test: placeholder - no tests yet (see docs/TASK_BOARD.md)"
