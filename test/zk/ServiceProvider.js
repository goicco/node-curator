function ServiceProvider(serviceName) {
	this.serviceName = serviceName;
}

function build(serviceName){
	return new ServiceProvider(serviceName);
}

exports.build = build;
exports.ServiceProvider = ServiceProvider;