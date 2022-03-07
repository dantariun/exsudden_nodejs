const { TnIaMngrEvent, ThIaMngrScan , Sequelize, sequelize } = require("../../models");

// 통계 > 소속 CCTV 목록 조회
const getCctvList = async(req) => {
    
    try {
        return await sequelize.query(
            "SELECT HIMS.CCTV_ID CCTVID, TC.INSTL_LC_ABRV CCTVNM"
            + " FROM TH_IA_MNGR_SCAN HIMS"
            + " INNER JOIN TN_CCTV TC"
                + " ON HIMS.CCTV_ID = TC.CCTV_ID"
            + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
	            + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
            + " WHERE TC.INTD_CODE = :intdCd"
            + " GROUP BY HIMS.CCTV_ID, TC.INSTL_LC_ABRV"
            + " ORDER BY HIMS.CCTV_ID"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                }
            }
        )
    } catch (err) {
        console.error(err);
        return '';
    }

}

// 통계 > 검지 정확도 (1차/2차)
const getScanAccuracy = async (req) => {
    var cctvSearchQuery = " ";         // CCTV ID 검색
    var params = req.query;
    var scanResultCodeMi= ""
    var scanResultCodeDta = "";
    var scanWhereCodeDta = "";
    var scanGroupCodeDta = "";
    
    // 특정 CCTV를 조회시!
    if(params.cid !="" && params.cid != null && params.cid != undefined) {
        cctvSearchQuery = " AND A.CCTV_ID ='"+params.cid+"'"
    }

    // 차수(1차/2차)- 검지결과 컬럼
    if(params.ord == 1) {   // 1차 검지정확도 조회 컬럼
        scanResultCodeDta =" SELECT TO_CHAR(A.SCAN_DT,'YYYY-MM-DD')	AS SCAN_DT"
        scanResultCodeDta += " , A.SCAN_RESULT_CODE"
        scanResultCodeDta += " , SUM(CASE WHEN A.SCAN_RESULT_CODE ='002' THEN 1 ELSE 0 END ) AS JUNG_RESULT_CODE"
        scanResultCodeDta += " , SUM(CASE WHEN A.SCAN_RESULT_CODE = '003' THEN 1 ELSE 0 END) AS OA_RESULT_CODE"

        // 1차검지정확도 where 절
        scanWhereCodeDta = " WHERE  A.SCAN_RESULT_CODE IN ('002','003')"    
        
        // 1차검지정확도 group by
        scanGroupCodeDta ="  GROUP BY TO_CHAR(A.SCAN_DT,'YYYY-MM-DD')"
        scanGroupCodeDta += " , A.SCAN_RESULT_CODE"
    } else {
        // 2차 검지정확도 조회
        scanResultCodeDta =" SELECT TO_CHAR(A.SCD_SCAN_DT,'YYYY-MM-DD')	AS SCAN_DT"
        scanResultCodeDta += " , (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END) AS SCAN_RESULT_CODE"
        scanResultCodeDta += " , SUM(CASE WHEN (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END) ='002' THEN 1 ELSE 0 END) AS JUNG_RESULT_CODE"
        scanResultCodeDta += " , SUM(CASE WHEN (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END) ='003' THEN 1 ELSE 0 END) AS OA_RESULT_CODE"
        scanResultCodeDta += " , SUM(CASE WHEN (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END) ='000' THEN 1 ELSE 0 END) AS MI_RESULT_CODE"
        // 미검지
        scanResultCodeMi = " , NVL(SUM(DTA.MI_RESULT_CODE),0)		AS MI_RESULT_CODE"      

        // 2차검지정확도 where 절
        scanWhereCodeDta = " WHERE A.SCD_SCAN_DT IS NOT NULL"
        scanWhereCodeDta += " AND (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END) IN ('000','002','003')"        
        
        // 2차검지정확도 group by
        scanGroupCodeDta ="  GROUP BY TO_CHAR(A.SCD_SCAN_DT,'YYYY-MM-DD')"
        scanGroupCodeDta += " , (CASE WHEN A.SCD_SCAN_TY_CODE IN ('001','002','003') THEN A.SCAN_RESULT_CODE ELSE '000' END)"
    }
    
    return await sequelize.query(
         " SELECT PDT.DT AS SCAN_DT"
        +" , NVL(SUM(DTA.JUNG_RESULT_CODE),0) AS JUNG_RESULT_CODE"
        +" , NVL(SUM(DTA.OA_RESULT_CODE),0) AS OA_RESULT_CODE"
        +" , NVL(SUM(DTA.DT_TOTAL_CNT),0) AS DT_TOTAL_CNT"
        + scanResultCodeMi
        +" FROM ("
            +  scanResultCodeDta
            +" , COUNT(A.SCAN_RESULT_CODE)	AS DT_TOTAL_CNT"
            +" FROM TH_IA_MNGR_SCAN A"
            +" INNER JOIN TN_CCTV B"
            +" ON A.CCTV_ID = B.CCTV_ID"
            +" INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION C"
            +" ON B.CCTV_ID = C.CCTV_ID"
            + scanWhereCodeDta
            +" AND  B.INTD_CODE = :intdCd"
            + cctvSearchQuery            
            + scanGroupCodeDta
        +" ) DTA,"
        +" ("
            +" SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
            +" FROM DUAL"
            +" CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
        +" ) PDT"
        +" WHERE PDT.DT = DTA.SCAN_DT(+)"
        +" GROUP BY PDT.DT"
        +" ORDER BY PDT.DT"
        , {
            replacements: {
                intdCd : params.intdCd,
                stdt :  params.stdt,
                eddt :  params.eddt
            }
        }
    )
}

