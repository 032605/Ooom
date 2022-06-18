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

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");

    h3.innerText = `Room ${roomName}`;
    
}

function handleRoomSumbit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("Enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSumbit);

socket.on("welcome", () => {
    addMessage("someone Joined!");
});