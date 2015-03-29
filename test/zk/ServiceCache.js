var ServiceInstance =		require('./ServiceInstance.js');


function ServiceCache(discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.instances = new Map();
	self.serviceName = name;


	var childEvent = null;
	self.start = function() {
		self.discovery.client.getChildren(
				self.discovery.pathForName(self.serviceName),
				function (event){
					childEvent = event;
					self.start();
				},
				function (error, data, status){
					if(childEvent){
						console.log(childEvent);
						switch (childEvent.name){
							case 'NODE_CREATED':
							case 'NODE_CHILDREN_CHANGED':
							case 'NODE_DATA_CHANGED':
							case 'NODE_DELETED':
								self.updateInstance(data);
								break;
						}
					}
				}
			);
	};

	self.updateInstance = function (instanceIds) {
		for(var i = 0; i < instanceIds.length; i++) {
			if(instances.get(instanceIds[i])) {

			}
			else {

			}


			self.discovery.client.getData(
					self.discovery.pathForInstance(self.serviceName, instanceIds[i]),
					null,
					function (error, data, status){
						if(error){
							console.log(error);
						} else {
							var serviceInstance = ServiceInstance.build(data.toString());
							self.instances.set(instanceIds[i], serviceInstance);
						}
					}
				);
		}
	}
}

function build (discovery, name, callback){
	if(callback){
		callback(null, new ServiceCache(discovery, name));
	}
	else{
		return new ServiceCache(discovery, name);
	}
}

exports.build = build;
exports.ServiceCache = ServiceCache;
