require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')


//rate limit
//rate limiter
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 5 // 20 requests
});



const User = require('./models/userModel')
const userRoutes = require('./routes/userRoutes')

app.use(express.json())

//morgan
app.use(morgan('dev'))

morgan.token('id', (req) => {
  return req.id
})

app.use((req, res, next) => {
  req.id = uuid.v4()
  next()
})

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));



app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin',  '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept')
  next()
})

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan(':id :method :url :response-time', { stream: accessLogStream }))

//monitoring on route /status
app.use(require('express-status-monitor')());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
  console.log('Connected to the Database successfully')
});

//multer 
app.use('/avatars', express.static('avatars')); //added sly


app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one"
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
})



app.use('/', rateLimiter,userRoutes)

module.exports = app

