var zookeeper		= require('node-zookeeper-client');
var Exception       = require('node-zookeeper-client/lib/Exception');
var ServiceInstance = require('./ServiceInstance.js');

function ServiceDiscovery (localhost, port, basePath) {
	this.client = zookeeper.createClient(localhost + ':' + port);
	this.services = new Map();
    this.basePath = basePath;

    this.pathForName = function(name) {
        return this.basePath + '/' + name;
    }

    this.pathForInstance = function(name, id){
        return this.basePath + '/' + name + '/' + id;
    }
}

ServiceDiscovery.prototype.registerService = function (service) {
    var self = this;
    var instancePath = self.pathForInstance(service.getName(), service.getId());
    var servicePath = self.pathForName(service.getName());

	self.services.set(service.getId(), service);


    for(var i = 0;i < 2; i++){
        self.client.transaction().
        create(self.basePath).
        create(servicePath).
        create(instancePath, new Buffer(ServiceInstance.serialize(service))).
        commit(function (error, results) {
            if (error && error.getCode() === Exception.NODE_EXISTS) {
                self.client.transaction().remove(instancePath, -1);
            }
        });
    }
};

/**
 * Get the names of all know services
 *
 * @return list of service names
 */

ServiceDiscovery.prototype.queryForNames = function () {
    var self = this;
    var names = new Array();

    self.client.getChildren(
        self.basePath,
        function (event){
            console.log('Got watcher event: %s', event);
        },
        function (error, children, stat) {
            //console.log('Children of node: %s are: %j.', self.path, children);
            return children;
        }
    );
}

ServiceDiscovery.prototype.queryForInstance = function(name, id) {
    var self = this;
    var instancePath = self.pathForInstance(name, id);

    self.client.getData(
        instancePath,
        function (event) {

        },
        function (error, data, stat) {
            if( data != null){
                console.log(ServiceInstance.deserialize(data.toString()));
                return ServiceInstance.deserialize(data.toString());
            } else {
                return null;
            }
        }
    );
}

ServiceDiscovery.prototype.queryForInstances = function(name) {
    var self = this;
    var servicePath = self.pathForName(name);
    var instances = new Array();

    self.client.getChildren(
        servicePath,
        function (event) {

        },
        function (error, data, stat) {
            if(data == null){
                return null;
            } else {
                for(var i = 0; i < data.length; i++){
                    var instance = self.queryForInstance(name, data[i]);

                    if(instance != null) {
                        instances.push(instance);
                    }
                }
            }
            return instances;
        }
    );
}

function build(localhost, port, basePath){
	return new ServiceDiscovery(localhost, port, basePath);
}

exports.build = build;
exports.ServiceDiscovery = ServiceDiscovery;
