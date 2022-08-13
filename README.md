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

--2022.07.02
--video call (이전 realtime chat room은 bye~~)

--2022.07.03
--WebRTC : peer to peer (server는 IP주소, port 정보 등을 넘기기 위해서 존재)

--2022.07.04
--RTCIceCandidate는 answer이 이루어지고 난 뒤 수행.

--2022.07.09
--addstream event is deprecated ref. (https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addstream_event)
--local tunnel : 서버를 공유. url 생성 (글로벌에 설치, npx localtunnel --port 3000)
--백그라운에서 lt 실행(주의,,)

--2022.07.10
--stun 서버가 필요한 이유 : 어떤 것을 request하면 pulic IP 알려줌 (다른 네트워크에 접속 시 기동X)
--해당 프로젝트에서는 구글에서 제공하는 무료 테스트 용 address 활용
(https://help.singlecomm.com/hc/en-us/articles/115007993947-STUN-servers-A-Quick-Start-Guide)
--서비스 운영 시 Stun 서버 직접 개발 필요

--back of WebRTC
--peer to peer 형식이므로 다수 사용자가 이용 시 무거워짐 (최대 3명 이하 권장. 같은 스트림을 n번 업로드, 각각의 다른 사용자 스트림을 n번 다운로드 받아야기 때문)

-- SFU(Selective Forwarding Unit) : 서버 의존하여 스트림을 다운로드 및 업로드
-- peer to peer는 최고사양의 스트림을 송출. SFU는 사용자 활동에 따라 다르게 압축하여 송출 ex) 발표자

-- 2022.08 css  /  msg 
