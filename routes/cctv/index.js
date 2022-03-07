const express = require("express");
const router = express.Router();
const { CctvController } = require("../../server/controller");

// cctv 목록 조회
router.get("/list", CctvController.cctvList);
// cctv 정보 (cctv 목록조회 > 관리 팝업 > cctv정보 )
router.get("/manager/info/:cctvId", CctvController.cctvInfo);
// cctv 정보 (cctv 목록조회 > 관리 팝업 > cctvPreset )
router.get("/manager/preset/:cctvId", CctvController.cctvPreset);
// cctv 변경이력 (cctv 목록조회 > 관리 팝업 > cctvHistory )
router.get("/manager/alarm-setup-history/:cctvId", CctvController.cctvAlarmSetupHistory)
// cctv 이벤트이력 (cctv 목록조회 > 관리 팝업 > 이벤트 이력 )
router.get("/manager/alarm-event-history/:cctvId", CctvController.cctvAlarmEventHistory)

// cctv off스케쥴
router.get("/manager/alarm-off-schedule/:cctvId", CctvController.cctvOneAlarOffSchedule)
// cctv off스케쥴 (cctv 목록조회 > 관리 팝업 > 알람off스케쥴 > 알람off취소)
router.put("/manager/alarm-off-schedule/:cctvId", CctvController.deleteCctvOneAlarOffSchedule)
// cctv 관리팝업 > 알람 ON 예외 처리 조회 
router.get("/manager/alarm-on-except-schedule/:cctvId", CctvController.alarmOnExceptionSchedule)
// cctv 관리팝업 > 알람 ON 예외 취소
router.put("/manager/alarm-on-except-schedule/:cctvId", CctvController.deleteAlarmOnExceptionSchedule)
// cctv 리스트 > 일괄알람설정 
router.post("/manager/alarm-off", CctvController.cctvAlarSetup)
//  관리설정 (cctv 리스트 > 관리팝업 > 관리설정)
router.get("/manager/analaysis/:cctvId", CctvController.cctvAnalysisLst)
router.put("/manager/analaysis", CctvController.cctvAnalysis)

// cctv 리스트 > 알람 off 스케쥴 팝업 
router.get("/alarm-off-schedule/:yyyymm", CctvController.cctvAlarOffSchedule)

module.exports = router;