"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');


module.exports = class WatchDevice extends Homey.Device {

	// this method is called when the Device is inited
	onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());

		Homeyman.Current.VirtualDevices[this.getName()] = this;

		// this.registerCapabilityListener('devicecapatilies_string', this.setValue.bind(this));
		// this.registerCapabilityListener('measure_devicecapatilies_number', this.setValue.bind(this));
		// this.registerCapabilityListener('alarm_devicecapatilies_boolean', this.setValue.bind(this));
	}

	async onSettings({ oldSettings, newSettings, changedKeys }) {
		changedKeys.forEach(key => {
			switch (key) {
				case 'numberOfTextFields':
					for (let i = 1; i <= newSettings.numberOfTextFields; i++) if(!this.hasCapability('devicecapatilies_text.text'+i)) this.addCapability('devicecapatilies_text.text'+i);
					for (let i = newSettings.numberOfTextFields+1; i <= 10; i++) if(this.hasCapability('devicecapatilies_text.text'+i)) this.removeCapability('devicecapatilies_text.text'+i);
					break;
				case 'numberOfNumberFields':
					for (let i = 1; i <= newSettings.numberOfNumberFields; i++) if(!this.hasCapability('measure_devicecapatilies_number.number'+i)) this.addCapability('measure_devicecapatilies_number.number'+i);
					for (let i = newSettings.numberOfNumberFields+1; i <= 10; i++) if(this.hasCapability('measure_devicecapatilies_number.number'+i)) this.removeCapability('measure_devicecapatilies_number.number'+i);
					break;
				case 'numberOfBooleanFields':					
					for (let i = 1; i <= newSettings.numberOfBooleanFields; i++) if(!this.hasCapability('alarm_devicecapatilies_boolean.boolean'+i)) this.addCapability('alarm_devicecapatilies_boolean.boolean'+i);
					for (let i = newSettings.numberOfBooleanFields+1; i <= 10; i++) if(this.hasCapability('alarm_devicecapatilies_boolean.boolean'+i)) this.removeCapability('alarm_devicecapatilies_boolean.boolean'+i);
				break;
			}
		});
		// run when the user has changed the device's settings in Homey.
		// changedKeysArr contains an array of keys that have been changed
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	  }
}
