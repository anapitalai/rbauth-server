// file: utils/mailer.js
const _ = require('lodash');	
const nodemailer = require('nodemailer');

const config = {
    host: 'smtp.gmail.com',
    secure:true,
    auth: {
        user: 'anapitalai@gmail.com', // generated ethereal user
        pass:  "lhwjcnqwtqcmeytx"  // generated ethereal password
    }
}


    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'alois.napitalai@pnguot.ac.pg',
    to: 'anapitalai@gmail.com',
    text: 'test text',
};

module.exports = function(mail){
    // use default setting
    mail = _.merge({}, defaultMail, mail);
    
    // send email
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};