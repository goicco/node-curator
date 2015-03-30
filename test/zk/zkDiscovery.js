var async				=		require("async");
var zookeeper			=		require("node-zookeeper-client");
var ServiceInstance		=		require("./ServiceInstance.js");
var ServiceDiscovery	=		require("./ServiceDiscovery.js");
var ServiceCache		=		require("./ServiceCache.js");
var ServiceProvider		=		require("./ServiceProvider.js");


var service1 = ServiceInstance.build("test", null);
var service2 = ServiceInstance.build("test", null);

var discovery = ServiceDiscovery.build("112.124.117.146", "2181", "/firebats");


discovery.client.once("connected", function(){

	/*
	discovery.registerService(service1, function(){
		console.log('completed 1');
		discovery.registerService(service2, function(){
			console.log('completed 2');
		});
	});
	*/

	/*
	discovery.registerService(service1);
	discovery.registerService(service2);
	*/
	/*
	discovery.queryForInstances('test', function(error, data){
		console.log(data);
	});
	*/
	
	/*
	async.waterfall([
		function (next) {
			discovery.queryForInstances('test', next);
		},
		function (instances, next) {
			for(var i = 0; i < instances.length; i++){
				discovery.client.remove('/firebats/test/' + instances[i].id, function(error){
				});
			}
		}
	], function (error, result){
		//console.log(result);
	});
	*/

	/*
	async.waterfall([
			function (next) {
				ServiceCache.build(discovery, 'test', next);
			},function (cache, next) {
				discovery.registerService(service1, next);
			},function (cache, next) {
				discovery.registerService(service2, next);
			}
		], function (error, result){

		});
	*/
	var provider = ServiceProvider.build(discovery, 'test');
	provider.start();

	async.waterfall([
		function (next) {
			discovery.registerService(service1, next);
		},function (cache, next) {
			var instance = provider.getInstance();
		}
	], function(error, result){

	});

});

discovery.client.connect();