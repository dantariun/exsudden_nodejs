const { StatsService } = require("../service");

// 통계 > 소속 CCTV 목록 조회
const getCctvList = async(req, res, next) => {
    try {
        const result = await StatsService.getCctvList(req);

        var payload;

        const resultData = result[0];

        const map = new Map();
        map.set('cctvList', resultData);

        payload = mapToJson(map);
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 검지 정확도 (1차/2차)
const getScanAccuracy = async(req,res,next) => {
    try{
        const result = await StatsService.getScanAccuracy(req);

        var payload;

        const resultData = result[0];
        if(resultData != null && resultData != undefined && resultData != "") {
            var labelsList = [];            // x축 라벨 내용
            var labelList = ["정검지", "오검지"]; // 범례 라벨
            var dataList = [];
            var jungResultList = [];     // 정검지 수
            var oaResultList = [];        // 오검지 수
            var miResultList = [];      // 미검지 수
            var jungResultSum = 0;
            var oaResultSum = 0;
            var miResultSum = 0;
            var sumDataList = [];

            const map = new Map();

            if(req.query.exyn == "Y") {
                if(req.query.ord == 2) {
                    labelList.push("미검지");
                }
                map.set('labelList', labelList);
                map.set('dataList', resultData);
            } else {
                if(req.query.ord == 2) {
                    labelList.push("미검지");
                    for(var i in resultData) {            
                        labelsList.push(resultData[i].SCAN_DT); // 축 라벨 내용
    
                        var totalCnt = resultData[i].JUNG_RESULT_CODE + resultData[i].OA_RESULT_CODE + resultData[i].MI_RESULT_CODE;
    
                        if(resultData[i].JUNG_RESULT_CODE == 0 && resultData[i].OA_RESULT_CODE == 0 && resultData[i].MI_RESULT_CODE == 0) {
                            jungResultList.push(resultData[i].JUNG_RESULT_CODE);        // 정검지 수
                            oaResultList.push(resultData[i].OA_RESULT_CODE);            // 오검지 수
                            miResultList.push(resultData[i].MI_RESULT_CODE);            // 미검지 수
                        } else {
                            jungResultList.push((resultData[i].JUNG_RESULT_CODE / totalCnt * 100).toFixed(1));        // 정검지 수
                            oaResultList.push((resultData[i].OA_RESULT_CODE / totalCnt * 100).toFixed(1));            // 오검지 수
                            miResultList.push((resultData[i].MI_RESULT_CODE / totalCnt * 100).toFixed(1));            // 미검지 수
                        }
    
                        jungResultSum += resultData[i].JUNG_RESULT_CODE;            // 정검지 총합계
                        oaResultSum += resultData[i].OA_RESULT_CODE;                // 오검지 총합계
                        miResultSum += resultData[i].MI_RESULT_CODE;                // 미검지 총합계
                    }
        
                    dataList.push(jungResultList, oaResultList, miResultList);
                    sumDataList.push(jungResultSum);
                    sumDataList.push(oaResultSum);
                    sumDataList.push(miResultSum);
                } else {
                    for(var i in resultData) {            
                        labelsList.push(resultData[i].SCAN_DT); // 축 라벨 내용
    
                        var totalCnt = resultData[i].JUNG_RESULT_CODE + resultData[i].OA_RESULT_CODE;
                        
                        if(resultData[i].JUNG_RESULT_CODE == 0 && resultData[i].OA_RESULT_CODE == 0) {
                            jungResultList.push(resultData[i].JUNG_RESULT_CODE);        // 정검지 수
                            oaResultList.push(resultData[i].OA_RESULT_CODE);            // 오검지 수
                        } else {
                            jungResultList.push((resultData[i].JUNG_RESULT_CODE / totalCnt * 100).toFixed(1));        // 정검지 수
                            oaResultList.push((resultData[i].OA_RESULT_CODE / totalCnt * 100).toFixed(1));            // 오검지 수
                        }
    
                        jungResultSum += resultData[i].JUNG_RESULT_CODE;     // 정검지 총합계
                        oaResultSum += resultData[i].OA_RESULT_CODE;         // 오검지 총합계
                    }
        
                    dataList.push(jungResultList,oaResultList);
                    sumDataList.push(jungResultSum);
                    sumDataList.push(oaResultSum);
                }
    
                map.set('labelsList', labelsList);
                map.set('labelList', labelList);
                map.set('dataList', dataList);
                map.set('sumDataList', sumDataList);
            }

            payload = mapToJson(map);
        } else {
            payload = '';
        }

        return res.json(payload)
    } catch(err) {
        console.log("catch err :", err);
        next(err)
    }
}

// 통계 > 검지 정확도 > 검지결과 비교
const getScanResultCompare = async(req, res, next) => {
    try {
        const result = await StatsService.getScanResultCompare(req);

        const resultData = result[0];

        var payload;

        if(resultData != null && resultData != undefined && resultData != "") {

            var dataList = [];
            dataList.push(resultData[0].ACCORD);
            dataList.push(resultData[0].DISCORD);

            const map = new Map();
            map.set('dataList', dataList);

            payload = mapToJson(map);
        } else {
            payload = '';
        }

        return res.json(payload);

    } catch(err) {
        console.log("catch err :", err);
        next(err);
    }
}

// 통계 > 검지등급 비교
const getScanGradeCompare = async(req, res, next) => {
    try {
        const result = await StatsService.getScanGradeCompare(req);

        var payload;
        
        const resultData = result[0];
        
        if(resultData != null && resultData != undefined && resultData != "") {
            
            const map = new Map();
            var labelList = ["1급", "2급"];
            
            if(req.query.exyn == "Y") {
                map.set('labelList', labelList);
                map.set('dataList', resultData);
            } else {
                var labelsList = [];
                var dataList = [];
                var gradOneList = [];
                var gradTwoList = [];
                var gradOne = 0;
                var gradTwo = 0;
                var sumDataList = [];
    
                for(var i = 0; i < resultData.length; i++) {
                    labelsList.push(resultData[i].SCANDT);
                    gradOneList.push(resultData[i].GRADONE);
                    gradTwoList.push(resultData[i].GRADTWO);
                    gradOne += resultData[i].GRADONE;
                    gradTwo += resultData[i].GRADTWO;
                }
    
                dataList.push(gradOneList, gradTwoList);
    
                sumDataList.push(gradOne);
                sumDataList.push(gradTwo);
    
                map.set('labelsList', labelsList);
                map.set('labelList', labelList);
                map.set('dataList', dataList);
                map.set('sumDataList', sumDataList);
            }

            payload = mapToJson(map);
        } else {
            payload = '';
        }
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 검지유형별 검지등급 비교
const getScanTypeGrade = async(req, res, next) => {
    try {
        const result = await StatsService.getScanTypeGrade(req);

        var payload;

        const resultData = result[0];

        if(resultData != null && resultData != undefined && resultData != "") {
            var labelsList = ["1급", "2급"];
            var labelList = ["정지차량", "역주행", "보행자"];
            var dataList = [];
            
            for(var i = 0; i < labelList.length; i++) {
                var dataFlag = "N";
                for(var j = 0; j < resultData.length; j++) {
                    if(labelList[i] == resultData[j].SCANNM) {
                        dataList.push([resultData[j].GRADONE, resultData[j].GRADTWO]);
                        dataFlag = "Y"
                        break;
                    }
                }
                if(dataFlag == "N") {
                    dataList.push([0, 0]);
                }
            }

            const map = new Map();
            map.set('labelsList', labelsList);
            map.set('labelList', labelList);
            map.set('dataList', dataList);

            payload = mapToJson(map);
        } else {
            var labelsList = ["1급", "2급"];
            var labelList = ["정지차량", "역주행", "보행자"];
            var dataList = [["", ""], ["", ""], ["", ""]];

            const map = new Map();
            map.set('labelsList', labelsList);
            map.set('labelList', labelList);
            map.set('dataList', dataList);

            payload = mapToJson(map);
        }

        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 차수별 검지구분 비교
const getScanOrder = async(req,res,next) => {
    try {
        const result = await StatsService.getScanOrder(req);

        var payload;

        const resultData = result[0];

        if(resultData != null && resultData != undefined && resultData != "") {

            var labelList = ["정지차량", "역주행", "보행자"];
            
            const map = new Map();
            
            if(req.query.exyn == "Y") {
                
                map.set('labelList', labelList);
                map.set('dataList', resultData);
                
            } else {
                var labelsList = [];
                var stopVhcleList = [];
                var reverseList = [];
                var pdtrnList = [];
                var dataList = [];
                var sumDataList = [];
                var stopVhcle = 0;
                var reverse = 0;
                var prtrn = 0;
    
                for(var i = 0; i < resultData.length; i++) {
                    labelsList.push(resultData[i].SCANDT);
                    stopVhcleList.push(resultData[i].STOPVHCLE);
                    reverseList.push(resultData[i].RVRS);
                    pdtrnList.push(resultData[i].PDTRN);
                    stopVhcle += resultData[i].STOPVHCLE;
                    reverse += resultData[i].RVRS;
                    prtrn += resultData[i].PDTRN;
                }
    
                dataList.push(stopVhcleList, reverseList, pdtrnList);
    
                sumDataList.push(stopVhcle);
                sumDataList.push(reverse);
                sumDataList.push(prtrn);
    
                map.set('labelsList', labelsList);
                map.set('labelList', labelList);
                map.set('dataList', dataList);
                map.set('sumDataList', sumDataList);
            }

            payload = mapToJson(map);
        } else {
            payload = '';
        }
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 등급별 검지구분 비교
const getScanGrade = async(req,res,next) => {
    try {
        const result = await StatsService.getScanGrade(req);

        var payload;

        const resultData = result[0];

        if(resultData != null && resultData != undefined && resultData != "") {

            var labelList = ["정지차량", "역주행", "보행자"];

            const map = new Map();

            if(req.query.exyn == "Y") {
                
                map.set('labelList', labelList);
                map.set('dataList', resultData);
                
            } else {
                var labelsList = [];
                var stopVhcleList = [];
                var reverseList = [];
                var pdtrnList = [];
                var dataList = [];
                var sumDataList = [];
                var stopVhcle = 0;
                var reverse = 0;
                var prtrn = 0;
    
                for(var i = 0; i < resultData.length; i++) {
                    labelsList.push(resultData[i].SCANDT);
                    stopVhcleList.push(resultData[i].STOPVHCLE);
                    reverseList.push(resultData[i].RVRS);
                    pdtrnList.push(resultData[i].PDTRN);
                    stopVhcle += resultData[i].STOPVHCLE;
                    reverse += resultData[i].RVRS;
                    prtrn += resultData[i].PDTRN;
                }
    
                dataList.push(stopVhcleList, reverseList, pdtrnList);
    
                sumDataList.push(stopVhcle);
                sumDataList.push(reverse);
                sumDataList.push(prtrn);
    
                map.set('labelsList', labelsList);
                map.set('labelList', labelList);
                map.set('dataList', dataList);
                map.set('sumDataList', sumDataList);
            }

            payload = mapToJson(map);
        } else {
            payload = '';
        }
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 검지유형별 상세유형비교
// secd: 검지구분 코드, tycd: 검지유형 코드, stdt: 시작 날짜, eddt: 끝 날짜, cId: cctvId
const getScanTypeDtl = async(req, res, next) => {
    try {
        // get data list
        const dataResult = await StatsService.getScanTypeDtl(req);
        
        // get date list
        const labelsResult = await StatsService.getDateList(req);
        
        // get type code list
        const labelResult = await StatsService.getTypeCodeList(req);

        // data parsing
        const payload = await getResultData(dataResult, labelResult, labelsResult);
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 환경요소 상세유형비교
const getScanTypeEnvrnDtl = async(req, res, next) => {
    try {
        // get data list
        const dataResult = await StatsService.getScanTypeEnvrnDtl(req);

        // get date list
        const labelsResult = await StatsService.getDateList(req);

        // get type code list for envrnDetail
        const labelResult = await StatsService.getTypeCodeListEnvrn(req);

        // date data parsing
        const payload = await getResultData(dataResult, labelResult, labelsResult);

        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 1급 상황대비 알람 건수
const getScanGradeAlarm = async(req, res, next) => {
    try {
        // 1급 전체 count
        const totalResult = await StatsService.getScanGradeAlarmTotal(req);
        // 알람 count
        const alarmResult = await StatsService.getScanGradeAlarm(req);

        const totalData = totalResult[0];
        const alarmData = alarmResult[0];

        var payload;

        if(totalData != null && totalData != undefined && totalData != ""
        && alarmData != null && alarmData != undefined && alarmData != "") {

            var labelsList = [];
            var labelList = ["필터링 횟수", "알림 횟수"];
            var filterList = [];
            var alarmList = [];
            var dataList = [];
            var totalSum = 0;
            var alarmSum = 0;
            var sumDataList = [];

            for(var i = 0; i < totalData.length; i++) {
                labelsList.push(totalData[i].DT);
                filterList.push(totalData[i].CNT - alarmData[i].CNT);
                alarmList.push(alarmData[i].CNT);
                totalSum += totalData[i].CNT;
                alarmSum += alarmData[i].CNT;
            }
            
            dataList.push(filterList, alarmList);
            sumDataList.push(totalSum - alarmSum);
            sumDataList.push(alarmSum);

            const map = new Map();
            map.set('labelsList', labelsList);
            map.set('labelList', labelList);
            map.set('dataList', dataList);
            map.set('sumDataList', sumDataList);

            payload = mapToJson(map);
        } else {
            payload = '';
        }
        
        return res.json(payload);
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 통계 > 검지구분 알람 건수
const getScanTypeAlarm = async(req, res, next) => {
    try {
        const result = await StatsService.getScanTypeAlarm(req);

        const resultData = result[0];
        var payload;

        if(resultData != null && resultData != undefined && resultData != "") {
            var labelsList = [];
            var labelList = ["정지차량", "역주행", "보행자"];
            var stopVhcleList = [];
            var reverseList = [];
            var pdtrnList = [];
            var dataList = [];
            var sumDataList = [];
            var stopVhcle = 0;
            var reverse = 0;
            var prtrn = 0;

            for(var i = 0; i < resultData.length; i++) {
                labelsList.push(resultData[i].SCANDT);
                stopVhcleList.push(resultData[i].STOPVHCLE);
                reverseList.push(resultData[i].RVRS);
                pdtrnList.push(resultData[i].PDTRN);
                stopVhcle += resultData[i].STOPVHCLE;
                reverse += resultData[i].RVRS;
                prtrn += resultData[i].PDTRN;
            }

            dataList.push(stopVhcleList, reverseList, pdtrnList);

            sumDataList.push(stopVhcle);
            sumDataList.push(reverse);
            sumDataList.push(prtrn);

            const map = new Map();
            map.set('labelsList', labelsList);
            map.set('labelList', labelList);
            map.set('dataList', dataList);
            map.set('sumDataList', sumDataList);

            payload = mapToJson(map);
        } else {
            payload = '';
        }

        return res.json(payload);
        
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 검지유형(정지차량, 역주행, 보행자)별 excel data
const scanTypeDtlExcel = async(req, res, next) => {
    try {
        // get data list
        const dataResult = await StatsService.getScanTypeDtl(req);
        
        // get date list
        const labelsResult = await StatsService.getDateList(req);
        
        // get type code list
        const labelResult = await StatsService.getTypeCodeList(req);

        const dataData = dataResult[0]
        const labelData = labelResult[0]
        const labelsData = labelsResult[0]
        const rowList = [];

        for(var i = 0; i < labelsData.length; i++) {
            var jsonString = "{\"date\": \"" + dataData[i].DT + "\"";

            for(var j = 0; j < labelData.length; j++) {
                var dataIdx = i + labelsData.length*j;
                jsonString += ", \"" + labelData[j].SCLASCD + "\": " + dataData[dataIdx].CNT 
            }

            jsonString += "}";

            rowList.push(JSON.parse(jsonString));
        }

        const map = new Map();
        map.set('labelList', labelData);
        map.set('rowList', rowList);

        return res.json(mapToJson(map));
    } catch(err) {
        console.log("catch err: ", err);
        next(err);
    }
}

// 환경요소 검지유형 excel data
const scanTypeEnvrnExcel = async(req, res, next) => {
    try {

        // get data list
        const dataResult = await StatsService.getScanTypeEnvrnDtl(req);

        // get date list
        const labelsResult = await StatsService.getDateList(req);

        // get type code list for envrnDetail
        const labelResult = await StatsService.getTypeCodeListEnvrn(req);

        const dataData = dataResult[0]
        const labelData = labelResult[0]
        const labelsData = labelsResult[0]
        const rowList = [];

        for(var i = 0; i < labelsData.length; i++) {
            var jsonString = "{\"date\": \"" + dataData[i].DT + "\"";

            for(var j = 0; j < labelData.length; j++) {
                var dataIdx = i + labelsData.length*j;
                jsonString += ", \"" + labelData[j].SCLASCD + "\": " + dataData[dataIdx].CNT 
            }

            jsonString += "}";

            rowList.push(JSON.parse(jsonString));
        }

        const map = new Map();
        map.set('labelList', labelData);
        map.set('rowList', rowList);

        return res.json(mapToJson(map));
    } catch(err) {
        console.log("catch err: ", err);
        next(err)
    }
}

// 알람통계 excel data
const alarmExcel = async(req, res, next) => {
    try {

        // 1급 전체 count
        const totalResult = await StatsService.getScanGradeAlarmTotal(req);
        const totalAlrmData = totalResult[0];
        // 알람 count
        const alarmResult = await StatsService.getScanGradeAlarm(req);
        const alarmCountData = alarmResult[0];
        const gradeAlarmList = [];

        const scanTypeData = await StatsService.getScanTypeAlarm(req);
        const scanTypeList = scanTypeData[0];
        
        for(var i = 0; i < totalAlrmData.length; i++) {
            let data = {date : totalAlrmData[i].DT, filterCnt : totalAlrmData[i].CNT - alarmCountData[i].CNT, alarmCnt : alarmCountData[i].CNT}
            gradeAlarmList.push(data)
        }

        const map = new Map();
        map.set('gradeAlarmList', gradeAlarmList);
        map.set('scanTypeList', scanTypeList);

        return res.json(mapToJson(map));
        
    } catch(err) {
        console.log("catch err: ", err);
        next(err)
    }
}

// 일별 데이터 파싱
async function getResultData(dataResult, labelResult, labelsResult) {
    
    const dataData = dataResult[0]
    const labelData = labelResult[0]
    const labelsData = labelsResult[0]

    if(labelsData != null && labelsData != undefined && labelData != null && labelData != undefined && dataData != null && dataData != undefined) {
        var labelsList = [];
        var labelList = [];
        var dataList = [];
        var sumDataList = [];

        for(var i = 0; i < labelsData.length; i++) {
            labelsList.push(labelsData[i].DT);
        }

        for(var i = 0; i < labelData.length; i++) {
            labelList.push(labelData[i].SCLASNM);
            var dataListList = [];
            var sumCnt = 0;
            for(var j = 0; j < labelsData.length; j++) {
                var dataIdx = i*labelsData.length+j;
                // if(labelsData[j].DT == dataData[dataIdx].DT && labelData[i].SCLASCD == dataData[dataIdx].SCLASCD) {
                    dataListList.push(dataData[dataIdx].CNT);
                // } else {
                    // dataListList.push(0);
                // }
                sumCnt += dataData[dataIdx].CNT;
            }
            dataList.push(dataListList);
            sumDataList.push(sumCnt);
        }
        
        const map = new Map();
        map.set('labelsList', labelsList);
        map.set('labelList', labelList);
        map.set('dataList', dataList);
        map.set('sumDataList', sumDataList);

        return mapToJson(map);

    } else {
        return '';
    }
}

// map to jsonObject
function mapToJson(mapData) {
    let obj = {};

    mapData.forEach((value, key) => {
        obj[key] = value;
    })
    
    return obj;
}

module.exports ={
    getCctvList,
    getScanAccuracy,
    getScanResultCompare,
    getScanGradeCompare,
    getScanTypeGrade,
    getScanOrder,
    getScanGrade,
    getScanTypeDtl,
    getScanTypeEnvrnDtl,
    getScanGradeAlarm,
    getScanTypeAlarm,
    scanTypeDtlExcel,
    scanTypeEnvrnExcel,
    alarmExcel
}
