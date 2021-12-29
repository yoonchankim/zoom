const socket=io();
const myFace=document.querySelector("#myFace");
const muteBtn=document.querySelector("#mute");
const cameraBtn=document.querySelector("#camera");
const cameraSelect=document.querySelector("#cameras");
const call=document.querySelector("#call");
call.hidden=true;
let myStream;
let muted=false;
let cameraOff=false;
let roomName;
async function getCameras()
{
    try{
        const devices=await navigator.mediaDevices.enumerateDevices();
        const cameras=devices.filter(device=>device.kind==="videoinput");
        const currentCamera=myStream.getVideoTracks()[0];
        cameras.forEach(camera=>{
            const option=document.createElement("option");
            option.value=camera.deviceId;   
            option.innerText=camera.label;
            if(camera.label===currentCamera.label){
                option.selected=true;
            }
            cameraSelect.appendChild(option);
        })
    }
    catch(e){
        console.log(e);
    }
}
async function getMedia(deviceId){
    const initialConstraints={
        audio:true,
        video:{facingMode:"user"}
    };
    const cameraConstraimts={
        audio:true,
        video:{deviceId:{exact:deviceId}}
    };
    try{
        myStream=await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraimts:initialConstraints
        );
        myFace.srcObject=myStream;
        if(!deviceId){
            await  getCameras();
        }
    }
    catch(e){
        console.log(e);
    }
}
function handleMuteClick(){
    myStream.getAudioTracks().forEach(track=>{
        track.enabled=!track.enabled;
    });
    if(!muted){
        muteBtn.innerText="Unmute";
        muted=true;
    }
    else{
        muteBtn.innerText="Mute";
        muted=false;
    }
}
function handleCameraClick(){
    myStream.getVideoTracks().forEach(track=>{
        track.enabled=!track.enabled;
    });
    if(cameraOff){
        cameraBtn.innerText="Turn Camera Off";
        cameraOff=false;
    }
    else{
        cameraBtn.innerText="Turn Camera On";
        cameraOff=true;
    }
}
async function handleCameraChange(){
    await getMedia(cameraSelect.value);
}
muteBtn.addEventListener("click",handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick)
cameraSelect.addEventListener("input",handleCameraChange);
// form part(room part)
const welcome=document.querySelector("#welcome");
const welcomeForm=welcome.querySelector("form");
welcomeForm.addEventListener("submit",handelWeclomeSubmit)
function startMedia(){
    welcome.hidden=true;
    call.hidden=false;
    getMedia();
}
function handelWeclomeSubmit(event){
    event.preventDefault();
    const input=welcomeForm.querySelector("input");
    socket.emit("join_room",input.value,startMedia);
    roomName=input.value;
    input.value="";
}
//socket code
socket.on("welcome",()=>{
    console.log("someone joined");
})