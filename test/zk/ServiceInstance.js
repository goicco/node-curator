var uuid			= require('node-uuid');


function ServiceInstance (name, uri) {
	this.name = name;
	this.id = uuid.v4();
	this.uri = uri;
}

ServiceInstance.prototype.getId = function(){
	var self = this;
	return self.id;
}

ServiceInstance.prototype.getName = function(){
	var self = this;
	return self.name;
}

ServiceInstance.prototype.getUri = function () {
	var self = this;
	return self.uri;
}

function build(name){
	return new ServiceInstance(name);
}

function serialize(service){
	var instance = new Object();
	instance.name = service.name;
	instance.id = service.id;
	instance.uri = service.uri;

	return JSON.stringify(instance);
}

function deserialize(rawStr){
	var instance = JSON.parse(rawStr);
	var service = new ServiceInstance(instance.name, instance.uri);

	return service;
}

exports.build = build;
exports.serialize = serialize;
exports.deserialize = deserialize;
exports.ServiceInstance = ServiceInstance;