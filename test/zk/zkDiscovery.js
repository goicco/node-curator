var async				=		require("async");
var zookeeper			=		require("node-zookeeper-client");
var ServiceInstance		=		require("./ServiceInstance.js");
var ServiceDiscovery	=		require("./ServiceDiscovery.js");	



var service1 = ServiceInstance.build("test", null);
var service2 = ServiceInstance.build("test", null);

var discovery = ServiceDiscovery.build("192.168.1.220", "2181", "/firebats-yu/services");


discovery.client.once("connected", function(){
	/*
	discovery.registerService(service1, function(){
		//console.log('completed 1');
		discovery.registerService(service2, function(){
			//console.log('completed 2');
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
	
	async.waterfall([
		function (next) {
			discovery.queryForInstances('bus.question.create', next);
		},
		function (instances, next) {
			console.log(instances);
		}
	], function (error, result){
		console.log(result);
	});
});

discovery.client.connect();



/*
var client = zookeeper.createClient("112.124.117.146:2181");
var path = '/test';

client.once('connected', function () {
    console.log('Connected to the server.');

    client.create(path, function (error) {
        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        } else {
            console.log('Node: %s is successfully created.', path);
        }

        client.close();
    });
});

client.connect();
*/