const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const dotEnv = require("dotenv")
const PORT = process.env.PORT || 5000;
const router = require("./views/routes")


dotEnv.config();

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected Sucessfully!.."))
.catch((error)=>console.log(error))

const server = app.listen(PORT,()=>console.log(`Server running 0n a ${PORT} Port..`))

app.use("/userchat",router)

app.use(express.static(path.join(__dirname ,"public")))

const io = require("socket.io")(server)
 
let socketsConnected = new Set();

//set is store the each socketid in scoketsConnected variable..

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })

  
  socket.on("deletedMessages",()=>{
    socket.emit("deletedMessages")
  })
}