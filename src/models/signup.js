const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    
    tokens:[{
        token:{
            type: String,
            required: true,
        }
    }]
});


userSchema.methods.generateAuthToken = async function() {
    try {
        // console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        // console.log(token);
        return token;
    } catch (error) {
        res.send('error'+ error);
        // console.log('error'+ error);
    }
    
};

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        // const passwordHash = await bcrypt.hash(password,10);
        console.log(this.password);
        this.password= await bcrypt.hash(this.password,10);
        console.log(this.password);
        
    }
    next(); 
})

const Signup = new mongoose.model("Signup", userSchema)

module.exports = Signup;