FROM python:3.11-slim

WORKDIR /

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY orchestration/requirements.txt /orchestration/requirements.txt
RUN pip install --no-cache-dir -r /orchestration/requirements.txt

COPY orchestration /orchestration
COPY backend/app /orchestration/app
COPY validation_suite /orchestration/validation_suite

CMD ["python", "/orchestration/run.py"]
