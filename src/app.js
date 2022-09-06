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
    res.render("index"), {
        pageTitle: "MickyDesigns - Welcome to my portfolio showroom",
        layout: false
    }
});
app.get('/services', (req, res)=>{
    res.render("services");
});


// var popup = require('popups');

// let alert = require('alert'); 

app.get('/membership', auth, async(req, res)=>{
    cookies=req.cookies.jwt;
    // console.log('pk'+cookies)
    res.render('membership')
})



app.get('/subscription',auth, (req, res)=>{
    res.render("subscription");
    // return req.user;
})
app.get('/contact', (req, res)=>{
    res.render("contact");
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

app.get('/login', (req, res)=>{
    res.render("login");
});


app.get('/signup', (req, res)=>{
    res.render("signup");
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
                expires: new Date(Date.now()+30000),
                httpOnly: true
            })

            const registered = await users.save();
            // console.log('this page part'+registered);
            res.status(201).render('index');

        }else{
            console.log('passwords do not match');
        }
    } catch (error) {
        res.status(400).send(error);
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
        console.log(req.user);
        req.user.tokens=req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token;

        })

        res.clearCookie('jwt');
        console.log('logout successful');
        req.user.save();
        res.redirect('login');
    } catch (error) {
        res.status(401).send(error);
    }
});

app.get('/timetable', (req, res)=>{
    res.render("timetable");
});


app.get('/bmi', (req, res)=>{
    res.render("bmi");
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



