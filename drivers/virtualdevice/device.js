"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');


module.exports = class WatchDevice extends Homey.Device {

	// this method is called when the Device is inited
	onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());

		
		
		// this.setCapabilityOptions('measure_devicecapabilities_number.number1', {title:'test1', units:'Status check'});        
		// this.setCapabilityValue('measure_devicecapabilities_number.number1', 0);

		Homeyman.Current.VirtualDevices[this.getName()] = this;

		var settings = this.getSettings();
		


		for (let i = 1; i <= settings.numberOfButtons; i++) this.registerCapabilityListener("button.button" +i, ((value, options)=> {
			this.driver.triggerButton(this,value, {field:{id:"button" +i}});
		}).bind(this));


		// this.registerCapabilityListener('devicecapabilities_string', this.setValue.bind(this));
		// this.registerCapabilityListener('measure_devicecapabilities_number', this.setValue.bind(this));
		// this.registerCapabilityListener('alarm_devicecapabilities_boolean', this.setValue.bind(this));
	}

	// async button_pushed (value, options) {
	// 	this.driver.triggerButton(this,value);
	// 	//this.log(value);
	//   }

	async onSettings({ oldSettings, newSettings, changedKeys }) {
		changedKeys.forEach(key => {
			switch (key) {
				case 'numberOfTextFields':
					for (let i = 1; i <= newSettings.numberOfTextFields; i++) if(!this.hasCapability('devicecapabilities_text.text'+i)) this.addCapability('devicecapabilities_text.text'+i);
					for (let i = newSettings.numberOfTextFields+1; i <= 10; i++) if(this.hasCapability('devicecapabilities_text.text'+i)) this.removeCapability('devicecapabilities_text.text'+i);
					break;
				case 'numberOfNumberFields':
					for (let i = 1; i <= newSettings.numberOfNumberFields; i++) if(!this.hasCapability('measure_devicecapabilities_number.number'+i)) this.addCapability('measure_devicecapabilities_number.number'+i);
					for (let i = newSettings.numberOfNumberFields+1; i <= 10; i++) if(this.hasCapability('measure_devicecapabilities_number.number'+i)) this.removeCapability('measure_devicecapabilities_number.number'+i);
					break;
				case 'numberOfBooleanFields':					
					for (let i = 1; i <= newSettings.numberOfBooleanFields; i++) if(!this.hasCapability('alarm_devicecapabilities_boolean.boolean'+i)) this.addCapability('alarm_devicecapabilities_boolean.boolean'+i);
					for (let i = newSettings.numberOfBooleanFields+1; i <= 10; i++) if(this.hasCapability('alarm_devicecapabilities_boolean.boolean'+i)) this.removeCapability('alarm_devicecapabilities_boolean.boolean'+i);
					break;
				case 'numberOfButtons':					
					for (let i = 1; i <= newSettings.numberOfButtons; i++) if(!this.hasCapability('button.button'+i)) this.addCapability('button.button'+i);
					for (let i = newSettings.numberOfButtons+1; i <= 10; i++) if(this.hasCapability('button.button'+i)) this.removeCapability('button.button'+i);
					//for (let i = 1; i <= 10; i++) this.removeCapability("button.button" +i,);
					for (let i = 1; i <= newSettings.numberOfButtons; i++) this.registerCapabilityListener("button.button" +i, ((value, options)=> {
						this.driver.triggerButton(this,value, {field:{id:"button" +i}});
					}).bind(this));
					break;
				case 'numberOfStatusFields':
					for (let i = 1; i <= newSettings.numberOfStatusFields; i++) if(!this.hasCapability('measure_devicecapabilities_status.status'+i)) this.addCapability('measure_devicecapabilities_status.status'+i);
					for (let i = newSettings.numberOfStatusFields+1; i <= 10; i++) if(this.hasCapability('measure_devicecapabilities_status.status'+i)) this.removeCapability('measure_devicecapabilities_status.status'+i);
					break;
			}
		});
		// run when the user has changed the device's settings in Homey.
		// changedKeysArr contains an array of keys that have been changed
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	  }
}
