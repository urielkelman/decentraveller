FROM python:3.9-bookworm
WORKDIR /api
COPY web-api/pyproject.toml .
RUN apt-get update -y
RUN apt-get install gcc pkg-config libhdf5-dev -y
RUN pip3 install poetry
RUN poetry install --with dev
COPY ./web-api .