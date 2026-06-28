FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

COPY --from=frontend-builder /app/frontend/build /app/frontend/build

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

ENV MONGO_URI=mongodb://localhost:27017
ENV HF_API_TOKEN=
ENV HF_DEFAULT_MODEL=google/gemma-3-4b-it

EXPOSE 7860

CMD uvicorn main:app --host 0.0.0.0 --port 7860
