var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');
var message1 = {
		messageType : "sendCommand",
		filter : null ,
		deviceID : "esp-device",
		command : "gpio/write" ,
		parameters : { "5":1 } 
	};

var message2 = {
		messageType : "sendCommand",
		filter : null ,
		deviceID : "esp-device",
		command : "gpio/write" ,
		parameters : { "5":0 } 
	};
var SubMessage = {
		messageType : "Subscribe",
		subPath : "client/subscribe/esp-device",
		subscription : {
			deviceIds : "esp-device",
			names : "uart/int",
			onMessage : "uart/int"
		}
};

var message3 = {
		messageType : "sendCommand",
		filter : null ,
		deviceID : "esp-device",
		command : "uart/int" ,
		parameters : { "mode": "115200" }
}

client.on('connect', function(){
  client.subscribe('client/status');
  client.subscribe('client/response');
  client.subscribe('client/subscribe/esp-device');
});

client.on('message', function(topic, message){
  switch (topic) {
    case 'client/status':
      return handleClientStatus(message);
    case 'client/response':
      return handleClientResponse(message);
    case 'client/subscribe/esp-device':
      return handleSubscribtion(message);
  }
  console.log('No handler for topic %s', topic);
})

function handleSubscribtion(message){
	console.log('subscription %s', message);
};

function handleClientStatus (message) {
  console.log('client gateway %s', message);
};

function handleClientResponse (message) {
  console.log('Client response %s', message.toString());
};


setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  console.log('send command');
  client.publish('client/SendMessage', JSON.stringify(message1));

}, 5000);

setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  console.log('send command');
  client.publish('client/SendMessage', JSON.stringify(message3));

}, 7000);

setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  console.log('subscribtion');
  client.publish('client/SendMessage', JSON.stringify(SubMessage));
}, 15000);

setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  console.log('send command');
  client.publish('client/SendMessage', JSON.stringify(message2));
}, 120000);