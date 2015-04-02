var uuid = require('node-uuid');

function ServiceInstance (name) {
	this.entity = new Object();
	this.entity.serviceName = name;
	this.entity.serviceId = uuid.v4();
}

ServiceInstance.prototype.getName = function(){
	return this.entity.serviceName;
}

ServiceInstance.prototype.getId = function(){
	return this.entity.serviceId;
}

function build(name) {
	return new ServiceInstance(name);
}

exports.build = build;
exports.ServiceInstance = ServiceInstance;