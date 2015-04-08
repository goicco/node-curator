var util 		= require('util');
var BusClient	= require('./BusClient.js');
var async 		= require('async');


function RawBus(discovery) {
	this.clients = [];
	//FIXME to use node-cache
	this.replyObserverQueue = [];
	this.discovery = discovery;

	this.createClient = function (uri) {
		return BusClient.create(uri);
	}

	this.getOrConnectAsync = function (service, callback) {
		var self = this;
		var find = self.clients[service.getUri()];

		if (find) return find;

		var newConnection = self.createClient(service.getUri());
		self.clients[service.getUri()] = newConnection;

		async.waterfall([
				function (next) {
					newConnection.connect(next);
				}, function (newConnection, next) {
					newConnection.connection.on('message', function (message) {
						if (message.type == 'utf8') {
							console.log(message.utf8Data);
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
					next(null, newConnection);
				}
			], function (error, result) {
				callback(error, result);
			});
	}

	this.parseCid = function (text) {
		return JSON.parse(text).cid;
	}

	this.parseChannel = function (text) {
		return JSON.parse(text).channel;
	}
}

RawBus.prototype.send = function (channel, message, callback) {
	var self = this;

	async.waterfall([
			function (next) {
				self.discovery.select(channel, next);
			}, function (service, next) {
				if (!service) {
					var e = util.format('send failed, channel[%s] no subscriber', channel);
					next(e, null);
				} else {
					self.getOrConnectAsync(service.getPayload(), next);
				}
			}, function (connection, next) {
				connection.writeAndFlush(message, next);
			}
		], function (error, result) {
			if (callback) {
				callback(error, result);
			}
		});
}

RawBus.prototype.receive = function (channel) {

}

function build(discovery) {
	return new RawBus(discovery);
}

exports.build = build;
exports.RawBus = RawBus;