// io는 자동적으로 back-end socket.io와 연결해주는 funtion 
const socket = io();

const welocome = document.getElementById("welcome");
const form = welocome.querySelector("form");

function backendDone(msg){
    console.log(`mag form backend : `, msg);
}

function handleRoomSumbit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("room", input.value, backendDone);
    input.value = "";
}



form.addEventListener("submit", handleRoomSumbit);