module.exports=(req, res, next) => {
    // do any checks you want to in here
    User.findOneAndUpdate({ updatedAt: new Date(),function(){
        if (err) throw err;
        else{
            console.log(updatedAt);
        }
    } });

    next();

    };