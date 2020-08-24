const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkMiddlewares = require('../middlewares/checkAuth')
const usersController = require('../controllers/userController')

const User = require('../models/userModel');
const DateUpdate = require('../middlewares/date');
const multer = require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./avatars/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};
const upload = multer({storage:storage,limit:{
    fileSize:1024 * 1024 * 5
},
fileFilter:fileFilter
}); 


//allUsers


//get all alumni routes
router.get('/users',checkMiddlewares.auth,usersController.getAllUsers)
   

//add a login user route
router.post('/signup',upload.single('avatar'),usersController.createUser)
//login
router.post('/login',usersController.auth)

//get single alumni route
router.get('/:memberId',(req,res,next)=>{
    const id=req.params.memberId;
    User.findById(id)
    .exec()
    .then(doc=>{
       console.log('From DB',doc);
       if(doc){
        res.status(200).json(doc);
       }
        else{
            res.status(400).json({
                message:'No valid member for the given ID'
            });
        }
      
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });

   router.put('/:memberId',(req,res)=>{
    const _id = req.params.memberId;
   // User.findOneAndUpdate({_id},
   User.findByIdAndUpdate({_id},
      req.body,
      { new: true },
      (err, user) => {
      if (err) {
         res.status(400).json(err);
      }

       res.json(user);


    });
    
    });
//date
router.put('/update/:memberId',(req,res)=>{
    const _id = req.params.memberId;
    var ndate=new Date();
    User.findByIdAndUpdate(_id,{ updatedAt:ndate },
      //req.body,
      //{ new: true },
      (err, user) => {
      if (err) {
         res.status(400).json(err);
      }

       res.json(user);


    });
    
    });
   
//delete route
router.delete('/:userId',(req,res,next)=>{
    
    User.remove({_id:req.params.userId})
    .exec()
    .then(result=>{
        return res.status(200).json({message:'User purged'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });

   
    
});




module.exports = router