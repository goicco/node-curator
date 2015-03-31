var Zookeeper		=	require("zookeeper");
var EventEmitter	=	require('events').EventEmitter;
var async			= 	require('async');

var client = new Zookeeper({
	connect : "112.124.117.146:2181",
	timeout : 4000,
	debug_level : Zookeeper.ZOO_LOG_LEVEL_WARN,
	host_order_deterministic: false
});

var onWatch = function (type, state, path){
	var emitter = new EventEmitter();
	emitter.emit(type);
	register();
}

var register = function () {
	process.nextTick(function () {
		client.aw_get_children (
				'/firebats/test',
				onWatch,
				function (rc, error, children) {
					console.log('children is %s', children);
				}
			);
		});
}

client.connect(function (error) {
	register();

	async.waterfall([
			function (next){
				client.a_create(
					'/firebats/test/123', 
					"test", 
					Zookeeper.ZOO_EPHEMERAL, 
					function (rc, error, path) {
						//console.log(error);
						next();
					});
			},function (next) {
				client.a_create(
					'/firebats/test/124', 
					"test", 
					Zookeeper.ZOO_EPHEMERAL, 
					function (rc, error, path) {
						//console.log(error);
						next();
					});				
			}
		], function (error){
		}
	)
});
	

/*
client.connect(function (error){
	console.log('connected');
	client.aw_get_children (
		'/firebats/test',
		function (type, state, path) {
			var emitter = new EventEmitter(type);
		},
		function (rc, error, children) {
			console.log('children is %s', children);
		}
	);
});
*/