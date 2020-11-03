const app = require('./app')
//const https = require('https')
const https= require('http')
const socketio = require('socket.io')
require('dotenv').config()

const server = https.createServer(app)
const io = socketio(server)
const fs = require('fs');

const options = {
  key: fs.readFileSync('ssl/sly-key.pem'),
  cert: fs.readFileSync('ssl/sly-cert.pem')
}


io.on("connection", socket => {
  console.log("New client connected")
  
  socket.on("disconnect", () => console.log("Client disconnected"));
})




https.createServer(options,app).listen(process.env.HTTP_PORT,()=>{
  console.log("HTTP is running on port 3000!")
})
