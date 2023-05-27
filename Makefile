SHELL := /bin/bash
PWD := $(shell pwd)
default: build

all:

docker-image:
	docker-compose build
.PHONY: docker-image

docker-compose-up:
	docker-compose -f docker-compose.yml up -d --remove-orphans
.PHONY: docker-compose-up

docker-compose-down:
	docker-compose -f docker-compose.yml stop -t 1
	docker-compose -f docker-compose.yml down
.PHONY: docker-compose-down

docker-compose-logs:
	docker-compose -f docker-compose.yml logs -f
.PHONY: docker-compose-logs

clean:
	./clean.sh
