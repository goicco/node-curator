var ServiceCache = require('./ServiceCache.js');

function ServiceProvider(discovery, serviceName) {
	this.serviceName = serviceName;
	this.discovery = discovery;
	this.cache = ServiceCache.build(this.discovery, this.serviceName);
	this.instanceInx = 0;
}

ServiceProvider.prototype.getInstance = function() {
	var self = this;

	var instances = self.cache.getInstances();

	if( !instances || instances.length == 0) {
		return null;
	}

	return instances[self.instanceInx++ % (instances.length - 1)];
}

ServiceProvider.prototype.start = function() {
	var self = this;

	self.cache.start();
}

ServiceProvider.prototype.close = function() {

}

function build(discovery, serviceName){
	return new ServiceProvider(discovery, serviceName);
}

exports.build = build;
exports.ServiceProvider = ServiceProvider;