const express = require("express");
const router = express.Router();
const { SetController } = require("../../server/controller");
const {isNotLoggedIn, isLoggedIn} = require('../middlewares');

// 설정 > 야간시간대 조회
router.get("/getNightTimes",SetController.getNightTimes)
// 설정 > 야간시간대 저장
router.post("/setNightTimes",SetController.setNightTimes);
// 설정 > 이벤트항목 설정 저장
router.post("/setEventCode",SetController.setEventCode);
// 설정 > 이벤트항목 목록 조회
router.get("/getEventCodeList/:evtSeCode/:evtTyCode",SetController.getEventCodeList);
// 설정 > 이벤트항목 순번 수정
router.put("/setEventCodeOrderMod",SetController.setEventCodeOrderMod);
// 설정 > 이벤트항목 삭제
router.delete("/delEventCode/:evtSeCode/:evtTyCode/:evtDetailCode/:order",SetController.delEventCode);

module.exports = router;