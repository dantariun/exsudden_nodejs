# exsudden_nodejs

CCTV 영상 관제 시스템 백엔드. RTSP 스트림을 HLS로 변환하여 브라우저에 제공하고, Socket.io를 통해 실시간 이벤트·알람 데이터를 클라이언트에 푸시한다. Vue.js 2 SPA가 번들로 내장되어 단일 서버로 프론트엔드까지 서빙한다.

## Stack

![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![Vue.js](https://img.shields.io/badge/Vue.js-2.x-4FC08D)
![OracleDB](https://img.shields.io/badge/DB-OracleDB-F80000)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101)
![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED)

### Backend
- **서버**: Node.js + Express 4
- **ORM**: Sequelize 6 + OracleDB 5
- **인증**: Passport (Local Strategy) + express-session
- **실시간**: Socket.io 4, ws, WebSocket
- **스트리밍**: fluent-ffmpeg, rtsp-ffmpeg, hls-server (RTSP → HLS 변환)
- **프로세스 관리**: PM2
- **환경 설정**: dotenv

### Frontend (번들 내장)
- **UI 프레임워크**: Vue.js 2.x
- **라우터**: Vue Router 3.x (history mode, `connect-history-api-fallback` 지원)
- **상태 관리**: Vuex
- **빌드**: Webpack (app, vendor, manifest + 코드 스플리팅 chunks)
- **기타**: jQuery (EXcode 화면)

## 주요 기능

### CCTV 스트리밍
- RTSP 스트림 수신 → fluent-ffmpeg로 HLS 변환
- 브라우저에서 플러그인 없이 실시간 영상 재생
- 다중 카메라 목록 관리 (`models/cctv/thCctv.js`)

### 실시간 이벤트 처리
- Socket.io로 감지 이벤트·알람 클라이언트 푸시
- `WebSocket.js` / `netSocket.js` 분리 구조
- 야간 이벤트 (`tnIaMngrNight`), 스캔 상태 (`thIaCctvScanSttus`) 모델 별도 관리

### 관제 대시보드
- Vue SPA가 `public/static/`에 번들로 내장
- 대시보드 / 이벤트 / 이력 / 통계 / 설정 화면 구성 (`routes/`)
- Vue Router history mode: `connect-history-api-fallback` 미들웨어로 SPA 라우팅 지원

### 인증
- Passport Local Strategy + bcrypt 패스워드 해시
- 세션 기반 인증 (httpOnly 쿠키, 1시간 만료)
- 기관(`tnInstt`) · 사용자(`tnUser`) · 사용자 속성(`tnUserAttrb`) 모델

## 프로젝트 구조

```
exsudden_nodejs/
├── app.js                   # Express 앱 설정
├── bin/www                  # HTTP 서버 진입점
├── WebSocket.js             # Socket.io 연결 처리
├── netSocket.js             # 네트워크 소켓
├── fstScanServer.js         # 스캔 서버
├── constants.js             # 상수 정의
├── Dockerfile
├── config/db/               # Sequelize DB 설정
├── models/
│   ├── auth/                # 사용자·기관 모델
│   ├── cctv/                # CCTV 모델
│   └── outbrk/              # 이벤트·알람·스캔 모델
├── routes/
│   ├── auth/                # 로그인·로그아웃
│   ├── cctv/                # 카메라 목록·스트림
│   ├── dashboard/           # 대시보드 API
│   ├── event/               # 이벤트 조회
│   ├── history/             # 이력 조회
│   ├── set/                 # 설정 API
│   └── statistical/         # 통계 API
├── server/
│   ├── controller/          # 라우트 컨트롤러
│   ├── service/             # 비즈니스 로직
│   └── utils/               # 공통 유틸
├── passport/                # Passport 전략 설정
├── views/                   # EJS 템플릿
└── public/static/
    ├── js/                  # Vue SPA Webpack 번들
    ├── css/
    └── EXcode/ EXcode2/     # 정적 화면 (jQuery)
```

## 환경 변수

`.env` 파일을 프로젝트 루트에 생성한다.

```env
PORT=3000
COOKIE_SECRET=your_cookie_secret
DB_HOST=your_oracle_host
DB_PORT=1521
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_service_name
```

## 시작하기

```bash
npm install
```

```bash
# 개발
npm start        # nodemon server

# 프로덕션
pm2 start bin/www --name exsudden
```

## Docker

```bash
docker build -t exsudden_nodejs .
docker run -d -p 3000:3000 --env-file .env exsudden_nodejs
```

## API 구조

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/login` | 로그인 |
| GET | `/cctv/list` | CCTV 목록 조회 |
| GET | `/cctv/stream/:id` | HLS 스트림 |
| GET | `/dashboard` | 대시보드 데이터 |
| GET | `/event/list` | 이벤트 목록 |
| GET | `/statistical` | 통계 데이터 |

## 주의사항

- OracleDB 클라이언트 (`oracledb` 네이티브 모듈) 설치 시 Oracle Instant Client가 필요하다.
- Vue SPA는 별도 빌드 없이 `public/static/js/`에 번들이 포함되어 있다.
- RTSP 스트리밍은 서버에 `ffmpeg`가 설치되어 있어야 동작한다.
