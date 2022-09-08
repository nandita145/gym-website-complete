require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const auth = require('./middleware/auth')

require('./db/conn.js');
const Signup = require('./models/signup');
const Feedback = require('./models/feedback');
const Membership = require('./models/members');
const port=process.env.PORT || 3000;

const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'hbs');
app.set('views', templatePath);

hbs.registerPartials(partialsPath);

// app.use(express.static(staticPath));
// console.log(path.join(__dirname, '../public'));


app.use(express.static(staticPath));

// console.log(process.env.SECRET_KEY)

app.get('/', (req, res)=>{
    if(req.cookies.jwt){
        // isLoggedIn=true
        res.render("index",{isLoggedIn:true}), {
            pageTitle: "Hello",
            layout: false
        }
    }else{
    res.render("index",{isLoggedIn:false}), {
        pageTitle: "Hello",
        layout: false
    }}
});
app.get('/services', (req, res)=>{
    if(req.cookies.jwt){
        isLoggedIn=true
        res.render("services",{isLoggedIn:isLoggedIn});
    }else{
        isLoggedIn=false
        res.render("services",{isLoggedIn:isLoggedIn});
    }
});


// var popup = require('popups');

// let alert = require('alert'); 



app.get('/membership', auth, async(req, res)=>{
    useremail=req.user.email
    subscriptionDetails= await Membership.findOne({email: useremail}).sort({ _id: -1 });
    // var isLoggedIn=true;
    // console.log(subscriptionDetails.name)
    if(subscriptionDetails){
        var paymentForInMonths=subscriptionDetails.paymentForInMonths;
        var paymentDate= subscriptionDetails.paymentDate;
        // console.log(paymentDate);
        // console.log(getDate())
        
        // console.log(today);
        // console.log(paymentForInMonths);
        // console.log(today-paymentDate/(1000*60*60*24));
        var today = new Date();
        const start = new Date(today).getTime();
        const end = new Date(paymentDate).getTime();
        const milliseconds = Math.abs(end - start).toString()
        const seconds = parseInt(milliseconds / 1000);
        const minutes = parseInt(seconds / 60);
        const hours = parseInt(minutes / 60);
        const days = parseInt(hours / 24);
        const time = days + ":" + hours % 24 + ":" + minutes % 60 + ":" + seconds % 60;
        // console.log(days)
        // console.log(paymentForInMonths*30);
        var subscriptionDays=days;
        var paymentForInDays=paymentForInMonths*30;
        // console.log(isLoggedIn);
        // console.log( paymentDate.setDate(paymentDate.getDate() - paymentForInMonths*28))
        if (subscriptionDays<=paymentForInDays){
            
            var isActive=true;
            // res.render("membership", {isLoggedIn:true, subscriptionActive:'have a active', paymentForInMonths:subscriptionDetails.paymentForInMonths+' month', name: subscriptionDetails.name , phone:subscriptionDetails.phone ,email: useremail, paymentAmount:subscriptionDetails.paymentAmount, paymentDate: subscriptionDetails.paymentDate });
        }
    }
    if(req.cookies.jwt){
        isLoggedIn=true
        if(isActive===true){
        res.render('membership',{isLoggedIn:isLoggedIn, isActive:true});
        }else{
            res.render('membership',{isLoggedIn:isLoggedIn});
        }
    }else{
        isLoggedIn=false
        res.render('membership',{isLoggedIn:isLoggedIn});
    }
    
})

app.post('/membership', auth, async(req, res)=>{
    try {
        useremail=req.user.email
        // global.isLoggedIn=true;
        const membership= new Membership({
            name: req.body.name,
            email: useremail,
            phone: req.body.phone,
            address: req.body.address,
            // comment: req.body.comment,
            paymentForInMonths:req.body.plan,
            paymentAmount: req.body.amount,
            paymentDate: new Date,

        })
        
        if (membership.paymentForInMonths==1){
        res.status(201).redirect('https://rzp.io/l/gPxhXfkG')
        }else if (membership.paymentForInMonths==6){
            res.status(201).redirect('https://rzp.io/l/wQcOWBXvR')
        }else{
            res.status(201).redirect('https://rzp.io/l/6H8rVF6Cc')
        }const membershipSaved = await membership.save();
        } catch (error) {
            res.status(400).send(error);
        }
    
})


