const socket=io();
const welcome=document.getElementById("welcome");
const form=welcome.querySelector("form");
const form2=welcome.querySelector("#name");
const room=document.getElementById("room");
const nameForm=room.querySelector("#name");
const input3=nameForm.querySelector("input");
let firstNickName="Anon";
input3.value=firstNickName;
room.hidden=true;
let roomName;
function addMessage(message){
    const ul=room.querySelector("ul");
    const li=document.createElement("li");
    li.innerText=message;
    ul.appendChild(li);
}
function handleMessageSubmit(event){
    event.preventDefault();
    const msgForm=room.querySelector("#msg");
    const input=msgForm.querySelector("input");
    const value=input.value;
    socket.emit("new_message",value,roomName,()=>{
        addMessage(`You:${value}`);
    });
    input.value="";
}
function handleNicknameSubmit(event){
    event.preventDefault();
    const value=input3.value;
    socket.emit("nickname",value)
}
function showRoom() {
    welcome.hidden=true;
    room.hidden=false;
    const h3=room.querySelector("h3");
    h3.innerText=`room ${roomName}`;
    const msgForm=room.querySelector("#msg");
    const nameForm=room.querySelector("#name");
    msgForm.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);
}
function handleRoomSubmit(event){
    event.preventDefault();
    const input=form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName=input.value;
    input.value="";
}
function handleFirstNicknameSubmit(event){
    event.preventDefault();
    const input=form2.querySelector("input");
    const value=input.value;
    firstNickName=value;
    input3.value=firstNickName;
    socket.emit("first-nickname",value);
}
form.addEventListener("submit",handleRoomSubmit);
form2.addEventListener("submit",handleFirstNicknameSubmit);
socket.on("welcome",(user)=>{
    addMessage(`${user} arrive`);
})
socket.on("bye",(left)=>{
    addMessage(`${left} left`);
})
socket.on("new_message",(msg)=>{
    addMessage(msg);
})