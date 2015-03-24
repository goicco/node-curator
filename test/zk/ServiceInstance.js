function ServiceInstance (name, path) {
	this.name = name;
	this.path = path;
	this.id = '123';
}


ServiceInstance.prototype.serialize = function(){
	var instance = new Object();
	instance.name = this.name;

	return JSON.stringify(instance);
}

ServiceInstance.prototype.deserialize = function(raw){
	var instance = JSON.parse(raw);
	this.name = instance.name;

	return this;
}

ServiceInstance.prototype.getId = function(){
	return this.id;
}

function build(name){
	return new ServiceInstance(name);
}

exports.build = build;
exports.ServiceInstance = ServiceInstance;