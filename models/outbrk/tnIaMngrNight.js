'use strict'

/*****************************
 *  돌발매니저 야간시간 모델정보
 *  @since 2021.12.13
 *  @author srhan
 *****************************/
module.exports = (sequelize,DataTypes) =>{
    const TnIaMngrNight  = sequelize.define('TN_IA_MNGR_NIGHT_SETUP',{
        // 월
        mnth : {
            type : DataTypes.STRING(2)        
        ,   primaryKey : true
        ,   field : "STDMT"
        },
        // 일몰시각 
        sunsetTime : {
            type : DataTypes.STRING(4)
        ,   field : "SUNSET_HM"
        },
        // 일출시각
        sinriseTime : {
            type : DataTypes.STRING(4)
        ,   field : "SUNRISE_HM"
        }
    },{
        freezeTableName : true,
        tableName : "TN_IA_MNGR_NIGHT_SETUP",
        timestamps : false
    })   
    return TnIaMngrNight;
}
