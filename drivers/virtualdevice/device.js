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
		
		if (this.hasCapability('devicecapabilities_starttext')) await this.setCapabilityValue('devicecapabilities_starttext', "Goto Device Settings");
		


		if (process.env.DEBUG === '1')  {
			
		}


		Homeyman.Current.VirtualDevices[this.getName()] = this;
		var caps = this.getCapabilities();		
		this.Settings = await this.getSettings();

		let versionUpdatedTo = this.getStoreValue('Version') || "0.0.0";
		if(this.homey.app.manifest.version!=versionUpdatedTo) {
			let versionArr = this.homey.app.manifest.version.split(".");
			let versionUpdatedToArr = versionUpdatedTo.split(".");
			if(
				parseInt(versionArr[0])> parseInt(versionUpdatedToArr[0]) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])> parseInt(versionUpdatedToArr[1])) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])=== parseInt(versionUpdatedToArr[1]) && parseInt(versionArr[2])> parseInt(versionUpdatedToArr[1]))
				) {
					let newSettings = {
						"labelGeneral":this.homey.__("virtualdevicesettings.labelGeneral"),
						"labelAlso":this.homey.__("virtualdevicesettings.labelAlso"),
						"labelCustomIcons":this.homey.__("virtualdevicesettings.labelCustomIcons"),
						"labelCamerasRestart":this.homey.__("virtualdevicesettings.labelCamerasRestart")
						
					};
					for (const settingKey in this.Settings	) 
						if(settingKey.startsWith("label") && Object.keys(newSettings).indexOf(settingKey)===-1) newSettings[settingKey] = "";

					
					await this.setSettings(newSettings);		
					this.Settings = await this.getSettings();
					this.setStoreValue('Version', this.homey.app.manifest.version);
					await this.loadFromSettings(this.Settings, this.Settings, []); //Do i want to keep this in or is this just for testing?
				}
		}

		


		for(let i=0;i<caps.length;i++){
			let fieldId = this.getStoreValue(caps[i]);			
			if(!fieldId) continue;
			
			await this.setListener({fieldId, settings:this.Settings, cap:caps[i]});		
		}
		await this.setCameras();
	}

	async setListener({fieldId, cap, settings}) {
		if(fieldId.startsWith('button')) {
			if(settings[fieldId+'Disabled']!==true) 
				this.registerCapabilityListener(cap, (async (value, options) => {
					if(settings[fieldId+'ShowAs']==="pushbutton_indicator") {
						let val = this.getStoreValue(fieldId+"Value")===true;
						await this.setCapabilityValue(cap, val);
						return setTimeout(async ()=> {
							await this.setCapabilityValue(cap, val);
							this.driver.triggerFlow(this, !val, { field: { id: fieldId } });
						},1);
					} else this.driver.triggerFlow(this, value, { field: { id: fieldId } });					
					return true;
				}).bind(this));
		}
		if(fieldId.startsWith('boolean')) {
			if(cap.indexOf('_button')>-1) 
			  this.registerCapabilityListener(cap, ((value, options) => {
				this.driver.triggerFlowBoolean(this, value, { field: { id: fieldId } });
			}).bind(this));
		}			
		if(fieldId.startsWith('number')) {
				this.registerCapabilityListener(cap, ((value, options) => {
					this.driver.triggerFlowNumber(this, value, { field: { id: fieldId } });
				}).bind(this));
		}	
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
		if (this.hasCapability('devicecapabilities_starttext') && changedKeys && changedKeys.length>0) await this.removeCapability('devicecapabilities_starttext');
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
				
				let icon = (settings[type + i + 'Icon'] || '').trim().length > 0 ? '-' + settings[type + i + 'Icon'] : '';
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
						break;
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
						break;
					case "status":
						cap = 'measure_devicecapabilities_number' + icon + '.' + type + i; 
						break;
					case "boolean":
						let isAlarm = settings[type + i + 'ShowAs'] === 'alarm';
						let quickAction = settings[type + i + 'ShowAs']==='onoff';// || settings[type + i + 'ShowAs']=='';
						cap = 
							(isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + (quickAction ? 'quickaction_' : '') + //(disabled ? 'disabled_' : '') + 
							type + icon + '.' + type + i;
							if(quickAction) cap = "onoffbuttontab_devicecapabilities_button" + icon + '.' + type + i;
						break;
					case "button":
						switch (settings[type + i + 'ShowAs']) {
							case "": pushbutton = true;  break;
							case "button": pushbutton = true;  break;
							case "onoff": isOnOff = true;  break;
							case "onoff_buttontab": isOnOffButtonTab = true;  break;
							//case "indicatoronly": isOnOff = true; hide = true;  break;
							case "indicatoronly": isOnOff = false; hide = true;  break;
							case "onoff_hide":
							case "pushbutton_indicator":
								 isOnOff = true; hide = true;  break; 
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
							if(isOnOff) cap = "devicecapabilities_onoff_hide_button." + type + i;
							else cap = "devicecapabilities_hide_button." + type + i;
						}
						
						if(!hide && !capSet) {
							if (i === 1) {
								cap = isOnOff ? 'onoff' : type;
							} else {
								cap =  ( (isOnOff ? 'onoff_':'')+ (isOnOffButtonTab ? 'onoffbuttontab_':'') + ("devicecapabilities"+(disabled?"_disabled":"")+"_button"+icon+"." + type + i));
							}
						}
						//if (!oldCap && i===1) oldCap = 'button';

						break;						
				}
				if (oldCap) oldValue = this.getCapabilityValue(oldCap) || oldValue;
				

				if (oldCap && cap!=oldCap)  await this.removeCapability(oldCap);
				

				

				let name = settings[type + i + 'Name'];
				if (!name || name.length <= 0) {
					this.setStoreValue(type + i, null);
					this.setStoreValue(cap, null);
				}

				if (name && name.length > 0) {
					if((type=="button" || (type=="boolean" && cap.indexOf('_button')>-1)) && button1Reset) {
						if (this.hasCapability(cap)) await this.removeCapability(cap);
					}
					this.setStoreValue(type + i, cap);
					this.setStoreValue(cap, type + i);
					if (!this.hasCapability(cap)) {
						if(type=="button" && i===1) button1Reset = true;
						await this.addCapability(cap);
						if (oldValue !== undefined) await this.setCapabilityValue(cap, oldValue);
						await this.setListener({fieldId:type+i, settings, cap});
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
					
					let decimals = settings[type + i + 'Decimals'];// decimals = decimals===1?undefined:null;
					let max = settings[type + i + 'Max'];///max = max===1?undefined:null;
					let min = settings[type + i + 'Min'];///min = min===1?undefined:null;


					
					
					if (
						opt.title != name || opt.preventInsights != settings[type + i + 'PreventInsights'] ||
						(settings[type + i + 'Units'] != oldSettings[type + i + 'Units'] && type != 'status') ||
						(opt.decimals != decimals && decimals!==-1) || 
						opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] || opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse'] ||
						values ||
						(decimals != oldSettings[type + i + 'Decimals'] ) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  ||
						(min != oldSettings[type + i + 'Min'] ) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  || && min!==-1 && !oldSettings[type + i + 'Min'])  ||
						(max != oldSettings[type + i + 'Max'] ) //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  || && max!==-1 && !oldSettings[type + i + 'Max']) 
						//|| opt.uiQuickAction != settings[type + i + 'UiQuickAction']
						//|| (type == 'button' && disabled && !pushbutton && opt.value!=checked )
						

					) {
						let optNew = {
							title: name,
							preventInsights: settings[type + i + 'PreventInsights'],
							//decimals: decimals,
							insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
							insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
						};
						if (type == 'status') optNew.units = opt.units;
						else if (settings[type + i + 'Units']) optNew.units = settings[type + i + 'Units'];
						
						if(decimals!==-1) optNew.decimals = decimals;
						if(min!==-1) optNew.min = min;
						if(max!==-1) optNew.max = max;								

						//if(type == 'dropdown' && values) optNew.valuesasd = values;
						// switch (type) {
						// 	case "number":
						// 		break;
						// 	case "status":
						// 		if(decimals!==-1) optNew.decimals = decimals;
						// 		break;
						// 	default:
						// 		break;
						// }
						
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
		if(settings[type + i + 'ShowAs']==="measure_temperature") {
			let a = _.find(_.orderBy(n,undefined,'desc'), _n=> settings[type+_n+"ShowAs"]==="target_temperature" && (otherCapTarget=this.getStoreValue(type+_n) ));
			let b= a;
		}
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

		await this.loadFromSettings(newSettings, oldSettings, changedKeys);
		this.Settings = newSettings;
		// if the settings must not be saved for whatever reason:
		// throw new Error('Your error message');
	}
};
