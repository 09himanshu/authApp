const mongoose = require('mongoose');

// creating database
mongoose.connect("mongodb://localhost:27017/regData").then( () =>{
    console.log(`Database connected`);
}).catch( (e) =>{
    console.log(`Database not connected`);
})

// 