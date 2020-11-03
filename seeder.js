const express = require('express');
const User = require('./models/userModel');
const router = express.Router();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const bcrypt = require('bcryptjs');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, limit: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


mongodbUri = "mongodb://202.1.39.189/apec";

const mongooseUri = uriUtil.formatMongoose(mongodbUri);
const dbOptions = {};

mongoose.connect(mongooseUri, dbOptions, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Db started');
});


           
bcrypt.hash('noGoZone',10,(err,hash)=>{
    if(err){
        return res.status(500).json({
         error:err
        });
    }else{
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            avatar:'http://202.1.39.151:3000/test.jpg',
            email: 'anapitalai@gmail.com',
            password:hash,
            
        }
        );
        //test

            user.save()
            .then(result=>{
                mongoose.disconnect();
                return res.status(201).json({message:'User created'});
            })
            .catch(error=>{
                console.log(err);
                res.status(500).json({error:err});
            });
    }//ifelse
});//bcrypt


