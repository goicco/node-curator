var async				= require('async');
var ZooKeeper 			= require('zookeeper');
var ServiceDiscovery	= require('./ServiceDiscovery.js');
var ServiceInstance		= require('./ServiceInstance.js');
var ServiceCache		= require('./ServiceCache.js');

var discovery = ServiceDiscovery.build('192.168.1.220', '2181', '/firebats/services');
var cache = ServiceCache.build(discovery, 'bus.user.username.check');


discovery.client.connect(function (error) {
	async.waterfall([
			function (next) {
				cache.start(next);
			}, function (result, next) {
				var rawInstance = cache.getInstance();
				var instance = ServiceInstance.deserialize(rawInstance);
				//console.log("getInstance() %s", cache.getInstance());
				
				console.log(instance.getPayload());
				next(null, null);
			}
		]);
});