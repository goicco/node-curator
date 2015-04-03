var io 		= require('socket.io');
var socket	= require('socket.io-client');

function RawBus () {
	this.clients = new Array();

	this.createClient = function (uri) {
		return socket.connect(uri);
	}
}

RawBus.prototype.getOrConnectAsync = function(service) {
	var self = this;
	var find = self.clients[service.getUri()];

	if (find != null) return find;
	final var newConnection = self.createClient(service.getUri());
	self.clients[service.getUri()] = newConnection;

	newConnection.on();
}