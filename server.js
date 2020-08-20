const app = require('./app')
const http = require('http')
const https = require('https')
require('dotenv').config()

const fs = require('fs');

const options = {
  key: fs.readFileSync('ssl/sly-key.pem'),
  cert: fs.readFileSync('ssl/sly-cert.pem')
};


https.createServer(options,app).listen(process.env.HTTPS_PORT,()=>{
  console.log("HTTPS is running on port 443!")
})