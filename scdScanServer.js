
const http = require('http');
const net = require("net");
const { EventService } = require("./server/service")
const port = 10200;

// 2차검지 서버
const fstServer = net.createServer(function(socket) {
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
            // 2차검지 수정            
            const result  =await EventService.updateEventInfo(eventParam)

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

fstServer.on("error",function(err){
    console.log("소켓 에러 :", err.code);
})

fstServer.listen(port,()=>{
    console.log(`${port}번 포트 대기중...`)
})



