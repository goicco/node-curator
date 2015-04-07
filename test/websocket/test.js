var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
    	console.log(message);
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    
	var data = {
        "cid" : 2,
	    "c" : "bus.user.username.check",
	    "data" : {
	        "username" : "nengzhizhi"
	    }
	}

	connection.send(JSON.stringify(data));
    
    //connection.ping(JSON.stringify(data));
});

client.connect('ws://192.168.1.174:51222/bus', null);