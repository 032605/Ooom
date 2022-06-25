// io는 자동적으로 back-end socket.io와 연결해주는 funtion 
const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");
const chat = document.getElementById("chat");

chat.hidden = true;

let roomName;

function addMessage(msg){
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = chat.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_msg", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}


function showRoom(){
    welcome.hidden = true;
    chat.hidden = false;
    const h3 = chat.querySelector("h3");

    h3.innerText = `Room ${roomName}`;
    
    const msgForm = chat.querySelector("#msg");

    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSumbit(event){
    event.preventDefault();
    const nameInput = roomForm.querySelector("#nickName");
    const roomInput = roomForm.querySelector("#roomName");
    socket.emit("Enter_room", roomInput.value, nameInput.value, showRoom);
    roomName = roomInput.value;
    //input.value = "";
}

roomForm.addEventListener("submit", handleRoomSumbit);

//Server에서 프론트 단으로 가져오기
socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} leftㅠㅠ`);
});

socket.on("new_msg", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0 ){
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.appendChild(li);
    });
});
//socket.on("room_change", (msg) => console.log(msg)); //위와 같은 코드
