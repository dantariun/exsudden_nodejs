const { HistoryService  } = require("../service");

// 변경이력 조회 
const getHisotryList = async(req,res,next) =>{
    try {
        var params = req.query
        var rtnObj = {
            message :"success"        
        }
        // 운영자ID 조회여부
        if(params.userIsSearch)
        {            
            var userList = await HistoryService.getSelUserList(params);
            rtnObj.userList = userList[0]
        }

        var resultList = await HistoryService.getHistoryList(params)
        rtnObj.dataList = resultList[0];        
        return res.json(rtnObj);
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getHisotryList
}