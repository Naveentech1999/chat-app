const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    Message:{
        type:String,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    DateTime:{
        type:String,
    }
    
})

module.exports = mongoose.model("chatuser",chatSchema )