var DeviceHive = require('./devicehive.device');

var Device = function (options){
	var DH = new DeviceHive(options.apiurl ,options.deviceId, options.accessKey);
	this.dh = DH;
	this.key = options.deviceKey;
	this.deviceName = options.deviceName;
	this.deviceClass = options.deviceClass;
	this.equipment = options.equipment;
	//this.MQTTpath = options.

};

Device.prototype.start = function (cb,handler){
	var self = this;
	console.log("Device registering: " + self.deviceName);
    self.dh.registerDevice(
		{
			guid: self.deviceId,
	        name: self.deviceName,
	        key: self.key, // obsolete but still required	
	        status: "Online",
	        deviceClass: {
	            name: self.deviceClass.name,
	            version: self.deviceClass.version,
	            equipment: [
	            	{
	            		name: self.equipment.name,
	            		type: self.equipment.type, 
	            		code: self.equipment.code
	            	}
	           	] 
	        }
	    }, 
		function (err, res) {
	        if (err) {
	        	console.log(err);
	            return cb(err);
	        }
	        self.dh.openChannel(function (err, res) {
	            if (err) {
	            	console.log(err);
	                return cb(err);
	            }
				var mqtt = require('mqtt');
	 			var device = mqtt.connect('mqtt://localhost');
	 			
	 			device.on('connect', function(){
  					device.publish(self.equipment.MQTT_pub_sub, '{ "gateway":"device","status": "online" }');
  					console.log('MQTT Device online!');
				});
	 			
	 			var SubCommands = {
	 				names: self.equipment.commands
	 			};
	 			
	 			var CmdSub = self.dh.subscribe(function(err,res){
	 				if(err){
	 					console.log(err);
	 				}
	 				console.log('DEVICE SUBSCRIBES TO MASAGES '+JSON.stringify(res));
	 			},SubCommands);

	 			

	 			CmdSub.message(function(cmd){
	 				console.log(JSON.stringify(cmd));
	 				device.subscribe(self.equipment.MQTT_pub_sub + '/response');
	 				device.on('message', function(topic, message){
						if( topic == self.equipment.MQTT_pub_sub + '/response'){
      						cmd.update(JSON.parse(message),function(err,res){
      							if(err)
      								console.log(err);
      							console.log('Command updated!');
      						});
  						}
  						else device.publish(self.equipment.MQTT_pub_sub,'Incorect Topic!');
  						device.unsubscribe(self.equipment.MQTT_pub_sub + '/response');
					});
					device.publish(self.equipment.MQTT_pub_sub,JSON.stringify(cmd));
	 			});

	            return cb();
	        }, "websocket");
	    }
	);

};



module.exports = Device;