var ServiceInstance	=		require('./ServiceInstance.js');
var ServiceCache	=		require('./ServiceCache.js');

function ServiceProvider(discovery, serviceName) {
	this.serviceName	= serviceName;
	this.discovery		= discovery;
	this.cache			= ServiceCache.build(this.discovery, this.serviceName);
	this.instanceIndex	= 0;
}

ServiceProvider.prototype.getInstance = function() {
	var self = this;
	
	var instances = self.cache.getInstances();
	console.log('instances = %s', instances);
	if ( !instances || instances.length == 0 ){
		return null;
	}
	return instances[self.instanceIndex++ % (instances.length -1)]; 
}

ServiceProvider.prototype.start = function(callback) {
	var self = this;
	self.cache.start(callback);
};

ServiceProvider.prototype.close = function() {
	var self = this;
	self.cache.stop();
}

function build(discovery, serviceName, callback){
	if(callback){
		return new ServiceProvider(discovery, serviceName, callback);
	} else {
		return new ServiceProvider(discovery, serviceName);
	}
}

exports.build = build;
exports.ServiceProvider = ServiceProvider;