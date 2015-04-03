var io = require('socket.io-client');


var socket = io.connect('ws://192.168.1.220:42739/bus');
var data = {
    "c" : "bus.user.username.check",
    "data" : {
        "username" : "nengzhizhi"
    }
}


socket.on('connect', function(){
	socket.emit(JSON.stringify(data));
	//socket.emit('message', {'1':1});
});