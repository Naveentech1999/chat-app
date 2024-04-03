const models  = require("../model/Chatschema")
const controllers = require("../controller/chatController")

const express = require("express")

const router = express.Router();

router.post("/storeNM",controllers.createChatSchema)

router.get("/getalluserchats",controllers.getAllChats)


router.delete("/delete/:id",controllers.deleteUserChat)


module.exports = router;