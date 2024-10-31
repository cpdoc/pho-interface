.PHONY: help build bundle clean deploy dev first install shell restart start stop test test-watch tsc-watch up

help:		## List all make commands
	@awk 'BEGIN {FS = ":.*##"; printf "\n  Please use `make <target>` where <target> is one of:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)
	@echo ' '

build:		## Build containers
	docker compose build

bundle: build install		## Run npm build to bundle final
	rm -rf dist
	docker compose run --rm web npm run build

clean: stop	## Stop and remove containers and node_modules
	docker compose down -v --remove-orphans
	rm -rf node_modules

deploy:		bundle		## Prepare the dist/ folder for gh-pages deployment
	@if git show-ref --verify --quiet refs/heads/gh-pages; then \
		git checkout gh-pages; \
	else \
		git checkout --orphan gh-pages && \
		git reset; \
	fi
	$(eval DIST_FILES := $(shell ls dist))
	cp -r dist/* .
	rm -rf dist
	git add -f $(DIST_FILES)
	git commit -m "Deploy to GitHub Pages - $(shell date +"%Y-%m-%d %H:%M:%S")"
	git checkout -f -
	@echo "Branch gh-pages está pronto para push. Para publicar, execute:"
	@echo "git push origin gh-pages --force"

dev:		## Run `npm run dev`
	docker compose run --rm web npm run dev -- --host

first: build install start  ## Build the env, up it and run the npm install and then run npm run dev it to

install:	## Run npm install
	docker compose run --rm web npm install

shell:	## Interactive mode in web
	docker compose run --rm web bash

restart: stop start ## Compose Kill, rm and start again

start: up dev	## Start services

stop:	## Compose kill and rm
	docker compose kill
	docker compose rm --force

test:	## Run tests
	docker compose run --rm web npm run test:unit

test-watch:	## Run tests in watch mode
	docker compose run --rm web npm run test-watch:unit

tsc-watch:	## Run type-check-watch command
	docker compose run --rm web npm run type-check-watch

up:	## Start containers
	docker compose up --build --no-recreate -d
