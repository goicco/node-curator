var WebSocketClient = require('websocket').client;

function BusClient(uri) {
	this.uri = uri;
	this.client = new WebSocketClient();
}

BusClient.prototype.create = function (uri) {
	return new BusClient(uri);
}

BusClient.prototype.connect = function (callback) {
	var self = this;

	self.client.connect(self.uri, null);
	self.client.on('connect', function (connection) {
		connection.on('error', function (error) {

		});
		connection.on('message', function (message) {
			if(message.type == 'utf8') {
				
			}
		});
	});
}

BusClient.prototype.close = function () {

}


BusClient.prototype.writeAndFlush = function () {

}