const socket = io(); //front-backend 연결

const h2 = document.querySelector('h2');
const nicknameWrapper = document.querySelector('#nicknameWrapper');
const nicknameForm = document.querySelector('#nicknameForm');
const nicknameInput = document.querySelector('#nicknameInput');
const roomWrapper = document.querySelector('#roomWrapper');
const roomForm = document.querySelector('#roomForm');
const roomInput = document.querySelector('#roomInput');
const messageWrapper = document.querySelector('#messageWrapper');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#messageInput');
const messageULWrapper = document.querySelector('#messageULWrapper');
const messageUL = document.querySelector('#messageUL');
const roomsUL = document.querySelector('#roomsUL');
const welcomeText = document.createElement('p');
const membersWrapper = document.querySelector('#membersWrapper');
const membersText = document.querySelector('#membersText');
const roomInfoWrapper = document.querySelector('#roomInfoWrapper');

let currentRoom = "";
let nickname = "";

const init = () =>{
    membersWrapper.hidden = true; //숨기기
    roomWrapper.hidden = true;    //숨기기
    messageWrapper.hidden = true; //숨기기
    messageULWrapper.hidden = true;      //숨기기
    nicknameInput.focus();
}

init();

/* ============= CLIENT EVENT ============= */

function handleNicknameSubmit(event){
    event.preventDefault();
    socket.emit("nickname", nicknameInput.value, showRoomForm);
}

function handleRoomSubmit(event){
    event.preventDefault();
    socket.emit("enter_room", roomInput.value, showMessageForm);
    currentRoom = roomInput.value;
    roomInput.value="";
}

function handleMessageSubmit(event){
    event.preventDefault();
    const message = messageInput.value;
    socket.emit("new_message",  message, currentRoom, ()=>{
        addMessage(`ME: ${message}`);
    });
    messageInput.value="";
}

/* ============= Toggle Form ============= */

function showRoomForm(newNickname){
    nickname = newNickname;
    //nickname 입력후 입장 → hidden설정
    nicknameWrapper.hidden = true; //숨기기
    roomWrapper.hidden = false;    //보이기
    messageWrapper.hidden = true;  //숨기기
    
    roomInput.focus();
    const p = document.createElement('p');
    p.id="welcome";
    p.innerHTML = `Hello "${nickname}"! Please Join a room💍`;
    roomWrapper.prepend(p);
}

function showMessageForm(){
    //room 입력후 입장 → hidden설정
    roomInfoWrapper.hidden = true;   //숨기기
    nicknameWrapper.hidden = true;   //숨기기
    roomWrapper.hidden = true;       //숨기기
    messageWrapper.hidden = false;   //보이기
    messageULWrapper.hidden = false; //보이기
    membersWrapper.hidden = false;   //보이기
    h1.hidden = true;                //숨기기

    messageInput.focus();
    welcomeText.innerHTML  = `${nickname} in Room ${currentRoom} `;
    membersWrapper.prepend(welcomeText);
}

/* ============= SOCKET EVENT ============= */

function addMessage(message){
    const li = document.createElement('li');
    li.innerText = message;
    messageUL.append(li);
}

socket.on("welcome", (user)=>{
    addMessage(`${user} joined!`);
});

socket.on("bye", (user)=>{
    addMessage(`${user} left!`);
})

socket.on("new_message", addMessage);

socket.on("room_change", (rooms)=>{
    const roomsLength = document.querySelector('#roomsLength');
    roomsLength.innerHTML  = ` (${rooms.length})`;
    roomsUL.innerHTML = '';
    const roomMembers = [];
    
    if(rooms.length===0){
        const li = document.createElement("li");
        li.innerHTML  = `No rooms now`;
        roomsUL.append(li);
    }else{
        rooms.forEach( (room) => {
            const li = document.createElement("li");
            li.innerHTML  = `${room.room} → ${room.idData.length} users`;
            roomsUL.append(li);
            if(room.room === currentRoom){
                room.idData.forEach( (member) => {
                    roomMembers.push(member.nickname);
                })
            }
        })
        const membersNumb = roomMembers.length;
        const membersLength = document.querySelector('#membersLength');
        membersLength.innerHTML  = ` (${membersNumb})`;
        membersText.innerHTML  = roomMembers.toString();
    }  
});


nicknameForm.addEventListener('submit', handleNicknameSubmit);
roomForm.addEventListener('submit', handleRoomSubmit);
messageForm.addEventListener('submit', handleMessageSubmit);


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

