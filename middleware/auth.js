const jwt = require('jsonwebtoken');
const Register = require('../models/userDetail');

const auth = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUser);
        const user = await Register.findOne({_id: verifyUser._id});
        // console.log(user);

        // Log out fuction
        req.token;
        req.user;

        next();

    } catch (error) {
        res.status(201).send(`<h1> Authenticate !!! </h1>`);
    }
}
module.exports = auth;