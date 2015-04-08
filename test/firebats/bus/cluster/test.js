var async				= require('async');
var ServiceDiscovery	= require('./ServiceDiscovery.js');
var ServiceInstance		= require('./ServiceInstance.js');
var ServiceCache		= require('./ServiceCache.js');
var RawBus				= require('./RawBus.js');

var discovery = ServiceDiscovery.build('192.168.1.220', '2181', '/firebats/services');
var bus = RawBus.build(discovery);

discovery.client.connect(function (error) {
	async.waterfall([
			function (next) {
				var data = {
					'cid' : '0',
					'c': 'bus.user.email.exist',
					'data' : {
						'username': 'nengzhizhi'
					}
				}
				bus.send('bus.user.username.check', JSON.stringify(data), next);
				//discovery.select('bus.user.username.check', next);
			},
			function (result, next) {
				console.log(result);
			}
		]);
})