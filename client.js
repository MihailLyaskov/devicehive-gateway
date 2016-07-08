global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
var DeviceHive = require('./devicehive.client');
var Commands = require('./commands');

var Client = function (options){
	var DH = new DeviceHive(options.apiurl , options.accessKey);
	var commands = new Commands(DH);
	
	this.commands=commands;
	this.DH = DH;

};

Client.prototype.start = function (cb,handler){
	var self = this;
	var data = {
		device : "esp-device",
		command : "gpio/write" ,
		parameters : { "5":1 } 
	}
	

	console.log("trying to open chanell!");
	self.DH.openChannel(function (err, res) {
	            if (err) {
	                console.log(err);
	            }
	            console.log("trying to send command!");
				self.commands.SendCommand(data);



				/*self.DH.sendCommand('esp-device',self.command, self.parameters1 ,function(err, res) {
					if(err){
						console.log(err);
					}
					console.log("equipment sendNotification " + "esp-device" + " " + self.command);
					console.log(res);
					return;
				}); */

				/*setTimeout( function(){
					self.DH.sendCommand('esp-device',self.command, self.parameters0 ,function(err, res) {
						if(err){
							console.log(err);
						}
						console.log("equipment sendNotification " + "esp-device" + " " + self.command);
						console.log(res);
						return;
					});
					self.DH.closeChannel(
						function(err,res){
							if(err){
								console.log("failed to close websocket channel");
							}
							else console.log(res);
						}
					);

				},3000);*/
	        }, 
	        "websocket"
	);
};


module.exports = Client;