FROM python:3.9
WORKDIR /api
COPY web-api/pyproject.toml .
RUN pip3 install poetry
RUN poetry install --with dev
COPY ./web-api .