const getScanResultCompare = async (req) => {
    try {
        let cctvIdAdd;

        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = " AND A.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT SUM((CASE WHEN A.SCAN_TY_CODE = A.SCD_SCAN_TY_CODE THEN 1 ELSE 0 END))  AS ACCORD"
            + " , SUM((CASE WHEN A.SCAN_TY_CODE = A.SCD_SCAN_TY_CODE THEN 0 ELSE 1 END))  AS DISCORD"
            + " FROM TH_IA_MNGR_SCAN A"
            + " INNER JOIN TN_CCTV B"
                + " ON A.CCTV_ID = B.CCTV_ID"
            + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION C"
                + " ON B.CCTV_ID = C.CCTV_ID"
            + " WHERE A.SCD_SCAN_DT IS NOT NULL"
                + " AND A.SCAN_RESULT_CODE IS NOT NULL"
                + " AND B.INTD_CODE = :intdCd"
                + " AND A.SCD_SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt
                }
            }
        )

    } catch(err) {
        console.error(err);
        return '';
    }
}

// 통계 > 검지등급 비교
const getScanGradeCompare = async (req) => {
    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = " AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT DTLS.DT AS SCANDT"
                + " , NVL(SUM(CASE WHEN DALS.SCAN_GRAD = 1 THEN DALS.CNT END), 0) AS GRADONE"
                + " , NVL(SUM(CASE WHEN DALS.SCAN_GRAD = 2 THEN DALS.CNT END), 0) AS GRADTWO"
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') SCAN_DT, TIMS.SCAN_GRAD, COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
	                + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_RESULT_CODE = :secd"
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD'), TIMS.SCAN_GRAD"
            + " ) DALS,"
            + " ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DTLS.DT = DALS.SCAN_DT(+)"
            + " GROUP BY DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd
                }
            }
        );
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 통계 > 검지유형별 검지등급 비교
const getScanTypeGrade = async (req) => {
    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = " AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT SCAN_TY_CODE SCANCD, SCAN_TY_CODE_NM SCANNM, NVL(GRADONE, 0) GRADONE, NVL(GRADTWO, 0) GRADTWO"
            + " FROM ("
                + " SELECT TIMS.SCAN_GRAD"
                    + " , TIMS.SCAN_TY_CODE"
                    + " , (CASE WHEN TIMS.SCAN_TY_CODE = '001' THEN '정지차량' WHEN TIMS.SCAN_TY_CODE = '002' THEN '역주행' WHEN TIMS.SCAN_TY_CODE = '003' THEN '보행자' END) AS SCAN_TY_CODE_NM"
                    + " , COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
	                + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_RESULT_CODE = :secd"
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TIMS.SCAN_GRAD, TIMS.SCAN_TY_CODE"
            + " )"
            + " PIVOT ("
                + " SUM(CNT)"
                + " FOR SCAN_GRAD IN (1 AS GRADONE, 2 AS GRADTWO)"
            + " )"
            + " ORDER BY SCAN_TY_CODE"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd
                }
            }
        );
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 통계 > 차수별 검지구분 비교
const getScanOrder = async (req) => {
    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = " AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        var order = req.query.ord
        var srchColumn = "SCAN_TY_CODE";

        if(order == 2) {
            srchColumn = "SCD_SCAN_TY_CODE"
        }

        return await sequelize.query(
            "SELECT DTLS.DT AS SCANDT"
                + " , NVL(SUM(CASE WHEN DALS." + srchColumn + " = '001' THEN DALS.CNT END), 0) AS STOPVHCLE"
                + " , NVL(SUM(CASE WHEN DALS." + srchColumn + " = '002' THEN DALS.CNT END), 0) AS RVRS"
                + " , NVL(SUM(CASE WHEN DALS." + srchColumn + " = '003' THEN DALS.CNT END), 0) AS PDTRN"
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCAN_DT, TIMS." + srchColumn + ", COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
	                + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_RESULT_CODE = :secd"
                    + " AND TIMS." + srchColumn + " IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD'), TIMS." + srchColumn
            + " ) DALS,"
            + " ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DTLS.DT = DALS.SCAN_DT(+)"
            + " GROUP BY DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd
                }
            }
        );
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 통계 > 등급별 검지구분 비교
const getScanGrade = async (req) => {

    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = " AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT DTLS.DT AS SCANDT"
                + ", NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '001' THEN DALS.CNT END), 0) AS STOPVHCLE" // 정지차량
                + ", NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '002' THEN DALS.CNT END), 0) AS RVRS" // 역주행
                + ", NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '003' THEN DALS.CNT END), 0) AS PDTRN" // 보행자
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCAN_DT, TIMS.SCAN_TY_CODE, COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
	                + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_RESULT_CODE = :secd" // 검지구분 정-002, 오-003
                    + " AND TIMS.SCAN_GRAD = :grad" // 검지등급 1, 2
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD'), TIMS.SCAN_TY_CODE"
            + " ) DALS,"
            + " ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DTLS.DT = DALS.SCAN_DT(+)"
            + " GROUP BY DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd,
                    grad : req.query.grad
                }
            }
        );
    } catch (err) {
        console.error(err);
        return;
    }
}

