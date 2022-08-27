"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');

const NUMBEROFFIELDS = 10;

module.exports = class WatchDevice extends Homey.Device {

	// this method is called when the Device is inited
	async onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());

		if (process.env.DEBUG === '1')  {
			//if(!this.hasCapability('devicecapabilities_quickaction_boolean')) await this.addCapability('devicecapabilities_quickaction_boolean');
			if(this.getClass()!=='other') this.setClass('other');
			var image = await this.homey.images.createImage();
			await image.setUrl('https://www.computerhope.com/jargon/l/link.jpg');
			await this.setCameraImage('camera1', 'Camera1', image);
			var image = await this.homey.images.createImage();
			await image.setUrl('https://apps-sdk-v3.developer.homey.app/images/logo.png');
			await this.setCameraImage('camera2', 'Camera2', image);
		}
		//await this.removeCapability('devicecapabilities_quickaction_boolean');
		// if(!this.hasCapability('devicecapabilities_quickaction_boolean')) await this.addCapability('devicecapabilities_quickaction_boolean');

		// await this.setCapabilityOptions('devicecapabilities_quickaction_boolean', {uiComponent:'sensor'});  

		// this.registerCapabilityListener("devicecapabilities_quickaction_boolean", ((value, options) => {
		// 	// var disabled = this.getButtonDisabled('button'+i);
		// 	// if(disabled) this.setCapabilityValue("button",!value );
		// 	// else 
		// 	this.log(value);
		// }).bind(this));


		Homeyman.Current.VirtualDevices[this.getName()] = this;



		var caps = this.getCapabilities();
		
		var settings = this.getSettings();

		for(let i=0;i<caps.length;i++){
			let type = null;
			if(caps[i].indexOf('.')>-1)
				type = caps[i].split('.')[1];
			else if(caps[i]=='onoff' || caps[i]=='button') type = 'button1';
			
			if(type.startsWith('button')) {
				if(!settings[type+'Disabled']) this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlow(this, value, { field: { id: type } });}).bind(this));
			}
			if(type.startsWith('boolean')) {
				if(settings[type+'UiQuickAction']) this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlowBoolean(this, value, { field: { id: type } });}).bind(this));
			}
			
		}
	}


	getButtonDisabled(buttonName) {
		var settings = this.getSettings();
		return settings[buttonName + 'Disabled'];

	}

	async loadFromSettings(settings, oldSettings) {
		var types = ['status', 'text', 'number', 'button', 'boolean'];
		var button1Reset = false;
		var a = this;

		for (let iTypes = 0; iTypes < types.length; iTypes++) {
			const type = types[iTypes];
			
			for (let i = 1; i <= NUMBEROFFIELDS; i++) {
				let oldCap = this.getStoreValue(type + i);
				var oldValue = undefined;
				if (oldCap) oldValue = this.getCapabilityValue(oldCap);

				var storeValue = this.getStoreValue(type + i + 'Icon');
				let oldIcon = storeValue && storeValue.length > 0 ? '-' + storeValue : '';
				// (oldSettings[type + i + 'Icon']||'').length>0 ? '-' + oldSettings[type + i + 'Icon'] : '';
				var cap = 'devicecapabilities_' + type + oldIcon + '.' + type + i;
				let disabled = settings[type + i + 'Disabled'] === true;
				let hide = settings[type + i + 'Hide'] === true;
				let isAlarm = type == 'boolean' && settings[type + i + 'AsAlarm'] === true;
				let isOnOff = type == 'button' && settings[type + i + 'AsOnOff'] === true;
				switch (type) {
					case "number":
					case "status":
						cap = 'measure_devicecapabilities_' + type + oldIcon + '.' + type + i; break;
					case "boolean":
						var quickAction = settings[type + i + 'UiQuickAction'] || '';
						cap = 
							(isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + (quickAction ? 'quickaction_' : '') + //(disabled ? 'disabled_' : '') + 
							type + oldIcon + '.' + type + i;

						if (!oldCap) oldCap = cap;
						
						if (isAlarm && oldCap.startsWith('devicecapabilities_')) await this.removeCapability(oldCap);
						if (!isAlarm && oldCap.startsWith('alarm_devicecapabilities_')) await this.removeCapability(oldCap);
						if (quickAction && oldCap.indexOf('_quickaction_') === -1) await this.removeCapability(oldCap);
						if (!quickAction && oldCap.indexOf('_quickaction_') > -1) await this.removeCapability(oldCap);
						// if (disabled && oldCap.indexOf('_disabled_') === -1) await this.removeCapability(oldCap);
						// if (!disabled && oldCap.indexOf('_disabled_') > -1) await this.removeCapability(oldCap);


						break;
					case "button":
						if(disabled) {
							cap = "devicecapabilities_quickaction"+(disabled?"_disabled":"")+(hide?"_hide":"")+"_boolean." + type + i;
						}
						
						if (!oldCap) oldCap = 'button';

						if (disabled && oldCap.indexOf('_disabled_') === -1) await this.removeCapability(oldCap);
						if (!disabled && oldCap.indexOf('_disabled_') > -1) await this.removeCapability(oldCap);
						if (hide && oldCap.indexOf('_hide_') === -1) await this.removeCapability(oldCap);
						if (!hide && oldCap.indexOf('_hide_') > -1) await this.removeCapability(oldCap);

						if(!disabled) {
							if (i === 1) {
								if (!isOnOff && this.hasCapability('onoff')) await this.removeCapability('onoff');
								if (isOnOff && this.hasCapability(type)) await this.removeCapability(type);
								cap = isOnOff ? ('onoff') : (type);
							} else {
								if (!isOnOff && this.hasCapability('onoff.' + type + i)) await this.removeCapability('onoff.' + type + i);
								if (isOnOff && this.hasCapability(type + '.' + type + i)) await this.removeCapability(type + '.' + type + i);
								cap = isOnOff ? ('onoff.' + type + i) : (type + '.' + type + i);
							}
						}
						break;
				}
				if (['text', 'number', 'boolean', 'status'].indexOf(type) > -1) {
					let icon = (settings[type + i + 'Icon'] || '').length > 0 ? '-' + settings[type + i + 'Icon'] : '';
					if (icon != oldIcon) {
						await this.removeCapability(cap);
						if (icon == '') cap = cap.replace(oldIcon, '');
						else if (oldIcon == '') cap = cap.replace('.', icon + '.');
						else cap = cap.replace(oldIcon, icon);
						this.setStoreValue(type + i + 'Icon', settings[type + i + 'Icon']);

					}

				}

				let name = settings[type + i + 'Name'];
				if (!name || name.length <= 0) this.setStoreValue(type + i, null);

				if (name && name.length > 0) {
					this.setStoreValue(type + i, cap);
					if((type=="button" || (type=="boolean" && cap.indexOf('_quickaction_')>-1)) && button1Reset) {
						if (this.hasCapability(cap)) await this.removeCapability(cap);
					}
					if (!this.hasCapability(cap)) {
						if(type=="button" && i===1) button1Reset = true;
						await this.addCapability(cap);
						if (oldValue !== undefined) this.setCapabilityValue(cap, oldValue);
						var buttonDisabled = settings[type + i + 'Disabled'];
						if (type == 'button' && !buttonDisabled) {
							try {
								this.registerCapabilityListener(cap, ((value, options) => {
									this.driver.triggerFlow(this, value, { field: { id: "button" + i } });
								}).bind(this));
							} catch (error) { }
						}
						if (type == 'boolean' && settings[type + i + 'UiQuickAction']) {
							try {
								this.registerCapabilityListener(cap, ((value, options) => {
									this.driver.triggerFlowBoolean(this, value, { field: { id: "button" + i } });
								}).bind(this));
							} catch (error) { }
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
						(opt.units != settings[type + i + 'Units'] && type != 'status') ||
						opt.decimals != settings[type + i + 'Decimals'] || opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] || opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse'] ||
						//opt.setable != settings[type + i + 'Disabled'] || 
						opt.uiQuickAction != settings[type + i + 'UiQuickAction']
					) {
						var optNew = {
							title: name,
							preventInsights: settings[type + i + 'PreventInsights'],
							decimals: settings[type + i + 'Decimals'],
							insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
							insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
						};
						if (type == 'status') optNew.units = opt.units;
						else if (settings[type + i + 'Units']) optNew.units = settings[type + i + 'Units'];
						//if(settings[type + i + 'Disabled']!==undefined) optNew.setable= !settings[type + i + 'Disabled'];
						//if(settings[type + i + 'UiQuickAction']!==undefined) optNew.uiQuickAction= !settings[type + i + 'UiQuickAction'];
						//if(settings[type + i + 'Icon']) optNew.icon= "/assets/" + settings[type + i + 'Icon'] + ".svg";
						this.setCapabilityOptions(cap, optNew);
					}
				} else if (this.hasCapability(cap)) await this.removeCapability(cap);

			}
		}

	}

	
	async onSettings({ oldSettings, newSettings, changedKeys }) {

		this.loadFromSettings(newSettings, oldSettings);
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
}
