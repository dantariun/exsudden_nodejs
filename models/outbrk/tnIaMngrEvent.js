'use strict'

/*****************************
 *  돌발매니저 이벤트
 *  @since 2021.12.14
 *  @author srhan
 *****************************/
module.exports = (sequelize,DataTypes) =>{
    const TnIaMngrEvent  = sequelize.define('TN_IA_MNGR_EVENT',{
        // 이벤트 구분
        eventSeCode : {
            type : DataTypes.STRING(3)        
        ,   primaryKey : true
        ,   field : "IA_EVENT_LCLAS_CODE"
        },
        // 이벤트 유형코드
        eventTyCode : {
            type : DataTypes.STRING(3)        
        ,   primaryKey : true
        ,   field : "IA_EVENT_MLSFC_CODE"
        },
        // 이벤트 세부유형코드
        eventDetailTyCode : {
            type : DataTypes.STRING(2)        
        ,   primaryKey : true
        ,   field : "IA_EVENT_SCLAS_CODE"
        },
        // 이벤트 세부유형명
        eventDetailTyNm : {
            type : DataTypes.STRING(100)
        ,   field : "IA_EVENT_SCLAS_NM"
        },
        codeOrdr : {
            type : DataTypes.INTEGER
        ,   field : "SORT_ORDR"
        }
    },{
        freezeTableName : true,
        tableName : "TN_IA_MNGR_EVENT",
        timestamps : false
    })   
    return TnIaMngrEvent;
}
