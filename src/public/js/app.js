const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open",()=>{
    console.log("connected to server");
})
socket.addEventListener("message",(message)=>{
    console.log("jusr got this from server",message.data);
})
socket.addEventListener("close",()=>{
    console.log("disconnected to server");
})
setTimeout(()=>{
    socket.send("hello from the browser")
},10000)