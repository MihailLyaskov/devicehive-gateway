global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
var DeviceHive = require('./devicehive.client');
var Messages = require('./messages');



var Client = function (options){
	var DH = new DeviceHive(options.apiurl , options.accessKey);
	var messages = new Messages(DH);
	this.messages=messages;
	this.DH = DH;
};

Client.prototype.start = function (cb,handler){
	var self = this;
	

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
};


module.exports = Client;