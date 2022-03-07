const http = require('http');
const net = require("net");
const { EventService , AlarmService } = require("./server/service")
const port = 10100;

// 데이터 전송
async function writeData(socket, eventParam)
{
    // 알림 데이터 custom    
    /*********** 검지정보 *********/
    var cctvIdByte = Buffer.alloc(20);          // CCTVID
    cctvIdByte.write(eventParam.CctvId);

    // 검지일시(BCD코드)
    var scanDt = eventParam.Date;
    //var dateTest = "20220121152532";
    var scanDate = scanDt.replace(/-/g,"").replace(/\|/g,"").replace(/:/g,"").replace(/ /g,"")
    var len = scanDate.length;

    if(len % 2 != 0)
    {
        len += 1;
        scanDate ="0" + scanDate;
    }
    var scanDateBuffer = Buffer.alloc(len / 2);

    var indexArray = 0;
    var byteArray = 0;

    for(var i=0;i<scanDate.length; i+= 2)
    {
        scanDateBuffer[byteArray] = Buffer.from(parseInt(scanDate[indexArray]).toString(16));    
        indexArray++;
        scanDateBuffer[byteArray] <<=4;
        scanDateBuffer[byteArray] |= Buffer.from(parseInt(scanDate[indexArray]).toString(16));    
        indexArray++;
        byteArray++;    
    }

    // 검지유형 (BYTE 1)
    var typeCode = (eventParam.Type == "Stop")? "1" : (eventParam.Type == "Reverse")? "2" : "3";
    var typeBuffer =Buffer.from(typeCode);

    // 검지 방향 (BTYE 1)
    var drcCode = (eventParam.Direction == "Forward")? "1" : (eventParam.Direction == "Reverse")? "2" : 0x00.toString()
    var drcBuffer =Buffer.from(drcCode);

    // 검지 X 좌표(WORD 2 = BYTE 4)
    var corXBuffer = Buffer.alloc(4);
    corXBuffer.write((Math.floor(eventParam.CoordinateX * 10000)).toString())

    // 검지 Y 좌표(WORD 2 = BYTE 4)
    var corYBuffer = Buffer.alloc(4);
    corYBuffer.write((Math.floor(eventParam.CoordinateY * 10000)).toString())
    
    // 검지 너비 (WORD 2 = BYTE 4)
    var widthBuffer = Buffer.alloc(4);
    widthBuffer.write((Math.floor(eventParam.Width * 10000)).toString())

    // 검지 높이 (WORD 2 = BYTE 4)
    var heightBuffer = Buffer.alloc(4);
    heightBuffer.write((Math.floor(eventParam.Height * 10000)).toString())

    // 신뢰도 (WORD 2 = BYTE 4)
    var reliBuffer = Buffer.alloc(4);
    reliBuffer.write((Math.floor(eventParam.Reliability * 100)).toString())

    // 영상 URL (CHAR100 == BYTE 100)
    var urlBuffer = Buffer.alloc(100);
    urlBuffer.write(eventParam.URL);
    
    // 지방청 코드 조회 
    const intdCodeResult = await AlarmService.getIntdCode(eventParam.CctvId);
    const intdCode = intdCodeResult[0][0].INTD_CODE
    var intdByteCode = Buffer.from([0x00]); // 통합
    if(intdCode == "1613168")
    {   // 서울
        intdByteCode = Buffer.from([0x01]) 
    }
    else if(intdCode == "1613191")
    {   // 원주
        intdByteCode = Buffer.from([0x02]) 
    }
    else if(intdCode == "1613217")
    {   //대전
        intdByteCode = Buffer.from([0x03]) 
    }
    else if(intdCode == "1613281")
    {   //부산
        intdByteCode = Buffer.from([0x04]) 
    }
    else if(intdCode == "1613248")
    {   //익산
        intdByteCode = Buffer.from([0x05]) 
    }

    var senderNode = Buffer.from([0xA0])        // 송신지노드 (1BYTE)
    var desNode = Buffer.from([0x90])           // 목적지노드 (1BYTE)
    var opCode = Buffer.from([0x10,0x01,0x00,0x00])          // 운영코드(2WORD = 4BYTE)
    var nullCode = Buffer.from([0x00]);        // 0x00(=null) 채움

    var seqCode = Buffer.alloc(4,[0x00]);      // 순번,통신포트 (WORD 2 = 4BYTE)
    var contNum = Buffer.alloc(20,[0x00]);     // 제어기번호, 통신 IP (CHAR 20 = 20BYTE)
    // 검지정보 buffer 데이터 합치기
    var scanSendDate = Buffer.concat([cctvIdByte,scanDateBuffer,typeBuffer,drcBuffer,corXBuffer,corYBuffer,widthBuffer,heightBuffer,reliBuffer,urlBuffer])

    var scanSendLen = scanSendDate.length;
    var scanSendLenBuffer= Buffer.alloc(16);        // 검지데이터 길이 (UNIT 4 = 16BYTE)
    scanSendLenBuffer.write(scanSendLen.toString())
    
    // 전송 데이터 
    var sendData = Buffer.concat([intdByteCode,senderNode,intdByteCode,desNode,opCode,nullCode,seqCode,contNum,contNum,seqCode,scanSendLenBuffer,scanSendDate])
    // 데이터 전송 
    var success = socket.write(sendData);
    if (!success){
        console.log("Server Send Fail");
        return false;
    } 
    return true;
}

