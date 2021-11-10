const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        require: true
    },
    tokens: [{
        tokens:{
            type: String,
            required: true
        }
    }]
}) 

// hash password
userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`password is : ${this.password}`);
    }
    next();
});

// jwt token
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({tokens: token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }   
}


// Creating collection
const Register = new mongoose.model("Register", userSchema);

module.exports = Register;