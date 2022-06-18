import http from "http";
import WebSocket from 'ws';
import SocketIO, { Socket } from "socket.io";
import express from "express";
import res from 'express/lib/response';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views" );
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`sockect event:-${event}`);
    });

    socket.on("Enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
});

/*const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log(sockets.length);
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from Browser💨") );
    socket.on("message", (message) => {
        const jsonData = JSON.parse(message);

        switch(jsonData.type){
            case "new_message": 
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${jsonData.value}`));
            case "nickname":
                socket["nickname"] = jsonData.value;
        }

    });
}); */

server.listen(3000, handleListen);