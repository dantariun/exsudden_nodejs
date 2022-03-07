'use strict'

/**
 * 영상분석 매니저 검지
 * @since 2021.12.15
 * @author lmh
 */
module.exports = (sequelize,DataTypes) => {
    const ThIaMngrScan  = sequelize.define('TH_IA_MNGR_SCAN',{
        // 검지일시
        scanDt : {
            type : DataTypes.DATE,
            primaryKey : true,
            field : "SCAN_DT",
            defaultValue: sequelize.literal('SYSDATE'),
        },
        // CCTV ID
        cctvId : {
            type : DataTypes.STRING(13),
            primaryKey : true,
            field : "CCTV_ID"
        },
        // 검지 X좌표
        scanXcord : {
            type : DataTypes.INTEGER,
            field : "SCAN_XCORD"
        },
        // 검지 Y좌표
        scanYcord : {
            type : DataTypes.INTEGER,
            field : "SCAN_YCORD"
        },
        // 검지 너비
        scanBt : {
            type : DataTypes.INTEGER,
            field : "SCAN_BT"
        },
        // 검지 높이
        scanHg : {
            type : DataTypes.INTEGER,
            field : "SCAN_HG"
        },
        // 검지 신뢰성
        scanRlablty : {
            type : DataTypes.INTEGER,
            field : "SCAN_RLABLTY"
        },
        // 검지영상 URL
        scanVidoUrl : {
            type : DataTypes.STRING(1000),
            field : "SCAN_VIDO_URL"
        },
        // 검지방향 코드
        scanDrcCode : {
            type : DataTypes.STRING(3),
            field : "SCAN_DRC_CODE"
        },
        // 검지유형 코드
        scanTyCode : {
            type : DataTypes.STRING(3),
            field : "SCAN_TY_CODE"
        },
        // 검지 등급
        scanGrad : {
            type : DataTypes.INTEGER,
            field : "SCAN_GRAD"
        },
        // 강수형태 코드
        prcptStleCode : {
            type : DataTypes.STRING(3),
            field : "PRCPT_STLE_CODE"
        },
        // 검지 구분
        scanSeCode : {
            type : DataTypes.STRING(3),
            field : "SCAN_RESULT_CODE"
        },
        // 이벤트 세부유형 코드
        eventDetailTyCode : {
            type : DataTypes.STRING(3),
            field : "EVENT_DETAIL_TY_CODE"

        },
        // 이벤트 세부 기타내용
        eventDetailTyCode : {
            type : DataTypes.STRING(1000),
            field : "SCAN_DETAIL_ETC_CN"
        },
        // 이벤트 메모내용
        eventDetailTyCode : {
            type : DataTypes.STRING(1000),
            field : "SCAN_RESULT_MEMO_CN"
        },
        // 알람방지 분
        alarPrvnTime : {
            type : DataTypes.INTEGER,
            field : "ALAR_PRVN_TIME"
        },
        // 환경요소 코드
        envrnFactorCode : {
            type : DataTypes.STRING(3),
            field : "ENVRN_FACTOR_CODE"
        },
        // 환경요소기타내용
        envrnFactorEtcCn : {
            type : DataTypes.STRING(1000),
            field : "ENVRN_FACTOR_ETC_CN"
        },
        // 2차검지 신뢰성
        scdScanRlablty : {
            type : DataTypes.INTEGER,
            field : "SCD_SCAN_RLABLTY"
        },
        // 2차검지 유형코드
        scdScanTyCode : {
            type : DataTypes.STRING(3),
            field : "SCD_SCAN_TY_CODE"
        },
        // 2차검지 일시
        scdScanDt : {
            type : DataTypes.DATE,
            field : "SCD_SCAN_DT"
        },
        // 검지길이코드
        scdLtCode : {
            type : DataTypes.STRING(3)
        ,   field : "SCAN_LT_CODE"
        }
    },
    {
        freezeTableName : true,
        tableName : "TH_IA_MNGR_SCAN",
        timestamps : false
    });

    return ThIaMngrScan;
}
