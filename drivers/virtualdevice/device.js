"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');


module.exports = class WatchDevice extends Homey.Device {

	// this method is called when the Device is inited
	onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		// this.removeCapability('measure_devicecapabilities_status_measure_temperature.status1');
		// this.removeCapability('measure_devicecapabilities_status.status1');
		


		// this.setCapabilityOptions('measure_devicecapabilities_number.number1', {title:'test1', units:'Status check'});        
		// this.setCapabilityValue('measure_devicecapabilities_number.number1', 0);

		Homeyman.Current.VirtualDevices[this.getName()] = this;

		


		for (let i = 1; i <= 10; i++) {
					
			if(i==1) {
				// var disabled = this.getButtonDisabled('button'+i);
				// if(disabled) return;

				if(this.hasCapability("button")) this.registerCapabilityListener("button", ((value, options) => {
					// var disabled = this.getButtonDisabled('button'+i);
					// if(disabled) this.setCapabilityValue("button",!value );
					// else 
					this.driver.triggerFlow(this, value, { field: { id: "button" + i } });
				}).bind(this));
				if(this.hasCapability("onoff")) this.registerCapabilityListener("onoff", ((value, options) => {
					// var disabled = this.getButtonDisabled('button'+i);
					// if(disabled) this.setCapabilityValue("onoff",!value );
					// else 
					this.driver.triggerFlow(this, value, { field: { id: "button" + i } });					
				}).bind(this));
			} else  {
				if(this.hasCapability("button.button" + i)) this.registerCapabilityListener("button.button" + i, ((value, options) => {
					// var disabled = this.getButtonDisabled('button'+i);
					// if(disabled) this.setCapabilityValue("button.button" + i,!value );
					// else 
					this.driver.triggerFlow(this, value, { field: { id: "button" + i } });
				}).bind(this));
				if(this.hasCapability("onoff.button" + i)) this.registerCapabilityListener("onoff.button" + i, ((value, options) => {
					// var disabled = this.getButtonDisabled('button'+i);
					// if(disabled) this.setCapabilityValue("onoff.button" + i,!value );
					// else 
					this.driver.triggerFlow(this, value, { field: { id: "button" + i } });
				}).bind(this));
			}
		}


		// this.registerCapabilityListener('devicecapabilities_string', this.setValue.bind(this));
		// this.registerCapabilityListener('measure_devicecapabilities_number', this.setValue.bind(this));
		// this.registerCapabilityListener('alarm_devicecapabilities_boolean', this.setValue.bind(this));
	}

	// async button_pushed (value, options) {
	// 	this.driver.triggerFlow(this,value);
	// 	//this.log(value);
	//   }

	getButtonDisabled(buttonName) {
		var settings = this.getSettings();
		return settings[buttonName+'Disabled'];
			
	}

	async loadFromSettings(settings, oldSettings) {
		var types = ['status', 'text', 'number', 'boolean', 'button'];
		types.forEach(async (type) => {
			for (let i = 1; i <= 4; i++) {
				let oldCap = this.getStoreValue(type+i);
				var oldValue = undefined;
				if(oldCap) oldValue = this.getCapabilityValue(oldCap);
						
				var storeValue =this.getStoreValue(type + i + 'Icon'); 
				let oldIcon = storeValue && storeValue.length>0 ? '-' + storeValue : '';
				// (oldSettings[type + i + 'Icon']||'').length>0 ? '-' + oldSettings[type + i + 'Icon'] : '';
				var cap = 'devicecapabilities_' + type + oldIcon + '.' + type + i;
				let isAlarm = type == 'boolean' && settings[type + i + 'AsAlarm']===true;
				let isOnOff = type == 'button' && settings[type + i + 'AsOnOff']===true;
				switch (type) {
					case "number": 
					case "status": 
						cap = 'measure_devicecapabilities_' + type + oldIcon + '.' + type + i; break;
					case "boolean":
						var quickAction = '';// settings[type + i + 'UiQuickAction'];
						cap = (isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + (quickAction ? 'quickaction_' : '') + type + oldIcon + '.' + type + i;
						if(!oldCap) oldCap = cap;
						if (isAlarm && oldCap.startsWith('devicecapabilities_')) await this.removeCapability(oldCap);
						if (!isAlarm && oldCap.startsWith('alarm_devicecapabilities_')) await this.removeCapability(oldCap);
						// if (quickAction && oldCap.indexOf('_quickaction_')===-1) await this.removeCapability(oldCap);
						// if (!quickAction && oldCap.indexOf('_quickaction_')>-1) await this.removeCapability(oldCap);
						
						
						break;
					case "button":
						if(i===1) {
							if (!isOnOff && this.hasCapability('onoff')) await this.removeCapability('onoff');
							if (isOnOff && this.hasCapability(type)) await this.removeCapability(type);						
							cap = isOnOff ? ('onoff'): (type);						
						} else {
							if (!isOnOff && this.hasCapability('onoff.' + type + i)) await this.removeCapability('onoff.' + type + i);
							if (isOnOff && this.hasCapability(type+ '.' + type + i)) await this.removeCapability(type+ '.' + type + i);						
							cap = isOnOff ? ('onoff.' + type + i): (type + '.' + type + i); 
						}
						break;
				}
				if(['text', 'number', 'boolean', 'status'].indexOf(type)>-1) {
					let icon = (settings[type + i + 'Icon']||'').length>0 ? '-' + settings[type + i + 'Icon'] : '';
					if(icon!=oldIcon) {
						await this.removeCapability(cap);
						if(icon=='') cap = cap.replace(oldIcon, '');
						else if(oldIcon=='') cap = cap.replace('.', icon+'.');
						else cap = cap.replace(oldIcon, icon);
						this.setStoreValue(type + i + 'Icon', settings[type + i + 'Icon']);
						
					}
					
				}
				
				let name = settings[type + i + 'Name'];
				if(!name || name.length<=0) this.setStoreValue(type+i, null);

				if (name && name.length > 0) {
					this.setStoreValue(type+i, cap);
					if (!this.hasCapability(cap)) {
						await this.addCapability(cap);
						if(oldValue!==undefined) this.setCapabilityValue(cap, oldValue);
						if(type=='button') {
							try {								
								this.registerCapabilityListener(cap, ((value, options) => {
									this.driver.triggerFlow(this, value, { field: { id: "button" + i } });
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
						//this.error(error);
					} 
					if (!opt) opt = {};
					if (
						opt.title != name || opt.preventInsights != settings[type + i + 'PreventInsights'] || 
						(opt.units != settings[type + i + 'Units'] && type!='status' ) || 
						opt.decimals != settings[type + i + 'Decimals'] || opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] || opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse'] ||
						opt.setable != settings[type + i + 'Disabled'] || opt.uiQuickAction != settings[type + i + 'UiQuickAction']
					) {
						var optNew = {
							title: name, 
							preventInsights: settings[type + i + 'PreventInsights'],							
							decimals: settings[type + i + 'Decimals'],
							insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
							insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
						};
						if(type=='status') optNew.units= opt.units;
						else if(settings[type + i + 'Units']) optNew.units= settings[type + i + 'Units'];
						//if(settings[type + i + 'Disabled']!==undefined) optNew.setable= !settings[type + i + 'Disabled'];
						//if(settings[type + i + 'UiQuickAction']!==undefined) optNew.uiQuickAction= !settings[type + i + 'UiQuickAction'];
						//if(settings[type + i + 'Icon']) optNew.icon= "/assets/" + settings[type + i + 'Icon'] + ".svg";
						this.setCapabilityOptions(cap,optNew);
					}
				} else if (this.hasCapability(cap)) await this.removeCapability(cap);

			}
		});

	}

	async onSettings({ oldSettings, newSettings, changedKeys }) {
		
		this.loadFromSettings(newSettings, oldSettings);
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
}
