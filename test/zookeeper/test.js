var async				= require('async');
var ZooKeeper 			= require('zookeeper');
var ServiceDiscovery	= require('./ServiceDiscovery.js');
var ServiceInstance		= require('./ServiceInstance.js');
var ServiceCache		= require('./ServiceCache.js');


var discovery = ServiceDiscovery.build('112.124.117.146', '2181', '/firebats/test');
var cache = ServiceCache.build(discovery, '001');

var service1 = ServiceInstance.build('001');
var service2 = ServiceInstance.build('001');

discovery.client.connect(function (error) {
	async.waterfall([
			function (next) {
				discovery.register(service2, next);
			},
			function (result, next) {
				cache.start(next);
			}, 
			function (result, next) {
				console.log("getInstance() %s", cache.getInstance());
				next(null, null);
			},
			function (result, next) {
				discovery.register(service1, next);
			},
			function (result, next) {
				console.log("getInstance() %s", cache.getInstance());
				next(null, null);
			},
			function (result, next) {
				console.log("getInstance() %s", cache.getInstance());
				next(null, null);
			},
			function (result, next) {
				//console.log("getInstance() %s", cache.getInstance());
				next(null, null);
			}
		]);
});
