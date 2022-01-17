import express from "express"; // express로 view와 render 설정 
import http from "http";
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";


const app = express();

app.set("view engine", "pug"); //pug로 view engine 설정
app.set("views", __dirname + "/views"); //express에 template이 어디있는지 지정
app.use("/public", express.static(__dirname + "/public")); //public url 생성해서 유저에게 파일 공유(app.js): front
 
app.get("/", (req, res) => res.render("home")); //route handler로 home.pug render해줌
app.get("/*", (req, res) => res.redirect("/")); //어떤 페이지로 GET request 보내도 redirect로 반응
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//http, websocket protocol 생성
const httpServer = http.createServer(app);
const WsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});

instrument(WsServer, {
    auth: false,
  });
  
let publicRooms = [];

function findPublicRooms(){ 
    //const sids = WsServer.sockets.adapter.sids;
    //const rooms = WsServer.sockets.adapter.rooms;
    const {
        sockets: {
            adapter: {sids, rooms},
        },
    } = WsServer;  
    
    publicRooms = [];
    const roomsData = [];

    rooms.forEach((_, key) => {
        if(sids.get(key)===undefined){ //private room 제외
            roomsData.push(key);
        }
    })

    roomsData.forEach((room)=>{
        const members = rooms.get(room);
        const idData = [];
        members.forEach((member)=>{
            WsServer.sockets.sockets.forEach((socket)=>{
                if(member === socket.id){
                    idData.push({ id: member, nickname: socket.nickname});
                }
            })
        })
        publicRooms.push({ room, idData });
    })
    return publicRooms;
}

/*
function countRoom(roomName){
    return WsServer.sockets.adapter.rooms.get(roomName)?.size; //멤버수
}
*/

WsServer.on("connection", (socket) => {

    //WsServer.emit("room_change", findPublicRooms());
    
    socket.onAny( (event) => {
        console.log(`Socket Event:${event}`)
    });

    socket.on("nickname", (nick, showRoomForm)=> {
        socket.nickname = nick;
        showRoomForm(nick);
    })

    socket.on("enter_room", (roomName, showMessageForm)=>{
        //console.log(socket.rooms); //sids, rooms 정보: private room key = socket id
        socket.join(roomName);
        showMessageForm();
        socket.to(roomName).emit("welcome", socket.nickname); //본인을 제외하고 웰컴메세지: A joined!
        WsServer.sockets.emit("room_change", findPublicRooms()); // 모든 socket한테 보냄
    });

    socket.on("new_message", (message, room, done)=>{
        socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
        done();
    })

    socket.on("disconnecting", ()=>{
        socket.rooms.forEach( (room)=> {
            socket.to(room).emit("bye", socket.nickname);
        }); //본인을 제외하고 바이메세지: A left!        
    })
    
    socket.on("disconnect", ()=> {
        WsServer.sockets.emit("room_change", findPublicRooms()); // 모든 socket한테 보냄
    })
});

httpServer.listen(3000, handleListen);


/*
const wss = new WebSocket.Server({ server });
const sockets = [];

//socket: 연결된 브라우저
wss.on("connection", (socket) => {
    sockets.push(socket); //연결된 브라우저 모음 
    
    socket["nickname"] = "Anonymous";

    console.log("Connected to Browser ✅");
    
    socket.on("close", ()=>{
       console.log("Disconnected from the Browser ❌");
    });

    socket.on("message", (msg)=>{
        //console.log(message.toString('utf8')); //socket한테 메세지 받은거 출력
        const message = JSON.parse(msg); //string을 object로 전환
        switch(message.type){
            case "new_message":
                sockets.forEach( (aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`)); //socket한테 받은 메세지 다시 받아쳐서 모든 브라우저에 보냄
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
        //socket.send(message.toString('utf8')); //socket한테 받은 메세지 다시 받아침
    }); 

    //socket.send("hello!!"); //socket한테 메세지 보냄
}); 
*/
