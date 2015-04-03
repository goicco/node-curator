var uuid = require('node-uuid');
var os = require('os');

function ServiceInstance (name, id, address, payload, registrationTimeUTC, serviceType) {
	this.name = name;
	this.id = id;
	this.address = address;
	this.payload = JSON.parse(payload);
	this.registrationTimeUTC = registrationTimeUTC;
	this.serviceType = serviceType;
}

ServiceInstance.prototype.create = function(name, uri, serviceType){
	var hostName = os.hostname();
	var id = uuid.v4();
	var payload = {};
	payload.uri = uri;
	payload.name = name;
	payload.serviceId = id;
	//FIXME
	payload.nodeId = null;
	var serviceType = serviceType ? serviceType : "DYNAMIC";
	return new ServiceInstance(name, id, hostname, payload, Date.now(), serviceType);
}

ServiceInstance.prototype.getName = function(){
	return this.name;
}

ServiceInstance.prototype.getId = function(){
	return this.id;
}

function deserialize(rawStr) {
	var obj = JSON.parse(rawStr);

	return new ServiceInstance(
					obj.name, 
					obj.id, 
					obj.address, 
					obj.payload,
					obj.registrationTimeUTC,
					obj.serviceType
				);
}

function serialize() {

}

exports.serialize = serialize;
exports.deserialize = deserialize;
exports.ServiceInstance = ServiceInstance;