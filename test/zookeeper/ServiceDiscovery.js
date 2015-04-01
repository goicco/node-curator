var async			= require('async');
var ZooKeeper		= require('zookeeper');
var ServiceProvider = require('./ServiceProvider.js');

function ServiceDiscovery (host, port, basePath) {
	this.host = host;
	this.port = port;
	this.basePath = basePath;
	this.client = new ZooKeeper({
		connect : host + ':' + port,
		timeout : 4000,
		debug_level : ZooKeeper.ZOO_LOG_LEVEL_WARN,
		host_order_deterministic: false		
	});
	this.providers = new Object();

	this.pathForName = function (name) {
		return this.basePath + '/' + name;
	}

	this.pathForInstance = function (name, id) {
		return this.basePath + '/' + name + '/' + id;
	}
}


ServiceDiscovery.prototype.register = function (service, callback) {
	var self = this;
	var instancePath = this.pathForInstance(service.getName(), service.getId());
	var servicePath = this.pathForName(service.getName());

	async.waterfall([
				function (next) {
					self.client.mkdirp(servicePath, next);
				}, function (result, next) {
					process.nextTick( function(){
						self.client.a_create(instancePath, new Buffer(JSON.stringify(service.entity)), ZooKeeper.ZOO_EPHEMERAL, 
							function (rc, error, path) {
								if (rc != 0){
									console.log('error is %e', error);
								}
								next();
							})
					});
				}
			],function (error) {
				if (callback) {
					callback(error, null);
				}
			}
		);
}

ServiceDiscovery.prototype.unregister = function (serviceId) {

}

ServiceDiscovery.prototype.getOrLoadProvider = function (serviceName) {
	var self = this;
	var provider = self.providers[serviceName];

	if( !provider) {
		provider = ServiceProvider.build(this, serviceName);
		provider.start();
		self.providers[serviceName] = provider;
	}
	return provider;
}

ServiceDiscovery.prototype.select = function (serviceName){
	var self = this;
	var provider = self.getOrLoadProvider(serviceName);
	if(provider) {
		var instance = provider.getInstance();
		console.log('instance is %s', instance);
		return instance;
	} else {
		return null;
	}
}

function build (host, port, basePath) {
	return new ServiceDiscovery(host, port, basePath);
}

exports.build = build;
exports.ServiceDiscovery = ServiceDiscovery;