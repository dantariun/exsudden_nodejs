const net = require("net");
const { EventService , AlarmService } = require("./server/service")

module.exports = (port) => {
    var server = net.createServer(function(socket) {
        console.log(socket.address().address + "NET connected.");
        console.log(`${port} 접속`)

        // setting encoding
	    socket.setEncoding('utf8');
        socket.on("data",async function(data)
        {            
            
            try{
                var jsonstr = data.toString().trim()
                var customData = jsonstr.substring(jsonstr.indexOf("{"),jsonstr.indexOf("}")+1) + "}";
                var jsonData = JSON.parse(customData);

                var eventParam = jsonData.EventInfo;
                
                if(port == 10100)
                {
                    // 이벤트 추가
                    const result = await EventService.insertEventInfo(eventParam);

                    // 1급일 경우
                    if(eventParam.grade == 1)
                    {
                        const result = await AlarmService.getIsAlarm(eventParam);                        
                        console.log("알람 필터링 결과 ==>",result);
                        if(result)
                        {
                            console.log("돌발서버 알람 호출 해야짐")
                        }
                        else
                        {
                            console.log("돌발서버 열람 호출 안해도 됨.");
                        }
                    }
                }
                
                if(port == 10200)
                {                       
                    // 2차검지 수정
                    const result  =await EventService.updateEventInfo(eventParam)
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

    })

    server.on("error",function(err){
        console.log("소켓 에러 :", err.code);
    })

    server.listen(port,()=>{
        console.log(`${port}번 포트 대기중...`)
    })
    return server
}