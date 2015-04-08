var uuid = require('node-uuid');

function Service(nodeId, name, id, uri){
	this.nodeId = nodeId;
	this.name = name;
	this.uri = uri;
	this.serviceId = id;
}

Service.prototype.getName = function () {
	var self = this;
	return self.name;
};

Service.prototype.getUri = function () {
	var self = this;
	return self.uri;
}

Service.prototype.getServiceId = function () {
	var self = this;
	return self.serviceId;
}

function deserialize(obj) {
	return new Service(obj.nodeId, obj.name, obj.serviceId, obj.uri);
}

function create(nodeId, name, uri) {
	return new Service(nodeId, name, uuid.v4(), uri);
}

exports.create = create;
exports.deserialize = deserialize;
exports.Service = Service;