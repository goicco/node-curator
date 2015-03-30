var async			=		require('async');
var ServiceInstance =		require('./ServiceInstance.js');


function ServiceCache(discovery, name) {
	var self = this;

	self.discovery = discovery;
	self.instances = {};
	self.serviceName = name;

	/*
	var childEvent = null;
	self.start = function () {
		async.waterfall([
				function (next) {
					self.discovery.client.getChildren(
						self.discovery.pathForName(self.serviceName),
						function (event){
							console.log("event = %s", event);
							childEvent = event;
							self.start();
						},
						function (error, data, status) {
							console.log("childEvent = %s", childEvent);
							if (childEvent) {
								next(data);
							}
						});
				},function (instanceIds, next) {
					delete self.instances;
					self.instances = {};
				
					console.log('instanceIds = %s', instanceIds);

					if(instanceIds != undefined) {
						async.each(
							instanceIds, 
							function (instanceId, callback){
								self.discovery.client.getData(
									self.discovery.pathForInstance(self.serviceName, instanceId),
									null,
									function (error, data, status){
										if (error) {
											console.log(error);
										} else {
											var serviceInstance = ServiceInstance.build(data.toString());
											self.instances[instanceId] = serviceInstance;
										}
										callback();
									}
								);
							},
							function (error){
								next();
							}
						);
					}					
				}
			], function(error, result){

			}
		);
	}

	self.stop = function () {

	}
	*/

	/*
	self.start = function () {
		self.discovery.client.getChildren(				
			self.discovery.pathForName(self.serviceName),
				function (event){
					childEvent = event;
					self.start();
				},
				function (error, data, status){
					console.log("childEvent = %s", childEvent);
					if(childEvent){
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

	self.stop = function () {

	}

	//FIXME to optimize async
	self.updateInstance = function (instanceIds) {
		delete self.instances;
		self.instances = {};

		if(instanceIds != undefined) {
			async.each(
				instanceIds, 
				function (instanceId, callback){
					self.discovery.client.getData(
						self.discovery.pathForInstance(self.serviceName, instanceId),
						null,
						function (error, data, status){
							if (error) {
								console.log(error);
							} else {
								var serviceInstance = ServiceInstance.build(data.toString());
								self.instances[instanceId] = serviceInstance;
							}
							callback();
						}
					);
				},
				function (error){}
			);
		}
	}
	*/
}


ServiceCache.prototype.getInstances = function() {
	var self = this;
	var instancesArray = new Array();

	for (var key in self.instances){
		instancesArray.push(self.instances[key]);
	}

	return instancesArray;
};

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
