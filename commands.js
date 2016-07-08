
var Commands = function(dh){
	this.dh = dh;

};

Commands.prototype.SendCommand = function(commandData){
	if(commandData.command == 'gpio/write'){
			this.dh.sendCommand(commandData.device,commandData.command, commandData.parameters ,function(err, res) {
				if(err){
					console.log(err);
				}
				console.log("equipment sendNotification " + "esp-device" + " " + commandData.command);
				console.log(res);
				return;
			});
	}
	else{
			console.log('Unknown command!');
	}

};

module.exports = Commands;