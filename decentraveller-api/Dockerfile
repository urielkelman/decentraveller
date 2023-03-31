FROM python:3.9
WORKDIR /api
COPY web-api/requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install pytest
COPY ./web-api .