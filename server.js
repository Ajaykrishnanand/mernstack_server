import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {readdirSync} from "fs";
require("dotenv").config();





const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http,{
  cors:{
    origin:"http://localhost:3000",
    method:["GET","POST"],
    allowedHeaders:["Content-type"],

  }
});
const morgan = require("morgan");
mongoose
  .connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("dbconnected"))
  .catch((err) => console.log("db connection err", err));
app.use(express.json({ linit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);
//autoload routs
readdirSync('./routs').map((r)=>app.use('/api',require(`./routs/${r}`)));
 //shocket.io
 io.on('connect',(socket)=>{
   socket.on('new-post',(newPost)=>{
    //  socket.broadcast.emit("get-message",message); 
    //  console.log('new post recive',newPost);
    socket.broadcast.emit("new-post",newPost);
   })
  //  console.log("SHOCKET.IO",socket.id);
 })
const port = process.env.PORT||8000;
http.listen(port, () => console.log(`server is runnig on port no ${port} `));
