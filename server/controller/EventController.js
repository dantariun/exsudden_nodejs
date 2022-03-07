const CustomError = require("../utils/CustomError");
const { EventService ,CmmnCodeService, SetService,HistoryService} = require("../service");

// 이벤트 목록 조회 
const getEventList = async(req,res,next) =>{    
    try {        
        var params = req.query;    
        
        var rtnObj = {
            message : "success"
        }            
        // 최초 로딩 조회시 
        if(params.searchType == "L")
        {
            // 1. 검지유형 
            params.codeId = "SCAN_TY_CODE";
            const tyCodeList = await CmmnCodeService.getCodeList(params);
            rtnObj.scanTyCodeList = tyCodeList[0]    

            // 2. 검지방향
            params.codeId = "SCAN_DRC_CODE"
            const drcCodeList = await CmmnCodeService.getCodeList(params);
            rtnObj.scanDrcCodeList =  drcCodeList[0]            
        }
        
        const eventList =  await EventService.getEventList(params);        
        rtnObj.eventList = eventList[0]
    
        return res.json(rtnObj);
    } catch (error) {        
        next(error)
    }
}
// 이벤트 팝업 조회 
const getEventPopData = async(req,res,next)=>{
    try {
        var params = req.query;
        var rtnObj = {
            message : "success"
        }          
        // 돌발이벤트 정보
        const info = await EventService.getEventDetail(params);        
        rtnObj.info = info[0][0];

        if(params.searchType == "L")
        {
            const eventSetList = await SetService.getAllEveltList()
            rtnObj.eventSetList = eventSetList            
        }

        return res.json(rtnObj)
    } catch (error) {
        
        next(error)
    }
}
// 이벤트 내용 저장
const setEventInfo = async(req,res,next) => {
    try {
        const params = req.body        
        const result = await EventService.setEventInfo(params);

        /**** 변경이력 추가*****/  
        var chgCnNm =(params.scanResultCode == '002')? "정검지":(params.scanResultCode == '003')? "오검지":"확인불가"
        chgCnNm += " 업데이트"        
        
        var hisPam = {
            cctvId : params.cctvId
        ,   changeDtaCode : "E"
        ,   userId : req.user.dataValues.userId    // session 정보에서 가져와야하는데.. 못가져옴..ㅠㅠ
        ,   changeCn :  chgCnNm
        }
        var hisRe = await HistoryService.insertHistory(hisPam);

        var rtnObj = {
            message : "success"
        }
        return res.json(rtnObj);
    } catch (error) {                
        next(error)
    }
}
module.exports = {
    getEventList
,   getEventPopData
,   setEventInfo
}