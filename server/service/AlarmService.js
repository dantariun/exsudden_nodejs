const { sequelize ,Sequelize } = require("../../models");

// 알람 여부 체크
const getIsAlarm = async(params)=>{
    try 
    {
        // 1. 파라미터 값 
        var typeCode = (params.Type == "Stop")? "001" : (params.Type == "Reverse")? "002" : "003";
        var scanDt = params.Date;
        var scanDtSplit = scanDt.split("|");
        var dtDate = scanDtSplit[0].replace(/ /g,"").replace(/-/g,"");
        var dtTime = scanDtSplit[1].replace(/ /g,"").replace(/:/g,"");
        var scanDate = dtDate+dtTime;       
        
        // 1 . 등록이벤트의 중복 알람 방지 여부 체크   
        const evtOverLap = await getEventOverLapCheck(params.CctvId,typeCode,scanDate);        
        console.log("중복알림 ==>",evtOverLap[0][0].CNT)
        // 중복알림
        if(evtOverLap[0][0].CNT > 0)
        {
            // 중복알림 방지에 해당할 경우
            // 조건 - 동일한 CCTV , 동일한 이벤트 유형 , 설정한 중복알림방지시간에 해당할 경우 알림 x
            console.log("중복 알림 방지 보내지 않음");
            return false;
        }
        else
        {
            // 2. 알람 ON 여부 체크 
            const isAlaramOnYn = await getAlarmOnYn(params.CctvId,scanDate);
            
            // 3. 등록된 이벤트가 알람 ON 설정 일정에 포함되어 있다면 알람 ON 조건에 따라 알림 전송 또는 전송불가
            if(isAlaramOnYn[0][0].CNT > 0)
            {
                console.log("알람 ON 조건 일정에 포함된 CCTV******")
                // 4. 알람 설정의 ON 여부
                const isAlarmOn = await getIsAlarmOnOff(params.CctvId,typeCode,dtDate,scanDate,"ON");
                if(isAlarmOn[0][0].CNT > 0)
                {
                    // 알람 ON 이지만 검지구분이 예외이거나 예외시간대일 경우 알림 x
                    console.log("예외검지구분 혹은  예외시간대에 해당하므로 알림을 보내지 않음")
                    return false
                }
                else
                {
                    console.log("예외검지구분 혹은 예외시간대에 해당하지 않으므로 알림을 보냄")
                    return true;
                }
            }
            else
            {                
                console.log("알람 OFF 조건 일정에 포함된 CCTV******")
                // 4. 알람 설정의 OFF여부의 설정 체크                
                const isAlarmOff = await getIsAlarmOnOff(params.CctvId,typeCode,dtDate,scanDate,"OFF");                
                if(isAlarmOff[0][0].CNT > 0)
                {
                    // 알람 OFF인 CCTV와 알람OFF 할 조건에 해당할 경우 알림 x
                    console.log("알람 OFF 설정된 검지유형과 일자에 해당하므로 알림을 보내지 않음")
                    return false
                }
                else
                {
                    // 알람을 보낸다.
                    console.log("알람 OFF 설정된 검지유형과 일자에 해당하지 않으므로 알림을 보냄")
                    return true;
                }
            }
            
        }
    } 
    catch(err)
    {
        return false
    }
}
// 등록이벤트의 중복 알람 방지여부 체크 
const getEventOverLapCheck = (cctvId,typeCode, scanDate) =>{    
    return sequelize.query( "SELECT  COUNT(*) AS CNT"        
        + " FROM  	TH_IA_MNGR_SCAN A"
        + " WHERE  	A.SCAN_GRAD = 1"
        + " AND  	A.SCAN_RESULT_CODE IS NOT NULL"
        + " AND		NVL(A.ALAR_PRVN_TIME,0) > 0"
        + " AND		A.CCTV_ID = :cctvID"
        + " AND		A.SCAN_TY_CODE = :scanTyCode "
        + " AND		TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN A.SCAN_DT AND A.SCAN_DT + A.ALAR_PRVN_TIME/(24*60)"
        , {
            replacements : {
                cctvID : cctvId
            ,   scanTyCode : typeCode
            ,   scanDate : scanDate
            }
        }
    )
}
// 알람 ON 존재 여부 체크 
const getAlarmOnYn = (cctvId,scanDate) =>
{   
    return sequelize.query( "SELECT  COUNT(*) AS CNT"        
    + " FROM  	TH_IA_MNGR_ALAR_SETUP A"
    + " WHERE  	A.CCTV_ID = :cctvID"    
    + " AND		TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN TO_DATE(CONCAT(NVL(A.BEGIN_DE,'19000101'),NVL(A.BEGIN_HM,'0000')),'YYYYMMDDHH24MI') AND TO_DATE(CONCAT(NVL(A.END_DE, '19000101'),NVL(A.END_HM,'0000')),'YYYYMMDDHH24MI') + 1/(24*60)"
    + " AND     ALAR_AT = 'Y'"
    , {
        replacements : {
            cctvID : cctvId
        ,   scanDate : scanDate
        }
    }
)
}
// 알람 ON / Off 설정 설정여부
const getIsAlarmOnOff = (cctvId,typeCode,scanDt,scanTime,alarmOnOff) => {
    var whereQuery = "";
    var joinQuery = "";
    // 알람 ON  체크
    if(alarmOnOff == "ON")
    {
        // join Query 
        joinQuery = " LEFT OUTER JOIN ("
        joinQuery += " SELECT  STDMT"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNRISE_HM),'00'),'YYYYMMDDHH24MISS') -30/(24*60) +1	AS SUNRISE_START_TIME_NEXT"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNRISE_HM),'00'),'YYYYMMDDHH24MISS') -30/(24*60)	AS SUNRISE_START_TIME"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNRISE_HM),'00'),'YYYYMMDDHH24MISS') +30/(24*60) AS SUNRISE_END_TIME"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNSET_HM),'00'),'YYYYMMDDHH24MISS') -30/(24*60)	AS SUNSET_START_TIME"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNSET_HM),'00'),'YYYYMMDDHH24MISS') +30/(24*60) AS SUNSET_END_TIME"
        joinQuery += " ,		TO_DATE(CONCAT(CONCAT(:scanDt,SUNSET_HM),'00'),'YYYYMMDDHH24MISS') +30/(24*60) -1 AS SUNSET_END_TIME_BEF"        
        joinQuery += " FROM TN_IA_MNGR_NIGHT_SETUP"
        joinQuery += " WHERE  STDMT  = TO_CHAR(TO_DATE(:scanDate,'YYYYMMDDHH24MISS'),'MM')"
        joinQuery += " ) NIT"
        joinQuery += " ON NIT.STDMT = TO_CHAR(TO_DATE(:scanDate,'YYYYMMDDHH24MISS'),'MM')"

        // where Query
        whereQuery =" AND ALS.ALAR_AT = 'Y'"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN TO_DATE(CONCAT(NVL(ALS.BEGIN_DE,'19000101'),NVL(ALS.BEGIN_HM,'0000')),'YYYYMMDDHH24MI') AND  TO_DATE(CONCAT(NVL(ALS.END_DE, '19000101'),NVL(ALS.END_HM,'0000')),'YYYYMMDDHH24MI') + 1/(24*60)"        
        whereQuery +=" AND ("
        // 예외 검지구분일때
        whereQuery +=" REGEXP_LIKE(ALS.SCAN_SE_NM, :scanTyCode)"        
        whereQuery +=" OR ("
        // 예외시간대가 주간일 때 
        whereQuery +=" ("
        whereQuery +=" REGEXP_LIKE(ALS.EXCP_TIME_NM,'T01')"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN NIT.SUNRISE_END_TIME AND NIT.SUNSET_START_TIME + 1/(24*60)"
        whereQuery +=" )"
        // 예외시간대가 야간일 때
        whereQuery +=" OR("
        whereQuery +=" REGEXP_LIKE(ALS.EXCP_TIME_NM,'T02')"
        whereQuery +=" AND ("
        whereQuery +=" TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN NIT.SUNSET_END_TIME AND NIT.SUNRISE_START_TIME_NEXT + 1/(24*60)"
        whereQuery +=" OR TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN NIT.SUNSET_END_TIME_BEF AND NIT.SUNRISE_START_TIME + 1/(24*60)"
        whereQuery +=" ))"

        // 예외시간대가 일몰일 떄
        whereQuery +=" OR("
        whereQuery +=" REGEXP_LIKE(ALS.EXCP_TIME_NM,'T03')"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN NIT.SUNSET_START_TIME AND NIT.SUNSET_END_TIME + 1/(24*60)"
        whereQuery +=" )"
        // 예외시간대가 일츨일 떄
        whereQuery +=" OR("
        whereQuery +=" REGEXP_LIKE(ALS.EXCP_TIME_NM,'T04')"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN NIT.SUNRISE_START_TIME AND NIT.SUNRISE_END_TIME + 1/(24*60)"
        whereQuery +=" )))"
    }
    else
    {
        // OFF 일때 

        // where Query
        whereQuery =" AND ("
        // 알림 주기코드 - 반복안함
        whereQuery +=" (("
        whereQuery +=" (ALS.ALAR_CYCLE_CODE ='N' OR ALS.ALAR_CYCLE_CODE IS NULL)"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN TO_DATE(CONCAT(NVL(ALS.BEGIN_DE,'19000101'),NVL(ALS.BEGIN_HM,'0000')),'YYYYMMDDHH24MI') AND TO_DATE(CONCAT(NVL(ALS.END_DE, '19000101'),NVL(ALS.END_HM,'0000')),'YYYYMMDDHH24MI') + 1/(24*60)"
        whereQuery +=" )"

        // 알림 주기코드 - 일마다
        whereQuery +=" OR("
        whereQuery +=" ALS.ALAR_CYCLE_CODE ='D'"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN TO_DATE(CONCAT(:scanDt, NVL(ALS.BEGIN_HM, '0000')), 'YYYYMMDDHH24MI') AND TO_DATE(CONCAT(:scanDt, NVL(ALS.END_HM, '0000')), 'YYYYMMDDHH24MI') + 1/(24*60)"
        whereQuery +=" )"

        // 알림 주기코드 - 주마다
        whereQuery +=" OR("
        whereQuery +=" ALAR_CYCLE_CODE ='W'"
        whereQuery +=" AND TO_DATE(:scanDate,'YYYYMMDDHH24MISS') BETWEEN TO_DATE(CONCAT(:scanDt, NVL(ALS.BEGIN_HM, '0000')), 'YYYYMMDDHH24MI') AND TO_DATE(CONCAT(:scanDt, NVL(ALS.END_HM, '0000')), 'YYYYMMDDHH24MI') + 1/(24*60)"
        whereQuery +=" AND REGEXP_LIKE(ALS.REPTIT_DOTW_NM, TO_CHAR(TO_DATE(:scanDate,'YYYYMMDDHH24MISS'), 'dy', 'NLS_DATE_LANGUAGE=ENGLISH'))"
        whereQuery +=" ))"

        whereQuery +=" AND ALS.ALAR_AT = 'N'"
        whereQuery +=" AND (REGEXP_LIKE(ALS.SCAN_SE_NM, :scanTyCode) OR ALS.SCAN_SE_NM IS NULL)"
        whereQuery +=" )"
    }


    return sequelize.query( "SELECT  COUNT(ALS.CCTV_ID) AS CNT"        
        + " FROM TH_IA_MNGR_ALAR_SETUP ALS"
        +  joinQuery
        + " WHERE ALS.CCTV_ID = :cctvID"
        +  whereQuery
        , {
            replacements : {
                cctvID : cctvId
            ,   scanTyCode : typeCode            
            ,   scanDt :  scanDt
            ,   scanDate : scanTime
            }
        }
    )
}
// 지방청 코드 가져오기 
const getIntdCode = (cctvId)=>{
    return sequelize.query( "SELECT INTD_CODE "
    + " FROM TN_CCTV "
    + " WHERE CCTV_ID = :cctvId "
    , {
        replacements : {
            cctvId : cctvId
        }
    })
}
module.exports = {
    getIsAlarm,
    getIntdCode
}