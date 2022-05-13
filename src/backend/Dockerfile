FROM quay.io/azavea/django:3.2-python3.10-slim

RUN mkdir -p /usr/local/src/backend
WORKDIR /usr/local/src/backend

COPY ./src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src/backend /usr/local/src/backend
COPY ./src/frontend/build /usr/local/src/backend/static
