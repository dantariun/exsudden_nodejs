const express = require("express");
const router = express.Router();
const { EventController } = require("../../server/controller")
const {isNotLoggedIn, isLoggedIn} = require('../middlewares');

router.get("/getEventList",EventController.getEventList);
router.get("/getEventPopData",EventController.getEventPopData);
router.put("/setEventInfo",EventController.setEventInfo);

module.exports=router;