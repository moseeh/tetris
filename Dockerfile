FROM golang:1.21 AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

# Add CGO_ENABLED=0 to create a statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -o tetris ./cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/tetris .
COPY static/ ./static/
COPY index.html ./

# Install CA certificates for any HTTPS requests your app might make
RUN apk --no-cache add ca-certificates

EXPOSE 8080

# Simplify the CMD to directly run the binary
CMD ["/app/tetris"]