import http from "http";
import WebSocket from 'ws';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import res from 'express/lib/response';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views" );
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true ,
    },
});

instrument(io, {
    auth: false,
});

function publicRooms() {
    const {sockets : {adapter:{sids, rooms}}} = io;
    //console.log(io.sockets.adapter);        

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function cntRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`sockect event:-${event}`);
        console.log(io.sockets.adapter);   
    });

    socket.on("Enter_room", (roomName, nickName, done) => {
        socket.join(roomName);
        done();
        socket["nickname"] = nickName;
        socket.to(roomName).emit("welcome", socket.nickname, cntRoom(roomName));
        io.sockets.emit("room_change", publicRooms());
        /*socket.to(roomName).emit("welcome" , { some: "someone Joined!", id: socket.id });*/
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, cntRoom(room) -1 ));
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnect", () => {
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_msg", (msg, room, done) => {
        socket.to(room).emit("new_msg", `${socket.nickname}: ${msg}`);
        done();
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

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);