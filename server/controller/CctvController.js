const Service = require('../service/CctvService')

// cctv 리스트 
const cctvList = async (req, res, next) => {
    try {
        const result = await Service.getCctvList(req)
        res.send(result)
    }
    catch(err) {
        next(err)
    }
}
// cctv 상세 정보 > cctv list > 관리 팝업 > cctv정보 탭
const cctvInfo = async (req, res, next) => {
    try {
        const result = await Service.getCctvInfo(req)

        
        res.send(result[0])
    }
    catch(err) {
        next(err)
    }
}

const cctvPreset = async (req, res, next) => {
    try {
        const result = await Service.getCctvPreset(req)
        res.send(result)
    }
    catch(err) {
        next(err)
    }
}
// cctv관리>변경이력
const cctvAlarmSetupHistory = async(req, res, next) => {
    try {
        const result = await Service.getCctvAlarmSetupHistory(req.params, req)
        res.send(result)
    }
    catch(error) {
        next(error)
    }
}


// 영상분석매니저 알람설정이력 
const cctvAlarSetup = async (req, res, next) => {
    try {
        const result = await Service.setCctvAlarSetup(req.body, req)
        res.send(result)
    }
    catch(error) {
        next(error)
    }
}

// 영상 off 스케줄
const cctvAlarOffSchedule = async (req, res, next) => {
    try {
        const result = await Service.getCctvAlarOffSchedule(req.params, req)
        res.send(result)
    } catch(error) {
        next(error)
    }
    
}

const cctvOneAlarOffSchedule = async (req, res, next) => {
    try {
        const result = await Service.getCctvOneAlarOffSchedule(req.params, req)
        res.send(result)
    } catch(error) {
        next(error)
    }
}

const deleteCctvOneAlarOffSchedule = async (req, res, next) => {
    try {
        const param = {...req.body}
        const result = await Service.putCctvOneAlarOffSchedule(param, req)
        res.send(result)
    } catch(error) {
        next(error)
    }
}

const alarmOnExceptionSchedule = async (req, res, next) => {
    try {
        const result = await Service.getAlarmOnExceptionSchedule(req)
        res.send(result)
    } catch(error) {
        next(error)
    }
}

const deleteAlarmOnExceptionSchedule = async (req, res, next) => {
    try {
        const result = await Service.putAlarmOnExceptionSchedule(req)
        res.send(result)
    }catch(error) {
        next(error)
    }
}
// cctv관리>이벤트 이력
const cctvAlarmEventHistory = async(req, res, next) => {
    try {
        const result = await Service.getCctvAlarmEventHistory(req.params, req)
        res.send(result)
    }
    catch(error) {
        next(error)
    }
}
// cctv 관리 > 분석 설정 
const cctvAnalysis = async (req, res, next) => {
    try {
        const result = await Service.putCctvAnalysis(req)
        res.send(result)
    } catch(error) {
        next(error)
    }
}
const cctvAnalysisLst = async (req, res, next) => {
    try {
        const result = await Service.getCctvAnalysis(req)
        res.send(result)
    } catch(error) {
        next(error)
    }
}
module.exports = {
    cctvList,
    cctvInfo,
    cctvPreset,
    cctvAlarmSetupHistory,
    cctvAlarSetup,
    cctvAlarOffSchedule,
    cctvOneAlarOffSchedule,
    alarmOnExceptionSchedule,
    deleteAlarmOnExceptionSchedule,
    deleteCctvOneAlarOffSchedule,
    cctvAlarmEventHistory,
    cctvAnalysis,
    cctvAnalysisLst
}