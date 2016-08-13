var mqtt = require('mqtt');
var device = mqtt.connect('mqtt://localhost');


device.on('connect', function(){
  device.subscribe('device/database');
});

device.on('message', function(topic, message){
  if(topic == 'device/database'){
  	var msg = JSON.parse(message);
  	switch(msg.command){
  		case 'database/query': 
  			return handleQuerry(msg);
  	}
  }
  //console.log('No handler for topic %s', topic);
});

function handleQuerry(message){
	device.publish('device/database/response','{"command":"database/query","status":"OK","parameters":{"message":"Hello!"}}');
}