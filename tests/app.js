var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');
var subscribtionID;
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
		subPath : "client/subscribe",
		subscription : {
			deviceIds : "esp-device",
			names : "uart/int",
			onMessage : "uart/int"
		}
};

var UnSubMessage = {
	messageType : "Unsubscribe",
		subPath : "client/subscribe",
		subscription : null ,
		deviceIds : "esp-device"		
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
  client.subscribe('client/subscribe');
});

client.on('message', function(topic, message){
  switch (topic) {
    case 'client/status':
      return handleClientStatus(message);
    case 'client/response':
      return handleClientResponse(message);
    case SubMessage.subPath+'/'+SubMessage.subscription.deviceIds:
      return handleSubscribtionData(message);
    case 'client/subscribe':
      return handleSubscribtion(message);
 
  }
  console.log('No handler for topic %s', topic);
})

function handleSubscribtionData(message){
	console.log('subscription data' + message)
};

function handleSubscribtion(message){
	console.log('subscription ' + message.toString('utf8'));
	subscribtionID = message.toString('utf8');
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
  console.log('subscribtion ' + JSON.stringify(SubMessage));
  client.publish('client/SendMessage', JSON.stringify(SubMessage));
  client.subscribe(SubMessage.subPath+'/'+SubMessage.subscription.deviceIds);
}, 10000);

setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  var string = JSON.stringify(UnSubMessage);
  console.log('unsubscribe ' + string.replace('null',subscribtionID));
  client.publish('client/SendMessage', string.replace('null',subscribtionID));
  //client.unsubscribe(UnSubMessage.subPath+'/'+UnSubMessage.deviceIds);
}, 115000);

setTimeout(function(err){
  if(err){
  	console.log(err);
  }
  console.log('send command');
  client.publish('client/SendMessage', JSON.stringify(message2));
}, 120000);