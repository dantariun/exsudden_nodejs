const { TnIaMngrNight, TnIaMngrEvent,sequelize, Sequelize } = require("../../models");
const Op = Sequelize;

// 설정 > 저장 : 야간 시간대 설정 조회
const getNightTimeList = () => {    
    return TnIaMngrNight.findAll({
        attributes : [
            [Sequelize.col('STDMT'),"mnth"]
        ,   [Sequelize.col("SUNSET_HM"), 'sunsetTime']
        ,   [Sequelize.col("SUNRISE_HM"), 'sinriseTime']
        ]
    ,   order : ["STDMT"]
    ,   raw : true
    ,   where : {}
    })
}

// 설정 > 저장 : 해당 월의 저장여부 조회 
const getIsTimeDataCnt = (params) => {    
    return TnIaMngrNight.findOne({
         attributes :[
             [Sequelize.fn("COUNT",Sequelize.col("STDMT")), "CNT"]
         ]      
    ,    where : {
        mnth : params
        }
    ,   raw : true
    })    
}

// 설정 > 저장 : 데이터추가
const setTimeDataInsert = (params) =>{
    return TnIaMngrNight.create({
        mnth            :   params.mnth
    ,   sunsetTime     :   params.sunsetTime
    ,   sinriseTime    :   params.sunriseTime
    })
}

// 설정 > 저장 : 데이터수정
const setTimeDataUpdate = (params) => {
    return TnIaMngrNight.update({
        sunsetTime  :   params.sunsetTime
    ,   sinriseTime :   params.sunriseTime   
    },{
        where : {
            mnth :params.mnth
        }
    })
}

// 설정 > 이벤트항목 저장  > 세부유형명 혹은 코드 중복체크
const getEventCodeCheck = (params,type) => {
    if(type == "code")
    {
        return TnIaMngrEvent.findOne(
            {
                attributes : [
                    [Sequelize.fn("COUNT",Sequelize.col("IA_EVENT_SCLAS_CODE")), "CNT"]
                ]
                ,   raw : true        
                ,   where : {
                        eventSeCode : params.eventSeCode
                ,       eventTyCode : params.eventTyCode
                ,       eventDetailTyCode : params.eventDetailTyCode
                }
            })
    }
    else {
        return TnIaMngrEvent.findOne(
            {
                attributes : [
                    [Sequelize.fn("COUNT",Sequelize.col("IA_EVENT_SCLAS_NM")), "CNT"]
                ]
                ,   raw : true
                ,   where : {
                        eventSeCode : params.eventSeCode
                ,       eventTyCode : params.eventTyCode
                ,       eventDetailTyNm : params.eventDetailTyNm
                }
            })
    }
    
}
// 설정 > 이벤트 항목 목록 조회
const getEventCodeList = (params) => {
    return TnIaMngrEvent.findAll({
            attributes :[                
                [Sequelize.literal('ROW_NUMBER() OVER(ORDER BY SORT_ORDR DESC)'),"rnum"]
            ,   [Sequelize.col("IA_EVENT_LCLAS_CODE"), "eventSeCode"]
            ,   [Sequelize.col("IA_EVENT_MLSFC_CODE"), "eventTyCode"]
            ,   [Sequelize.col("IA_EVENT_SCLAS_CODE"), "eventDetailTyCode"]
            ,   [Sequelize.col("IA_EVENT_SCLAS_NM"), "eventDetailTyNm"]
            ,   [Sequelize.col("SORT_ORDR"), "codeOrdr"]
            ]
        ,   where : {
                eventSeCode :   params.evtSeCode
            ,   eventTyCode :   params.evtTyCode
            }
        ,   raw : true
        ,   order : ["SORT_ORDR"]
    })

}
// 설정 > 이벤트 항목 추가
const setEventCodeInsert = async (params) =>{
    // 순번 
    const order = await TnIaMngrEvent.findOne({
        attributes : [
            [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("SORT_ORDR")),0), "codeOrdr"]
        ]
        ,   raw : true
        ,   where : {
                eventSeCode : params.eventSeCode
            ,   eventTyCode : params.eventTyCode
            }
    })
    const orderNum = order.codeOrdr + 1

    return TnIaMngrEvent.create({
        eventSeCode : params.eventSeCode
    ,   eventTyCode : params.eventTyCode    
    ,   eventDetailTyCode : params.eventDetailTyCode
    ,   eventDetailTyNm : params.eventDetailTyNm
    ,   codeOrdr : orderNum
    })
}

