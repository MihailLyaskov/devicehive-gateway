global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
var config = require('config');


var gateway = config.connectors.map( function(connconfig){
	if(connconfig.type == "client"){
		var Client = require('./client');
		var client = new Client(connconfig);

		client.start(
			function(err,res){
				if(err){
					return console.log(err);
				}
				else console.log('Client started successfully');
			},
			null
		);
	}
	else if(connconfig.type == "device"){
		var Device = require('./device');
		var device = new Device(connconfig);

		device.start(
			function(err,res){
				if(err){
					console.log(err);
				}
				else console.log('Device '+ connconfig.DeviceId + 'started successfully' );
			},null
		);

	}
	else console.log("not client");
});