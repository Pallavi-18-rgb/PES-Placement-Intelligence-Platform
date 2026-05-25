FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Ensure backend can import orchestration local modules
ENV PYTHONPATH=/app:/app/orchestration

# Copy requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application and orchestration packages
COPY backend/app ./app
COPY orchestration ./orchestration
COPY validation_suite ./validation_suite

# Expose the port FastAPI will run on
EXPOSE 8000

# Use environment file if present (optional)
# ENV $(cat .env | xargs)

# Start the FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
