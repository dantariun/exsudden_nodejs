const socketIo = require("socket.io");
const rtsp = require('./server/utils/rtsp-ffmpeg');
module.exports = (server)=>{
    console.log('스트리밍 wait')
    const io = socketIo(server,{cors:{origin :"*"}});
    // const media = io.of("/memia")
    // media.on("connection", (socket) => {
    //     console.log('media server....')
    //     socket.on('stream', (d)=> {
    //         console.log(d.toString())
    //     })
    // })
    io.on("connection",function(socket){        
        const req =socket.request;
        
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`${ip}의 connected`);
        
        // rtsp to image data
        socket.on('rtsp', function(params) {                 

            console.log("rtsp"+JSON.stringify(params));
            const { cctvId, src } = params
            
            // # node_modules\rtsp-ffmpeg\lib\rtsp-ffmpeg.js 추가 
            // FFMpeg.prototype._args = function() {
            //     return this.arguments.concat([
            //         '-loglevel', 'quiet',
            //#A#      '-rtsp_transport', 'tcp',
            //         '-i', this.input,
            //#A#      '-timeout', 300000,
            //         '-r', this.rate.toString()
            // var stream = new rtsp.FFMpeg({input: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov', rate:16})    
            var stream = new rtsp.FFMpeg({input: src, rate:16})    
               
            const defSteaming = (data) => {
                socket.emit('stream', {[cctvId]: data.toString('base64')})
            }
            stream.on('data', defSteaming);   
            
            socket.on('disconnect', function() {
                stream.removeListener('data', defSteaming);
              });
            
            socket.on("error",function(error){
                console.log("error"+error);
            })
            socket.on('stream', (stream) => {         
                console.log("rtps=>"+JSON.stringify(stream));            
            });
        });
        // rtsp to
        


    })
}
