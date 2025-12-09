FROM python:3.11-slim

WORKDIR /app

RUN pip install flask==3.0.0 werkzeug==3.0.0

COPY . .

EXPOSE 8080

CMD ["python", "app.py"]
