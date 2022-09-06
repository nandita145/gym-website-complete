const jwt = require("jsonwebtoken");

const Signup = require('../models/signup');

const auth = async (req, res, next)=>{
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);

    const user = await Signup.findOne({_id:verifyUser._id});
    console.log(user);

    req.token = token;
    req.user = user;

    next();
    
  } catch (error) {
    res.redirect('login');
    // res.status(401).send(error)
  }
}

// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

module.exports = auth;