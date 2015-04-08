var async = require('async');
var WebSocketClient = require('websocket').client;

function BusClient(uri) {
	this.uri = uri;
	this.client = new WebSocketClient();
}

BusClient.prototype.connect = function (callback) {
	var self = this;

	//TODO decode uri
	self.client.connect('ws://192.168.1.220:44856/bus', null);
	self.client.on('connect', function (connection) {
		self.connection = connection;
		callback(null, self);
	});
}

BusClient.prototype.close = function () {

}

BusClient.prototype.writeAndFlush = function (message) {
	var self = this;

	if (self.connection) {
		self.connection.send(message);
	}
}

function create(uri) {
	return new BusClient(uri);
}

exports.create = create;
exports.BusClient = BusClient;