// 클라이언트  접속
function getConnection(portNum)
{
    let client = "";
    const recvData = [];
    var localPort = "";
    // 전송 IP 정보 ( 반영 혹은 테스트시 해당 IP 변경 해야함)
    const conHost= "192.168.0.20";
    // IP 접속
    client = net.connect({port:portNum,host : conHost},function(){
        console.log(`${conHost} 서버 접속 성공`);
        //localPort = this.localPort;                
        this.setEncoding("utf8");
        this.setTimeout(30000); // timeout 10분
    })

    client.on("close",function(){
        console.log("client Socket Closed : " + "localport : "+ localPort);
    })

    client.on("data",function(data){
        console.log(" data Receve log ==========");
        recvData.push(data);
        console.log("data.length :" +data.length);
        console.log("data :" + data);
        client.emit("close")
    })

    client.on('end', function() { 
        console.log('client Socket End'); 
    }); 
     
    client.on('error', function(err) { 
        console.log('client Socket Error: '+ JSON.stringify(err)); 
    }); 
     
    client.on('timeout', function() { 
        console.log('client Socket timeout: '); 
    }); 
     
    client.on('drain', function() { 
        console.log('client Socket drain: '); 
    }); 
     
    client.on('lookup', function() { 
        console.log('client Socket lookup: '); 
    });  
    return client;
}

// 1차 검지
const fstServer = net.createServer(function(socket) {
    console.log(socket.address().address + "NET connected.");
    console.log(`${port} 접속`);
    // setting encoding
    socket.setEncoding('utf8');

    socket.on("data",async function(data)
    {            
        console.log("data", data)            
        try{
            var jsonstr = data.toString().trim()
            var customData = jsonstr.substring(jsonstr.indexOf("{"),jsonstr.indexOf("}")+1) + "}";
            var jsonData = JSON.parse(customData);

            var eventParam = jsonData.EventInfo;
            
            // 이벤트 추가
            const result = await EventService.insertEventInfo(eventParam);

            // 1급일 경우
            if(eventParam.grade == 1)
            {
                const result = await AlarmService.getIsAlarm(eventParam);                        
                console.log("알람 필터링 결과 ==>",result);
                if(result)
                {
                    console.log("돌발서버 알람 호출 해야짐");
                    // 2022-01-27일 우선 주석처리 ( 추후 인터페이스 전송 시 혹은 테스트 시  주석 해제 해야함!)
                    /*
                    var client = getConnection(30800)                        
                    var sendDataResult = await writeData(client,eventParam);
                    console.log(sendDataResult)
                    */
                }
                else
                {
                    console.log("돌발서버 열람 호출 안해도 됨.");
                }
            }

            socket.write("ok");
        }
        catch(err)
        {
            socket.emit("close");
        }            

    });

    socket.on("close" ,function(){
        console.log(`${port} 클라이언트 접속 종료`);
    })   
});

fstServer.on("error",function(err){
    console.log("소켓 에러 :", err.code);
})

fstServer.listen(port,()=>{
    console.log(`${port}번 포트 대기중...`)
})
