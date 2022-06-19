// io는 자동적으로 back-end socket.io와 연결해주는 funtion 
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_msg", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");

    h3.innerText = `Room ${roomName}`;
    
    const form = room.querySelector("form");

    form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSumbit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("Enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSumbit);

//Server에서 프론트 단으로 가져오기
socket.on("welcome", () => {
    addMessage("someone joined!");
});

socket.on("bye", () => {
    addMessage("soneone left:(");
});

socket.on("new_msg", addMessage);