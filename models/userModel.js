const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{type: String,required:true,unique:true},
    password: {type: String,required:true},
    admin:{type:Boolean,default:false},
    avatar:{type:String,required:false},
    createdAt:Date,
    updatedAt:Date
});

userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.createdAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.updatedAt)
    this.updatedAt = currentDate;
    next();
    });
    

    





module.exports = mongoose.model('User',userSchema);