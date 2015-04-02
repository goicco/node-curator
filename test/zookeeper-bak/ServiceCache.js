var ZooKeeper		= require('zookeeper');
var EventEmitter	= require('events').EventEmitter;
var async			= require('async');

function ServiceCache (discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.serviceName = name;
	self.emitter = new EventEmitter();
	self.instances = new Array();
	self.instanceInx = 0;

	this.watchPath = function (path) {
		var self = this;

		process.nextTick( function(){
			self.discovery.client.aw_get_children (
					path,
					function (type, state, path) {
						self.emitter.emit(type);
						self.watchPath(path);
					},
					function (rc, error, children) {
						//callback(null, children);
					}
				)
		});
	}



	this.registerWatch = function (path, callback) {
		process.nextTick(function() {
			self.discovery.client.aw_get_children (
					path,
					self.onWatch,
					function (rc, error, children) {
						if (error != 'ok') {
							console.log('error: %s',error);
						}

						if (callback) {
							self.updateInstance(children, callback);
						}
					}
				);
		})
	}

	this.onWatch = function (type, state, path) {
		console.log('type is %s:', type);
		self.emitter.emit(type);
		self.registerWatch(path);
	}

	this.updateInstance = function(instanceIds, callback) {
		var self = this;

		for (var i = 0;i < instanceIds.length; i++) {
			self.instances[i] = {
				'id' : instanceIds[i]
			};
		}

		if (callback) {
			callback(null, self.getInstance());
		}
	}
}

ServiceCache.prototype.start = function(callback) {
	var self = this;
	self.registerWatch(self.discovery.pathForName(self.serviceName), callback);
}

ServiceCache.prototype.close = function() {

}

ServiceCache.prototype.getInstance = function() {
	var self = this;

	if( !self.instances || !self.instances.length) {
		return null;
	}

	return self.instances[self.instanceInx++ % self.instances.length];
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