// 순번 바뀔 데이터 정보 조회 
const getEventCodeOrderInfo = (params) =>{
    return TnIaMngrEvent.findOne({
        attributes :[                
            [Sequelize.col("IA_EVENT_LCLAS_CODE"), "eventSeCode"]
        ,   [Sequelize.col("IA_EVENT_MLSFC_CODE"), "eventTyCode"]
        ,   [Sequelize.col("IA_EVENT_SCLAS_CODE"), "eventDetailTyCode"]
        ,   [Sequelize.col("IA_EVENT_SCLAS_NM"), "eventDetailTyNm"]
        ,   [Sequelize.col("SORT_ORDR"), "codeOrdr"]
        ]
    ,   where : {
            eventSeCode :   params.eventSeCode
        ,   eventTyCode :   params.eventTyCode
        ,   codeOrdr    :   params.codeOrdr
        }
    ,   raw : true
    })
}

// 설정 > 이벤트 항목 순서변경 
const setEventCodeOrderMod = async (params) => {
    return TnIaMngrEvent.update({
            codeOrdr : params.codeOrdr
    },{
        where : {
            eventSeCode : params.eventSeCode
        ,   eventTyCode : params.eventTyCode
        ,   eventDetailTyCode : params.eventDetailTyCode
        }
    })
}
// 이벤트 항목 삭제 전 순서 삭제할 코드 재정립
const setEventOrderReestablish = async (params) => {
    const updateQuery = "UPDATE TN_IA_MNGR_EVENT"
    +   " SET SORT_ORDR = SORT_ORDR - 1" 
    +   " WHERE IA_EVENT_LCLAS_CODE = :evtSeCode"
    +   " AND IA_EVENT_MLSFC_CODE = :evtTyCode"
    +   " AND SORT_ORDR > :order"  
      
    return TnIaMngrEvent.sequelize.query(updateQuery,{
        replacements :{
            evtSeCode : params.evtSeCode
        ,   evtTyCode : params.evtTyCode
        ,   order     : params.order
        }
    })   
}
// 이벤트 항목 삭제 
const delEventCode = async(params) => {
    const deleteQuery = "DELETE FROM TN_IA_MNGR_EVENT"
    +   " WHERE IA_EVENT_LCLAS_CODE = :evtSeCode"
    +   " AND IA_EVENT_MLSFC_CODE = :evtTyCode"
    +   " AND IA_EVENT_SCLAS_CODE = :evtDetailCode"
    
    return TnIaMngrEvent.sequelize.query(deleteQuery,{
        replacements :{
            evtSeCode : params.evtSeCode
        ,   evtTyCode : params.evtTyCode
        ,   evtDetailCode : params.evtDetailCode
        }
    })   
}
// 이벤트항목 전체 조회 
const getAllEveltList = async()=>{
    return TnIaMngrEvent.findAll({
        attributes :[                
            [Sequelize.col("IA_EVENT_LCLAS_CODE"), "eventSeCode"]
        ,   [Sequelize.col("IA_EVENT_MLSFC_CODE"), "eventTyCode"]
        ,   [Sequelize.col("IA_EVENT_SCLAS_CODE"), "eventDetailTyCode"]
        ,   [Sequelize.col("IA_EVENT_SCLAS_NM"), "eventDetailTyNm"]
        ,   [Sequelize.col("SORT_ORDR"), "codeOrdr"]
        ]
        ,   raw : true
        ,   order : ["IA_EVENT_LCLAS_CODE","IA_EVENT_MLSFC_CODE","SORT_ORDR"]
    })
}
module.exports = {
    getNightTimeList
,   getIsTimeDataCnt
,   setTimeDataInsert
,   setTimeDataUpdate
,   getEventCodeCheck
,   getEventCodeList
,   setEventCodeInsert
,   getEventCodeOrderInfo
,   setEventCodeOrderMod
,   setEventOrderReestablish
,   delEventCode
,   getAllEveltList
}