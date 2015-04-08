var async = require('async');
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
		self.connection = connection;
	});
}

BusClient.prototype.close = function () {

}

BusClient.prototype.writeAndFlush = function (message, callback) {
	var self = this;

	if (self.connection) {
		self.connection.send(message);
	}
}

exports.create = create;
exports.BusClient = BusClient;