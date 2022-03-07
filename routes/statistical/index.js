const express = require("express");
const router = express.Router();
const { StatsController } = require("../../server/controller");

// 통계 > 소속 CCTV 목록 조회
router.get("/getCctvList", StatsController.getCctvList);

// 통계 > 검지 정확도 
router.get("/getScanAccuracy", StatsController.getScanAccuracy);

// 통계 > 검지 정확도 > 검지결과 비교
router.get("/getScanResultCompare", StatsController.getScanResultCompare);

// 통계 > 검지등급 비교
router.get("/getScanGradeCompare", StatsController.getScanGradeCompare);

// 통계 > 검지유형별 검지등급 비교
router.get("/getScanTypeGrade", StatsController.getScanTypeGrade);

// 통계 > 차수별 검지구분 비교
router.get("/getScanOrder", StatsController.getScanOrder);

// 통계 > 등급별 검지구분 비교
router.get("/getScanGrade", StatsController.getScanGrade);

// 통계 > 검지유형별 상세유형비교
// secd: 검지구분 코드, tycd: 검지유형 코드, stdt: 시작 날짜, eddt: 끝 날짜, cId: cctvId
router.get("/getScanTypeDtl", StatsController.getScanTypeDtl);

// 통계 > 환경요소 상세유형비교
// secd: 검지구분 코드, tycd: 검지유형 코드, stdt: 시작 날짜, eddt: 끝 날짜, cId: cctvId
router.get("/getScanTypeEnvrnDtl", StatsController.getScanTypeEnvrnDtl);

// 통계 > 1급 상황대비 알람 건수
router.get("/getScanGradeAlarm", StatsController.getScanGradeAlarm);

// 통계 > 검지구분 알람 건수
router.get("/getScanTypeAlarm", StatsController.getScanTypeAlarm);

// 검지유형(정지차량, 역주행, 보행자)별 excel data
router.get("/scanTypeDtlExcel", StatsController.scanTypeDtlExcel);

// 환경요소 검지유형 excel data
router.get("/scanTypeEnvrnExcel", StatsController.scanTypeEnvrnExcel);

// 알람통계 excel data
router.get("/alarmExcel", StatsController.alarmExcel);

module.exports = router;
