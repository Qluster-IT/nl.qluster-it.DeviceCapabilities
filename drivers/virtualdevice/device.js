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
			//if(this.hasCapability('button.button2'))  await this.removeCapability('button.button2');
			if(this.hasCapability('onoff.button2'))  await this.removeCapability('onoff.button2');
			// if(this.hasCapability('locked_devicecapabilities_boolean.boolean10'))  await this.removeCapability('locked_devicecapabilities_boolean.boolean10');
			// if(this.hasCapability('locked_devicecapabilities_quickaction_boolean.boolean10'))  await this.removeCapability('locked_devicecapabilities_quickaction_boolean.boolean10');
		
			// if(!this.hasCapability('locked_devicecapabilities_boolean.boolean10')) await this.addCapability('locked_devicecapabilities_boolean.boolean10');
			// if(!this.hasCapability('locked_devicecapabilities_quickaction_boolean.boolean10')) await this.addCapability('locked_devicecapabilities_quickaction_boolean.boolean10');
			
			// if(this.getClass()!=='other') this.setClass('other');
			// var image = await this.homey.images.createImage();
			// await image.setUrl('https://www.computerhope.com/jargon/l/link.jpg');
			// await this.setCameraImage('camera1', 'Camera1', image);
			// var image = await this.homey.images.createImage();
			// await image.setUrl('https://apps-sdk-v3.developer.homey.app/images/logo.png');
			// await this.setCameraImage('camera2', 'Camera2', image);
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
			else if(caps[i]=='onoff' || caps[i]=='button' || caps[i]=='locked' || caps[i]=='garagedoor_closed' || caps[i]=='windowcoverings_closed') type = 'button1';
			
			
			if(type.startsWith('button')) {
				if(settings[type+'Disabled']!==true) 
					this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlow(this, value, { field: { id: type } });}).bind(this));
			}
			if(type.startsWith('boolean')) {
				//if(settings[type+'UiQuickAction']) 
				if(caps[i].indexOf('_quickaction_')>-1) 
				this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlowBoolean(this, value, { field: { id: type } });}).bind(this));
			}			
		}
		await this.setCameras();
	}


	async setCameras(settings) {
		settings = settings || (await this.getSettings());
		if(!this.Cameras) this.Cameras = {};
		for (let i = 1; i <= 10; i++) {
			const ref =  "camera"+i;
			if(settings[ref+"Name"]!="" && settings[ref+"Url"]!="") {
				if(!this.Cameras[ref]) this.Cameras[ref] ={id:ref, image:await this.homey.images.createImage(), url:settings[ref+"Url"], name:settings[ref+"Name"]};
				if(this.Cameras[ref].interval) clearInterval(this.Cameras[ref].interval);
				if(settings[ref+"Interval"]!==0) this.Cameras[ref].interval = setInterval(()=>{
					this.setCameraImageFromRef(ref);
				},(settings[ref+"Interval"] || 60) * 1000);
				await this.setCameraImageFromRef(ref);
			} else {
				if(this.Cameras[ref]) {
					if(this.Cameras[ref].interval) clearInterval(this.Cameras[ref].interval);
					delete this.Cameras[ref];
				}
				//  {
				// 	if(this.Cameras[ref].interval) clearInterval(this.Cameras[ref].interval);
				// 	if(this.Cameras[ref].image) await this.homey.images.unregisterImage(this.Cameras[ref].image);
				// 	delete this.Cameras[ref];
				// 	//await this.setCameraImage(ref, null, this.Cameras[ref].image); // error
				// }  
			}
		}
	}
	async setCameraImageFromRef(ref, name) {
		if(!this.Cameras[ref]) return;
		this.Cameras[ref].image.setUrl(this.Cameras[ref].url);
		await this.Cameras[ref].image.update();
		if(!this.Cameras[ref].attached) {
			await this.setCameraImage(ref, this.Cameras[ref].name, this.Cameras[ref].image);
			this.Cameras[ref].attached = true;
		}
	}
	// async setCamera() {

	// }
	// async removeCamera() {

	// }

	getButtonDisabled(buttonName) {
		var settings = this.getSettings();
		return settings[buttonName + 'Disabled'];

	}

	async loadFromSettings(settings, oldSettings) {

		let cls = this.getClass();
		if(cls!=settings.cls) await this.setClass(settings.cls);

		var types = ['status', 'text', 'number', 'button', 'boolean'];
		var button1Reset = false;
		var a = this;

		for (let iTypes = 0; iTypes < types.length; iTypes++) {
			const type = types[iTypes];
			
			for (let i = 1; i <= NUMBEROFFIELDS; i++) {
				let oldCap = this.getStoreValue(type + i);
				var oldValue = undefined;
				if (oldCap) oldValue = this.getCapabilityValue(oldCap);

				//var storeValue = this.getStoreValue(type + i + 'Icon');
				//let icon = storeValue && storeValue.length > 0 ? '-' + storeValue : '';
				let icon = (settings[type + i + 'Icon'] || '').length > 0 ? '-' + settings[type + i + 'Icon'] : '';
				// (oldSettings[type + i + 'Icon']||'').length>0 ? '-' + oldSettings[type + i + 'Icon'] : '';
				var cap = 'devicecapabilities_' + type + icon + '.' + type + i;
				let disabled = settings[type + i + 'Disabled'] === true;
				//let hide = settings[type + i + 'Hide'] === true;
				switch (type) {
					case "number":
					case "status":
						cap = 'measure_devicecapabilities_' + type + icon + '.' + type + i; break;
					case "boolean":
						let isAlarm = settings[type + i + 'ShowAs'] === 'alarm';
						var quickAction = settings[type + i + 'ShowAs']=='button' || '';
						cap = 
							(isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + (quickAction ? 'quickaction_' : '') + //(disabled ? 'disabled_' : '') + 
							type + icon + '.' + type + i;
						if (!oldCap) oldCap = cap;

						break;
					case "button":
						let isOnOff, hide, lock, garagedoor_closed, windowcoverings_closed = false;
						switch (settings[type + i + 'ShowAs']) {
							case "onoff": isOnOff = true; break;
							//case "disabled": disabled = true; break;
							case "indicatoronly": isOnOff = true; hide = true; break; //disabled=true; indicatorOnly is for Button1 only.
							case "lock": lock = true; break;
							case "garagedoor_closed": garagedoor_closed = true; break;
							case "windowcoverings_closed": windowcoverings_closed = true; break;
						}
						
						if(hide) { //always Button1
							cap = "devicecapabilities_hide_button." + type + i;
						}
						
						if (!oldCap && i===1) oldCap = 'button';

						if(!hide) {
							if (i === 1) {
								cap = isOnOff ? 'onoff' : lock ? 'locked' : garagedoor_closed ? 'garagedoor_closed' : windowcoverings_closed ? 'windowcoverings_closed' : type;
							} else {
								cap =  lock ? ('locked.' + type + i) : garagedoor_closed ? ('garagedoor_closed.' + type + i) : 
									windowcoverings_closed ? ('windowcoverings_closed.' + type + i) :( (isOnOff ? 'onoff_':'') + ("devicecapabilities"+(disabled?"_disabled":"")+"_button"+icon+"." + type + i));// (type + '.' + type + i);
							}
					}
						break;						
				}
				
				if(cap!=oldCap && oldCap)  await this.removeCapability(oldCap);

				

				let name = settings[type + i + 'Name'];
				if (!name || name.length <= 0) this.setStoreValue(type + i, null);

				if (name && name.length > 0) {
					if((type=="button" || (type=="boolean" && cap.indexOf('_quickaction_')>-1)) && button1Reset) {
						if (this.hasCapability(cap)) await this.removeCapability(cap);
					}
					this.setStoreValue(type + i, cap);
					if (!this.hasCapability(cap)) {
						if(type=="button" && i===1) button1Reset = true;
						await this.addCapability(cap);
						if (oldValue !== undefined) this.setCapabilityValue(cap, oldValue);
						if (type == 'button' && !disabled){//} && settings[type + i + 'ShowAs']!='disabled') {
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
					//var optHas = this.hasCapability(cap);
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

		await this.setCameras(settings);

	}

	
	async onSettings({ oldSettings, newSettings, changedKeys }) {

		this.loadFromSettings(newSettings, oldSettings);
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
};
