const mongoose = require("mongoose")
// for mongo uri 
const URI = require("./key").MONGO_URI

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(!err){
        console.log('Mongo is connected....')
    }
    else{
        console.log('An error occured during connection with mongo', err)
    }
})
    

