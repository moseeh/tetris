# Build stage
FROM golang:1.20 AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o tetris ./cmd/main.go

# Run stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/tetris .
COPY static/ ./static/
COPY index.html ./
EXPOSE 8080
CMD ["./tetris"]
