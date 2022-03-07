const {ThIaMngrScan, sequelize ,Sequelize } = require("../../models");
const Op = Sequelize;

// 이벤트 목록 조회
const getEventList = (params) => {
    var queryList = "SELECT A.SCAN_GRAD"        
    +   " ,		A.CCTV_ID"
    +   " ,		B.INTD_CODE"
    +   " ,		B.INSTL_LC"
    +   " ,		B.INSTL_LC_ABRV"    
    +   " ,		TO_CHAR(A.SCAN_DT,'YYYY-MM-DD HH24:MI:SS') AS SCAN_DT"
    +   " ,		A.SCAN_TY_CODE"
    +   " ,		C.DETAIL_CODE_NM    AS SCAN_TY_CODE_NM"
    +   " ,		A.SCD_SCAN_TY_CODE"
    +   " ,		NVL(E.DETAIL_CODE_NM,'N/A')  AS SCD_SCAN_TY_CODE_NM"
    +   " ,		A.SCAN_DRC_CODE"
    +   " ,		D.DETAIL_CODE_NM AS SCAN_DRC_CODE_NM" 
    +   " ,		A.SCAN_DRC_CODE  AS SCD_SCAN_DRC_CODE"
    +   " ,		D.DETAIL_CODE_NM AS SCD_SCAN_DRC_CODE_NM"        
    +   " ,		(CASE WHEN A.SCAN_TY_CODE = A.SCD_SCAN_TY_CODE THEN 'Y' ELSE 'N' END) AS SCAN_TY_DIV"
    +   " FROM TH_IA_MNGR_SCAN A"
    +   " INNER JOIN TN_CCTV B"
    +   " ON A.CCTV_ID = B.CCTV_ID"
    +   " LEFT OUTER JOIN TN_CMMN_DETAIL_CODE C"
    +   " ON  A.SCAN_TY_CODE	=	C.DETAIL_CODE_ID"
    +   " AND C.CODE_ID		=	'SCAN_TY_CODE'"
    +   " AND C.USE_AT		=	'Y'"
    +   " LEFT OUTER JOIN TN_CMMN_DETAIL_CODE D"
    +   " ON A.SCAN_DRC_CODE = D.DETAIL_CODE_ID"
    +   " AND D.CODE_ID		=	'SCAN_DRC_CODE'"
    +   " AND D.USE_AT		=	'Y'"
    +   " LEFT OUTER JOIN TN_CMMN_DETAIL_CODE E"
    +   " ON  A.SCD_SCAN_TY_CODE	=	E.DETAIL_CODE_ID"
    +   " AND E.CODE_ID		=	'SCAN_TY_CODE'"
    +   " AND E.USE_AT		=	'Y'"
    +   " INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION F"
    +   " ON B.CCTV_ID = F.CCTV_ID"
    +   " WHERE B.INTD_CODE = '"+params.intdCode+"'"
    +   " AND	A.SCAN_RESULT_CODE IS NULL "
    +   " AND 	(A.SCD_SCAN_DT IS NOT NULL OR NVL(A.SCD_SCAN_DT,'') !='')"
    
    // 1. 검지유형이 전체가 아닐때
    if(params.searchScanTyCode != "all")
    {
        switch (params.searchStatus) {
            case "1" :
                queryList += " AND A.SCAN_TY_CODE = '"+params.searchScanTyCode+"'"
                break;
            case "2" :
                queryList += " AND A.SCD_SCAN_TY_CODE = '"+params.searchScanTyCode+"'"
            default: queryList += " AND (A.SCAN_TY_CODE = '"+params.searchScanTyCode+"' OR A.SCD_SCAN_TY_CODE = '"+params.searchScanTyCode+"')"
                break;
        }
    }
    // 2. 검지방향이 전체가 아닐 때 
    if(params.searchScanDrcCode != "all")
    {
        queryList += " AND A.SCAN_DRC_CODE = '"+params.searchScanDrcCode+"'"
    }

    if(params.searchType == "L")
    {
        queryList += " ORDER BY A.SCAN_DT ASC"
    }    
    else 
    {
        if(params.currOrder == "INSTL_LC_ABRV")
        {
            queryList += " ORDER BY B."+params.currOrder+" "+params.currOrderAlign
        }
        else if(params.currOrder == "SCD_SCAN_DRC_CODE")
        {
            queryList += " ORDER BY A.SCAN_DRC_CODE "+params.currOrderAlign
        }
        else if(params.currOrder == "SCAN_TY_DIV")
        {
            queryList += " ORDER BY (CASE WHEN A.SCAN_TY_CODE = A.SCD_SCAN_TY_CODE THEN 'Y' ELSE 'N' END) "+params.currOrderAlign            
        }
        else
        {
            queryList += " ORDER BY A."+params.currOrder+" "+params.currOrderAlign
        }
    }
    
    return sequelize.query(queryList)
}
// 이벤트 팝업 호출 데이터
const getEventDetail = (params) =>{
    var queryList = "SELECT 	A.CCTV_ID"         //  CCTV_ID
    +" ,        TO_CHAR(A.SCAN_DT,'YYYY-MM-DD HH24:MI:SS') AS SCAN_DT"              //   검지일시    
    +" ,		B.INTD_CODE"                        // 지방청코드
    +" ,		B.INSTL_LC"                        // 설치위치
    +" ,		B.INSTL_LC_ABRV"                  // 설치위치약어
    +" ,		A.SCAN_GRAD"                       // 검지등급
    +" ,		A.PRCPT_STLE_CODE"                // 강수형태코드
    +" ,		NVL((SELECT DETAIL_CODE_NM FROM TN_CMMN_DETAIL_CODE WHERE CODE_ID='PRCPT_STLE_CODE' AND DETAIL_CODE_ID = A.PRCPT_STLE_CODE),'없음') AS PRCPT_SITE_NAME"                // 강수형태코드명
    +" ,		CASE"
    +" 		    WHEN A.SCAN_DT BETWEEN TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNRISE_HM),'00'),'YYYY-MM-DD HH24:MI:SS') - 30/(24*60) AND TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNRISE_HM),'00'),'YYYY-MM-DD HH24:MI:SS') + 30/(24*60)  THEN '일출'"
    +" 		    WHEN A.SCAN_DT BETWEEN TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNRISE_HM),'00'),'YYYY-MM-DD HH24:MI:SS') + 30/(24*60) AND TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNSET_HM),'00'),'YYYY-MM-DD HH24:MI:SS') - 30/(24*60) THEN '주간'"
    +" 	    	WHEN A.SCAN_DT BETWEEN TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNSET_HM),'00'),'YYYY-MM-DD HH24:MI:SS') - 30/(24*60) AND  TO_DATE(CONCAT(CONCAT(TO_CHAR(A.SCAN_DT,'YYYYMMDD'),C.SUNSET_HM),'00'),'YYYY-MM-DD HH24:MI:SS') + 30/(24*60) THEN '일몰'"
    +" 		    ELSE '야간'"
    +" 		    END 		AS NIGHT_TIME"
    +" ,		CASE"
    +" 		    WHEN TO_CHAR(A.SCAN_DT,'MM') IN ('11','12','01','02')  THEN '겨울'"
    +" 		    WHEN TO_CHAR(A.SCAN_DT,'MM') IN ('03','04','05')	   THEN '봄'"
    +" 	    	WHEN TO_CHAR(A.SCAN_DT,'MM') IN ('06','07''08')		   THEN '여름'"
    +" 		    ELSE '가을'"
    +" 		    END 		AS SEASON_NM"
    +" ,		A.SCAN_XCORD"
    +" ,		A.SCAN_YCORD"
    +" ,		A.SCAN_BT"
    +" ,		A.SCAN_HG"
    +" ,		A.SCAN_RLABLTY"
    +" ,		A.SCAN_VIDO_URL"
    +" ,		A.SCAN_DRC_CODE"
    +" ,		A.SCAN_TY_CODE"    
    +" ,        (SELECT DETAIL_CODE_NM FROM TN_CMMN_DETAIL_CODE WHERE CODE_ID='SCAN_TY_CODE' AND DETAIL_CODE_ID = A.SCAN_TY_CODE AND USE_AT='Y') AS SCAN_TY_CODE_NM"    
    +" ,		A.SCAN_RESULT_CODE"
    +" ,		A.SCAN_DETAIL_TY_CODE"
    +" ,		A.SCAN_DETAIL_ETC_CN"
    +" ,		A.SCAN_RESULT_MEMO_CN"
    +" ,		A.ALAR_PRVN_TIME"
    +" ,		A.ENVRN_FACTOR_CODE"
    +" ,		A.ENVRN_FACTOR_ETC_CN"
    +" ,		A.SCD_SCAN_TY_CODE"
    +" ,		A.SCD_SCAN_DT"
    +" ,		A.SCD_SCAN_RLABLTY"
    +" FROM TH_IA_MNGR_SCAN A"
    +" INNER JOIN TN_CCTV B"
    +" ON A.CCTV_ID = B.CCTV_ID"
    +" LEFT OUTER JOIN TN_IA_MNGR_NIGHT_SETUP C"
    +" ON TO_CHAR(A.SCAN_DT,'MM') = C.STDMT"
    +" INNER JOIN TN_IA_PROCS_CCTV_COMPOSITION D"
    +" ON B.CCTV_ID = D.CCTV_ID"
    +" WHERE A.CCTV_ID ='"+ params.cctvId +"'"
    +" AND   TO_CHAR(A.SCAN_DT,'YYYY-MM-DD HH24:MI:SS') = '"+params.scanDt+"'"
    +" AND   B.INTD_CODE = '"+params.intdCode+"'"
    
    return sequelize.query(queryList);
}

