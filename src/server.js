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
io.on("connection",socket=>{
    socket.on("join_room",(roomName,done)=>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome")
    })
})
server.listen(3001,handleListen);