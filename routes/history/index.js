const express = require("express");
const router = express.Router();
const { HistoryController } = require("../../server/controller")


// 이력 > 이력 조회
router.get("/getHisotryList",HistoryController.getHisotryList)



module.exports = router