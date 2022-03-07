'use strict'

/*****************************
 *  돌발매니저 CCTV 모델
 *  @since 2021.12.14
 *  @author kyy
 *****************************/
module.exports = (sequelize,DataTypes) =>{
    const TnCctv  = sequelize.define('TN_CCTV',{
        cctvId : {
            type : DataTypes.STRING(13),   
            primaryKey : true,
            allowNull: false,
            field: "CCTV_ID",
            comment: 'CCTVID'
        },
        intdCode : {
            type : DataTypes.STRING(7),
            field: "INTD_CODE",
            comment: '지방청코드(추후 not null로 변경 가능. 모든 제어기 테이블 적용) '
        },
        markNm : {
            type : DataTypes.STRING(100),
            field: "MAKR_NM",
            comment: '제조사명'
        },
        modelNm: {
            type: DataTypes.STRING(100),
            field: "MODEL_NM",
            comment: '모델명'
        },
        instlLc:{
            type: DataTypes.STRING(200),
            field: "INSTL_LC",
            comment: '설치위치'
        },
        instlLcAbrv: {
            type: DataTypes.STRING(128),
            field: "INSTL_LC_ABRV",
            comment: '설치 위치 약어'
        },
        instlDt: {
            type: DataTypes.DATE,
            field: "INSTL_DT",
            comment: '설치일시'
        },
        instlDrcCode: {
            type: DataTypes.STRING(3),
            field: 'INSTL_DRC_CODE',
            comment: '설치방향코드'
        },      
        commTyCode: {
            type: DataTypes.STRING(3),
            field: 'COMM_TY_CODE',
            comment:'통신유형코드'
        },
        cntlrIpAdres: {
            type: DataTypes.STRING(20),
            field: 'CNTLR_IP_ADRES',
            comment:'제어기IP주소'
        },      
        cntlrPortNo: {
            type: DataTypes.NUMBER(5,0),
            field: 'CNTLR_PORT_NO',
            comment:'제어기포트번호',
        },
        localNo: {
            type: DataTypes.NUMBER(12,0),
            field: 'LOCAL_NO',
            comment: '로컬번호'
        },
        mapXcord: {
            type: DataTypes.NUMBER(),
            field: 'MAP_XCORD', 
            comment:'지도X좌표'
        },
        mapYcord: {
            type: DataTypes.NUMBER(),
            field: 'MAP_YCORD',
            comment:'지도Y좌표'
        },
        rtspAdres: {
            type: DataTypes.STRING(200),
            field: 'RTSP_ADRES',
            comment:'RTSP주소'
        },
        useAt: {
            type: DataTypes.STRING(1),
            field: 'USE_AT',
            comment:'사용여부'
        },
        instlLkId: {
            type: DataTypes.STRING(13),
            field: 'INSTL_LK_ID',
            comment:'설치LKID'
        },
        instlLkLcCode: {
            type: DataTypes.STRING(3),
            field: 'INSTL_LK_LC_CODE',
            comment:'설치LK위치코드'
        },
        stdEqpmnAt: {
            type: DataTypes.STRING(1),
            field: 'STD_EQPMN_AT',
            comment:'표준장비여부'
        },
        refrnNo: {
            type: DataTypes.STRING(13),
            field: 'REFRN_NO',
            comment:'참조번호'
        },      
        oldCctvId: {
            type: DataTypes.STRING(13),
            field: 'OLD_CCTV_ID',
            comment:'구CCTVID'            
        },
        procsId:{
            type: DataTypes.STRING(13),
            field: 'PROCS_ID',
            comment:'프로세스ID'
        },      
        cntlrRipAdres: {
            type: DataTypes.STRING(20),
            field: 'CNTLR_RIP_ADRES',
            comment:'제어기실제IP주소'
        },
        removAt: {
            type: DataTypes.STRING(1),
            field: 'REMOV_AT',
            comment:'제거여부'
        },
        prtclTyCode: {
            type: DataTypes.STRING(3),
            field: 'PRTCL_TY_CODE',
            comment:'프로토콜유형코드'
        },
        loginId: {
            type: DataTypes.STRING(10),
            field: 'LOGIN_ID',
            comment:'로그인ID'
        },      

        loginPassword: {
            type: DataTypes.STRING(128),
            field: 'LOGIN_PASSWORD',
            comment:'로그인비밀번호'
        },
        cctvTyCode:{
            type: DataTypes.STRING(3),
            field: 'CCTV_TY_CODE',
            comment:'CCTV유형코드'
        },
        matrixInputPortNo:{
            type: DataTypes.NUMBER(5),
            field: 'MATRIX_INPUT_PORT_NO',
            comment:'매트릭스입력포트번호'
        },      
        matrixOutptPortNo: {
            type: DataTypes.NUMBER(5),
            field: 'MATRIX_OUTPT_PORT_NO',
            comment:'매트릭스출력포트번호'
        },
        rm: {
            type: DataTypes.STRING(4000),
            field: 'RM',
            comment:'비고'
        },      
        rwisSpotId:{
            type: DataTypes.STRING(13),
            field: 'RWIS_SPOT_ID',
            comment:'RWIS지점ID'
        }       
    },{
        freezeTableName : true,
        tableName : "TN_CCTV",
        timestamps : false
    })
    
    return TnCctv;
}
