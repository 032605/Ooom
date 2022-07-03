// io는 자동적으로 back-end socket.io와 연결해주는 funtion 
const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const callH2 = call.querySelector("h2");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
        console.log(cameras);
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true.valueOf,
        video: {facingMode : "user"},
    }

    const cameraConstraints = {
        audio: true,
        video: {deviceId : {exact : deviceId}},
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    } catch (e) {
        console.log(e);
    }
}

function handleMuteClick () {
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled ));
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick (){
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled ));
    
    if(cameraOff) {
        cameraBtn.innerText = "Turn camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handleCameraClick)
camerasSelect.addEventListener("input", handleCameraChange)


// Welcome Form(choose a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();     //cam/mic on 
    makeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();   //WebSokcet 속도가 media를 가져오는 속도나 연결을 만드는 속도보다 빨라 initCall 함수를 join_room보다 먼저 호출하도록 순서 변경
    socket.emit("join_room", input.value);
    roomName = input.value;
    callH2.innerText = roomName;
    input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

// Peer A
socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer(); //the purpose of starting a new WebRTC connection to a remote peer
    myPeerConnection.setLocalDescription(offer);    //offer로 연결 구성
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

// Peer B
socket.on("offer", async (offer) => {
    myPeerConnection.setRemoteDescription(offer);   //offer를 받아서 set
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer); 
    socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
    myPeerConnection.setRemoteDescription(answer);
});

// RTC Code

function makeConnection(){
    // track들을 개별적으로 추가해주는 함수
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));    //addStram()은 오래된 함수라 사용 X
}