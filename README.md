#Ooom

Zoom Clone using Node.JS, WebRTC and WebSockets

--I write memos what I study below

npm 라이브러리 설치 도와주는 도구
express node.JS (라이브러리)

package-lock.json > 모듈 정보 저장

서버를 띄우기 위한 기본 세팅
const express = require('epxress');
const app = express();

app.listen(8080 , function () {
//띄운 후 실행할 코드
});

app.get('/pet', (res, req) => response.send(''));

nodemon은 서버 재실행시켜주는 라이브러리임

--2022.06.12
--WebSocket > SocketI.O : 어떠한 event 명 사용 가능, Object, funtion도 전달 가능

--2022.06.18
--SocketI.O room을 제공
