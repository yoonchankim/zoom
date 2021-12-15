import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
const app=express();
const __dirname = path.resolve();
app.set("view engine","pug");
app.set("views",__dirname+"/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/",(req,res)=>res.render("home"));
app.get("/*",(req,res)=>res.redirect("/"));
const handleListen=()=>console.log(`Listening on http://localhost:3001`);
const server=http.createServer(app);
const wss=new WebSocketServer({server});
wss.on("connection",(socket)=>{
    console.log("Connected to Browser")
    socket.on("close",()=>console.log("disconnected to browser"));
    socket.on("message",(message)=>{
        console.log(message.toString('utf8'))
    })
    socket.send("hello!!!");
});
server.listen(3001,handleListen);