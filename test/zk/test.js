var async				=		require("async");
var zookeeper			=		require("node-zookeeper-client");
var ServiceInstance		=		require("./ServiceInstance.js");
var ServiceDiscovery	=		require("./ServiceDiscovery.js");
var ServiceCache		=		require("./ServiceCache.js");

var service1			= 		ServiceInstance.build("test", null);
var service2			= 		ServiceInstance.build("test", null);

var discovery = ServiceDiscovery.build("112.124.117.146", "2181", "/firebats");

discovery.client.once("connected", function(){
	async.waterfall([
			function (next) {
				discovery.registerService(service1, next);
			},function (cache, next) {
				discovery.registerService(service2, next);
			}
		], function (error, result){

		});
});
discovery.client.connect();