const { ThIaMngrChange, sequelize,Sequelize } = require("../../models")
const Op = Sequelize

// 변경이력 추가 
const insertHistory  = async(params) =>{
   // 순번 
   const changeSn = await ThIaMngrChange.findOne({
        attributes : [
            [Sequelize.fn("NVL",Sequelize.fn("MAX",Sequelize.col("CHANGE_SN")),0), "changeSn"]
        ]
        ,   raw : true
    })
    const changeSnNum = changeSn.changeSn + 1 
    //
    return ThIaMngrChange.create({
        changeSn : changeSnNum
    ,   changeDt : sequelize.literal("SYSDATE")
    ,   cctvId : params.cctvId
    ,   changeDtaCode : params.changeDtaCode
    ,   userId  : params.userId
    ,   changeCn : params.changeCn
    })
}
// 변경이력 조회 
const getHistoryList = (params) => {    
    var selQuery = "SELECT 	ROW_NUMBER() OVER(ORDER BY A.CHANGE_DT DESC) AS RNUM"
    selQuery += " ,     A.CCTV_ID"
    selQuery += " ,		TO_CHAR(A.CHANGE_DT,'YYYY-MM-DD HH24:MI:SS') AS CHANGE_DT"
    selQuery += " ,		A.CHANGE_DTA_CODE"
    selQuery += " ,		A.USER_ID"
    selQuery += " ,		B.USER_NM"
    selQuery += " ,		A.CHANGE_CN"
    selQuery += " FROM TH_IA_MNGR_CHANGE A"
    selQuery += " LEFT OUTER JOIN TN_USER B"
    selQuery += " ON	A.USER_ID	=	B.USER_ID"
    selQuery += " INNER JOIN TN_USER_ATTRB C"
    selQuery += " ON B.USER_ID = C.USER_ID"
    selQuery += " WHERE	C.INSTT_ID	=   '"+params.intdCode+"'"
    if(
        (params.startDate != null && params.startDate != undefined && params.startDate != "")
    || (params.endDate != null && params.endDate != undefined && params.endDate != ""))
    {
        if(params.endDate == null || params.endDate == undefined || params.endDate == "")
        {
            // 종료일자만 없을 때 
            selQuery +=" AND TO_CHAR(A.CHANGE_DT,'YYYYMMDD') >= TO_CHAR('"+params.startDate+"','YYYYMMDD')"

        }
        else if(params.startDate == null || params.startDate == undefined || params.startDate == "")
        {
            // 시작일자만 없을 때
            selQuery +=" AND TO_CHAR(A.CHANGE_DT,'YYYYMMDD') <= TO_CHAR('"+params.endDate+"','YYYYMMDD')"
        }
        else
        {
            // 시작일자, 종료일자 둘다 존재 
            selQuery +=" AND TO_CHAR(A.CHANGE_DT, 'YYYY-MM-DD') BETWEEN '"+params.startDate+"' AND '"+params.endDate+"'"
        }

    }
    else
    {
        // 시작일자,종료일자 둘다 없을 때 (디폴트 최근 2일 설정)
        selQuery += " AND TO_CHAR(A.CHANGE_DT,'YYYYMMDD') >= TO_CHAR(SYSDATE-2, 'YYYYMMDD')"
    }

    // 운영자 id
    if(params.searchUsrId != null && params.searchUsrId != "" && params.searchUsrId != undefined)
    {
        selQuery += " AND A.USER_ID = '"+ params.searchUsrId+"'"
    }

    // 구분값 
    if(params.searchChgDtaCode != null && params.searchChgDtaCode != "" && params.searchChgDtaCode != undefined)
    {
        selQuery += " AND A.CHANGE_DTA_CODE = '"+ params.searchChgDtaCode+"'"
    }

    selQuery += " ORDER BY A.CHANGE_DT DESC"

    return sequelize.query(selQuery)
}
// 운영자 ID 정보
const getSelUserList = (params) => {    
    var selQuery = "SELECT 	A.USER_ID"
    selQuery += " ,		A.USER_NM"
    selQuery += " ,		B.INSTT_ID"
    selQuery += " FROM TN_USER A"
    selQuery += " INNER JOIN TN_USER_ATTRB B"
    selQuery += " ON A.USER_ID = B.USER_ID"
    selQuery += " WHERE 	A.USE_AT = 'Y'"
    selQuery += " AND 	B.INSTT_ID	=	'"+params.intdCode+"'"
    selQuery += " ORDER BY A.USER_NM"
    return sequelize.query(selQuery);
}

module.exports ={
    insertHistory
,   getHistoryList
,   getSelUserList
}
