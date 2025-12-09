FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=builder /app/dist ./dist
COPY app.py .
EXPOSE 8080
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} app:app
