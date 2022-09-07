const jwt = require("jsonwebtoken");

const Signup = require('../models/signup');

const auth = async (req, res, next)=>{
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);
    const isVerified=true;
    
    const user = await Signup.findOne({_id:verifyUser._id});
    // console.log(user);

    req.token = token;
    req.user = user;
    // req.user.email=email;
    // const userEmail=user.email;
    // console.log(user, userEmail)
    next();
    
  } catch (error) {
    res.redirect('login');
    // res.status(401).send(error)
  }
  
}


module.exports = auth;