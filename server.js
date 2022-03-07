
const app = require('./app');
const http = require('http');
//const netServer = require('./netSocket')
const ioServ =  require('./socketio')


var server = http.createServer(app).listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})
      
ioServ(server);

//netServer(10100);
//netServer(10200);
/*
const netSocketServer10100 = netServer(10100);
netSocketServer10100.listen(10100,()=>{
	console.log("10100번 포트 대기중....")
});

const netSocketServer10200 = netServer(10200);
netSocketServer10200.listen(10200,()=>{
	console.log("10200번 포트 대기중....")
});
*/
