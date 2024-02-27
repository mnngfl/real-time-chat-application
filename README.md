# Real-time Chat Application

## Description

간단한 실시간 채팅 애플리케이션으로, Client ∙ API Server ∙ Socket Serve ∙ Database로 구성되어 있습니다.

## Project structure

- **client**: 클라이언트 애플리케이션. Vite와 React를 사용해 구성되었으며 Nginx를 통해 서비스됩니다.
- **server**: 서버 애플리케이션. Express를 사용하여 구성되었으며 MongoDB와 통신하며 데이터를 처리합니다.
- **socket**: Socket.io를 사용한 실시간 통신 서버. 클라이언트 및 서버 간의 실시간 이벤트를 처리합니다.

## How to Install and Run

#### 1. 프로젝트 클론

```shell
git clone https://github.com/mnngfl/real-time-chat-application.git
cd real-time-chat-application
```

#### 2. 도커 컴포즈 실행

```shell
docker-compose up --build -d
```

실행시키기 위해 Docker Desktop 혹은 Compose plugin이 설치되어 있어야 합니다.([설치 가이드](https://docs.docker.com/compose/install/))<br />
명령이 정상적으로 실행된 경우, http://localhost:5173 경로를 통해 클라이언트 애플리케이션이 제공됩니다.

#### 3. 접근 방법

- Client: 브라우저에서 http://localhost:5175에 접속해 실시간 채팅을 시작할 수 있습니다.
- API Server: http://localhost:3000 에서 접근할 수 있습니다.
- Socket: http://localhost:3030 에서 접근할 수 있습니다.
- Database: mongodb://localhost:27017 로 접속할 수 있습니다.
