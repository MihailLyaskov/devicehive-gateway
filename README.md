# DeviceHive-Gateway
Configurable gateway for DeviceHive containing Client and Device.

## Dependencies:
The code is tested on Ubuntu 14.04 LTS.

###Installing NodeJS and npm

```sh
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm         //installing needed modules described in package.json
```
###Installing MQTT Mosquito Broker
Eclipse Mosquitto™ is an open source (EPL/EDL licensed) message broker that implements the MQTT protocol versions 3.1 and 3.1.1.
MQTT provides a lightweight method of carrying out messaging using a publish/subscribe model. This makes it suitable for "Internet of Things" 
messaging such as with low power sensors or mobile devices such as phones, embedded computers or microcontrollers like the Arduino.
In our current implementation MQTT is used for IPC (inter-process communication) between the gateway modules and user apps.

```sh
sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
sudo apt-get update
sudo apt-get install mosquitto
```

## Configuration file structure
Node-config organizes hierarchical configurations for your app deployments.
It lets you define a set of default parameters, and extend them for different deployment environments (development, qa, staging, production, etc.).
Configurations are stored in configuration files within your application, and can be overridden and extended by environment variables, command line parameters, or external sources.
This gives your application a consistent configuration interface shared among a growing list of npm modules also using node-config.

The "connectors" array may contain configuration of different numbers of clients and devices that will be running in parallel.

```json
default.json

{
	"connectors": [ 
		{ // Client Connector
			"type":"client",
			"apiurl":"http://playground.devicehive.com/api/rest",
			"accessKey":"FsJCDRAbjTO+5GA8b0nydWJvtHl4Nwc4wZqHnqM/+Gk="
		},
		{ //Device Connector and Device Registration
			"type": "device",
			"deviceId": "database",
    	"deviceKey": "devicekey",
			"deviceName": "database",
			"deviceClass": {
				"name": "Services",
				"version": "0.0.1"
			},
			"apiurl": "http://playground.devicehive.com/api/rest",
			"accessKey": "FsJCDRAbjTO+5GA8b0nydWJvtHl4Nwc4wZqHnqM/+Gk=",
			"equipment": 
				{
					"name": "Database",
					"code": "Database",
					"type": "server",
					"MQTT_pub_sub": "device/database", //MQTT Main device topic
					"commands": [   //Commands supported by the device
						 "database/davicelog/start",
						 "database/devicelog/stop",
						 "database/query"
					]
				}
		}
	]
}
```
## Client Gateway Command parameters

The current implementation of DeviceHive Client supports couple of commands, which are sent to MQTT 'client/SendMessage' topic.
The client uses websocket chanel for communication with DeviceHive.
#### Send command to Device
parameters:
```json
{
		"messageType" : "sendCommand",
		"filter" : null ,
		"deviceID" : "esp-device",
		"command" : "gpio/write" ,
		"parameters" : { "5":1 } 
}
```

#### Subscribe for Device Notifications
After the subscribtion is done a number is returned. This number of the subscribtion is used later for unsubscribing.
parameters:
subPath is the MQTT path to which the subscribe command in being sent and sub number is being recieved.
names is the name of the notification.
Notifications for the subscribed device are returned in client/subscribe/<deviceID> MQTT Topic.
```json
{
		"messageType" : "Subscribe",
		"subPath" : "client/subscribe",
		"subscription" : {
			"deviceIds" : "esp-device",
			"names" : "uart/int",
			"onMessage" : "uart/int"
		}
}
```
#### Unsubscribe for Device Notifications
Parameters:
subscription holds the subscription number.
```json
{
	  "messageType" : "Unsubscribe",
		"subPath" : "client/subscribe",
		"subscription" : null ,
		"deviceIds" : "esp-device"		
}
```

#### Get all the networks in the current DeviceHive Instance 
Parameters:
filter is used to filter out networks
Returns array of json objects giving describtion for the current networks.
```json
{
    "messageType" : "getNetworks",
    "filter" : null
}
```

#### Get description for all the devices in current DeviceHive network 
Parameters:
filter is used to filter out devices.
Returns array of json objects giving describtion for the devices.
```json
{
    "messageType" : "getDevices",
    "filter" : null
}
```

#### Get the current state of a device in the network. 
Parameters:
filter is used to filter out devices. 
Returns array of json objects giving describtion for the devices.
```json
{
    "messageType" : "getEquipmentState",
    "deviceID" : "esp-device"
}
```

## Device Gateway

The Device Gateway registers a device in the network using information from the configuration file config/default.json.
After that it subscribes for the commands listed again in config/default.json - equipment.commands.
The MQTT Topic used for sending commands to the applications is device/command and the topic for responses in device/command/response

## Running the gateway and test apps
After seting up the configuration file ,gateway can be started with 
```sh
bash start.sh
```
and after that you can try either the client test
```sh
nodejs ./tests/app.js
```
or device test 

```sh
nodejs ./tests/devicetest.js
```

## Other usefull information
More information about the JavaScript implementation of DeviceHive Client and Device can be found here : https://github.com/devicehive/devicehive-javascript
Information about DeviceHive API : http://devicehive.com/restful/
ESP8266 Devicehive Firmware commands : https://github.com/devicehive/esp8266-firmware/blob/master/COMMANDS.md
The board for testing the application is OLIMEX ESP8266 EVB : https://www.olimex.com/Products/IoT/ESP8266-EVB/open-source-hardware
