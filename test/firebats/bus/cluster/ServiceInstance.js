var uuid 	= require('node-uuid');
var os 		= require('os');
var Service = require('./Service.js');

function ServiceInstance (name, id, address, payload, registrationTimeUTC, serviceType) {
	this.name = name;
	this.id = id;
	this.address = address;
	this.payload = payload;//JSON.parse(payload);
	this.registrationTimeUTC = registrationTimeUTC;
	this.serviceType = serviceType;
}

ServiceInstance.prototype.getName = function(){
	return this.name;
}

ServiceInstance.prototype.getId = function(){
	return this.id;
}

ServiceInstance.prototype.getPayload = function(){
	return this.payload;
}

function deserialize(rawStr) {
	var obj = JSON.parse(rawStr);

	return new ServiceInstance(
					obj.name, 
					obj.id, 
					obj.address, 
					Service.deserialize(obj.payload),
					obj.registrationTimeUTC,
					obj.serviceType
				);
}

function serialize(obj) {
}

function build (name, uri, serviceType) {
	var hostName = os.hostname();
	//TODO set nodeId
	var payload = Service.create(null, name, uri);
	var serviceType = serviceType ? serviceType : "DYNAMIC";
	return new ServiceInstance(
					name, 
					payload.getServiceId(), 
					hostName, 
					payload, 
					Date.now(), 
					serviceType
				);
}

exports.build = build;
exports.serialize = serialize;
exports.deserialize = deserialize;
exports.ServiceInstance = ServiceInstance;