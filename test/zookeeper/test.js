var ServiceDiscovery	= require('./ServiceDiscovery.js');
var ServiceInstance		= require('./ServiceInstance.js');
var ServiceCache		= require('./ServiceCache.js');

var discovery = ServiceDiscovery.build('112.124.117.146', '2181', '/firebats/test');
var cache = ServiceCache.build(discovery, '001');

var service = ServiceInstance.build('001');


discovery.client.connect(function (error) {
	async.waterfall([
			function (next) {
				discovery.registerService(service);
			}
		],function(err){});
})
