const model = require("../model/Chatschema")


const createChatSchema =  async(req,res)=>{
    try{

        const{Message,Name,DateTime} = req.body

        const userchat = new model({
            Message,
            Name,
            DateTime
        })
        await userchat.save();
        res.status(200).json(userchat)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
}


const getAllChats = async(rea,res)=>{
    try{
        const usersChat = await model.find()
        if(!usersChat){
            return res.status(404).json({message:"No user found"})
        }
        res.status(200).json(usersChat)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Server Error"})
    }
}


const deleteUserChat = async(req,res)=>{
    try{
        const deleteUserChat = await model.findByIdAndDelete(req.params.id)
        if(!deleteUserChat){
            return res.status(400).json({message:"no userChat to delete"})
        }
        res.status(200).json({message:"userChat deleted SUccessfully!.."})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server Error"})
        }
}

module.exports =  { createChatSchema , getAllChats , deleteUserChat }