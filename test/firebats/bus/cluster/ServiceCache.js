var ZK 				= require('zookeeper');
var async			= require('async');
var ServiceInstance	= require('./ServiceInstance.js');

function ServiceCache (discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.serviceName = name;
	self.instances = [];
	self.instanceInx = 0;

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

	this.updateInstance = function(instanceIds, callback) {
		var self = this;

		if (!instanceIds) {
			return;
		}

		async.each(
			instanceIds, 
			function (instanceId, next) {
				self.discovery.client.a_get(
						self.discovery.pathForInstance(self.serviceName, instanceId),
						null,
						function (rc, msg, stat, data) {
							self.instances[instanceId] 
								= ServiceInstance.deserialize(data.toString());
							next();
						}
					)
			},
			function (error) {
				if (error) {
					console.log(error);
				}

				if (callback) {
					callback(null, self.getInstance());
				}
			}
		);
	}
}

ServiceCache.prototype.watchChild = function(path) {
	var self = this;

	process.nextTick( function(){
		self.discovery.client.aw_get_children (
			path,
			function (type, state, path) {
				var event = self.translateEvent(type);
				self.watchChild(path);
			}, function (rc, error, children){
				if (error != 'ok'){
					console.log(error);
				}
				self.updateInstance(children);
			}
		);
	});
}

ServiceCache.prototype.start = function (callback) {
	var self = this;

	var path = self.discovery.pathForName(self.serviceName);
	self.watchChild(path);
	self.discovery.client.a_get_children (
			path,
			null,
			function (rc, error, children) {
				if (error != 'ok'){
					console.log(error);
					//callback(error, null);
				}
				self.updateInstance(children, callback);
			}
		);
}

ServiceCache.prototype.getInstance = function () {
	var self = this;

	if ( !self.instances ) {
		return null;
	}

	var keys = new Array();
	self.instances.sort();
	for (var key in self.instances) {
		keys.push(key);
	}
	var theKey = keys[self.instanceInx++ % keys.length]; 
	return self.instances[theKey];
}


function build(discovery, name){
	return new ServiceCache(discovery, name);
}

exports.build = build;
exports.ServiceCache = ServiceCache;