// 통계 > 검지유형별 상세유형비교
// secd: 검지구분 코드, tycd: 검지유형 코드, stdt: 시작 날짜, eddt: 끝 날짜, cid: cctvId
const getScanTypeDtl = async(req) => {

    try {
        let cctvIdAdd;

        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = "AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT RWLS.DT AS DT, RWLS.IA_EVENT_SCLAS_CODE AS SCLASCD, NVL(DALS.CNT, 0) AS CNT "
            + "FROM "
            + "( "
                + "SELECT DT, IA_EVENT_SCLAS_CODE "
                + "FROM ( "
                    + "SELECT IA_EVENT_SCLAS_CODE, IA_EVENT_SCLAS_NM "
                    + "FROM TN_IA_MNGR_EVENT "
                    + "WHERE IA_EVENT_LCLAS_CODE = :secd "
                        + "AND IA_EVENT_MLSFC_CODE = :tycd "
                    + "UNION "
                    + "SELECT 'ETC' IA_EVENT_SCLAS_CODE, '기타' IA_EVENT_SCLAS_NM "
                    + "FROM TN_IA_MNGR_EVENT "
                + "), "
                + "( "
                    + "SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT "
                    + "FROM DUAL "
                    + "CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1) "
                    + ") "
            + ") RWLS "
            + "LEFT OUTER JOIN "
            + "( "
                + "SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCAN_DT, TIMS.SCAN_DETAIL_TY_CODE, COUNT(*) AS CNT "
                + "FROM TH_IA_MNGR_SCAN TIMS "
                + "INNER JOIN TN_CCTV TC "
                    + "ON TIMS.CCTV_ID = TC.CCTV_ID "
                + "INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC "
	                + "ON TC.CCTV_ID = TIPCC.CCTV_ID "
                + "WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1 "
                    + cctvIdAdd
                    + "AND TC.INTD_CODE = :intdCd "
                    + "AND TIMS.SCAN_RESULT_CODE = :secd "
                    + "AND TIMS.SCAN_TY_CODE = :tycd "
                    + "AND TIMS.SCAN_DETAIL_TY_CODE IS NOT NULL "
                    + "GROUP BY TIMS.SCAN_DETAIL_TY_CODE, TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') "
                + "ORDER BY SCAN_DT "
            + ") DALS "
                + "ON DALS.SCAN_DT = RWLS.DT "
                + "AND DALS.SCAN_DETAIL_TY_CODE = RWLS.IA_EVENT_SCLAS_CODE "
            + "ORDER BY RWLS.IA_EVENT_SCLAS_CODE, RWLS.DT "
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd,
                    tycd : req.query.tycd
                }
            }
        );
    } catch (err) {
        console.error(err);
        return;
    }
}

