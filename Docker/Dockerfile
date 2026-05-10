# ──────────────────────────────────────────────
# Stage 1 — Install dependencies
# ──────────────────────────────────────────────
FROM python:3.10-slim AS builder

WORKDIR /app

# System dependencies required by torch / opencv / pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir "poetry==1.6.1"

# Copy only dependency files first (layer caching)
COPY pyproject.toml poetry.lock ./

# Install production deps only (no dev tools like pytest/black)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --only main

# ──────────────────────────────────────────────
# Stage 2 — Final image
# ──────────────────────────────────────────────
FROM python:3.10-slim AS runtime

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# System runtime libs (needed by pillow / torch at runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend code and ML models
COPY backend/ ./backend/
COPY backend/models/ ./backend/models/

WORKDIR /app/backend

# Expose port used by uvicorn
EXPOSE 8000

# Health-check so Azure Container Apps can verify the service is up
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
