FROM python:3.9-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target=/dependencies

FROM python:3.9-slim
WORKDIR /app
COPY --from=builder /dependencies /usr/local/lib/python3.9/site-packages
COPY . .
EXPOSE 5000
CMD [ "python" , "app.py" ]