"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');


module.exports = class WatchDevice extends Homey.Device {

	// this method is called when the Device is inited
	onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.removeCapability('measure_temperature').then(x=> {
			var a = x;
		});
		


		// this.setCapabilityOptions('measure_devicecapabilities_number.number1', {title:'test1', units:'Status check'});        
		// this.setCapabilityValue('measure_devicecapabilities_number.number1', 0);

		Homeyman.Current.VirtualDevices[this.getName()] = this;

		var settings = this.getSettings();



		for (let i = 1; i <= 10; i++) {
			if(i==1) {
				if(this.hasCapability("button")) this.registerCapabilityListener("button", ((value, options) => {
					this.driver.triggerButton(this, value, { field: { id: "button" + i } });
				}).bind(this));
				if(this.hasCapability("onoff")) this.registerCapabilityListener("onoff", ((value, options) => {
					this.driver.triggerButton(this, value, { field: { id: "button" + i } });
				}).bind(this));
			} else  {
				if(this.hasCapability("button.button" + i)) this.registerCapabilityListener("button.button" + i, ((value, options) => {
					this.driver.triggerButton(this, value, { field: { id: "button" + i } });
				}).bind(this));
				if(this.hasCapability("onoff.button" + i)) this.registerCapabilityListener("onoff.button" + i, ((value, options) => {
					this.driver.triggerButton(this, value, { field: { id: "button" + i } });
				}).bind(this));
			}
		}


		// this.registerCapabilityListener('devicecapabilities_string', this.setValue.bind(this));
		// this.registerCapabilityListener('measure_devicecapabilities_number', this.setValue.bind(this));
		// this.registerCapabilityListener('alarm_devicecapabilities_boolean', this.setValue.bind(this));
	}

	// async button_pushed (value, options) {
	// 	this.driver.triggerButton(this,value);
	// 	//this.log(value);
	//   }

	async loadFromSettings(settings) {
		var types = ['text', 'number', 'boolean', 'status', 'button'];
		types.forEach(async (type) => {
			for (let i = 1; i <= 4; i++) {
				var cap = 'devicecapabilities_' + type + '.' + type + i;
				let isAlarm = type == 'boolean' && settings[type + i + 'AsAlarm']===true;
				let isOnOff = type == 'button' && settings[type + i + 'AsOnOff']===true;
				switch (type) {
					case "number": 
					case "status": 
						cap = 'measure_devicecapabilities_' + type + '.' + type + i; break;
					case "boolean":
						cap = (isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + type + '.' + type + i;
						if (isAlarm && this.hasCapability('devicecapabilities_' + type + '.' + type + i)) await this.removeCapability('devicecapabilities_' + type + '.' + type + i);
						if (!isAlarm && this.hasCapability('alarm_devicecapabilities_' + type + '.' + type + i)) await this.removeCapability('alarm_devicecapabilities_' + type + '.' + type + i);
						
						break;
					case "button":
						if(i===1) {
							if (!isOnOff && this.hasCapability('onoff')) await this.removeCapability('onoff');
							if (isOnOff && this.hasCapability(type)) await this.removeCapability(type);						
							cap = isOnOff ? ('onoff'): (type); 
							// if (this.hasCapability('onoff.' + type + i)) await this.removeCapability('onoff.' + type + i);
							// if (this.hasCapability(type+ '.' + type + i)) await this.removeCapability(type+ '.' + type + i);		
						} else {
							if (!isOnOff && this.hasCapability('onoff.' + type + i)) await this.removeCapability('onoff.' + type + i);
							if (isOnOff && this.hasCapability(type+ '.' + type + i)) await this.removeCapability(type+ '.' + type + i);						
							cap = isOnOff ? ('onoff.' + type + i): (type + '.' + type + i); 
						}
						break;
				}
				let name = settings[type + i + 'Name'];
				if (name && name.length > 0) {
					if (!this.hasCapability(cap)) {
						await this.addCapability(cap);
						if(type=='button') {
							try {								
								this.registerCapabilityListener(cap, ((value, options) => {
									this.driver.triggerButton(this, value, { field: { id: "button" + i } });
								}).bind(this));
							} catch (error) {
								
							}
						}
					}
					var optHas = this.hasCapability(cap);
					var opt;
					
					try {
						opt = this.getCapabilityOptions(cap);
					} catch (error) {
						this.error(error);
					} 
					if (!opt) opt = {};
					if (
						opt.title != name || opt.preventInsights != settings[type + i + 'PreventInsights'] || 
						(opt.units != settings[type + i + 'Units'] && type!='status' ) || 
						opt.decimals != settings[type + i + 'Decimals'] || opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] || opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse']
					) {
						var optNew = {
							title: name, 
							preventInsights: settings[type + i + 'PreventInsights'],							
							decimals: settings[type + i + 'Decimals'],
							insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
							insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
						};
						if(settings[type + i + 'Units']) optNew.units= settings[type + i + 'Units'];
						if(settings[type + i + 'Icon']) optNew.icon= "/assets/" + settings[type + i + 'Icon'] + ".svg";
						if(type=='status') optNew.units= opt.units;
						this.setCapabilityOptions(cap,optNew);
					}
				} else if (this.hasCapability(cap)) await this.removeCapability(cap);

			}
		});

	}

	async onSettings({ oldSettings, newSettings, changedKeys }) {
		
		this.loadFromSettings(newSettings);
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
}
