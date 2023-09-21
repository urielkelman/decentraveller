FROM python:3.9
WORKDIR /api
COPY web-api/pyproject.toml .
RUN pip3 install poetry
RUN apt-get update -y
RUN apt-get install gcc pkg-config libhdf5-dev -y
RUN pip install h5py==3.1.0
RUN poetry config virtualenvs.create false
RUN poetry install --with dev
COPY ./web-api .