# Real-time Chat Application

## Description

간단한 실시간 채팅 애플리케이션으로, Client ∙ API Server ∙ Socket Serve ∙ Database로 구성되어 있습니다.

## Project structure

- **client**: 클라이언트 애플리케이션. Vite와 React를 사용해 구성되었으며 Nginx를 통해 서비스됩니다.
- **server**: 서버 애플리케이션. Express를 사용하여 구성되었으며 MongoDB와 통신하며 데이터를 처리합니다.
- **socket**: Socket.io를 사용한 실시간 통신 서버. 클라이언트 및 서버 간의 실시간 이벤트를 처리합니다.

## Features

#### 실시간 1:1 채팅 및 읽지 않은 메시지 수 표시

웹소켓을 활용하여 실시간 메시지 전송 및 알림을 제공하면서도, 영구적인 채팅 데이터 보존을 위해 해당 데이터를 DB에 저장하고 있습니다. 부하를 최소화하기 위해 다음을 고려했습니다.

- 사용자가 메시지를 보낼 때마다 DB에 읽기/쓰기 작업을 하는게 아닌,
- 주기적으로(10초) 혹은 소켓 연결이 끊기는 경우에 데이터를 일괄적으로 저장
  <br />

[두 사용자가 동시에 방에 입장해 있지 않은 경우] 우측 사용자가 메시지를 다건 전송했지만, 주기적으로 실행되는 프로세스에 의해 알림을 1번만 수신합니다.
![1](https://github.com/mnngfl/real-time-chat-application/assets/47686322/83e32886-6af0-42e0-ac4c-7799caaa0368)

[두 사용자가 동시에 방에 입장해 있는 경우] 소켓 이벤트에 의해 두 사용자가 서로 실시간으로 메시지를 송・수신 할 수 있습니다. 이때는 읽지 않은 메시지가 없으므로 알림을 수신하지 않습니다.
![2](https://github.com/mnngfl/real-time-chat-application/assets/47686322/3f8061ba-3051-45aa-99a8-091ffe8ce09d)

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
이 후 터미널을 통해 명령이 정상적으로 실행된 경우, 브라우저에서 http://localhost:5173 경로로 접근하면 클라이언트 애플리케이션이 제공됩니다.

#### 3. 접근 방법

- Client: http://localhost:5175에 접속해 실시간 채팅을 시작할 수 있습니다.
- API Server: http://localhost:3000 에서 접근할 수 있습니다.
- Socket: http://localhost:3030 에서 접근할 수 있습니다.
- Database: mongodb://localhost:27017 로 접속할 수 있습니다.
