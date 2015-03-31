var zkplus	=	require('zkplus');

var client = zkplus.createClient({
	connectTimeout: 4000,
	servers: [{
		host: '112.124.117.146',
		port: 2181
	}]
});

client.connect(function (error) {
	console.log(error);
	/*
	client.get('/firebats/test/a1974c76-362e-412e-afa9-6d4cd822253d', function (error, obj){
		console.log('123');
	});
	*/

	client.mkdirp('/firebats/test2', function (error){
		console.log('2');
	});
})