FROM golang:1.24-bookworm AS builder
RUN apt-get update && apt-get install -y \
    libtesseract-dev \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/eng.traineddata -O /usr/share/tesseract-ocr/5/tessdata/eng.traineddata && \
    wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/tha.traineddata -O /usr/share/tesseract-ocr/5/tessdata/tha.traineddata

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -o main .

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-tha \
    tesseract-ocr-eng \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV OMP_THREAD_LIMIT=1
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/tessdata_fast/*.traineddata /usr/share/tesseract-ocr/5/tessdata/
EXPOSE 8081
CMD ["./main"]