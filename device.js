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
	 			});

	            return cb();
	        }, "websocket");
	    }
	);

};






	
	
/*
	console.log("trying to open chanell!");
	self.DH.openChannel(function (err, res) {
	            if (err) {
	                console.log(err);
	            }
	            var mqtt = require('mqtt');
	 			var client = mqtt.connect('mqtt://localhost');
	            console.log("trying to send message!");
				//self.messages.SendMessage(data);
				client.on('connect', function(){
  					client.subscribe('client/SendMessage');
  					// Inform that client gateway is online
  					client.publish('client/status', '{ "status": "online" }');
  					console.log('MQTT Client online!');
				})

				client.on('message', function(topic, message){
					var res;
  					//console.log('received message %s %s', topic, message.toString());
  					switch (topic) {
    				case 'client/SendMessage':
      					res = self.messages.SendMessage(JSON.parse(message),client);
      					
      					//client.publish('client/response' , JSON.stringify(res));
      					break;
    				default:
    					console.log("No topic");
    					break;
  					}
				});

	        }, 
	        "websocket"
	);
};*/


module.exports = Device;