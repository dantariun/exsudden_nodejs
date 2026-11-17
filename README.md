# exsudden_nodejs

CCTV 관제 시스템 Node.js 백엔드 서버. 실시간 영상 스트리밍과 이벤트 관리 대시보드를 제공한다.

## Stack

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black)
![Sequelize](https://img.shields.io/badge/Sequelize-6.x-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

- **Runtime**: Node.js + Express
- **Realtime**: Socket.io, WebSocket, RTSP → HLS (ffmpeg)
- **DB**: Oracle DB (Sequelize ORM)
- **Auth**: Passport.js (로컬 전략)
- **Infra**: Docker, PM2

## Features

- CCTV 실시간 영상 스트리밍 (RTSP → HLS 변환)
- 이벤트 감지 및 알림 관리
- 관제 대시보드 (통계, 이력 조회)
- 담당자 설정 및 야간 근무 관리
- 로컬 인증 (Passport)

## 화면 구성

| 화면 | 설명 |
|------|------|
| 1000. 로그인 | 사용자 인증 |
| 1100. 대시보드 | 전체 현황 한눈에 보기 |
| 2000. 이벤트 | 이상 감지 이벤트 목록 |
| 3000. 통계 | 기간별 통계 조회 |
| 4000. CCTV | 카메라 목록 및 영상 |
| 5000. 녹화 기록 | 녹화 이력 조회 |
| 6000~. 설정 | 시간, 이벤트, 날씨, 알림 설정 |

## 실행

```bash
npm install
npm start        # nodemon (개발)
pm2 start app.js # 운영
```

```bash
docker build -t exsudden .
docker run -p 3000:3000 exsudden
```

## 환경 변수

`.env` 파일 생성 후 설정:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
SESSION_SECRET=
```
