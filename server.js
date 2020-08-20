const app = require('./app')
const http = require('http')
const https = require('https')
require('dotenv').config()
const env= 'process.env'

const fs = require('fs');

const options = {
  key: fs.readFileSync('ssl/sly-key.pem'),
  cert: fs.readFileSync('ssl/sly-cert.pem')
};


// http.createServer(app).listen(port,()=>{
//   console.log("HTTP is running on port 3000!")
// })
https.createServer(options,app).listen(env.HTTPS_PORT,()=>{
  console.log("HTTPS is running on port 443!")
})