# ---------- Builder stage ----------
FROM python:3.13.7 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

# Create venv and install dependencies
RUN python -m venv .venv
COPY requirements.txt ./
RUN .venv/bin/pip install --no-cache-dir -r requirements.txt

# ---------- Runtime stage ----------
FROM python:3.13.7-slim
WORKDIR /app

# Copy venv from builder
COPY --from=builder /app/.venv .venv/

# Copy only the FastAPI service code into /app/app
COPY app ./app

# Make venv the default Python environment
ENV PATH="/app/.venv/bin:$PATH"

# Run uvicorn directly
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
