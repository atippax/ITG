FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    tesseract-ocr-data-tha

RUN wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/eng.traineddata -O /usr/share/tesseract-ocr/5/tessdata/eng.traineddata && \
    wget https://github.com/tesseract-ocr/tessdata_fast/raw/main/tha.traineddata -O /usr/share/tesseract-ocr/5/tessdata/tha.traineddata
    
ENV OMP_THREAD_LIMIT=1

COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 8080
CMD ["npm", "start"]