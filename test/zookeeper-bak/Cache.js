var ZK 				= require('zookeeper');
var events			= require('events');
var async			= require('async');
var util			= require('util');


function ServiceCache (discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.serviceName = name;

	this.translateEvent = function(event) {
		var e;

		switch (event) {
			case ZK.ZOO_CREATED_EVENT:
				e = 'create';
				break;
			case ZK.ZOO_DELETED_EVENT:
				e = 'delete';
				break;
			case ZK.ZOO_CHANGED_EVENT:
				e = 'change';
				break;
			case ZK.ZOO_CHILD_EVENT:
				e = 'child';
				break;
			case ZK.ZOO_SESSION_EVENT:
				e = 'session';
				break;
			case ZK.ZOO_NOTWATCHING_EVENT:
				e = 'nowatch';
				break;
			default:
				e = 'unknown';
				break;
		}
		return (e);
	}
}

util.inherits(ServiceCache, events.EventEmitter);

ServiceCache.prototype.watchChild = function(path) {
	var self = this;

	process.nextTick( function(){
		self.discovery.client.aw_get_children (
			path,
			function (type, state, path) {
				var event = translateEvent(type);
				self.emit(type);
				self.watchChild(path);
			},
			function (rc, error, children){

			}
		);
	});
}

ServiceCache.prototype.start = function () {
	var self = 
}


function build(discovery, name){
	return new ServiceCache(discovery, name);
}

exports.build = build;
exports.ServiceCache = ServiceCache;