// 통계 > 환경요소 상세유형비교
const getScanTypeEnvrnDtl = async(req) => {

    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = "AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT RWLS.DT AS DT, RWLS.IA_EVENT_SCLAS_CODE AS SCLASCD, NVL(DALS.CNT, 0) AS CNT "
            + "FROM "
            + "("
                + "SELECT DT, NIME.IA_EVENT_SCLAS_CODE "
                + "FROM TN_IA_MNGR_EVENT NIME, "
                + "("
                    + "SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT "
                    + "FROM DUAL "
                    + "CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1) "
                + ")"
                + "WHERE IA_EVENT_LCLAS_CODE = :secd "
                    + "AND IA_EVENT_MLSFC_CODE = :tycd "
            + ") RWLS "
            + "LEFT OUTER JOIN "
            + "( "
                + "SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCAN_DT, TIMS.ENVRN_FACTOR_CODE, COUNT(*) AS CNT "
                + "FROM TH_IA_MNGR_SCAN TIMS "
                + "INNER JOIN TN_CCTV TC "
                    + "ON TIMS.CCTV_ID = TC.CCTV_ID "
                + "INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC "
	                + "ON TC.CCTV_ID = TIPCC.CCTV_ID "
                + "WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1 "
                    + cctvIdAdd
                    + "AND TC.INTD_CODE = :intdCd "
                    + "AND TIMS.SCAN_RESULT_CODE = '003' "
                    + "AND TIMS.ENVRN_FACTOR_CODE IS NOT NULL "
                    + "AND TIMS.SCAN_DETAIL_TY_CODE IS NOT NULL "
                + "GROUP BY TIMS.ENVRN_FACTOR_CODE, TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') "
                + "ORDER BY SCAN_DT "
            + ") DALS "
                + "ON DALS.SCAN_DT = RWLS.DT "
                + "AND DALS.ENVRN_FACTOR_CODE = RWLS.IA_EVENT_SCLAS_CODE "
            + "ORDER BY RWLS.IA_EVENT_SCLAS_CODE, RWLS.DT "
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt,
                    secd : req.query.secd,
                    tycd : req.query.tycd
                }
            }
        );
    } catch (err) {
        console.error(err);
        return;
    }
}

// 통계 > 1급 상황대비 알람 건수 - 1급 전체 count
const getScanGradeAlarmTotal = async (req) => {    
    try {

        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = "AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT DTLS.DT, NVL(DALS.CNT, 0) CNT"
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCANDT, COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
                    + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_GRAD = 1"
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD')"
            + " ) DALS"
            + " , ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DALS.SCANDT(+) = DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt
                }
            }
        )
    } catch(err) {
        console.error(err);
        return;
    }
}

// 통계 > 1급 상황대비 알람 건수 - 알람 count
const getScanGradeAlarm = async (req) => {
    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = "AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT DTLS.DT, NVL(DALS.CNT, 0) CNT"
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCANDT, COUNT(*) AS CNT"
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
                    + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " INNER JOIN TH_OUTBRK_ALAR_ATMC_SCAN TOAAS"
                    + " ON TIMS.SCAN_DT = TOAAS.SCAN_DT"
                    + " AND TIMS.CCTV_ID = TOAAS.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_GRAD = 1"
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD')"
            + " ) DALS"
            + " , ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DALS.SCANDT(+) = DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt
                }
            }
        )
    } catch(err) {
        console.error(err);
        return;
    }
}

