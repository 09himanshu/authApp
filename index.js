require('dotenv').config();
const express = require('express')
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

require('./src/db/dbms');
const auth = require('./middleware/auth');
const Register = require('./models/userDetail');
const bodyParser = require('body-parser');

// public file path
let static_path = path.join(__dirname, "/public");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(static_path));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

// console.log("jwt key: "+process.env.SECRET_KEY);
app.get('/', (req, res) => {
    res.render("index", {title: 'Home Page'});
});

// registration form get, post method
app.get('/reg', (req, res) =>{
    // res.send('Response send');
    res.render("registration", {title : "Registration Form"})
})
app.post('/reg', async (req, res) =>{
    try {
        const password = req.body.psw;
        const cpassword = req.body.psw_repeat;
        if( password === cpassword){

            const registerUser = new Register({
                email: req.body.email,
                password: password,
                confirmPassword: cpassword
            })

            const token = await registerUser.generateAuthToken();

            // Cookies
            res.cookie("jwt", token);

            const data = await registerUser.save();
            res.status(201).render( "dashboard");
            // console.log(data);

        } else{
            res.send('<h1> Password not matched</h1>')
        }

    } catch (error) {
        res.status(400).send("<h1> E-mail id is already register </h1>");
        console.log(error);
    }
})

//  login form get, post method
app.get("/login", (req, res) =>{
    res.render('login', {title: 'Login'});
})

app.post('/login', async (req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.psw;
        const userMail = await Register.findOne({email});
        const isMatch = await bcrypt.compare(password, userMail.password);

        const token = await userMail.generateAuthToken();
        
        // Cookies
        res.cookie("jwt", token,{
            httpOnly: true,
            expires: new Date(Date.now() + 100000)
        });

        if(isMatch){
            res.render( "dashboard");
        } else{
            res.send('<h1> Invalid password detail </h1>');
        }
        // console.log(`${email}, ${password}`);
    } catch (error) {
        res.status(400).send('<h1> Invalid login detail </h1>');
        console.log(error);
    }
})

// secret page
app.get('/secret', auth, (req, res) =>{
    res.render("secret",{title: "Secret Page"});
})

// logout page
app.get("/logout", auth, async (req, res) =>{
    try {
        res.clearCookie("jwt");
        console.log("Log out successfully");
        // await req.user.save();
        res.render("login",{title: "login"} );
    } catch (error) {
        res.status(500).send(error);
    }
});

// Server port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listen on port ${port}`));