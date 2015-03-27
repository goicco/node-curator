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

ServiceDiscovery.prototype.registerService = function (service, callback) {
    var self = this;
    var instancePath = self.pathForInstance(service.getName(), service.getId());
    var servicePath = self.pathForName(service.getName());

	self.services.set(service.getId(), service);

    async.waterfall([
        function (next){
            self.client.mkdirp(servicePath, zookeeper.CreateMode.PERSISTENT, next);
        },function (path, next) {
            self.client.transaction().
                create(instancePath, zookeeper.CreateMode.PERSISTENT ,new Buffer(ServiceInstance.serialize(service))).
                commit(function (error, results) {
                    if (error && error.getCode() === Exception.NODE_EXISTS) {
                        console.log('NODE_EXISTS');
                    }
                    next();
                })
        }], function (error, result){
            callback();
        });
};


ServiceDiscovery.prototype.unregisterService = function(service, callback) {
    var self = this;
    var instancePath = self.pathForInstance(service.getName(), service.getId());

    self.client.remove(instancePath, function(error){
        if (error) {}
        callback();
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

ServiceDiscovery.prototype.queryForInstance = function(name, id, callback) {
    var self = this;
    var instancePath = self.pathForInstance(name, id);

    self.client.getData(
        instancePath,
        function (event) {
            console.log(event);
        },
        function (error, data, stat) {
            if( data != null){
                //FIXME to return service instance.
                callback(null, data.toString());
            } else {
                callback(null, null);
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
                async.eachSeries(
                    data, 
                    function (instanceId, next){
                        var instancePath = self.pathForInstance(name, instanceId);
                        self.client.getData(
                            instancePath,
                            function (event) {
                                console.log('Got event :%s', event);
                            },
                            function (error, data, stat) {
                                console.log(data);
                                if(data != null) {
                                    //FIXME to parse instance
                                    var rawInstance = JSON.parse(data.toString());
                                    instances.push(rawInstance);
                                    next();
                                }
                            }
                        );

                    }, function (error){
                        if (callback) {
                            callback(null, instances);
                        }
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
