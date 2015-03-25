var uuid			= require('node-uuid');


function ServiceInstance (name) {
	this.name = name;
	this.id = uuid.v4();
}

ServiceInstance.prototype.getId = function(){
	var self = this;
	return self.id;
}

ServiceInstance.prototype.getName = function(){
	var self = this;
	return self.name;
}

function build(name){
	return new ServiceInstance(name);
}

function serialize(service){
	var instance = new Object();
	instance.name = service.name;
	instance.id = service.id;

	return JSON.stringify(instance);
}

function deserialize(rawStr){
	var instance = JSON.parse(rawStr);
	var service = new ServiceInstance(instance.name);

	return service;
}

exports.build = build;
exports.serialize = serialize;
exports.deserialize = deserialize;
exports.ServiceInstance = ServiceInstance;