var async				=		require("async");
var zookeeper			=		require("node-zookeeper-client");
var ServiceInstance		=		require("./ServiceInstance.js");
var ServiceDiscovery	=		require("./ServiceDiscovery.js");	



var service1 = ServiceInstance.build("test", null);
var service2 = ServiceInstance.build("test", null);

var discovery = ServiceDiscovery.build("112.124.117.146", "2181", "/firebats");


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
			discovery.queryForInstance('test', '69913d26-16e5-4175-8ca8-8a57262e0d92', next);
		},
		function (instances, next) {
			console.log('remove');
			discovery.client.remove('/firebats/test/69913d26-16e5-4175-8ca8-8a57262e0d92', function(error){

			});
			//discovery.unregisterService();
		}
	], function (error, result){
		//console.log(result);
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