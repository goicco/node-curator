var util 		= require('util');
var BusClient	= require('./BusClient.js');


function RawBus() {
	this.clients = [];
	//FIXME to use cache
	this.replyObserverQueue = [];

	this.createClient = function (uri) {
		return BusClient.create(uri);
	}

	this.getOrConnectAsync = function (service) {
		var self = this;
		var find = self.clients.get(service.getUri());

		if(find) return find;
		final var newConnection = createClient(service.getUri);
		self.clients[service.getUri()] = newConnection;

		newConnection.connection.on('message', function (message) {
			if (message.type == 'utf8') {
				var correlationId = self.parseCid(message.utf8Data);
				if (correlationId) {
					//get reply observer[function]
					var x = self.replyObserverQueue[correlationId];
					if (x) {
						x(message.utf8Data);
					}
				}
			}
		});

		return newConnection;
	}
}

RawBus.prototype.send = function (channel, message, callback) {
	var self = this;

	var service = discovery.select(channel);
	if (!service) {
		var e = util.format('send failed, channel[%s] no subscriber', channel);
		callback(e, null);
	} else {
		var connection = self.getOrConnectAsync(service);
		connection.writeAndFlush(message, callback);
	}
}

function 