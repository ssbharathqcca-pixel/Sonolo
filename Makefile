# Sonolo Makefile
#
# backend and mobile run locally. setup, web, and test are placeholders
# until their scaffolding lands (see docs/TASK_BOARD.md).

.PHONY: help setup backend mobile web test

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  %-8s %s\n", $$1, $$2}'

setup: ## Install toolchains and dependencies for all workstreams
	@echo "setup: placeholder - no dependencies yet (see docs/TASK_BOARD.md)"

backend: ## Run the FastAPI backend locally (auto-reload on :8000)
	cd backend && uvicorn app.main:app --reload

mobile: ## Run the Expo mobile app (Metro dev server)
	cd apps/mobile && npx expo start

web: ## Run the Next.js web app
	@echo "web: placeholder - no web app yet (see docs/TASK_BOARD.md)"

test: ## Run all tests (backend tests: cd backend && pytest)
	@echo "test: unified target pending - backend tests run with pytest from backend/"
