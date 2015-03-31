var async		= require('async');
var ZooKeeper	= require('zookeeper');

function ServiceDiscovery (host, port, basePath) {
	this.host = host;
	this.port = port;
	this.basePath = basePath;
	this.client = new ZooKeeper({
		connect : host + ':' + port;
		timeout : 4000,
		debug_level : Zookeeper.ZOO_LOG_LEVEL_WARN,
		host_order_deterministic: false		
	});

	this.pathForName = function (name) {
		return this.basePath + '/' + name;
	}

	this.pathForInstance = function (name, id) {
		return this.basePath + '/' + name + '/' + id;
	}
}


ServiceDiscovery.prototype.registerService = function (service, callback) {
	var instancePath = this.pathForInstance(service.getName(), service.getId());
	var servicePath = this.pathForName(service.getName());

	async.waterfall([
				function (next) {
					this.client.mkdirp(servicePath, next);
				}, function (next) {
					this.client.create(instancePath, new Buffer(JSON.stringify(service.entity)),ZooKeeper.ZOO_SEQUENCE | ZooKeeper.ZOO_EPHEMERAL, 
						function (rc, error, path) {
							if (rc != 0){
								console.log('error is %e', error);
							}
							next();
						})
				}
			],function (error) {
				if (callback) {
					callback(error, null);
				}
			}
		);
}

function build (host, port, basePath) {
	return new ServiceDiscovery(host, port, basePath);
}

exports.build = build;
exports.ServiceDiscovery = ServiceDiscovery;