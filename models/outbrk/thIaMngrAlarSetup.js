
'use strict'

/**
 * 영상분석 매니저 알람 
 * @since 2021.12.20
 * @author kyy
 */
module.exports = (sequelize,DataTypes) => {
    const ThIaMngrAlarSetup  = sequelize.define('TH_IA_MNGR_ALAR_SETUP',{
        creatDt : {
            type : DataTypes.DATE,
            primaryKey : true,
            field : "CREAT_DT",
            comment: '생성일자'
        },
        cctvId : {
            type : DataTypes.STRING(13),
            primaryKey : true,
            field : "CCTV_ID",
            comment: 'CCTV ID'
        },
        alarAt: {
            type: DataTypes.STRING(1),
            field: 'ALAR_AT',
            comment: '알람여부'
        },
        alarCycleCode: {
            type: DataTypes.STRING(1),
            field: 'ALAR_CYCLE_CODE',
            comment: '알람구분코드'
        },
        beginDe: {
            type: DataTypes.STRING(8),
            field: 'BEGIN_DE',
            comment: '시작일자'
        },
        beginHm: {
            type: DataTypes.STRING(4),
            field: 'BEGIN_HM',
            comment: '시작시분'
        },
        endDe: {
            type: DataTypes.STRING(8),
            field: 'END_DE',
            comment: '종료일자'
        },
        endHm: {
            type: DataTypes.STRING(4),
            field: 'END_HM',
            comment: '종료시분'
        },
        reptitDotwNm: {
            type: DataTypes.STRING(100),
            field: 'REPTIT_DOTW_NM',
            comment: '반복요일명'
        },
        scanSeNm: {
            type: DataTypes.STRING(100),
            field: 'SCAN_SE_NM',
            comment: '검지구분명'
        },
        excpTimeNm: {
            type: DataTypes.STRING(100),
            field: 'EXCP_TIME_NM',
            comment: '예외시간명'
        }
  
    },
    {
        freezeTableName : true,
        tableName : "TH_IA_MNGR_ALAR_SETUP",
        timestamps : false
    });

    return ThIaMngrAlarSetup;
}