// var isLoggedIn=false;
app.get('/subscription',auth, async(req, res)=>{
    useremail=req.user.email;
    user = await Signup.findOne({email: useremail}).sort({ _id: -1 });
    subscriptionDetails= await Membership.findOne({email: useremail}).sort({ _id: -1 });
    // var isLoggedIn=true;
    // console.log(subscriptionDetails.name)
    if(subscriptionDetails){
        var paymentForInMonths=subscriptionDetails.paymentForInMonths;
        var paymentDate= subscriptionDetails.paymentDate;
        // console.log(paymentDate);
        // console.log(getDate())
        var today = new Date();
        // console.log(today);
        // console.log(paymentForInMonths);
        // console.log(today-paymentDate/(1000*60*60*24));

        const start = new Date(today).getTime();
        const end = new Date(paymentDate).getTime();
        const milliseconds = Math.abs(end - start).toString()
        const seconds = parseInt(milliseconds / 1000);
        const minutes = parseInt(seconds / 60);
        const hours = parseInt(minutes / 60);
        const days = parseInt(hours / 24);
        const time = days + ":" + hours % 24 + ":" + minutes % 60 + ":" + seconds % 60;
        // console.log(days)
        // console.log(paymentForInMonths*30);
        var subscriptionDays=days;
        var paymentForInDays=paymentForInMonths*30;
        // console.log(isLoggedIn);
        // console.log( paymentDate.setDate(paymentDate.getDate() - paymentForInMonths*28))
        if (subscriptionDays<=paymentForInDays){
            
            isActive=true;
            res.render("subscription", {isLoggedIn:true, subscriptionActive:'have a active', paymentForInMonths:subscriptionDetails.paymentForInMonths+' month', name: subscriptionDetails.name , phone:subscriptionDetails.phone ,email: useremail, paymentAmount:subscriptionDetails.paymentAmount, paymentDate: subscriptionDetails.paymentDate });

        }else{
            isActive=false;
            res.render("subscription", {isLoggedIn:true, subscriptionActive:'do not have a active', name: subscriptionDetails.name, email: useremail, paymentAmount:'--', paymentDate: '--' })
        }
    // res.render("subscription", {paymentForInMonths:subscriptionDetails.paymentForInMonths, name: subscriptionDetails.name , phone:subscriptionDetails.phone ,email: useremail, paymentAmount:subscriptionDetails.paymentAmount, paymentDate: subscriptionDetails.paymentDate });
    }else{
        res.render("subscription", {isLoggedIn:true, subscriptionActive:'do not have a active', name: user.name, email: useremail, paymentAmount:'--', paymentDate: '--' })
    }
    // return req.user;
})
app.get('/contact', (req, res)=>{
    if(req.cookies.jwt){
        isLoggedIn=true
        res.render('contact',{isLoggedIn:isLoggedIn});
    }else{
        isLoggedIn=false
        res.render('contact',{isLoggedIn:isLoggedIn});
    }
});
app.post('/contact', async (req, res)=>{
    try {
            const feedbacks= new Feedback({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                comment: req.body.comment,
            })
            const feedbackSaved = await feedbacks.save();
            res.status(201).render('contact');
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/history',auth, async(req,res)=>{
    isLoggedIn=true
    useremail=req.user.email
    subscriptionDetails= await Membership.find({email: useremail}).sort({ _id: -1 });
    // console.log(subscriptionDetails)
    res.render("history", {isLoggedIn:true, subscriptionDetails});
    // {subscriptionActive:'have a active', paymentForInMonths:subscriptionDetails.paymentForInMonths+'month', name: subscriptionDetails.name , phone:subscriptionDetails.phone ,email: useremail, paymentAmount:subscriptionDetails.paymentAmount, paymentDate: subscriptionDetails.paymentDate }
    // res.render('history');
})
app.get('/login', (req, res)=>{
    if(req.cookies.jwt){
        isLoggedIn=true
        res.render('login',{isLoggedIn:isLoggedIn});
    }else{
        isLoggedIn=false
        res.render('login',{isLoggedIn:isLoggedIn});
    }
});


app.get('/signup', (req, res)=>{    
// if(req.cookies.jwt){
//     isLoggedIn=true
//     res.render('signup',{isLoggedIn:isLoggedIn});
// }else{
    isLoggedIn=false
    res.render('signup',{isLoggedIn:isLoggedIn});
// }
});

app.post('/signup', async (req, res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password === cpassword){
            const users= new Signup({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            // console.log('success part'+users);

            const token = await users.generateAuthToken();
            // console.log('token'+token);
            
            res.cookie('jwt', token,{
                // loggedIn:'loggedIn',
                // expires: new Date(Date.now()+30000),
                httpOnly: true
            })

            const registered = await users.save();
            // console.log('this page part'+registered);
            res.status(201).redirect('/');

        }else{
            res.send('passwords do not match or email already exists');
            // console.log('passwords do not match');
        }
    } catch (error) {
        res.status(400).send('passwords do not match or email already exists '+error);
    }
});
app.post('/login', async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Signup.findOne({email: email});
        // console.log(password);
        const isMatch = await bcrypt.compare(password, useremail.password);
        // bcrypt.compare(password, useremail.password, function(err, isMatch) {
        //     if (err) {
        //       throw err
        //     } else if (!isMatch) {
        //       console.log("Password doesn't match!")
        //     } else {
        //       console.log("Password matches!")
        //     }
        //   })

        const token = await useremail.generateAuthToken();
        // console.log('token hi'+token);

        res.cookie('jwt', token,{
            // expires: new Date(Date.now()+50000),
            httpOnly: true,
            // secure:true
        });

        

        // console.log(isMatch);
        if (isMatch){
            res.status(201).redirect('membership');
        }else{
            res.send('password doesnt match')
        }

    } catch (error) {
        res.status(400).send("Invalid Email");
    }
});

app.get('/logout', auth, (req, res)=>{
    try {
        // console.log(req.user);
        req.user.tokens=req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token;

        })

        res.clearCookie('jwt');
        // console.log('logout successful');
        req.user.save();
        res.redirect('login');
    } catch (error) {
        res.status(401).send(error);
    }
});

app.get('/timetable', (req, res)=>{
    if(req.cookies.jwt){
        isLoggedIn=true
        res.render('timetable',{isLoggedIn:isLoggedIn});
    }else{
        isLoggedIn=false
        res.render('timetable',{isLoggedIn:isLoggedIn});
    }
});


app.get('/bmi', (req, res)=>{
    if(req.cookies.jwt){
        isLoggedIn=true
        res.render('bmi',{isLoggedIn:isLoggedIn});
    }else{
        isLoggedIn=false
        res.render('bmi',{isLoggedIn:isLoggedIn});
    }
})





// app.get('/', (req, res)=>{
//     res.send("Hello express")
// });



// app.use((req,res,next)=>{
//     res.locals.user= req.user;
// })

// secur


app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
});