// 이벤트 저장
const setEventInfo = async(params) =>{
    var updateQuery = "UPDATE TH_IA_MNGR_SCAN"
    updateQuery +=   " SET   SCAN_RESULT_CODE ='"+params.scanResultCode+"'"
    if(params.scanResultCode != "009")
    {
        updateQuery +=   " ,     SCAN_DETAIL_TY_CODE = '"+params.scanDetailTyCode+"'"   // 상세유형코드
        updateQuery +=   " ,     SCAN_DETAIL_ETC_CN = '"+params.scanDetailEtcCn+"'"        // 상세유형기타
        updateQuery +=   " ,     ENVRN_FACTOR_CODE = '"+params.envrnFactorCode+"'"      // 환경요소코드
    }    
    updateQuery +=   " ,     SCAN_RESULT_MEMO_CN = '"+params.scanResultMemoCn+"'"
    if(params.scanGrade == "1")
    {
        updateQuery +=   " ,     ALAR_PRVN_TIME = '"+params.alarPrvnTime+"'"    // 알람중복방지
    }
    
    updateQuery +=   " WHERE CCTV_ID = '"+params.cctvId+"'"
    updateQuery +=   " AND   TO_CHAR(SCAN_DT,'YYYY-MM-DD HH24:MI:SS') = '"+params.scanDt+"'"
        
    return sequelize.query(updateQuery)
}
// 이벤트 정보 
const insertEventInfo = async (params) =>{
    try{
        // 1.날짜정보 조회
        var wzQuery = "SELECT WZ_ID"
        + " FROM ("
        + " SELECT A.WZ_ID "
        + " FROM ("
        + " SELECT (( ACOS("
        + " SIN((SELECT MAP_YCORD FROM TN_CCTV WHERE CCTV_ID=:cctvId) * ACOS(-1) / 180) *"
        + " SIN(A.MAP_YCORD * ACOS(-1) / 180) +"
        + " COS((SELECT MAP_YCORD FROM TN_CCTV WHERE CCTV_ID=:cctvId) * ACOS(-1) / 180) * "
        + " COS(A.MAP_YCORD * ACOS(-1) / 180) * "
        + " COS(((SELECT MAP_XCORD FROM TN_CCTV WHERE CCTV_ID=:cctvId) - A.MAP_XCORD) * ACOS(-1) / 180)) * 180 /ACOS(-1)) * 60 * 1.1515) AS distance"
        + " ,	WZ_ID"
        + " FROM TN_WZ A"
        + " ) A"
        + " ORDER BY distance ASC"
        + " ) A"
        + " WHERE ROWNUM =1"
     

        var wzIdResult = await sequelize.query(wzQuery,{
            replacements : {
                cctvId : params.CctvId
            }
        })        
        
        // 2. 검지등급 => 코드로 분류
        var typeCode = (params.Type == "Stop")? "001" : (params.Type == "Reverse")? "002" : "003";
        var drcCode = (params.Direction == "Forward")? "001" : (params.Direction == "Reverse")? "002" : null
        var scanDt = params.Date;
        var scanDtSplit = scanDt.split("|");
        var dtDate = scanDtSplit[0].replace(/ /g,"").replace(/-/g,"");
        var dtTime = scanDtSplit[1].replace(/ /g,"").replace(/:/g,"");
        var scanDate = dtDate+dtTime;
        
        var prcDate = dtDate+dtTime.substring(0,2);
        var prcpQuery="(SELECT PRCPT_STLE_CODE FROM ("
        +" SELECT PRCPT_STLE_CODE FROM TH_WETHER_CND A WHERE A.WZ_ID='"+wzIdResult[0][0].WZ_ID+"' AND  TO_CHAR(A.COLCT_DT,'YYYYMMDDHH24') ='"+prcDate+"'"
        +" ORDER BY A.COLCT_DT DESC ) A WHERE ROWNUM =1)"     
               

        return ThIaMngrScan.create({
             scanDt : Sequelize.literal("TO_DATE("+scanDate+",'YYYYMMDDHH24MISS')")
        ,   cctvId : params.CctvId        
        ,   scanXcord : params.CoordinateX
        ,   scanYcord : params.CoordinateY
        ,   scanBt : params.Width
        ,   scanHg : params.Height
        ,   scanRlablty : params.Reliability
        ,   scdLtCode : params.DistanceType
        ,   scanVidoUrl : params.URL
        ,   scanDrcCode : drcCode
        ,   scanTyCode : typeCode
        ,   scanGrad : params.grade
        ,   prcptStleCode : Sequelize.literal("(SELECT NVL("+prcpQuery+",'000') FROM DUAL)")
        })
    }
    catch(error)
    {        
        return "";
    }
}

// 2차검지
const updateEventInfo = (params) =>{
    
    var typeCode = (params.Type == "Stop")? "001" : (params.Type == "Reverse")? "002" : (params.Type == "Pedestrian")? "003": null;
    var scanDt = params.Date;
    var scanDtSplit = scanDt.split("|");
    
    var dtDate = scanDtSplit[0].replace(/ /g,"").replace(/-/g,"");
    var dtTime = scanDtSplit[1].replace(/ /g,"").replace(/:/g,"");
    var scanDate = dtDate+dtTime;

    return ThIaMngrScan.update({
        scdScanRlablty : params.Reliability
    ,   scdScanTyCode : typeCode
    ,   scdScanDt : Sequelize.literal("SYSDATE")
    },{
        where : {
            cctvId : params.Cctvid
        ,   scanDt : Sequelize.literal("SCAN_DT = TO_DATE("+scanDate+",'YYYYMMDDHH24MISS')")
        }
    })
}
module.exports = {
    getEventList
,   getEventDetail
,   setEventInfo
,   insertEventInfo
,   updateEventInfo
}
