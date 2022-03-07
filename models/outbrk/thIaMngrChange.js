
'use strict'

/**
 * 영상분석 매니저 변경 이력
 * @since 2021.12.20
 * @author kyy
 */
module.exports = (sequelize,DataTypes) => {
    const ThIaMngrChange  = sequelize.define('TH_IA_MNGR_CHANGE',{
        changeSn : {
            type : DataTypes.INTEGER(12,0),
            primaryKey : true,
            field : "CHANGE_SN",
            autoIncrement: true,
            comment: '변경일련번호'
        },
        changeDt : {
            type : DataTypes.DATE,
            field : "CHANGE_DT",
            default: sequelize.literal('SYSDATE'),
            comment: '변경일시'
        },
        cctvId : {
            type : DataTypes.STRING(13),
            field : "CCTV_ID",
            comment: 'CCTV ID'
        },
        changeDtaCode: {
            type : DataTypes.STRING(3),
            field : "CHANGE_DTA_CODE",
            comment: '변경자료코드'
        },
        userId : {
            type : DataTypes.STRING(10),
            field : "USER_ID",
            comment: '사용자ID'
        },
        changeCn : {
            type : DataTypes.STRING(1000),
            field : "CHANGE_CN",
            comment: '변경내용'
        },
    },
    {
        freezeTableName : true,
        tableName : "TH_IA_MNGR_CHANGE",
        timestamps : false
    });

    return ThIaMngrChange;
}
