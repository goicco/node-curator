var zookeeper		= require('node-zookeeper-client');

function ServiceDiscovery (localhost, port) {
	this.client = zookeeper.createClient(localhost + ':' + port);
	this.services = new Map();
	this.path = '';
}

ServiceDiscovery.prototype.registerService = function (service) {
	this.services.set(service.getId(), service);

	this.client.transaction().
		create('/txn', new Buffer(service.serialize())).
		commit(function (error, results) {
            if (error) {
                console.log(
                    'Failed to execute the transaction: %s, results: %j',
                    error,
                    results
                );

                return;
            }

            console.log('Transaction completed.');
        });

	return this;
};


function build(localhost, port){
	return new ServiceDiscovery(localhost, port);
}

exports.build = build;
exports.ServiceDiscovery = ServiceDiscovery;
