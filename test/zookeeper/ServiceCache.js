var ZooKeeper		= require('zookeeper');
var EventEmitter	= require('events').EventEmitter;
var async			= require('async');

function ServiceCache (discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.serviceName = name;
	self.emitter = new EventEmitter();
	self.instances = {};

	this.registerWatch = function (path) {
		process.nextTick(function() {
			self.discovery.client.aw_get_children (
					path,
					self.onWatch,
					function (rc, error, children) {
						if (error != 'ok') {
							console.log('error: %s',error);
						}
						self.updateInstance(children);
					}
				);
		})
	}

	this.onWatch = function (type, state, path) {
		console.log('type is %s:', type);
		self.emitter.emit(type);
		self.registerWatch(path);
	}

	this.updateInstance = function(instanceIds) {
		var self = this;

		for (var i = 0;i < instanceIds.length; i++) {
			self.instances[instanceIds[i]] = 'blank';
		}
	}
}

ServiceCache.prototype.start = function() {
	var self = this;
	self.registerWatch(self.discovery.pathForName(self.serviceName));
}

ServiceCache.prototype.close = function() {

}

ServiceCache.prototype.getInstances = function() {
	var self = this;
	return self.instances;
}

function build(discovery, name, callback){
	if(callback){
		callback(new ServiceCache(discovery, name));
	}
	else{
		return new ServiceCache(discovery, name);
	} 
}

exports.build = build;
exports.ServiceCache = ServiceCache;