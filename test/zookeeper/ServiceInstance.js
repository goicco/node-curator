var uuid = require('node-uuid');

function ServiceInstance (name) {
	this.entity = new Object();
	this.entity.name = name;
	this.entity.ServiceId = uuid.v4();
}

ServiceInstance.prototype.getName = function(){
	return this.entity.ServiceName;
}

ServiceInstance.prototype.getId = function(){
	return this.entity.ServiceId;
}

function build(name) {
	return new ServiceInstance(name);
}

exports.build = build;
exports.ServiceInstance = ServiceInstance;