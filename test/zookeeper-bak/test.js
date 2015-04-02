var async				= require('async');
var ZooKeeper 			= require('zookeeper');
var ServiceDiscovery	= require('./ServiceDiscovery.js');
var ServiceInstance		= require('./ServiceInstance.js');
var ServiceCache		= require('./ServiceCache.js');
var EventEmitter		= require('events').EventEmitter;

var discovery = ServiceDiscovery.build('112.124.117.146', '2181', '/firebats/test');
var cache = ServiceCache.build(discovery, '001');

var service1 = ServiceInstance.build('001');
var service2 = ServiceInstance.build('001');
var service3 = ServiceInstance.build('001');
var service4 = ServiceInstance.build('001');


discovery.client.connect(function (error) {
	async.waterfall([
			function (next) {
				discovery.register(service1, next);
			}, function (result, next) {
				cache.watchPath(discovery.pathForName('001'), next);
			}, function (result, next) {
				console.log("1 :" + result);
				discovery.register(service2, next);
			}, function (result, next) {
				cache.watchPath(discovery.pathForName('001'), next);
			}, function (result, next) {
				console.log("2 :" + result);
			}
		]);
})

/*
discovery.client.connect(function (error) {
	async.waterfall([
		function (next) {
			discovery.register(service1, next);
		}, function (result, next) {
			discovery.select('001', next);
		}, function (result, next) {
			console.log(result);
			next();
		}, function (next) {
			discovery.register(service2, next);
		}, function (result, next) {
			console.log(result);
			discovery.select('001', next);
		}, function (result, next) {
			console.log(result);
		}
	], function(error){

	});
});
*/
/*
discovery.client.connect(function (error) {
	cache.start();

	async.waterfall([
			function (next) {
				console.log('service1 id is %s:', service1.getId());
				process.nextTick( function(){
					discovery.registerService(service1, next);
				});
			}, function (result, next) {
				console.log('service2 id is %s:', service2.getId());
				process.nextTick( function(){
					discovery.registerService(service2, next);
				});
			}, function (result, next) {
				console.log('service3 id is %s:', service3.getId());
				process.nextTick( function(){
					discovery.registerService(service3, next);
				});				
			}
		],function(err){});
})
*/
