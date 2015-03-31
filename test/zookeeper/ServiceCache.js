var ZooKeeper		= require('zookeeper');
var EventEmitter	= require('events').EventEmitter;
var async			= require('async');

function ServiceCache (discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.serviceName = name;
	self.emitter = new EventEmitter();

	var onWatch = function (type, state, path) {
		emitter.emit(type);
		register();
	}

	var register = function (path, watch) {
		process.nextTick(function() {
			client.aw_get_children (
					path,
					onWatch,
					function (rc, error, children) {
						if(error) {
							console.log(error);
						}
						else{
							this.updateInstance(children);
						}
					}
				);
		})
	}

	var updateInstance = function(instanceIds) {
		console.log(instanceIds);
	}
}


ServiceCache.prototype.start = function() {
	this.register();
};


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