const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`); //front-backend 서버로 연결

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg); //object를 string으로 바꿔 backend에 전송
}

socket.addEventListener("open", ()=>{
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
}); //server한테 메제지 받음

socket.addEventListener("close", ()=>{
    console.log("Disconnected from Server ❌");
});

// setTimeout(()=>{
//     socket.send("hello from the browser");
// }, 10000); //server한테 메세지 보냄

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value)); //server한테 메세지 보냄
    input.value="";
}
function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value)); //server한테 닉네임 보냄
    input.value="";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);