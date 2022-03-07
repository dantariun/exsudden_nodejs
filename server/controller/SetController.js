const { SetService, HistoryService } = require("../service");
const CustomError = require("../utils/CustomError");


// 설정 > 야간시간대 조회 
const getNightTimes  =async(req,res,next)=>{
    try{
        const timeList = await SetService.getNightTimeList();        
        return res.json(timeList);
    }
    catch(err)
    {
        next(err)
    }
}

// 설정 > 야간시간대 설정 
const setNightTimes = async(req,res,next) => {    
    try
    {
        var param = req.body; // 파라미터 정보 
        var monthList = Object.keys(param);        
        
        for( i in monthList)
        {
            var month = monthList[i];  
            var timeObj = param[month];
            var mon = (month < 10)? "0"+month : month;
            var setTime = timeObj.sunsetHour+timeObj.sunsetMin;
            var riseTime = timeObj.sunriseHour+timeObj.sunriseMin;
            const cntRe = await SetService.getIsTimeDataCnt(mon)
            var savepam = {
                 mnth       : mon
            ,    sunsetTime : setTime.trim()
            ,    sunriseTime : riseTime.trim()
            }
                        
            var saveResult 
            if(cntRe.CNT > 0)
            {                
                saveResult = await SetService.setTimeDataUpdate(savepam)
            }
            else
            {
                
                saveResult = await SetService.setTimeDataInsert(savepam)
            }
        }

        /**** 변경이력 추가*****/        
        var hisPam = {
            cctvId : ""
        ,   changeDtaCode : "V"
        ,   userId : req.user.dataValues.userId    // session 정보에서 가져와야하는데.. 못가져옴..ㅠㅠ
        ,   changeCn : "야간시간대 설정"
        }
        var hisRe = await HistoryService.insertHistory(hisPam)
        
        var rtnObj = {
            messge : "success"        
        }
        return res.json(rtnObj);
    } 
    catch(err)
    {   
        next(err);
    }
}

// 설정 > 이벤트 항목 목록 조회 
const getEventCodeList = async(req,res,next) => {
    try {
        const params = req.params;        
        const list = await SetService.getEventCodeList(params);        
        return res.json(list);
    }catch(err)
    {
        next(err);
    }
}

// 설정 > 이벤트 항목 설정
const setEventCode = async(req,res,next) =>{
     try
     {
        var params = req.body;
        var rtnObj = {
            message : "success"
        }
        // 1 .코드 중복 확인
        var isCode = await SetService.getEventCodeCheck(params,"code");
        if(isCode.CNT == 0)
        {
            // 2 .코드명 중복확인 
            var isCodeNm = await SetService.getEventCodeCheck(params,"name");
            if(isCodeNm.CNT == 0)
            {
                // 코드 추가
                var insertCode = await SetService.setEventCodeInsert(params);
                
                /**** 변경이력 추가*****/                
                var hisPam = {
                    cctvId : ""
                ,   changeDtaCode : "V"
                ,   userId : req.user.dataValues.userId    // session 정보에서 가져와야하는데.. 못가져옴..ㅠㅠ
                ,   changeCn : "이벤트항목 설정"
                }
                var hisRe = await HistoryService.insertHistory(hisPam)
                
                return res.json(rtnObj); 
            }
            else
            {
                                
                const e = new CustomError("중복된 세부유형명을 입력하실 수 없습니다.");
                e.status = 409
                throw e;
                //rtnObj.message = "중복된 세부유형명을 입력하실 수 없습니다."
                //rtnObj.errType = "exist"
                //return res.json(rtnObj);
            }
        }
        else
        {            
            const e = new CustomError("중복된 코드를 입력하실 수 없습니다.");
            e.status = 409
            throw e;
            //rtnObj.message = "중복된 코드를 입력하실 수 없습니다."
            //rtnObj.errType = "exist"
            //return res.json(rtnObj);
            
        }
     }
     catch(err)
     {        
        next(err);
     }
}

// 설정 > 이벤트 항목 순번 수정
const setEventCodeOrderMod = async(req,res,next) => {
    try {        
        var modParams = req.body       
        
        var modType = modParams.modeType;
        var originCode = modParams.codeOrdr;
        var codeOrdr = modParams.codeOrdr;
        if(modType == "down")
        {            
            codeOrdr = codeOrdr +1;
        }        
        else 
        {
            codeOrdr = codeOrdr -1;
        }
        modParams.codeOrdr = codeOrdr
        
        const changObj = await SetService.getEventCodeOrderInfo(modParams);
        
        changObj.codeOrdr = originCode;
        
        var oriOrd = await SetService.setEventCodeOrderMod(modParams);        
        var chgOrd = await SetService.setEventCodeOrderMod(changObj);        
        
        /**** 변경이력 추가*****/
        var hisPam = {
            cctvId : ""
        ,   changeDtaCode : "V"
        ,   userId : req.user.dataValues.userId    // session 정보에서 가져와야하는데.. 못가져옴..ㅠㅠ
        ,   changeCn : "이벤트항목 수정"
        }
        var hisRe = await HistoryService.insertHistory(hisPam)

        var rtnObj = {
            messge : "success"        
        }
        return res.json(rtnObj); 
    } catch (err) {
        next(err)
    }
}
// 이벤트 항목 삭제 
const delEventCode = async(req,res,next) =>{
    try {
        var rtnObj = {
            message : "success"
        }        
        var params = req.params;
        var ordRef = await SetService.setEventOrderReestablish(params);        
        var del = await SetService.delEventCode(params);

        /**** 변경이력 추가*****/
        var hisPam = {
            cctvId : ""
        ,   changeDtaCode : "V"
        ,   userId : req.user.dataValues.userId    // session 정보에서 가져와야하는데.. 못가져옴..ㅠㅠ
        ,   changeCn : "이벤트항목 수정"
        }
        var hisRe = await HistoryService.insertHistory(hisPam)
            
        return res.json(rtnObj)
    } catch (error) {
        next(error)
    }
}

module.exports ={
    getNightTimes
,   setNightTimes
,   getEventCodeList
,   setEventCode
,   setEventCodeOrderMod
,   delEventCode
}