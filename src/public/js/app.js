const socket = io(); //front-backend 연결
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;
let roomName;

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=>{
        addMessage(`YOU: ${value}`);
    });
    input.value="";
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText=message;
    ul.appendChild(li);
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value="";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount)=>{
    addMessage(`${user} joined!`);
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
});

socket.on("bye", (user, newCount)=>{
    addMessage(`${user} left!`);
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
})

socket.on("new_message", addMessage);

socket.on("room_change", (rooms)=>{
    const roomList = welcome.querySelector("ul");
    roomList.innerText= "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room=>{
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});


/*
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`); //front-backend 연결

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
*/

