# Basic Kong Gateway

Basic Kong Gateway based on Docker

## Getting Started

### Installing

1. Clone this repository anywhere on you machine:

```
$ git clone https://github.com/snlangsuan/demo-kong-gateway.git
```

2. Run mock service on Docker

```
$ cd demo-kong-gateway/01-basic-kong-gateway/mock-services
$ docker compose up -d --build
```

3. Run Kong Gateway on Docker

```
$ cd demo-kong-gateway/01-basic-kong-gateway
$ docker compose up -d
```

### Usage

1. Kong Manager (OSS) on your browser `http://localhost:8002`

2. Kong Admin API `http://localhost:8001`

3. Kong Proxy API `http://localhost:8000`

## Acknowledgments
- https://docs.konghq.com/gateway/latest/

ปล. สามารถอ่านบทความ [ลองเล่น Kong Gateway กัน แล้วจะรู้ว่าชีวิตง่ายขึ้นเมื่อมี Kong](https://medium.com/@decimo/%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99-kong-gateway-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%88%E0%B8%B0%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%A1%E0%B8%B5-kong-3e5c9683c137)