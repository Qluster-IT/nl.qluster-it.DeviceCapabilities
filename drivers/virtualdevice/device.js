"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');

const _ = require('lodash-core');
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
		// 	// if(disabled) await this.setCapabilityValue("button",!value );
		// 	// else 
		// 	this.log(value);
		// }).bind(this));


		Homeyman.Current.VirtualDevices[this.getName()] = this;



		var caps = this.getCapabilities();
		
		var settings = this.getSettings();

		for(let i=0;i<caps.length;i++){
			let type = this.getStoreValue(caps[i]);			
			if(!type) continue;
			
			if(type.startsWith('button')) {
				if(settings[type+'Disabled']!==true) 
					this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlow(this, value, { field: { id: type } });}).bind(this));
			}
			if(type.startsWith('boolean')) {
				//if(settings[type+'UiQuickAction']) 
				if(caps[i].indexOf('_quickaction_')>-1) 
				this.registerCapabilityListener(caps[i], ((value, options) => {this.driver.triggerFlowBoolean(this, value, { field: { id: type } });}).bind(this));
			}			
			if(type.startsWith('number')) {
					this.registerCapabilityListener(caps[i], ((value, options) => {
						this.driver.triggerFlowNumber(this, value, { field: { id: type } });
					}).bind(this));
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

	async loadFromSettings(settings, oldSettings, changedKeys) {
		
		let cls = this.getClass();
		if(cls!=settings.cls) await this.setClass(settings.cls);
		//let b = JSON.parse(JSON.stringify(settings));
		//b.number1Max = 15;
		//this.setSettings({number1Max:15});

		var types = ['status', 'text', 'number', 'button', 'boolean'];//, 'dropdown'];
		var button1Reset = false;
		var a = this;

		for (let iTypes = 0; iTypes < types.length; iTypes++) {
			const type = types[iTypes];
			
			for (let i = 1; i <= NUMBEROFFIELDS; i++) {
				let oldCap = this.getStoreValue(type + i);
				let oldValue;
				if (oldCap) oldValue = this.getCapabilityValue(oldCap);
				
				let icon = (settings[type + i + 'Icon'] || '').length > 0 ? '-' + settings[type + i + 'Icon'] : '';
				let disabled = settings[type + i + 'Disabled'] === true;
				let checked = settings[type + i + 'Checked']===true;
				
				let pushbutton = false;
				let isOnOff, hide, isOnOffButtonTab = false;

				let sensor = false;
						

				let cap = 'devicecapabilities_' + type + icon + '.' + type + i;
				let capSet = false;
				switch (type) {
					case "text":
						switch (settings[type + i + 'ShowAs']) {
							case "": 
							case "sensor":
								  break;
							default:
								capSet = true;
								 break;
						}
						if(capSet) {
							let caps = this.getCaps(type,i,settings,oldCap);
							cap = caps.cap;
							oldCap = caps.oldCap;
						}
						if (!oldCap && i===1) oldCap = "devicecapabilities_text.text1";break;
					// case "dropdown":
					// 	if (!oldCap && i===1) oldCap = "devicecapabilities_dropdown.dropdown1";break;
					case "number":
						cap = 'measure_devicecapabilities_' + type + icon + '.' + type + i;
						switch (settings[type + i + 'ShowAs']) {
							case "": sensor = true;   break;
							case "sensor": sensor = true;  break;
							default:
								capSet = true;
								 break;
						}
						if(capSet) {
							let caps = this.getCaps(type,i,settings,oldCap);
							cap = caps.cap;
							oldCap = caps.oldCap;
						}
						if (!oldCap && i===1) oldCap = "measure_devicecapabilities_number.number1";
						break;
					case "status":
						cap = 'measure_devicecapabilities_' + type + icon + '.' + type + i; 
						if (!oldCap && i===1) oldCap = "measure_devicecapabilities_status.status1";
						break;
					case "boolean":
						let isAlarm = settings[type + i + 'ShowAs'] === 'alarm';
						let quickAction = settings[type + i + 'ShowAs']==='button';// || settings[type + i + 'ShowAs']=='';
						cap = 
							(isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + (quickAction ? 'quickaction_' : '') + //(disabled ? 'disabled_' : '') + 
							type + icon + '.' + type + i;
						if (!oldCap && i===1) oldCap = "alarm_devicecapabilities_boolean.boolean1";

						break;
					case "button":
						switch (settings[type + i + 'ShowAs']) {
							case "": pushbutton = true;  break;
							case "button": pushbutton = true;  break;
							case "onoff": isOnOff = true;  break;
							case "onoff_buttontab": isOnOffButtonTab = true;  break;
							case "indicatoronly": isOnOff = true; hide = true;  break; //disabled=true; indicatorOnly is for Button1 only.	
							default:
								capSet = true;
								break;						
						}
						if(capSet) {
							let caps = this.getCaps(type,i,settings,oldCap);
							cap = caps.cap;
							oldCap = caps.oldCap;
						}
						if(hide) { //always Button1
							cap = "devicecapabilities_hide_button." + type + i;
						}
						
						if(!hide && !capSet) {
							if (i === 1) {
								cap = isOnOff ? 'onoff' : type;
							} else {
								cap =  ( (isOnOff ? 'onoff_':'')+ (isOnOffButtonTab ? 'onoffbuttontab_':'') + ("devicecapabilities"+(disabled?"_disabled":"")+"_button"+icon+"." + type + i));
							}
						}
						if (!oldCap && i===1) oldCap = 'button';

						break;						
				}
				if (oldCap) oldValue = this.getCapabilityValue(oldCap);
				let oldTempValue;
					

				

				let name = settings[type + i + 'Name'];
				if (!name || name.length <= 0) {
					this.setStoreValue(type + i, null);
					this.setStoreValue(cap, null);
				}

				if (name && name.length > 0) {
					if((type=="button" || (type=="boolean" && cap.indexOf('_quickaction_')>-1)) && button1Reset) {
						if (this.hasCapability(cap)) await this.removeCapability(cap);
					}
					this.setStoreValue(type + i, cap);
					this.setStoreValue(cap, type + i);
					if (!this.hasCapability(cap)) {
						if(type=="button" && i===1) button1Reset = true;
						await this.addCapability(cap);
						if (oldValue !== undefined) await this.setCapabilityValue(cap, oldValue);
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
						if(type=='number' && (!sensor)) {
								this.registerCapabilityListener(cap, ((value, options) => {
									this.driver.triggerFlowNumber(this, value, { field: { id: type + i } });
								}).bind(this));
						}	
					}
					let opt;

					try {
						opt = this.getCapabilityOptions(cap);
					} catch (error) {
						//this.error(error);
					}
					if (!opt) opt = {};
					
					//var valuesChanged = false;
					var values = null;
					// if(type=="dropdown") {
					// 	if(opt.values!=settings["dropdown"+i+"Values"] || changedKeys.indexOf("dropdown"+i+"Values")>-1)
					// 	values = this.getDropDownValues(settings["dropdown"+i+"Values"]);
					// }
					
					if (
						opt.title != name || opt.preventInsights != settings[type + i + 'PreventInsights'] ||
						(opt.units != settings[type + i + 'Units'] && type != 'status') ||
						opt.decimals != settings[type + i + 'Decimals'] || opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] || opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse'] ||
						values ||
						settings[type + i + 'Decimals'] != oldSettings[type + i + 'Decimals']  ||
						settings[type + i + 'Min'] != oldSettings[type + i + 'Min']  ||
						settings[type + i + 'Max'] != oldSettings[type + i + 'Max'] 
						//|| opt.uiQuickAction != settings[type + i + 'UiQuickAction']
						//|| (type == 'button' && disabled && !pushbutton && opt.value!=checked )

					) {
						let optNew = {
							title: name,
							preventInsights: settings[type + i + 'PreventInsights'],
							//decimals: settings[type + i + 'Decimals'],
							insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
							insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
						};
						if (type == 'status') optNew.units = opt.units;
						else if (settings[type + i + 'Units']) optNew.units = settings[type + i + 'Units'];
						if(type == 'dropdown' && values) optNew.valuesasd = values;
						switch (type) {
							case "number":
								if(settings[type + i + 'Decimals']!==-1) optNew.decimals = settings[type + i + 'Decimals'];
								if(settings[type + i + 'Min']!==-1) optNew.min = settings[type + i + 'Min'];
								if(settings[type + i + 'Max']!==-1) optNew.max = settings[type + i + 'Max'];
								
								break;
						
							default:
								break;
						}
						
						//if(type == 'button' && disabled && !pushbutton ) optNew.value = checked;
						//if(type == 'button' && disabled && !pushbutton ) optNew.value = checked;
						
						//if(settings[type + i + 'Disabled']!==undefined) optNew.setable= !settings[type + i + 'Disabled'];
						//if(settings[type + i + 'UiQuickAction']!==undefined) optNew.uiQuickAction= !settings[type + i + 'UiQuickAction'];
						//if(settings[type + i + 'Icon']) optNew.icon= "/assets/" + settings[type + i + 'Icon'] + ".svg";
						await this.setCapabilityOptions(cap, optNew);
					}
					if (type == 'button' && disabled && !pushbutton ) {
						await this.setCapabilityValue(cap, checked);
					}
				} else if (this.hasCapability(cap)) await this.removeCapability(cap);

			}
		}

		await this.setCameras(settings);

	}

	getCaps(type, i, settings, oldCap) {
		let otherCap, otherCapTarget;// = this.getStoreValue(type+i)
		let n = [];
		for (let _i = 1; _i < i ; _i++) n.push(_i);
		let capAllreadyFound = _.find(n, _n=> settings[type+_n+"ShowAs"]===settings[type + i + 'ShowAs'] && (otherCap=this.getStoreValue(type+_n)) && otherCap.indexOf(".")===-1);
		let capTarget;
		if(settings[type + i + 'ShowAs']==="measure_temperature" && _.find(_.orderBy(n,undefined,'desc'), _n=> settings[type+_n+"ShowAs"]==="target_temperature" && (otherCapTarget=this.getStoreValue(type+_n) ))) {
			if(otherCapTarget.indexOf(".")===-1) capTarget = "measure_temperature";
			else capTarget = "measure_temperature." + otherCapTarget.split(".")[1];
			capAllreadyFound = false;
		}
		if(capAllreadyFound && otherCap===oldCap) oldCap = undefined;
		return { cap: capTarget ? capTarget : settings[type + i + 'ShowAs']+ (capAllreadyFound || settings[type + i + 'CreateFlowCards']===false  ? "." +type + i : ""), oldCap:oldCap };
	}

	// getDropDownValues(text) {
	// 	var results = [];
	// 	let t = text.trimStart();
	// 	if(t.startsWith('[')) {
	// 		let r = JSON.parse(text);
	// 		if(Array.isArray(r)) for (let i = 0; i < r.length; i++) {
	// 			const element = r[i];
	// 			let type = typeof(element);
	// 			if(type=="object") results.push(element);
	// 			if(type=="string") results.push({id:element, title:element});
				
	// 		}
	// 	} else if(t.startsWith('"')) {			
	// 		let r = JSON.parse(text);
	// 		if(r=="string") results.push({id:r, name:r});
	// 	} else {
	// 		//let specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/gi; 
	// 		var seperators = {
	// 			"," : {"sep":",", "count": (text.match(/\,/g) ||[]).length},
	// 			";" : {"sep":";", "count": (text.match(/\;/g) ||[]).length}
	// 		};
	// 		var sep1 = _.orderBy(seperators,"count",'desc');
	// 		var sep = _.first(sep1) ? sep1[0].sep : "null";
	// 		var arr = text.split(sep);
	// 		for (let i = 0; i < arr.length; i++) {
	// 			let _r =  arr[i].trimStart();
	// 			results.push({id:_r, title:_r});
	// 		}

	// 	}

	// 	return results;

	// }

	
	async onSettings({ oldSettings, newSettings, changedKeys }) {

		this.loadFromSettings(newSettings, oldSettings, changedKeys);
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
};
