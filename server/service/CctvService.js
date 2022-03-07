const { maxRows, AQ_DEQ_NAV_NEXT_MSG } = require("oracledb");
const { ThIaMngrAlarSetup, ThIaMngrChange, sequelize, Sequelize } = require("../../models");

const getCctvList = async (req) => {
    //알림상태: TH_IA_MNGR_ALAR > 조건에 포함될 경우 
    let query = `
        SELECT
                CTV.CCTV_ID,                              --CCTV ID
                CTV.INSTL_LC,                             --설치위치
                CTV.INSTL_LC_ABRV,                        --설치위치 약어
                CTV.INSTL_DRC_CODE,                       --설치방향코드
                STT.SCAN_STTUS_CODE,                      --상태 업데이트 정보
                CASE WHEN NVL(STT.SCAN_STTUS_CODE,'') = '005' THEN 'N' ELSE 'Y' END STT_NET, -- 수신상태
                CASE WHEN NVL(STT.SCAN_STTUS_CODE,'') = '006' THEN 'N' ELSE 'Y' END STT_RNG, -- 화각상태
                --화질 x
                CTV.USE_AT,                               --사용여부, 검지여부
                CTV.INSTL_DT,                             --설치일시
                STS.COMM_STTUS_CODE,                      --통신상태
                NVL(ALS2.IS_ALAR_AT, 'Y') ALAR_AT,        --알림상태   
                CTV.RTSP_ADRES,
                NVL(ALM.SCAN_DT_CNT, 0) EVENT_CNT

        FROM TN_CCTV              CTV                     --CCTV
        INNER JOIN  TN_IA_PROCS_CCTV_COMPOSITION CON ON CON.CCTV_ID = CTV.CCTV_ID 
        LEFT JOIN ( 
            SELECT 
                CCTV_ID, 
                COUNT(SCAN_DT) AS SCAN_DT_CNT
            FROM TH_IA_MNGR_SCAN 
            WHERE 
                SYSDATE <= ADD_MONTHS(SCAN_DT, 1) 
            GROUP BY CCTV_ID 
        )   ALM ON ALM.CCTV_ID = CTV.CCTV_ID
        LEFT JOIN (                                       --알람여부
            SELECT 
                       ALS.CCTV_ID,
                       CASE WHEN COUNT(CASE WHEN ALS.ALAR_AT = 'Y' THEN 'Y' END) > 0 THEN 'Y' ELSE 'N' END IS_ALAR_AT
                           
            FROM TH_IA_MNGR_ALAR_SETUP ALS
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
            
            GROUP BY ALS.CCTV_ID
        )  ALS2 ON ALS2.CCTV_ID = CTV.CCTV_ID
        LEFT JOIN TN_CCTV_STTUS   STS                     --CCTV_상태
            ON CTV.CCTV_ID = STS.CCTV_ID
        LEFT JOIN (
                SELECT 
                    CCTV_ID ,
                    MAX(SCAN_STTUS_CODE) KEEP(DENSE_RANK FIRST ORDER BY COLCT_DT DESC) SCAN_STTUS_CODE
                FROM TH_IA_CCTV_SCAN_STTUS 
                WHERE SCAN_STTUS_CODE IN ('005', '006')
                -- AND COLCT_DT > SYSDATE - 0.1
                GROUP BY CCTV_ID
        )  STT ON STT.CCTV_ID = CTV.CCTV_ID 
        
        ${Object.keys(req.query).includes('detail') && req.query.detail != '' ? 'LEFT JOIN TN_IA_MNGR_ANALS_SETUP STP ON STP.CCTVID = CTV.CCTV_ID AND STP.ANALS_CND_CODE =:detail': '' }
        WHERE 
            CTV.INTD_CODE =:intdCode      
        
    `
    let addWhere = []
    let orderBy = ''
    // 지방청 코드 (로그인후 )
    let addReplacements = { intdCode: req.user.dataValues.insttId }
    // let addReplacements = {}
    for (key of Object.keys(req.query)) {
        if((req.query[key] || '') != '') {
            switch(key) {
                case "cctvId": //cctvid
                    addWhere.push(`CTV.CCTV_ID=:${key}`)        
                    break
                case 'sttNet': //수신상태
                    if(req.query[key] == 'N'){
                        addWhere.push(`NVL(STT.SCAN_STTUS_CODE,'') ='005'`)        
                    }else{
                        addWhere.push(`NVL(STT.SCAN_STTUS_CODE,'') != '005' or  STT.SCAN_STTUS_CODE IS NULL`)        
                    }
                break
                case 'alarAt':
                    addWhere.push(`NVL(ALS2.IS_ALAR_AT,'Y') ='${req.query[key]}'`)  
                    break      
                case 'env':
                    
                    break
                case 'detail':
                    // 분석설정
                    if(req.query[key] != '') {
                        addWhere.push(`NVL(STP.ANALS_AT, 'Y') = 'Y'`)
                    }
                    break;
                case 'asc':
                case 'desc':
                    if (['CCTV_ID','INSTL_LC','INSTL_DT','USE_AT'].includes(req.query[key])) {
                        orderBy=` ORDER BY CTV.${req.query[key]} ${key} `
                    } 
                    else if(['STT_NET'].includes(req.query[key])) // 수신
                    {
                        orderBy=` ORDER BY CASE WHEN NVL(STT.SCAN_STTUS_CODE,'') = '005' THEN 'N' ELSE 'Y' END ${key} `
                    }
                    else if(['STT_RNG'].includes(req.query[key])) // 화각
                    {
                        orderBy=` ORDER BY CASE WHEN NVL(STT.SCAN_STTUS_CODE,'') = '006' THEN 'N' ELSE 'Y' END ${key} `
                    }
                    else if(['ALAR_AT'].includes(req.query[key])) 
                    {
                        orderBy= ` ORDER BY NVL(ALS2.IS_ALAR_AT, 'Y') ${key}`
                    }
                    else if(['EVENT_CNT'].includes(req.query[key])) {
                        orderBy= ` ORDER BY NVL(ALM.SCAN_DT_CNT, 0) ${key}`
                    }
                    else
                    {
                        orderBy=` ORDER BY CTV.CCTV_ID DESC `
                    }
                    break;
                    
            }

            
        } 
        addReplacements = {
            ...addReplacements
            ,[key]: req.query[key]
         }
    }
    if (addWhere.length > 0) query = query + " and " + addWhere.join(" and ")
    
    query = query + orderBy
    

    let Options = {
        type: Sequelize.QueryTypes.SELECT,
        raw: true
    }
    if (Object.keys(addReplacements).length > 0) {
        Options = {...Options, replacements: addReplacements}
    }

    const result = await sequelize.query(query, Options)
    return result
}
// cctv 상세 정보 
const getCctvInfo = async (req) => {
    const query = `
        SELECT
            CTV.CCTV_ID,        -- ID          
            CTV.INTD_CODE,      -- 지방청 코드
            CM1.DETAIL_CODE_NM AS INTD_CODE_NM,
            CTV.INSTL_LC,                          
            CTV.USE_AT,                             
            CTV.INSTL_DT,      
            CTV.MAKR_NM,        -- 제조사명
            CTV.MODEL_NM,       -- 모델명
            CTV.INSTL_LC,       -- 설치위치
            CTV.INSTL_LC_ABRV,  -- 설치위치 약어
            CTV.INSTL_DT,       -- 설치일시
            CTV.INSTL_DRC_CODE, -- 설치방향코드
            CTV.COMM_TY_CODE,   -- 설치유형코드
            CTV.CNTLR_IP_ADRES, -- 제어기IP주소
            CTV.CNTLR_PORT_NO,  -- 제어기포트번호
            CTV.LOCAL_NO,       -- 로컬번호
            CTV.MAP_XCORD,      -- 지도X좌표
            CTV.MAP_YCORD,      -- 지도Y좌표
            CTV.RTSP_ADRES,     -- RTSP주소
            CTV.USE_AT,         -- 사용여부
            CTV.INSTL_LK_ID,    -- 설치LKID
            CTV.INSTL_LK_LC_CODE,
            CTV.STD_EQPMN_AT,
            CTV.REFRN_NO,
            CTV.OLD_CCTV_ID,
            CTV.PROCS_ID,
            CTV.CNTLR_RIP_ADRES,
            CTV.REMOV_AT,
            CTV.PRTCL_TY_CODE,
            CTV.LOGIN_ID,
            CTV.LOGIN_PASSWORD,
            CTV.CCTV_TY_CODE,
            CTV.MATRIX_INPUT_PORT_NO,
            CTV.MATRIX_OUTPT_PORT_NO,
            CTV.RM,
            CTV.RWIS_SPOT_ID,
            STS.COMM_STTUS_CODE,
            SCN.SCAN_DT

        FROM TN_CCTV CTV               
        LEFT JOIN TN_CCTV_STTUS STS ON CTV.CCTV_ID = STS.CCTV_ID
        LEFT JOIN TN_CMMN_DETAIL_CODE CM1 ON CM1.CODE_ID='INTD_CODE' 
            AND CTV.INTD_CODE = CM1.DETAIL_CODE_ID 
        LEFT JOIN (            
            SELECT 
                CCTV_ID, 
                SCAN_DT 
            FROM TH_IA_MNGR_SCAN 
            WHERE 
                CCTV_ID =:cctv_id
                AND ROWNUM = 1 
            ORDER  BY SCAN_DT DESC 
        ) SCN ON SCN.CCTV_ID = CTV.CCTV_ID
        WHERE 
            CTV.CCTV_ID = :cctv_id
        AND CTV.INTD_CODE =:intdCode    
`
    const result = await sequelize.query(query,
        {
            replacements: { 
                cctv_id: req.params.cctvId,
                intdCode: req.user ? req.user.dataValues.insttId : ''
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true   
        })
    return result

}
const getCctvPreset = async (req) => {
    
    const query = `
    SELECT 
        CTV.CCTV_ID,
        PRESET_NO,	    -- PRESET번호
        ZOOM_VALUE,	    -- 줌값
        FOCUS_VALUE,	-- 초점값
        PAN_VALUE,	    -- 팬값
        TILT_VALUE,	    -- 틸트값
        PRESET_NM,	    -- PRESET명
        VIEW_LK_ID	    -- 조망LKID
    
    FROM TN_CCTV    CTV 
    LEFT JOIN TN_CCTV_PRESET PRS 
        ON CTV.CCTV_ID = PRS.CCTV_ID
    
    WHERE 
        CTV.CCTV_ID = :cctv_id
    AND CTV.INTD_CODE =:intdCode   
    ORDER BY 
        CTV.CCTV_ID DESC, 
        PRS.PRESET_NO ASC
    `
    const result = await sequelize.query(query,
        {
            replacements: { 
                cctv_id: req.params.cctvId,
                intdCode: req.user ? req.user.dataValues.insttId : ''
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true   
        })
    return result
}

const getCctvAlarmSetupHistory = async (params, req) => {
    const query = `
        SELECT 
            CHG.CHANGE_SN,
            CHG.CHANGE_DT,
            CHG.CCTV_ID,
            CHG.CHANGE_DTA_CODE,
            CHG.USER_ID,
            NVL(USR.USER_NM,'None') AS USER_NM,
            CHG.CHANGE_CN
        
        FROM TH_IA_MNGR_CHANGE CHG 
        LEFT JOIN TN_USER      USR ON CHG.USER_ID = USR.USER_ID
        WHERE 
            CHG.CCTV_ID = :cctvId
        ORDER BY CHANGE_DT DESC
        
    `
    const result = await sequelize.query(query, {
        replacements: { cctvId: params.cctvId },
        type: Sequelize.QueryTypes.SELECT,
        raw: true   
    })
    return result 
}

// CCTV > 알람 OFF 스케쥴 > 알람 OFF 리스트
const getCctvAlarOffSchedule = async (params, req) => {
    const query=`SELECT 
            ALS.CREAT_DT,
            ALS.CCTV_ID,
            ALS.ALAR_AT,
            ALS.ALAR_CYCLE_CODE,
            ALS.BEGIN_DE,
            NVL(ALS.BEGIN_HM, '0000') BEGIN_HM,
            ALS.END_DE,
            NVL(ALS.END_HM, '0000') END_HM,
            ALS.REPTIT_DOTW_NM,
            ALS.SCAN_SE_NM,
            ALS.EXCP_TIME_NM, 
            CTV.INSTL_LC,      --설치위치
            CTV.INSTL_LC_ABRV --설치위치약어
            
        FROM TH_IA_MNGR_ALAR_SETUP ALS
        LEFT JOIN TN_CCTV CTV ON CTV.CCTV_ID = ALS.CCTV_ID
        WHERE 
            AlS.ALAR_AT = 'N' 
        -- AND CTV.INTD_CODE =:intdCode  
        AND 
        (
            ( 
                  ALS.ALAR_CYCLE_CODE ='N' 
                  AND TO_DATE('${params.yyyymm}', 'YYYYMMDD') BETWEEN TO_DATE(NVL(ALS.BEGIN_DE,'19000101'),'YYYYMMDD') AND TO_DATE(NVL(ALS.END_DE, '19000101'),'YYYYMMDD')
                  --AND TO_DATE(TO_CHAR(SYSDATE, 'HH24MI'), 'HH24MI')  BETWEEN TO_DATE(NVL(ALS.BEGIN_HM,'0000'),'HH24MI') AND TO_DATE(NVL(ALS.END_HM,'0000'),'HH24MI')
            ) 
            OR 
            (
                ALS.ALAR_CYCLE_CODE ='D' 
                --AND TO_DATE(TO_CHAR(SYSDATE,'HH24MI'), 'HH24MI') BETWEEN TO_DATE(NVL(ALS.BEGIN_HM,'0000'), 'HH24MI') AND TO_DATE(NVL(ALS.END_HM,'0000'), 'HH24MI')
            
            )
            OR (
                ALAR_CYCLE_CODE ='W' 
                --AND TO_DATE(TO_CHAR(SYSDATE, 'HH24MI'), 'HH24MI') BETWEEN TO_DATE(NVL(ALS.BEGIN_HM, '0000'), 'HH24MI') AND TO_DATE(NVL(ALS.END_HM,'0000'),'HH24MI')
                AND REGEXP_LIKE(ALS.REPTIT_DOTW_NM, TO_CHAR(TO_DATE('${params.yyyymm}','YYYYMMDD'), 'dy', 'NLS_DATE_LANGUAGE=ENGLISH'))
            )
        )
        ORDER BY ALS.CCTV_ID DESC
        `

        const result = await sequelize.query(query, {
            replacements: { 
                intdCode: req.user.dataValues.insttId 
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true   
        })
        return result 
}
// cctv list > cctv관리 팝업> 알람 off 스케쥴
const getCctvOneAlarOffSchedule = async(params, req) => {
    const query=`
        SELECT 
            CCTV_ID,
            CREAT_DT,
            BEGIN_DE,
            BEGIN_HM,
            END_DE,
            END_HM,
            ALAR_CYCLE_CODE, --반복
            SCAN_SE_NM       --검지구분명

        FROM TH_IA_MNGR_ALAR_SETUP
        WHERE 
            alar_at ='N'
        AND CCTV_ID=:cctvId
        ORDER BY CREAT_DT DESC
    `
    const result = await sequelize.query(query, {
        replacements: { cctvId: params.cctvId },
        type: Sequelize.QueryTypes.SELECT,
        raw: true   
    })
    return result 
}
// cctv list > cctv관리팝업 알람 off스케쥴 > 알람 off 취소
const putCctvOneAlarOffSchedule = async(params, req) => {
    return sequelize.transaction(async t => {
        try {
            const query=`
                DELETE FROM 
                    TH_IA_MNGR_ALAR_SETUP 
                WHERE 
                    ALAR_AT ='N'
                AND CCTV_ID =:cctvId
                AND CREAT_DT = TO_TIMESTAMP('${params.creatDt}', 'YYYYMMDDHH24MISSFF3')
            `
            const res = await sequelize.query(query, {
                replacements: { 
                    cctvId: params.cctvId 
                },
                type: Sequelize.QueryTypes.DELETE,
                raw: true,
                transaction: t
            }).catch(error => {
                console.log(error)
            }) 

            const { changeSn } = await ThIaMngrChange.findOne({
                attributes : [
                    [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("CHANGE_SN")),0), "changeSn"]
                ]
                ,   raw : true
            })

            // history params
            const historyParam = {
                    changeSn: changeSn + 1,
                    changeDt: sequelize.literal('SYSDATE'),
                    cctvId: params.cctvId,    
                    changeDtaCode:'C',                         //변경자료코드
                    userId: req.user.dataValues.userId,        //사용자아이디
                    changeCn: '알람 OFF 취소'                   //변경내용
                }
            // 변경 로그
            const res2 = await ThIaMngrChange.create(historyParam, {transaction: t})
            
            return {code:'ok', data:res}
        } catch(error) {
            t.rollback()
            throw error
        }
    })
}
// CCTV > 알람ON 예외처리 취소
const putAlarmOnExceptionSchedule = async (req) => {
    return sequelize.transaction(async t => {
        try {
            const query=`
                DELETE FROM 
                    TH_IA_MNGR_ALAR_SETUP 
                WHERE 
                    ALAR_AT ='Y'
                AND CCTV_ID =:cctvId
                AND CREAT_DT = TO_TIMESTAMP('${req.body.creatDt}', 'YYYYMMDDHH24MISSFF3')
            `
            const res = await sequelize.query(query, {
                replacements: { 
                    cctvId: req.body.cctvId 
                },
                type: Sequelize.QueryTypes.DELETE,
                raw: true,
                transaction: t
            }).catch(error => {
                console.log(error)
            }) 

            const { changeSn } = await ThIaMngrChange.findOne({
                attributes : [
                    [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("CHANGE_SN")),0), "changeSn"]
                ]
                ,   raw : true
            })

            // history params
            const historyParam = {
                    changeSn: changeSn + 1,
                    changeDt: sequelize.literal('SYSDATE'),
                    cctvId: req.body.cctvId,    
                    changeDtaCode:'C',                         //변경자료코드
                    userId: req.user.dataValues.userId,        //사용자아이디
                    changeCn: '알람 ON예외 취소'                   //변경내용
                }
            // 변경 로그
            const res2 = await ThIaMngrChange.create(historyParam, {transaction: t})
            
            return {code:'ok', data:res}
        } catch(error) {
            t.rollback()
            throw error
        }
    })
}
// CCTV > 알람ON 예외처리
const getAlarmOnExceptionSchedule = async (req) => {
   const query=`
        SELECT 
            ALS.CREAT_DT,
            ALS.CCTV_ID,
            ALS.ALAR_AT,
            ALS.ALAR_CYCLE_CODE,
            ALS.BEGIN_DE,
            NVL(ALS.BEGIN_HM, '0000') BEGIN_HM,
            ALS.END_DE,
            NVL(ALS.END_HM, '0000') END_HM,
            ALS.REPTIT_DOTW_NM,
            ALS.SCAN_SE_NM,
            ALS.EXCP_TIME_NM, 
            CTV.INSTL_LC,      --설치위치
            CTV.INSTL_LC_ABRV --설치위치약어
            
        FROM TH_IA_MNGR_ALAR_SETUP ALS
        LEFT JOIN TN_CCTV CTV ON CTV.CCTV_ID = ALS.CCTV_ID
        WHERE 
            AlS.ALAR_AT = 'Y' 
        AND CTV.CCTV_ID =:cctvId
        
        ORDER BY ALS.CCTV_ID DESC
   ` 
//    --AND CTV.INTD_CODE =:intdCode    
//    --AND 
//    --(
//    --    ( 
//    --          ALS.ALAR_CYCLE_CODE ='N' 
//    --          AND SYSDATE BETWEEN TO_DATE(ALS.BEGIN_DE,'YYYYMMDD') AND TO_DATE(ALS.END_DE,'YYYYMMDD')
//    --          AND TO_CHAR(SYSDATE,'HH24MI') BETWEEN NVL(ALS.BEGIN_HM,'0000') AND NVL(ALS.END_HM,'0000')
//    --    ) 
//    --    OR 
//    --    (
//    --        ALS.ALAR_CYCLE_CODE ='D' 
//    --        AND TO_CHAR(SYSDATE,'HH24MI') BETWEEN NVL(ALS.BEGIN_HM,'0000') AND NVL(ALS.END_HM,'0000')
//    --    
//    --    )
//    --    OR (
//    --        ALAR_CYCLE_CODE ='W' 
//    --        AND TO_CHAR(SYSDATE,'HH24MI') BETWEEN NVL(ALS.BEGIN_HM,'0000') AND NVL(ALS.END_HM,'0000')
//    --        AND REGEXP_LIKE(ALS.REPTIT_DOTW_NM, to_char(sysdate, 'dy', 'NLS_DATE_LANGUAGE=ENGLISH'))
//    --    )
//    --)
    const result = await sequelize.query(query, {
            replacements: { 
                cctvId: req.params.cctvId,
                // intdCode: req.user.dataValues.insttId
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true   
        })
        return result 

}


// CCTV > 일괄알람 팝업 > 영상분석 매니저 알람 추가
const setCctvAlarSetup = (params, req) => {
    
    return sequelize.transaction(async t => {
        try {
            const inParam = params.cctvIds.map((cctvid,index) => {
                return {
                    alarAt: params.alarAt,
                    alarCycleCode: params.alarCycleCode,
                    beginDe: params.beginDe.replace(/-/g,""),
                    beginHm: params.beginHm,
                    endDe: params.endDe.replace(/-/g,""),
                    endHm: params.endHm,
                    reptitDotwNm: params.reptitDotwNm.join(","), 
                    // exceptScanSeNm: params.exceptScanSeNm.join(","), //알람 on일때
                    excpTimeNm: params.exceptTm.join(","),             //알람 on일때
                    scanSeNm: params.alarAt == 'Y' ? params.exceptScanSeNm.join(",") : params.scanSeNm.join(","),            
                    cctvId: cctvid,
                    creatDt:  sequelize.literal('SYSDATE'),
                }
            })

            // 일괄 알람 설정 설정 (insert)
            const res = await ThIaMngrAlarSetup.bulkCreate(inParam, {transaction: t })
            
            const { changeSn } = await ThIaMngrChange.findOne({
                attributes : [
                    [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("CHANGE_SN")),0), "changeSn"]
                ]
                ,   raw : true
            })
            // history params
            const historyParam = inParam.map((item, index) => {
                return {
                    changeSn: changeSn + (index + 1),
                    changeDt: sequelize.literal('SYSDATE'),
                    cctvId: item.cctvId,    
                    changeDtaCode:'C',                                      //변경자료코드
                    userId: req.user.dataValues.userId ,                    //사용자아이디
                    changeCn: params.alarAt =='Y' ? '알람 ON':'알람 OFF'     //변경내용
                }
            })

            // 변경 로그
            const res2 = await ThIaMngrChange.bulkCreate(historyParam, {transaction: t })
            
            return {code:'ok', data:res}
        } catch (error) {
            t.rollback()
            throw error
            // return {code:'error', message: error.message}
        }
        
        
    })
}
// cctv > cctv 관리팝업 > 이벤트이력
const getCctvAlarmEventHistory = async (params, req) => {
    const query = `
        SELECT 
            CTV.CCTV_ID, 			            -- 검지일시	    
            SCN.SCAN_DT, 			            -- 검지일시	
            SCN.SCAN_GRAD, 			            -- 검지등급
            SCN.SCAN_DRC_CODE,                  -- 검지방향코드
            SCN.PRCPT_STLE_CODE,                -- 강수형태코드	

            CASE WHEN SCN.SCAN_RESULT_CODE = '002' THEN '정검지' 
                 WHEN SCN.SCAN_RESULT_CODE = '003' THEN '오검지'
                 ELSE '기타' 
                END  SCAN_RESULT_DTL_CODE,
            SCN.SCAN_RESULT_CODE, 	            -- 검지결과코드 T.IA_EVENT_LCLAS_CODE	영상분석이벤트대분류의 정검지(002)/오검지(003) 구분

            SCN.SCAN_DETAIL_TY_CODE,            -- 검지유형코드
            SCN.SCAN_RESULT_MEMO_CN,            -- 검지상세유형코드
            SCN.SCAN_DETAIL_ETC_CN,             -- 검지상세기타내용
            SCN.SCD_SCAN_RLABLTY,               -- 2차검지신뢰도
            SCN.SCAN_TY_CODE,                   -- 검지유형코드
            SCN.SCD_SCAN_TY_CODE,               -- 2차검지유형코드	
            DCD.DETAIL_CODE_NM SCD_SCAN_TY_NM,  -- 2차검지유형
            SCN.SCD_SCAN_DT, 		            -- 2차검시일시	
            CASE 
                WHEN 
                    SCN.SCAN_TY_CODE = SCN.SCD_SCAN_TY_CODE
                THEN '일치' ELSE '불일치' 
            END       IS_SCAN_TY_CODE

        FROM TN_CCTV CTV 
        LEFT JOIN TH_IA_MNGR_SCAN SCN ON CTV.CCTV_ID = SCN.CCTV_ID 
        LEFT JOIN TN_CMMN_DETAIL_CODE DCD ON  SCN.SCD_SCAN_TY_CODE = DCD.DETAIL_CODE_ID
            AND DCD.CODE_ID = 'SCAN_TY_CODE'
            AND DCD.USE_AT	= 'Y'

        WHERE SCN.SCAN_RESULT_CODE IS NOT NULL
          AND CTV.CCTV_ID =:cctvId

        ORDER BY SCN.SCAN_DT DESC
    `
    const result = await sequelize.query(query, {
        replacements: { 
            cctvId: params.cctvId
            // intdCode: req.user.dataValues.insttId
        },
        type: Sequelize.QueryTypes.SELECT,
        raw: true   
    })
    return result 
}
// cctv관리 > 분석 설정
const getCctvAnalysis = async (req) => {
    query = `
        SELECT 
            ANALS_CND_CODE,
            ANALS_AT 
        FROM TN_IA_MNGR_ANALS_SETUP 
        WHERE CCTVID =:cctvId
    `
    const result = await sequelize.query(query, {
        replacements: { 
            cctvId: req.params.cctvId,
        },
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
    })
    return result
}
const putCctvAnalysis = async (req) => {
    return sequelize.transaction(async t => {
        try {
            for (key of Object.keys(req.body.analysis)) {
                const query = `
                    MERGE INTO TN_IA_MNGR_ANALS_SETUP 
                    USING DUAL 
                    
                    ON ( 
                            CCTVID =:cctvId 
                        AND ANALS_CND_CODE =:analsCndCode
                    )
                    WHEN MATCHED THEN
                        UPDATE SET 
                            ANALS_AT=:analsAt 
                            
                    WHEN NOT MATCHED THEN
                        INSERT (
                            CCTVID,
                            ANALS_CND_CODE,
                            ANALS_AT
                        ) VALUES (
                            :cctvId,
                            :analsCndCode,
                            :analsAt
                        )
                `

                const result = await sequelize.query(query, {
                    replacements: { 
                        cctvId: req.body.cctvId,
                        analsCndCode:key,
                        analsAt: req.body.analysis[key]
                    },
                    type: Sequelize.QueryTypes.UPSERT,
                    raw: true,
                    t
                })
            }

            const { changeSn } = await ThIaMngrChange.findOne({
                attributes : [
                    [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("CHANGE_SN")),0), "changeSn"]
                ]
                ,   raw : true
            })

            // history params
            const historyParam = {
                    changeSn: changeSn + 1,
                    changeDt: sequelize.literal('SYSDATE'),
                    cctvId: req.body.cctvId,    
                    changeDtaCode:'C',                         //변경자료코드
                    userId: req.user.dataValues.userId,        //사용자아이디
                    changeCn: '분석설정 적용'                   //변경내용
                }
            // 변경 로그
            const res2 = await ThIaMngrChange.create(historyParam, {t})
            t.commit()
            return {code: 'ok', message: {}}
        } catch (error) {

            throw eror
        }
    })

}

module.exports = {
    getCctvList,
    getCctvInfo,
    getCctvPreset,
    setCctvAlarSetup,
    getCctvAlarOffSchedule,
    getCctvOneAlarOffSchedule,
    putCctvOneAlarOffSchedule,
    getAlarmOnExceptionSchedule,
    putAlarmOnExceptionSchedule,
    getCctvAlarmSetupHistory,
    getCctvAlarmEventHistory,
    getCctvAnalysis,
    putCctvAnalysis
}