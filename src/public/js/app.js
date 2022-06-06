const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server💫");
});

function fn_submit() {
    const test = document.getElementById("test").value;
    console.log(test);

    socket.send(test);
}

socket.addEventListener("message", (message) => {
    console.log("New Message : ", message.data, " from the server.");
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server💢");
});

setTimeout(() => {
    socket.send("Time Out!");
}, 10000);