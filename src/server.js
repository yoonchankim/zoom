import express from "express";
import path, { parse } from "path";
import http from "http";
import  { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const app=express();
const __dirname = path.resolve();
let firstNickName="Anon";
app.set("view engine","pug");
app.set("views",__dirname+"/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/",(req,res)=>res.render("home",{nickname:firstNickName}));
app.get("/*",(req,res)=>res.redirect("/"));
const handleListen=()=>console.log(`Listening on http://localhost:3001`);
const server=http.createServer(app);
const io=new Server(server, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
  });
  instrument(io, {
    auth: false,
  });
function publicRooms(){
    const sids=io.sockets.adapter.sids;
    const rooms=io.sockets.adapter.rooms;
    const publicRooms=[];
    rooms.forEach((_,key)=>{
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}
function countRoom(roomName){
    return io.sockets.adapter.rooms.get(roomName)?.size;
}
io.on("connection",(socket)=>{
    socket["nickname"]="Anon";
    socket.onAny((event)=>{
        console.log(io.sockets.adapter);
        console.log(`socket event:${event}`);
    })
    socket.on("enter_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome",socket.nickname,countRoom(roomName));
        console.log(socket.rooms);
        io.sockets.emit("room_change",publicRooms());
    });
    socket.on("disconnecting",()=>{
        socket.rooms.forEach(room=>socket.to(room).emit("bye",socket.nickname,countRoom(room)-1));
    })
    socket.on("disconnect",()=>{
        io.sockets.emit("room_change",publicRooms());
    })
    socket.on("new_message",(msg,roomName,done)=>{
        socket.to(roomName).emit("new_message",`${socket.nickname}:${msg}`);
        done();
    })
    socket.on("nickname",nickname=>{
        socket["nickname"]=nickname;
    })
    socket.on("first-nickname",(nickname)=>{
        socket["nickname"]=nickname;
        firstNickName=nickname;
    })
});
// const wss=new WebSocketServer({server});
// const sockets=[];
// wss.on("connection",(socket)=>{
//     sockets.push(socket);
//     socket["nickname"]="Anon"
//     console.log("Connected to Browser")
//     socket.on("close",()=>console.log("disconnected to browser"));
//     socket.on("message",(message)=>{
//         const parsed=JSON.parse(message);
//         switch(parsed.type){
//             case "new_message":
//                 sockets.forEach((aSocket)=>aSocket.send(`${socket.nickname}:${parsed.payload}`));
//             case "nickname":
//                 socket["nickname"]=parsed.payload;
//         }
//     })
// });
server.listen(3001,handleListen);