// 통계 > 검지구분 알람 건수
const getScanTypeAlarm = async (req) => {    
    try {
        let cctvIdAdd;
        //&& req.params.cId != null && req.params.cId != undefined
        if(req.query.cid == "") {
            cctvIdAdd = "";
        } else {
            cctvIdAdd = "AND TIMS.CCTV_ID = '" + req.query.cid + "'";
        }

        return await sequelize.query(
            "SELECT DTLS.DT SCANDT"
                + " , NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '001' THEN DALS.CNT END), 0) AS STOPVHCLE"
                + " , NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '002' THEN DALS.CNT END), 0) AS RVRS"
                + " , NVL(SUM(CASE WHEN DALS.SCAN_TY_CODE = '003' THEN DALS.CNT END), 0) AS PDTRN"
            + " FROM ("
                + " SELECT TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD') AS SCANDT"
                    + " , TIMS.SCAN_TY_CODE"
                    + ' , COUNT(*) AS CNT'
                + " FROM TH_IA_MNGR_SCAN TIMS"
                + " INNER JOIN TN_CCTV TC"
                    + " ON TIMS.CCTV_ID = TC.CCTV_ID"
                + " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION TIPCC"
                    + " ON TC.CCTV_ID = TIPCC.CCTV_ID"
                + " INNER JOIN TH_OUTBRK_ALAR_ATMC_SCAN TOAAS"
                    + " ON TIMS.SCAN_DT = TOAAS.SCAN_DT"
                    + " AND TIMS.CCTV_ID = TOAAS.CCTV_ID"
                + " WHERE TIMS.SCAN_DT BETWEEN TO_DATE(:stdt, 'YYYY-MM-DD') AND TO_DATE(:eddt, 'YYYY-MM-DD') + 1"
                    + cctvIdAdd
                    + " AND TC.INTD_CODE = :intdCd"
                    + " AND TIMS.SCAN_GRAD = 1"
                    + " AND TIMS.SCAN_TY_CODE IN ('001', '002', '003')"
                + " GROUP BY TO_CHAR(TIMS.SCAN_DT, 'YYYY-MM-DD'), TIMS.SCAN_TY_CODE"
            + " ) DALS"
            + " , ("
                + " SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') AS DT"
                + " FROM DUAL"
                + " CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
            + " ) DTLS"
            + " WHERE DTLS.DT = DALS.SCANDT(+)"
            + " GROUP BY DTLS.DT"
            + " ORDER BY DTLS.DT"
            , {
                replacements: {
                    intdCd : req.query.intdCd,
                    stdt : req.query.stdt,
                    eddt : req.query.eddt
                }
            }
        )
    } catch(err) {
        console.error(err);
        return;
    }
}

// get date list
const getDateList = async (req) => {
    return await sequelize.query(
        "SELECT TO_CHAR(TO_DATE(:stdt, 'YYYY-MM-DD') + LEVEL - 1, 'YYYY-MM-DD') dt "
        + "FROM DUAL "
        + "CONNECT BY LEVEL <= (TO_DATE(:eddt, 'YYYY-MM-DD') - TO_DATE(:stdt, 'YYYY-MM-DD') + 1)"
        ,{
            replacements: {
                stdt : req.query.stdt,
                eddt : req.query.eddt,
            }
        }
    )
}

// get type code list add ETC
const getTypeCodeList = async (req) => {
    return await sequelize.query(
        "SELECT IA_EVENT_SCLAS_CODE sclasCd, IA_EVENT_SCLAS_NM sclasNm "
        + "FROM TN_IA_MNGR_EVENT "
        + "WHERE IA_EVENT_LCLAS_CODE = :secd "
            + "AND IA_EVENT_MLSFC_CODE = :tycd "
        + "UNION "
        + "SELECT 'ETC' IA_EVENT_SCLAS_CODE, '기타' IA_EVENT_SCLAS_NM "
        + "FROM TN_IA_MNGR_EVENT "
        + "ORDER BY sclasCd"
        ,{
            replacements: {
                secd : req.query.secd,
                tycd : req.query.tycd
            }
        }
    )
}

// get type code list
const getTypeCodeListEnvrn = async (req) => {
    return await sequelize.query(
        "SELECT IA_EVENT_SCLAS_CODE sclasCd, IA_EVENT_SCLAS_NM sclasNm "
        + "FROM TN_IA_MNGR_EVENT "
        + "WHERE IA_EVENT_LCLAS_CODE = :secd "
            + "AND IA_EVENT_MLSFC_CODE = :tycd "
        + "ORDER BY IA_EVENT_SCLAS_CODE"
        ,{
            replacements: {
                secd : req.query.secd,
                tycd : req.query.tycd
            }
        }
    );
}

module.exports = {
    getCctvList,
    getScanAccuracy,
    getScanResultCompare,
    getScanGradeCompare,
    getScanTypeGrade,
    getScanOrder,
    getScanGrade,
    getScanTypeDtl,
    getScanTypeEnvrnDtl,
    getScanGradeAlarmTotal,
    getScanGradeAlarm,
    getScanTypeAlarm,
    getDateList,
    getTypeCodeList,
    getTypeCodeListEnvrn
}
