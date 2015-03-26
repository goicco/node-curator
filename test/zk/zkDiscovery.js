var async				=		require("async");
var zookeeper			=		require("node-zookeeper-client");
var ServiceInstance		=		require("./ServiceInstance.js");
var ServiceDiscovery	=		require("./ServiceDiscovery.js");	



var service1 = ServiceInstance.build("test");
var service2 = ServiceInstance.build("test");

var discovery = ServiceDiscovery.build("112.124.117.146", "2181", "/firebats");


discovery.client.once("connected", function(){
	discovery.registerService(service1);
	discovery.registerService(service2);
	/*
	var path = '/txn';
	discovery.client.getData(
				path, 
				function (event) {
	            	console.log('Got event: %s', event);
	            	getData(client, path);
	        	},
				function (error, data, stat) {
					if (error) {
					    console.log('Error occurred when getting data: %s.', error);
					    return;
					}

					console.log(
					    'Node: %s has data: %s, version: %d',
					    path,
					    data ? data.toString() : undefined,
					    stat.version
					);
				});
	*/
	async.waterfall([
		function(callback) {
			discovery.queryForInstances('test');
		},
		function(instances, callback) {
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