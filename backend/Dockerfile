FROM python:3.9-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt .
RUN pip install --upgrade pip && \
    pip install psycopg2-binary && \
    pip install uwsgi && \
    pip install -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
