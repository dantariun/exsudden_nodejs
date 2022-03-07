const express = require('express');
const router = express.Router();
const httpStatus = require('http-status-codes');
const moment = require('moment')

const {ThIaMngrScan, ThIaCctvScanSttus, ThIaMngrAlarSetup, Sequelize, sequelize} = require('../../models');
const CustomError  = require('../../server/utils/CustomError');

const passport = require('passport');
const {isNotLoggedIn, isLoggedIn} = require('../middlewares');
const constants = require('../../constants');

router.get('/',  async(req, res, next)=>{
    try{
        let date = moment()

        // //정검지 정지차량 전체
        // const normal_stop_all = await ThIaMngrScan.count({where:{ 
        //     SCAN_RESULT_CODE : constants.Detection_normal, 
        //     SCAN_TY_CODE: constants.ScanType_stop_car,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')")
        // }});
        // //정검지 정지차량 1급
        // const normal_stop_first = await ThIaMngrScan.count({where:{ 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_stop_car,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 1
        // }});
        // //정검지 정지차량 2급
        // const normal_stop_second = await ThIaMngrScan.count({where:{ 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_stop_car,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 2
        // }});

        // //정검지 역주행 전체
        // const normal_reverse_all = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_reverse_run,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')")
        // }});
        // //정검지 역주행 1급
        // const normal_reverse_first = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_reverse_run,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 1
        // }});
        // //정검지 역주행 2급
        // const normal_reverse_second = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_reverse_run,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 2
        // }});

        // //정검지 보행자 전체
        // const normal_walker_all = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_walker,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        // }});
        // //정검지 보행자 1급
        // const normal_walker_first = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_walker,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 1
        // }});
        // //정검지 보행자 2급
        // const normal_walker_second = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_normal,
        //     SCAN_TY_CODE: constants.ScanType_walker,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')"),
        //     SCAN_GRAD: 2
        // }});

        // ///////////////////////////

        // //오검지 정지차량 전체
        // const wrong_stop_all = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_wrong,
        //     SCAN_TY_CODE: constants.ScanType_stop_car,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')")
        // }});

        // // 오검지 역주행 전체
        // const wrong_reverse_all = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_wrong,
        //     SCAN_TY_CODE: constants.ScanType_reverse_run,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')")
        // }});

        // // 오검지 보행자 전체
        // const wrong_walker_all = await ThIaMngrScan.count({ where: { 
        //     SCAN_RESULT_CODE : constants.Detection_wrong,
        //     SCAN_TY_CODE: constants.ScanType_walker,
        //     SCAN_DT: Sequelize.literal("TO_CHAR(SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD')")
        // }});

        //////////////////////////////

        // CCTV 현황 미작동 SCAN_STTUS_CODE=005?미작동:작동
        // const cctv_not_working = await ThIaCctvScanSttus.count({ where : {
        //     SCAN_STTUS_CODE : constants.CCTV_sttus_not_working
        // }})
        // CCTV 영역 틀어짐
        // const cctv_angle_wrong = await ThIaCctvScanSttus.count({ where : {
        //     SCAN_STTUS_CODE : constants.CCTV_sttus_angle_wrong
        // }})
        // CCTV 알림 OFF
        // let cctvNowDate = date.format('YYYYMMDD')
        // let cctvNowTime = date.format('HHMM')
        // const cctv_alarm_on = await ThIaMngrAlarSetup.sequelize.query(
        //     `SELECT 
        //         COUNT(*) AS CNT 
        //      FROM TH_IA_MNGR_ALAR_SETUP ALS 
        //     WHERE ALS.ALAR_AT = 'N' 
        //       AND TO_DATE('${cctvNowDate}', 'YYYYMMDD') BETWEEN TO_DATE(ALS.BEGIN_DE,'YYYYMMDD') AND TO_DATE(ALS.END_DE,'YYYYMMDD') 
        //       AND TO_DATE('${cctvNowTime}', 'HH24MI') BETWEEN TO_DATE(ALS.BEGIN_HM,'HH24MI') AND TO_DATE(ALS.END_HM,'HH24MI')`
        // )     
        const query0 = `
            SELECT 
                -- 정검지 정지차량 전체
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_stop_car}' THEN 1 END) NORMAL_STOP_ALL,
                -- 정검지 정지차량 1급
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_stop_car}' AND SCA.SCAN_GRAD = 1 THEN 1 END) NORMAL_STOP_FIRST,
                -- 정검지 정지차량 2급 
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_stop_car}' AND SCA.SCAN_GRAD = 2 THEN 1 END) NORMAL_STOP_SECOND,
                -- 정검지 역주행 전체	
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_reverse_run}' THEN 1 END) NORMAL_REVERSE_ALL,
                -- 정검지 역주행 1급
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_reverse_run}' AND SCA.SCAN_GRAD = 1 THEN 1 END) NORMAL_REVERSE_FIRST,
                -- 정검지 역주행 2급
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_reverse_run}' AND SCA.SCAN_GRAD = 2 THEN 1 END) NORMAL_REVERSE_SECOND,
                -- 정검지 보행자 전체
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' THEN 1 END) NORMAL_WALKER_ALL,
                -- 정검지 보행자 1급
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' AND SCA.SCAN_GRAD = 1 THEN 1 END) NORMAL_WALKER_FIRST,
                -- 정검지 보행자 2급
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_normal}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' AND SCA.SCAN_GRAD = 2 THEN 1 END) NORMAL_WALKER_SECOND,
                -- 오검지 정지차량 전체
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_wrong}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' THEN 1 END) WRONG_STOP_ALL,
                -- 오검지 역주행 전체
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_wrong}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' THEN 1 END) WRONG_REVERSE_ALL,
                -- 오검지 보행자 전체
                COUNT(CASE WHEN SCA.SCAN_RESULT_CODE = '${constants.Detection_wrong}' AND SCA.SCAN_TY_CODE = '${constants.ScanType_walker}' THEN 1 END) WRONG_WALKER_ALL
                
                FROM TH_IA_MNGR_SCAN SCA
                INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION POS ON POS.CCTV_ID  = SCA.CCTV_ID 
                INNER JOIN TN_CCTV CTV ON CTV.CCTV_ID  = POS.CCTV_ID AND CTV.INTD_CODE =:intdCode     
            WHERE 
                TO_CHAR(SCA.SCAN_DT, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD') 
        `
        const result0 = await await sequelize.query(query0,
            {
                replacements: { 
                    intdCode: req.user.dataValues.insttId
                },
                type: Sequelize.QueryTypes.SELECT,
                raw: true   
            })

        const normal_stop_all = result0[0].NORMAL_STOP_ALL
        const normal_stop_first = result0[0].NORMAL_STOP_FIRST
        const normal_stop_second = result0[0].NORMAL_STOP_SECOND
        const normal_reverse_all = result0[0].NORMAL_REVERSE_ALL
        const normal_reverse_first = result0[0].NORMAL_REVERSE_FIRST
        const normal_reverse_second = result0[0].NORMAL_REVERSE_SECOND
        const normal_walker_all = result0[0].NORMAL_WALKER_ALL
        const normal_walker_first = result0[0].NORMAL_WALKER_FIRST
        const normal_walker_second = result0[0].NORMAL_WALKER_SECOND
        const wrong_stop_all = result0[0].WRONG_STOP_ALL
        const wrong_reverse_all = result0[0].WRONG_REVERSE_ALL
        const wrong_walker_all = result0[0].WRONG_WALKER_ALL
        
        console.log(result0[0])
        // CCTV 현황 미작동/ CCTV 영역 틀어짐  
        const query = `
            SELECT 
                    COUNT(CASE WHEN SCAN_STTUS_CODE = '${constants.CCTV_sttus_not_working}' THEN 1 END) STTUS_NOT_WORKING ,
                    COUNT(CASE WHEN SCAN_STTUS_CODE = '${constants.CCTV_sttus_angle_wrong}' THEN 1 END) STTUS_ANGLE_WRONG 
            FROM 
            (
                SELECT 
                    STT.CCTV_ID,
                    MAX(STT.SCAN_STTUS_CODE) KEEP(DENSE_RANK FIRST ORDER BY STT.COLCT_DT DESC) SCAN_STTUS_CODE
                
                FROM TN_CCTV CTV 
                INNER JOIN (
                        SELECT DISTINCT CCTV_ID  FROM TN_IA_PROCS_CCTV_COMPOSITION
                ) CON ON CON.CCTV_ID = CTV.CCTV_ID 
                INNER JOIN TH_IA_CCTV_SCAN_STTUS STT ON CTV.CCTV_ID = STT.CCTV_ID AND STT.SCAN_STTUS_CODE IN ('005', '006')
                
                --WHERE STT.COLCT_DT > SYSDATE - 0.1
                AND CTV.INTD_CODE =:intdCode     
                GROUP BY STT.CCTV_ID
            )
                
        `
        const result = await await sequelize.query(query,
            {
                replacements: { 
                    intdCode: req.user.dataValues.insttId
                },
                type: Sequelize.QueryTypes.SELECT,
                raw: true   
            })
        
        const cctv_not_working = result[0].STTUS_NOT_WORKING
        const cctv_angle_wrong = result[0].STTUS_ANGLE_WRONG
        
        // CCTV 알림 OFF
        const query1 = `
            SELECT                              
                    COUNT(CASE WHEN IS_ALAR_AT = 'N' THEN 1 END) CCTV_ALARM_OFF
            FROM (

                    --알람여부
                SELECT 
                            ALS.CCTV_ID,
                            CASE WHEN COUNT(CASE WHEN ALS.ALAR_AT = 'Y' THEN 'Y' END) > 0 THEN 'Y' ELSE 'N' END IS_ALAR_AT
                                
                FROM TN_CCTV CTV 
                INNER JOIN (
                            SELECT DISTINCT CCTV_ID  FROM TN_IA_PROCS_CCTV_COMPOSITION
                    ) CON ON CON.CCTV_ID = CTV.CCTV_ID 
                INNER JOIN TH_IA_MNGR_ALAR_SETUP ALS ON  CTV.CCTV_ID  = ALS.CCTV_ID 
                WHERE 
                (
                    ( 
                            ALS.ALAR_CYCLE_CODE ='N' OR ALS.ALAR_CYCLE_CODE IS NULL
                            AND SYSDATE
                            BETWEEN TO_DATE(CONCAT(NVL(ALS.BEGIN_DE,'19000101'),NVL(ALS.BEGIN_HM,'0000')),'YYYYMMDDHH24MI')
                                AND TO_DATE(CONCAT(NVL(ALS.END_DE, '19000101'),NVL(ALS.END_HM,'0000')),'YYYYMMDDHH24MI')

                    ) 
                    OR 
                    (
                        ALS.ALAR_CYCLE_CODE ='D' 
                        AND SYSDATE
                            BETWEEN TO_DATE(CONCAT(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(ALS.BEGIN_HM, '0000')), 'YYYYMMDDHH24MI') 
                                AND TO_DATE(CONCAT(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(ALS.END_HM, '0000')), 'YYYYMMDDHH24MI')
                    
                    )
                    OR 
                    (
                        ALAR_CYCLE_CODE ='W' 
                        AND SYSDATE 
                            BETWEEN TO_DATE(CONCAT(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(ALS.BEGIN_HM, '0000')), 'YYYYMMDDHH24MI') 
                                AND TO_DATE(CONCAT(TO_CHAR(SYSDATE, 'YYYYMMDD'), NVL(ALS.END_HM, '0000')), 'YYYYMMDDHH24MI')
                        AND REGEXP_LIKE(ALS.REPTIT_DOTW_NM, TO_CHAR(SYSDATE, 'dy', 'NLS_DATE_LANGUAGE=ENGLISH'))
                    )
                )
                AND CTV.INTD_CODE =:intdCode     
                GROUP BY ALS.CCTV_ID

            ) 
        `
        const result1 = await await sequelize.query(query1,
            {
                replacements: { 
                    intdCode: req.user.dataValues.insttId
                },
                type: Sequelize.QueryTypes.SELECT,
                raw: true   
            })
        const cctv_alarm_on_result = result1[0].CCTV_ALARM_OFF

        const allCount = {
            normal_stop_all : normal_stop_all,
            normal_stop_first : normal_stop_first,
            normal_stop_second : normal_stop_second,
            normal_walker_all : normal_walker_all,
            normal_reverse_all : normal_reverse_all,
            normal_reverse_first : normal_reverse_first,
            normal_reverse_second : normal_reverse_second,
            normal_walker_first : normal_walker_first,
            normal_walker_second : normal_walker_second,
            wrong_stop_all : wrong_stop_all,
            wrong_reverse_all : wrong_reverse_all,
            wrong_walker_all : wrong_walker_all,
            cctv_not_working  : cctv_not_working,
            cctv_angle_wrong : cctv_angle_wrong,
            cctv_alarm_on : cctv_alarm_on_result
        }

        res
        .status(httpStatus.StatusCodes.OK)
        .json(allCount);

    }catch(err){
        console.error(err);
        next(err);
    }
})

module.exports = router;