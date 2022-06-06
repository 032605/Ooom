//import { handle } from 'express/lib/application';

const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nickForm");
const msgForm = document.querySelector("#msgForm");
const socket = new WebSocket(`ws://${window.location.host}`);

//Json
function makeMsg(type, value){
    const msg = { type, value }
    return JSON.stringify(msg);
};

socket.addEventListener("open", () => {
    console.log("Connected to Server💫");
});

socket.addEventListener("message", (message) => {
    console.log("New Message : ", message.data, " from the server.");

    // li element 추가
    const li = document.createElement("li");
    li.innerText = message.data; // 2-3. li에 text node 추가 
    msgList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server💢");
});


function handleSubmit(event){
    event.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(makeMsg("new_message", input.value));
};

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMsg("nickname", input.value));
};

msgForm.addEventListener("submit", handleSubmit);

nickForm.addEventListener("submit", handleNickSubmit);