const socket = new WebSocket(`ws://${window.location.host}`);
const messageList=document.querySelector("ul");
const messageForm=document.querySelector("form");
socket.addEventListener("open",()=>{
    console.log("connected to server");
})
socket.addEventListener("message",(message)=>{
    console.log("jusr got this from server",message.data);
})
socket.addEventListener("close",()=>{
    console.log("disconnected to server");
})
function handleSubmit(event){
    event.preventDefault();
    const input=messageForm.querySelector("input");
    socket.send(input.value);
    input.value="";
}
messageForm.addEventListener("submit",handleSubmit);