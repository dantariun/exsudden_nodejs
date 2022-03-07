'use strict'

/*****************************
 *  돌발매니저 CCTV 상태
 *  @since 2021.12.30
 *  @author devbhc
 *****************************/
module.exports = (sequelize,DataTypes) =>{
    const TnIaCctvScanSttus  = sequelize.define('TN_IA_CCTV_SCAN_STTUS',{
        // 
        cctvId : {
            type : DataTypes.STRING(13)        
        ,   primaryKey : true
        ,   field : "CCTV_ID"
        },
        //  
        colctDt : {
            type : DataTypes.DATE
        ,   field : "COLCT_DT"
        },
        // 
        scanSttusCode : {
            type : DataTypes.STRING(3)
        ,   field : "SCAN_STTUS_CODE"
        }
    },{
        freezeTableName : true,
        tableName : "TN_IA_CCTV_SCAN_STTUS",
        timestamps : false
    })   
    return TnIaCctvScanSttus;
}
