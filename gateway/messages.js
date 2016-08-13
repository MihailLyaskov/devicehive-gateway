
// NEED TO IMPLEMENT SUBSCRIBTION TO DEVICE COMMANDS






var Messages = function(dh){
	this.dh = dh;
	this.sub = [];

};

Messages.prototype.SendMessage = function(messageData,mqtt){
	if(messageData.messageType == 'sendCommand'){
			this.dh.sendCommand(messageData.deviceID,messageData.command, messageData.parameters ,function(err, res) {
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(err));
					return err;
				}
				console.log( messageData.command + " send to " + messageData.deviceID + "with parameters" + messageData.parameters );
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
			});
	}
	else if(messageData.messageType == 'getNetworks'){
		this.dh.getNetworks(messageData.filter,function(err,res){
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(err));
					return err;
				}
				console.log(" getNetworks message sent to DH server");
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
				
		});
	}
	else if(messageData.messageType == 'getDevices'){
		this.dh.getDevices(null,function(err,res){
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(err));
					return err;
				}
				console.log(" getDevices message sent to DH server");
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
				
			});

	}
	else if(messageData.messageType == 'getEquipmentState'){
		this.dh.getEquipmentState(messageData.deviceID,function(err,res){
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(err));
					return err;
				}
				console.log(" getEquipmentState message sent to DH server for " + messageData.deviceID);
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
				
			});

	}
	else if(messageData.messageType == 'getNotifications'){
		this.dh.getNotifications(messageData.deviceID,messageData.filter,function(err,res){
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(err));
					return err;
				}
				console.log(" getNotifications message sent to DH server for " + messageData.deviceID);
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
				
			});

	}
	else if(messageData.messageType == 'Subscribe'){
		var subscribtion = this.dh.subscribe( function (err,res ){
			if(err){
				console.log(err);
				mqtt.publish(messageData.subPath,JSON.stringify(err));
				//return err
			}
			//console.log('SUBSCRIBE RESULLT '+ JSON.stringify(res && res.subscribtionId));
			//mqtt.publish(messageData.subPath+'/'+messageData.subscription.deviceIds,'SUBSCRIBTION ID '+ JSON.stringify(res.subscriptionId));
			//return res;
		},messageData.subscribtion);
		this.sub.push(subscribtion);
		var number = this.sub.length-1;
		mqtt.publish(messageData.subPath,number.toString());
		subscribtion.message(function(deviceIds,arguments){
			console.log(JSON.stringify(arguments.parameters));
			var data = arguments.parameters;
			var buf = new Buffer(data.data, 'base64');
			mqtt.publish(messageData.subPath+'/'+messageData.subscription.deviceIds,buf.toString('utf8'));
		});
	}
	else if(messageData.messageType == 'Unsubscribe'){
		var subscribtion = this.dh.unsubscribe(this.sub[messageData.subscription],function (err,res){
			if(err){
				console.log(err);
				mqtt.publish(messageData.subPath,JSON.stringify(err));
			}
			//console.log(res);
			mqtt.publish(messageData.subPath,JSON.stringify(res));
			
			//return res;
		});
		this.sub.splice(messageData.subscription,1);
		mqtt.publish(messageData.subPath,'unsubscribed for ');
	}
	else{
			console.log('Unknown message!');
	}

};

module.exports = Messages;