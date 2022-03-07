const {sequelize ,Sequelize } = require("../../models");

// 공통코드 목록 조회
const getCodeList = (params) =>{
    // 검지유형일때 

    var codeListQuery = "SELECT A.CODE_ID"
    +   " ,		B.DETAIL_CODE_ID"
    +   " ,		B.DETAIL_CODE_NM"
    +   " ,		B.USE_AT"
    +   " FROM TN_CMMN_CODE A"
    +   " INNER JOIN TN_CMMN_DETAIL_CODE B"
    +   " ON 	A.CODE_ID	=	 B.CODE_ID"
    +   " AND B.USE_AT	=	'Y'"

    +   " WHERE 	A.USE_AT	=	'Y'"
    +   " AND		A.CODE_ID	=	:codeId"

    if(params.codeId == "SCAN_TY_CODE")
    {
        codeListQuery +=   " AND       B.DETAIL_CODE_ID IN ('001','002','003')"
    }   
    
    return sequelize.query(codeListQuery,{
        replacements :{
            codeId          : params.codeId
        }
    })
}
module.exports ={
    getCodeList
}

