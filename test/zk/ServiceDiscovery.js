var async           = require('async');

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

    self.client.transaction().
                create(self.basePath).
                create(servicePath).
                create(instancePath, new Buffer(ServiceInstance.serialize(service))).
                commit(function (error, results) {
                    if (error && error.getCode() === Exception.NODE_EXISTS) {
                        //self.client.transaction().remove(instancePath, -1);
                    }
                });
};


ServiceDiscovery.prototype.unregisterService = function(service) {
    var self = this;
    var instancePath = self.pathForInstance(service.getName(), service.getId());

    self.client.remove(instancePath, function(error){
        if (error) {}
    });
    self.services.delete(service.getId());
}

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
                return ServiceInstance.deserialize(data.toString());
            } else {
                return null;
            }
        }
    );
}

ServiceDiscovery.prototype.queryForInstances = function(name, callback) {
    var self = this;
    var servicePath = self.pathForName(name);
    var instances = new Array();
    
    self.client.getChildren(
        servicePath,
        function (event) {
            console.log('Got watcher event: %s', event);
        },
        function (error, data, stat) {
            if(data == null){
                return null;
            } else {
                async.each(
                    data, 
                    function(instanceId, callback){
                        var instancePath = self.pathForInstance(name, instanceId);
                        self.client.getData(
                                instancePath,
                                function (event) {},
                                function (error, data, stat) {
                                    if(data != null) {
                                        instances.push(ServiceInstance.deserialize(data.toString()));
                                        callback();
                                    }
                                }
                            );

                    }, function (error){
                        callback(null, instances);
                    }
                );
            }
        }
    );
}

function build(localhost, port, basePath){
	return new ServiceDiscovery(localhost, port, basePath);
}

exports.build = build;
exports.ServiceDiscovery = ServiceDiscovery;
