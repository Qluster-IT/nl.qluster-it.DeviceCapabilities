"use strict";

const Homey = require('homey');
const Homeyman = require('../../app');

const _ = require('lodash-core');
const types = ['status', 'text', 'number', 'button', 'boolean'];
			
module.exports = class WatchDevice extends Homey.Device {


	onDeleted() {
		//delete Homeyman.Current.VirtualDevices[this.getName()];
	}
	// this method is called when the Device is inited
	async onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());

		if (this.hasCapability('devicecapabilities_starttext')) await this.setCapabilityValue('devicecapabilities_starttext', this.homey.__("virtualdevicesettings.devicecapabilities_starttext") || "To start");//"Goto Device Settings");



		if (process.env.DEBUG === '1') {
			if(this.getName()==='Test AVD') {
				if(this.hasCapability('devicecapabilities_2_dropdown')) await this.removeCapability('devicecapabilities_2_dropdown');
				// if(!this.hasCapability('devicecapabilities_2_dropdown')) await this.addCapability('devicecapabilities_2_dropdown');
				// await this.setCapabilityOptions('devicecapabilities_2_dropdown', {values:[
				// 	{
				// 	  "id":"1",
				// 	  "title":"Test 1.1"
				// 	},
				// 	{
				// 	  "id":"2",
				// 	  "title":"Test 2.1"
				// 	}
				//   ], title : "Test title"
				// });
			}
			//if(this.hasCapability('measure_Status.status.status1'))await this.removeCapability('measure_Status.status.status1');
		}


		//Homeyman.Current.VirtualDevices[this.getName()] = this;
		var caps = this.getCapabilities();


		this.Settings = await this.getStoreValue('Settings');
		let useNewSettings = (this.Settings!=null);
		if(!this.Settings) {
			if(!this.Settings) this.Settings = await this.getSettings();
			let settings = this.Settings;
			this.removeAllSettings(settings, 'label');
			this.removeAllSettings(settings, 'batteries');
			this.removeAllSettings(settings, 'dropdown');
			
			if(settings.status1Name==='') this.removeAllSettings(settings, 'status1');

			settings.numberOfTextFields = 0;
			for (let i = 1; i <= 10; i++) 
				if(settings['text'+i+'Name'] && settings['text'+i+'Name']!='') settings.numberOfTextFields=i; else this.removeAllSettings(settings, 'text'+i);
			
			settings.numberOfNumberFields = 0;
			for (let i = 1; i <= 10; i++) 
				if(settings['number'+i+'Name'] && settings['number'+i+'Name']!='') settings.numberOfNumberFields=i;else this.removeAllSettings(settings, 'number'+i);
			settings.numberOfBooleanFields = 0;
			for (let i = 1; i <= 10; i++) 
				if(settings['boolean'+i+'Name'] && settings['boolean'+i+'Name']!='') settings.numberOfBooleanFields=i;else this.removeAllSettings(settings, 'boolean'+i);
			settings.numberOfButtonFields = 0;
			for (let i = 1; i <= 10; i++) 
				if(settings['button'+i+'Name'] && settings['button'+i+'Name']!='') settings.numberOfButtonFields=i;else this.removeAllSettings(settings, 'button'+i);
			settings.numberOfCameraFields = 0;
			for (let i = 1; i <= 10; i++) 
				if(settings['camera'+i+'Name'] && settings['camera'+i+'Name']!='') settings.numberOfCameraFields=i;else this.removeAllSettings(settings, 'camera'+i);
			await this.setStoreValue('Settings', settings);	
		}

		//this.log('Settings', this.Settings);
		if(this.Settings && !this.Settings.cls) this.Settings.cls = 'other';

		//if (process.env.DEBUG === '1' || 
		if(this.driver.getVersionChanged(this.getStoreValue('Version') || "0.0.0")) {
			if(useNewSettings) {
				for (let i = 1; i <= 10; i++) {
					if(this.Settings['number'+i+'Decimals']===-1) this.Settings['number'+i+'Decimals'] = undefined;
					if(this.Settings['number'+i+'Min']===-1) this.Settings['number'+i+'Min'] = undefined;
					if(this.Settings['number'+i+'Max']===-1) this.Settings['number'+i+'Max'] = undefined;
				}
				delete this.Settings.iconNames;
			}

			var a= this.homey.__("virtualdevicesettings.devicecapabilities_starttext");
			await this.setSettings({"labelGotoRepair": this.homey.__("virtualdevicesettings.devicecapabilities_starttext") + ' ' + this.homey.__("virtualdevicesettings.devicecapabilities_starttextend")});

			try {
				
				this.setStoreValue('Version', this.homey.app.manifest.version);
				for (let i = 0; i < caps.length; i++) {
					let fieldId = this.getStoreValue(caps[i]);
					let _cap = caps[i].split('.')[0];
					if(caps[i].indexOf('devicecapabilities')>-1 && !this.homey.app.manifest.capabilities[_cap]) {
						this.removeCapability(caps[i]);
						continue;
						//this.log('cap doesn\'t exists any more', caps[i]);
					}
				}
			} catch (error) {
				this.error(error);
			}
			await this.loadFromSettings(this.Settings, this.Settings, []); //Do i want to keep this in or is this just for testing?
		} else {
			await this.setCameras(this.Settings); //Allready happends in loadFromSettings
		}

		


		for (let i = 0; i < caps.length; i++) {
			let fieldId = this.getStoreValue(caps[i]);
			if (!fieldId) continue;

			await this.setListener({ fieldId, settings: this.Settings, cap: caps[i] });
		}

		// this.homey.settings.on('set', (async function (settingName, settingValue) {
		// 	if (settingName == 'customIconNames') {
		// 		this.setIconNames();
		// 	}

		// }).bind(this));

	}

	async setListener({ fieldId, cap, settings }) {
		if (fieldId.startsWith('button')) {
			if (settings[fieldId + 'Disabled'] !== true)
				this.registerCapabilityListener(cap, (async (value, options) => {					
					let oldValue = this.getStoreValue(fieldId+"Value");
					if (settings[fieldId + 'ShowAs'] === "pushbutton_indicator") {
						let val = this.getStoreValue(fieldId + "Value") === true;
						await this.setCapabilityValue(cap, val);
						return setTimeout(async () => {
							await this.setCapabilityValue(cap, val);
							this.driver.triggerFlowButton(this, !val, { field: { id: fieldId }, changed:value!==oldValue }); //Do we need to await for triggerFlow?
						}, 1);
					} else {						
                        await this.driver.setSecondCapability({ val:value, device:this , fieldId});
						await this.setStoreValue(fieldId+"Value", value===true);
						this.driver.triggerFlowButton(this, value, { field: { id: fieldId }, changed:value!==oldValue }); //Do we need to await for triggerFlow?
					}
					return true;
				}).bind(this));
		}
		if (fieldId.startsWith('boolean')) {
			if (cap.indexOf('_button') > -1)
				this.registerCapabilityListener(cap, (async (value, options) => {
					let oldValue = this.getStoreValue(fieldId+"Value");
					await this.driver.setSecondCapability({ val:value, device:this , fieldId});
					await this.setStoreValue(fieldId+"Value", value===true);
					this.driver.triggerFlowBoolean(this, value, { field: { id: fieldId }, changed:value!==oldValue }); //Do we need to await for triggerFlow?
				}).bind(this));
		}
		if (fieldId.startsWith('number')) {
			this.registerCapabilityListener(cap, (async (value, options) => {
				let oldValue = this.getStoreValue(fieldId+"Value");
				await this.driver.setSecondCapability({ val:value, device:this , fieldId});
				await this.setStoreValue(fieldId+"Value", value);
				this.driver.triggerFlowNumber(this, value, { field: { id: fieldId }, changed:value!==oldValue }); //Do we need to await for triggerFlow?
			}).bind(this));
		}
	}


	async setCameras(settings) {
		if (!this.Cameras) this.Cameras = {};
		for (let i = 1; i <= settings.numberOfCameraFields || 0; i++) {
			const ref = "camera" + i;
			if (settings[ref + "Name"] && settings[ref + "Url"] && settings[ref + "Name"] != "" && settings[ref + "Url"] != "") {
				if (!this.Cameras[ref]) this.Cameras[ref] = { id: ref, image: await this.homey.images.createImage(), url: settings[ref + "Url"], name: settings[ref + "Name"] };
				if (this.Cameras[ref].interval) clearInterval(this.Cameras[ref].interval);
				if (settings[ref + "Interval"] && settings[ref + "Interval"] !== 0) this.Cameras[ref].interval = setInterval(() => {
					this.setCameraImageFromRef(ref);
				}, (settings[ref + "Interval"] || 60) * 1000);
				await this.setCameraImageFromRef(ref);
			} else {
				if (this.Cameras[ref]) {
					if (this.Cameras[ref].interval) clearInterval(this.Cameras[ref].interval);
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
		if (!this.Cameras[ref]) return;
		this.Cameras[ref].image.setUrl(this.Cameras[ref].url);
		await this.Cameras[ref].image.update();
		if (!this.Cameras[ref].attached) {
			await this.setCameraImage(ref, this.Cameras[ref].name, this.Cameras[ref].image);
			this.Cameras[ref].attached = true;
		}
	}
	
	async loadFromSettings(settings, oldSettings, changedKeys, saved, imported) {

		try {
				
			let cls = this.getClass();
			if (cls != settings.cls) await this.setClass(settings.cls);
			if (this.hasCapability('devicecapabilities_starttext') && saved) await this.removeCapability('devicecapabilities_starttext');

			if(settings.imported) {
				if(settings.deviceIcon) {
					await this.homey.app.createDeviceIcon({type:"image/svg", id:this.getData().id, buffer:settings.deviceIcon });
					delete settings.deviceIcon;
				} 
				if(settings.saveCustomIcons) {
					//await this.homey.app.createDeviceIcon({type:"image/svg", id:this.getData().id, buffer:settings.deviceIcon });
					for (const iconUsedKey	in settings.saveCustomIcons) {
						if (Object.hasOwnProperty.call(settings.saveCustomIcons, iconUsedKey)) {
							const toIconName = settings.saveCustomIcons[iconUsedKey];
							try {
								let data = settings.customIcons[iconUsedKey];
								if(data && data.length>0) {
									await this.homey.app.createCustomIcon({type:"image/svg", id:toIconName, buffer:data });
								}
							} catch (error) {
								
							}
							this.driver.executeForAllTypes(this, (type, i)=> {
								if(settings[type+i+"Icon"]== iconUsedKey) settings[type+i+"Icon"] = toIconName;
							});
						}
					}
					delete settings.saveCustomIcons;
				}
				
				if(settings.customIcons) delete settings.customIcons;
			}


			var button1Reset = false;

			for (let iTypes = 0; iTypes < types.length; iTypes++) {
				const type = types[iTypes];
				const fieldCount = type=="status" ? 1 : Math.max(settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0, oldSettings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);

				for (let i = 1; i <= fieldCount; i++) {
					//if(type=="status" && i>1) continue;
					try {
						let oldCap = this.getStoreValue(type + i);
						let oldValue;
						//let targetInsight;
						if (oldCap) {
							oldValue = this.getCapabilityValue(oldCap);
							//targetInsight = _.find(apiDevice.insights, x => x.id == oldCap);
							
						}

						let icon = (settings[type + i + 'Icon'] || '').trim().length > 0 ? '-' + settings[type + i + 'Icon'] : '';
						let disabled = settings[type + i + 'Disabled'] === true;
						let checked = settings[type + i + 'Checked'] === true;

						let pushbutton = false;
						let isOnOff, hide, isOnOffButtonTab = false;

						let sensor = false;

						//let isStatus = type=="status";
						let createSecondCap = (settings[type + i + 'CreateInsights']===true || settings[type + i + 'CreateTag']===true) && settings[type + i + 'SeparateCapabilities']!==false;

						let cap = 'devicecapabilities_' + type + icon + '.' + type + i;
						let capSet = false;
						switch (type) {
							case "text":
								switch (settings[type + i + 'ShowAs']) {
									case undefined:
									case null:
									case "":
									case "sensor":
										break;
									default:
										capSet = true;
										break;
								}
								if (capSet) {
									let caps = this.getCaps(type, i, settings, oldCap);
									cap = caps.cap;
									oldCap = caps.oldCap;
								}
								break;
							case "number":
								cap = (settings[type + i + 'CreateFlowCards'] !== true ? '' : 'measure_') + 'devicecapabilities_' + (settings[type + i + 'ShowAs']==='slider' ? 'slider_' : '') + type + 
								(settings[type + i + 'ShowAs']!=='slider' ? icon : '') + '.' + type + i;
								switch (settings[type + i + 'ShowAs']) {
									case undefined:
									case null:
									case "": break;
									case "sensor": break;
									case "slider": break;
									default:
										capSet = true;
										break;
								}
								if (capSet) {
									let caps = this.getCaps(type, i, settings, oldCap);
									cap = caps.cap;
									oldCap = caps.oldCap;
								}
								break;
							case "status":
								if(createSecondCap) cap = 'devicecapabilities_number' + icon + '.' + type + i;
								else cap = 'measure_devicecapabilities_number' + icon + '.' + type + i;
								break;
							case "boolean":
								let isAlarm, quickAction;
								switch (settings[type + i + 'ShowAs']) {
									case undefined:
									case null:
									case "": 
									case "sensor": sensor = true; break;
									case "alarm": isAlarm = true; break;
									case "onoff": quickAction=true; break;
									default:
										capSet = true;
										break;
								}
								cap = (isAlarm ? 'alarm_' : '') + 'devicecapabilities_' + type + icon + '.' + type + i;
								if (quickAction) cap = "onoffbuttontab_devicecapabilities_button" + icon + '.' + type + i;
								
								if (capSet) {
									let caps = this.getCaps(type, i, settings, oldCap);
									cap = caps.cap;
									oldCap = caps.oldCap;
								}
								break;
							case "button":
								switch (settings[type + i + 'ShowAs']) {
									case undefined:
									case null:
									case "": 
									case "button": pushbutton = true; break;
									case "onoff": isOnOff = true; break;
									case "onoff_buttontab": isOnOffButtonTab = true; break;
									case "indicatoronly": hide = true; break;
									case "onoff_hide":
									case "pushbutton_indicator":
										isOnOff = true; hide = true; break;
									default:
										capSet = true;
										break;
								}
								if (capSet) {
									let caps = this.getCaps(type, i, settings, oldCap);
									cap = caps.cap;
									oldCap = caps.oldCap;
								}
								if (hide) { //always Button1
									if (isOnOff) cap = "devicecapabilities_onoff_hide_button." + type + i;
									else cap = "devicecapabilities_hide_button." + type + i;
								}

								if (!hide && !capSet) {
									if (i === 1 && !isOnOffButtonTab) {
										cap = (isOnOff ? 'onoff' : type) + (settings[type + i + 'CreateFlowCards'] !== true ? "." + type + i : '');
									} else {
										cap = ((isOnOff ? 'onoff_' : '') + (isOnOffButtonTab ? 'onoffbuttontab_' : '') + ("devicecapabilities" + (disabled ? "_disabled" : "") + "_button" + icon + "." + type + i));
									}
								}
								//if (!oldCap && i===1) oldCap = 'button';

								break;
						}
						if (oldCap) oldValue = this.getCapabilityValue(oldCap) || oldValue;
						else if (type=="status") oldValue = 0;


						if (oldCap && cap != oldCap && this.hasCapability(oldCap)) {
							await this.removeCapability(oldCap);
							//await api.insights.deleteLog({ uri: targetInsight.uri, id: targetInsight.id }); // Do i want this automatic, or after a restart?
						}
						//else targetInsight = null;




						let name = settings[type + i + 'Name'];
						if (!name || name.length <= 0) {
							this.setStoreValue(type + i, null);
							this.setStoreValue(cap, null);
						}

						if (name && name.length > 0) {
							
							let secondCap = type=='status'? ("measure_Status"+"."+type+i) : (this.capitalizeFirstLetter(type) +"."+type+i);

							if ((type == "button" || (type == "boolean" && cap.indexOf('_button') > -1)) && button1Reset) {
								if (this.hasCapability(cap)) await this.removeCapability(cap);
								if (this.hasCapability(secondCap)) await this.removeCapability(secondCap);

							}
							this.setStoreValue(type + i, cap);
							this.setStoreValue(cap, type + i);
							if (!this.hasCapability(cap)) {
								if (type == "button" && i === 1) {
									button1Reset = true;
									if (this.hasCapability(secondCap)) 
										await this.removeCapability(secondCap);
								}
								await this.addCapability(cap);
								if (oldValue !== undefined) await this.setCapabilityValue(cap, oldValue);
								await this.setListener({ fieldId: type + i, settings, cap });
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
							let step = settings[type + i + 'Step'];
							let disableZoneActivity = settings[type + i + 'DisableZoneActivity'];


							// let var1= (settings[type + i + 'SeparateCapabilities']!==true && (opt.preventTag!= !settings[type + i + 'CreateTag'] || opt.preventInsights!= !settings[type + i + 'CreateInsights']));
							// let var2= (settings[type + i + 'SeparateCapabilities']===true && (opt.preventTag!==true || opt.preventInsights!==true)) ;
							// let var3= ((opt.preventInsights!==true && settings[type + i + 'SeparateCapabilities']!==false)) ;
							// let var4= (opt.preventInsights === settings[type + i + 'CreateInsights'] && settings[type + i + 'SeparateCapabilities']===false);
							// let var5= (settings[type + i + 'Units'] != oldSettings[type + i + 'Units'] && type != 'status');

							let capOptionsChanged = 
								opt.title != name || 
								//(opt.preventTag!==true && (settings[type + i + 'SeparateCapabilities']===true || settings[type + i + 'CreateTag']===true)) ||
								//(opt.preventTag===true && (settings[type + i + 'SeparateCapabilities']!==true && settings[type + i + 'CreateTag']===true)) ||
								(settings[type + i + 'SeparateCapabilities']!==true && (opt.preventTag===settings[type + i + 'CreateTag'] || opt.preventInsights===settings[type + i + 'CreateInsights'])) ||
								(settings[type + i + 'SeparateCapabilities']===true && (opt.preventTag!==true || opt.preventInsights!==true)) ||
								//((opt.preventInsights!==true && settings[type + i + 'SeparateCapabilities']!==false) || 
								//(opt.preventInsights === settings[type + i + 'CreateInsights'] && settings[type + i + 'SeparateCapabilities']===false)) ||
										//opt.preventInsights != settings[type + i + 'PreventInsights'] ||
								(settings[type + i + 'Units'] != oldSettings[type + i + 'Units'] && type != 'status') ||
								(opt.decimals != decimals) ||
								disableZoneActivity  != oldSettings[type + i + 'DisableZoneActivity'] ||
								(opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue']  && settings[type + i + 'InsightsTitleTrue'] && settings[type + i + 'InsightsTitleTrue']!='')|| 
								(opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse']  && settings[type + i + 'InsightsTitleFalse'] && settings[type + i + 'InsightsTitleFalse']!='') ||
								values ||
								(decimals != oldSettings[type + i + 'Decimals']) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  ||
								(min != oldSettings[type + i + 'Min']) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  || && min!==-1 && !oldSettings[type + i + 'Min'])  ||
								(max != oldSettings[type + i + 'Max']) ||
								(step != oldSettings[type + i + 'Step']) ;
								//|| opt.uiQuickAction != settings[type + i + 'UiQuickAction']
								//|| (type == 'button' && disabled && !pushbutton && opt.value!=checked );
							if (capOptionsChanged) {
								let optionValues = {type, i, settings, decimals, min, max, name, step, disableZoneActivity};
								if(type=="status") optionValues.units = opt.units || name;
								let optNew = this.getOptions(optionValues);
								if(settings[type + i + 'SeparateCapabilities']!==true) {
									optNew.preventInsights = !settings[type + i + 'CreateInsights'];
									optNew.preventTag = !settings[type + i + 'CreateTag'];
								}
								if(cap ==='measure_power' || cap.startsWith('measure_power.')) optNew.approximated = true; //Does not do much usefulls, only remove the graph from Mobile--> Energy, or not?
								if (this.hasCapability(cap))
									await this.setCapabilityOptions(cap, optNew);
							}
							let secondCapRemoved = false;
							//Status needs it second capability?
							//if(isStatus || ((settings[type + i + 'CreateInsights']===true ||settings[type + i + 'CreateTag']===true) && settings[type + i + 'SeparateCapabilities']!==false)) {
							if(createSecondCap) {
								if(!this.hasCapability(secondCap)) {
									await this.addCapability(secondCap);
									capOptionsChanged = true;
								}
								//let secondOpt; try { secondOpt = this.getCapabilityOptions(cap); } catch (error) { }
								if(
									capOptionsChanged || 
									//(isStatus && )
									settings[type + i + 'CreateInsights']!=oldSettings[type + i + 'CreateInsights'] || 
									settings[type + i + 'CreateTag']!=oldSettings[type + i + 'CreateTag']) {
										let optionValues = {type, i, settings, decimals, min, max, name, step};
										if(type=="status") optionValues.units = opt.units || name;
										let optNew = this.getOptions({type, i, settings, decimals, min, max, name, step, disableZoneActivity});
										optNew.preventInsights = settings[type + i + 'CreateInsights']!==true;
										optNew.preventTag = settings[type + i + 'CreateTag']!==true;
										//if(settings[type + i + 'CreateInsights']===true)
										if (this.hasCapability(secondCap))  
											await this.setCapabilityOptions(secondCap, optNew);
								}
								
								if (oldValue !== undefined && capOptionsChanged) 
									await this.setCapabilityValue(secondCap, oldValue);
								

							} else {
								if(this.hasCapability(secondCap)) 
									await this.removeCapability(secondCap);
								secondCapRemoved = true;
							}
							//Remove logs here
							// if((secondCapRemoved || settings[type + i + 'CreateInsights']!==true)){// && await this.homey.insights.getLog({id:secondCap}) ){
							// 	//Remove logs here
							// 	let a = await this.homey.insights.getLogs();
							// 	let b = a;
							// 	//await this.homey.insights.deleteLog({id:secondCap});
							// }
							

							if (type == 'button' && disabled && !pushbutton) {
								await this.setCapabilityValue(cap, checked);
							}
						} else if (this.hasCapability(cap)) 
							await this.removeCapability(cap);
					}
					catch (err) {
						this.error(err);
					}

				}
			}

			// if(settings.batteries != oldSettings.batteries) {
			// 	let energy = this.getEnergy();
			// 	if(settings.batteries.trim()=='') delete energy.batteries;
			// 	else energy.batteries = settings.batteries.replace(' ', '').split(',');
			// 	this.setEnergy(energy);
			// } 

			await this.setCameras(settings);
			await this.setStoreValue('Settings', settings);

			
			if(settings.imported) delete settings.imported;
			if(settings.flows) delete settings.flows;
			if(settings.advancedflows) delete settings.advancedflows;
			//if(settings.originalId) delete settings.originalId; // Maybe we will use this later?

			//if(command=="") command = null;
			this.Settings = settings;
			return settings;//, apiCommand:command};
			
		} catch (error) {
			this.error(error);
			return settings;	
		}
	}

	getCaps(type, i, settings, oldCap) {
		let otherCap, otherCapTarget;// = this.getStoreValue(type+i)
		let n = [];
		for (let _i = 1; _i < i; _i++) n.push(_i);
		let capAllreadyFound = _.find(n, _n => settings[type + _n + "ShowAs"] === settings[type + i + 'ShowAs'] && (otherCap = this.getStoreValue(type + _n)) && otherCap.indexOf(".") === -1);
		let capTarget;
		if (settings[type + i + 'ShowAs'] === "measure_temperature") {
			let a = _.find(_.orderBy(n, undefined, 'desc'), _n => settings[type + _n + "ShowAs"] === "target_temperature" && (otherCapTarget = this.getStoreValue(type + _n)));
			let b = a;
		}
		if (settings[type + i + 'ShowAs'] === "measure_temperature" && _.find(_.orderBy(n, undefined, 'desc'), _n => settings[type + _n + "ShowAs"] === "target_temperature" && (otherCapTarget = this.getStoreValue(type + _n)))) {
			if (otherCapTarget.indexOf(".") === -1) capTarget = "measure_temperature";
			else capTarget = "measure_temperature." + otherCapTarget.split(".")[1];
			capAllreadyFound = false;
		}
		if (capAllreadyFound && otherCap === oldCap) oldCap = undefined;
		return { cap: capTarget ? capTarget : settings[type + i + 'ShowAs'] + (capAllreadyFound || settings[type + i + 'CreateFlowCards'] !== true ? "." + type + i : ""), oldCap: oldCap };
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



 	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	removeAllSettings(settings, startName) {
		for (const settingKey in settings) if (Object.hasOwnProperty.call(settings, settingKey) && settingKey.startsWith(startName)) delete settings[settingKey];				
			
		
	}

	getOptions({type, i, settings, decimals, min, max, name, units, step, disableZoneActivity}) {
		let optNew = {
			title: name,
			preventInsights: true,
			preventTag:true,
			//decimals: decimals,
			insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
			insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
		};
		if (units) optNew.units = units;
		else if (settings[type + i + 'Units']) optNew.units = settings[type + i + 'Units'];

		if (decimals!==undefined) optNew.decimals = decimals;
		if (min!==undefined) optNew.min = min;
		if (max!==undefined) optNew.max = max;
		if (step!==undefined) optNew.step = step;
		if(disableZoneActivity===true) optNew.zoneActivity=false;
		return optNew;
	}
};
