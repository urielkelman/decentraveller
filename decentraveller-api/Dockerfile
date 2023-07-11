FROM python:3.9
WORKDIR /api
COPY web-api/pyproject.toml .
RUN apt-get update
RUN apt-get install libpq-dev
RUN pip3 install poetry
RUN poetry install
COPY ./web-api .