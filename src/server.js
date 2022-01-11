import express from "express";
// express로 view와 render 설정 

const app = express();


app.set("view engine", "pug"); //pug로 view engine 설정
app.set("views", __dirname + "/views"); //express에 template이 어디있는지 지정
app.use("/public", express.static(__dirname + "/public")); //public url 생성해서 유저에게 파일 공유(app.js)

app.get("/", (req, res) => res.render("home")); //route handler로 home.pug render해줌
const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);