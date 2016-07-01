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
	else console.log("not client");
});