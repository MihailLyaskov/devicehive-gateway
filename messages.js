
// NEED TO IMPLEMENT SUBSCRIBTION TO DEVICE COMMANDS






var Messages = function(dh){
	this.dh = dh;

};

Messages.prototype.SendMessage = function(messageData,mqtt){
	if(messageData.messageType == 'sendCommand'){
			this.dh.sendCommand(messageData.deviceID,messageData.command, messageData.parameters ,function(err, res) {
				if(err){
					console.log(err);
					mqtt.publish('client/response' , JSON.stringify(res));
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
					mqtt.publish('client/response' , JSON.stringify(res));
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
					mqtt.publish('client/response' , JSON.stringify(res));
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
					mqtt.publish('client/response' , JSON.stringify(res));
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
					return err;
					mqtt.publish('client/response' , JSON.stringify(res));
				}
				console.log(" getNotifications message sent to DH server for " + messageData.deviceID);
				console.log(res);
				mqtt.publish('client/response' , JSON.stringify(res));
				return res;
				
			});

	}
	else{
			console.log('Unknown message!');
	}

};

module.exports = Messages;