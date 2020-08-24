const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const emailValidator = require("email-validator")
const mailer = require("../utils/mailer")
const mongoose = require("mongoose")
//const checkRoles = require('../middleware/check-roles');
//const chekAuth = require('../middleware/check-auth');

const cryptojs = require("crypto-js")
const nodemailer = require('nodemailer')


//const { roles } = require("../roles");


//image upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
})


async function hashPassword(password) {
  return await bcryptjs.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcryptjs.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// exports.signup = async (req, res, next) => {
//   try {
//     const { role, email, password, active } = req.body; //active for email verfiy
//     const hashedPassword = await hashPassword(password);
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       active,
//       role: role || "basic",
//     }); //added active
//     const accessToken = jwt.sign(
//       { userId: newUser._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );
//     newUser.accessToken = accessToken;
//     await newUser.save();
//     res.json({
//       data: newUser,
//       message: "You have signed up successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return next(new Error("Email does not exist"));
//     const validPassword = await validatePassword(password, user.password);
//     if (!validPassword) return next(new Error("Password is not correct"));
//     const accessToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET
//     )
//     await User.findByIdAndUpdate(user._id, { accessToken });
//     res.status(200).json({
//       data: { email: user.email, role: user.role },
//       accessToken,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getUsers = async (req, res, next) => {
//   const users = await User.find({});
//   res.status(200).json({
//     data: users,
//   });
// };

// exports.getUser = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findById(userId);
//     if (!user) return next(new Error("User does not exist"));
//     res.status(200).json({
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   try {
//     const { role } = req.body;
//     const userId = req.params.userId;
//     await User.findByIdAndUpdate(userId, { role });
//     const user = await User.findById(userId);
//     res.status(200).json({
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteUser = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;
//     await User.findByIdAndDelete(userId);
//     res.status(200).json({
//       data: null,
//       message: "User has been deleted",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//new routes
exports.getAllUsers = (req, res, next) => {
  User.find()
    .select("_id email active password avatar accessToken createdAt updatedAt")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.auth = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: "Athentication failed,no email!",
        })
      }
      bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(401).json({
            message: "Athentication failed!",
          })
        }
        if (result) {
            const token=jwt.sign(
            { email: user[0].email,userId:user[0]._id },
            process.env.JWT_SECRET,{
              expiresIn:'1h'
            }
          )

          return res.status(200).json({
            message: "Authentication sucessful!",
            token: token,
          })
        }
        res.status(401).json({
          message: "Athentication failed!",
        })
      })//bcrypt compare
    })//then

    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    })
}


//add a login user route
exports.createUser=(req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (
        user.length >= 1 ||
        emailValidator.validate(req.body.email) == false
      ) {
        return res
          .status(409)
          .json({ message: "Please check if the email exists or is invalid." });
      } else {
        //create active token

        // const accessToken = jwt.sign({ email: req.body.emai }, process.env.JWT_SECRET, {
        //   expiresIn: "1h",
        // })

        // Encrypt
        const activeToken = cryptojs.AES.encrypt(
          "sly_message",
          "nictc123"
        ).toString();

        // Set expiration time is 24 hours.
        const activeExpires = Date.now() + 24 * 3600 * 1000;
        var link = "https://localhost/users/" + activeToken;
        //send email

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          secure: true, // true for 465, false for other ports
          auth: {
            user: "anapitalai@gmail.com", // generated ethereal user
            pass: "lhwjcnqwtqcmeytx", // generated ethereal password
          },
        });

        // setup email data with unicode symbols
        let mailOptions = {
          from: "${req.body.email}",
          to: "anapitalai@gmail.com", // list of receivers
          subject: `${req.body.email}`, // Subject line
          text: "Welcome", // plain text body
          html:
            'Please click <a href="' +
            link +
            '"> here </a> to activate your account.',
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          res.render("contact", { msg: "Email has been sent" });
        });

        bcryptjs.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              avatar:'https://localhost/some.jpg',
              //+req.file.path,
              email: req.body.email,
              password: hash,
              activeToken: activeToken,
             // activeExpires: activeExpires,
             // accessToken: accessToken,
            });
            //test

            user
              .save()
              .then((result) => {
                return res.status(201).json({ message: "User created" });
              })
              .catch((error) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          } //ifelse
        }) //bcrypt
      }
    })
}
