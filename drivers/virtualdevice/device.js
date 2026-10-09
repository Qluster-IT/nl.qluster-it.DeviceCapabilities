"use strict";

const Homey = require('homey');

const _ = require('lodash-core');
const { BL } = require('betterlogiclibrary');
const types = ['status', 'text', 'number', 'button', 'boolean', 'list'];


const APP_ID_BLL = 'net.i-dev.betterlogic';
const APP_ID_CG = 'nl.fellownet.chronograph';
const DC_DEVICES = 'dc:devices';


module.exports = class AvdDevice extends Homey.Device {


	onDeleted() {
		//delete Homeyman.Current.VirtualDevices[this.getName()];
		if (typeof this.getData().icon !== 'undefined' && this.getData().icon !== null && this.getData().icon.startsWith("../../../userdata"))
			this.homey.app.deleteFile(this.getData().icon.substring(8));
	}
	onUninit() {
		this.homey.app._getDevices = null;
	}
	// this method is called when the Device is inited
	async onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.homey.app._getDevices = null;

		if (this.hasCapability('devicecapabilities_starttext')) {
			await this.setCapabilityValue('devicecapabilities_starttext', this.homey.__("virtualdevicesettings.devicecapabilities_starttext"));
			await this.setSettings({ "labelGotoRepair": this.homey.__("virtualdevicesettings.devicecapabilities_starttext") + ' ' + this.homey.__("virtualdevicesettings.devicecapabilities_starttextend") });
		}

		let caps = this.getCapabilities();

		this.Settings = (await this.getStoreValue('Settings')) || {};
		if (this.Settings && !this.Settings.cls) this.Settings.cls = 'other';

		//if (process.env.DEBUG === '1' || 
		if (this.driver.getVersionChanged(this.getStoreValue('Version') || "0.0.0")) {			
			try {

				this.setStoreValue('Version', this.homey.app.manifest.version);
				
				// Use this part if capabilities are removed from the manifest.
				/*for (let i = 0; i < caps.length; i++) {
					let fieldId = this.getStoreValue(caps[i]);
					let _cap = caps[i].split('.')[0];
					if (caps[i].indexOf('devicecapabilities') > -1 && !this.homey.app.manifest.capabilities[_cap]) {
						this.removeCapability(caps[i]);
						continue;
					}
				}*/
			} catch (error) {
				this.error(error);
			}
			await this.loadFromSettings(this.Settings, this.Settings, []); //Do i want to keep this in or is this just for testing?
		} else {
			await this.setCameras(this.Settings); //Allready happends in loadFromSettings
			await this.setReflections(this.Settings); //Allready happends in loadFromSettings
		}




		for (let i = 0; i < caps.length; i++) {
			let fieldId = this.getStoreValue(caps[i]);
			if (!fieldId) continue;

			await this.setListener({ fieldId, settings: this.Settings, cap: caps[i] });
		}
		
	}

	async activateReact({ fieldId, value, source }) {
		try {
			const settings = this.Settings;
			if (!settings || !settings[fieldId + 'Name']) return;
			if (!settings[fieldId + 'ReflectDevices'] || !settings[fieldId + 'ReflectDevices'].length || !settings[fieldId + 'React']) return;
			if ((source == DC_DEVICES && this.Settings[fieldId + 'React'] === 'true_not_devices')) return;
			// if (!this.ReactLocks) this.ReactLocks = {};
			// this.ReactLocks[fieldId] = Date.now();

			for (let i = 0; i < settings[fieldId + 'ReflectDevices'].length; i++) {
				try {
					const device = settings[fieldId + 'ReflectDevices'][i];
					if (!device) continue;
					const property = this.homey.app.Reflections[DC_DEVICES][device.id][device.property];

					//await property.device.setCapabilityValue(device.property, value);
					property.value = value;
					property.lastUpdated = Date.now();

					await property.listener.setValue(value);
					for (let j = 0; j < property.fields.length; j++) {
						const field = property.fields[j];
						if (field.device !== this || field.fieldId !== fieldId) field.method(field, { value, id: device.property });

					}
				} catch (error) {
					const err = error;
				}
			}
		} catch (error) {

		}
	}

	async setListener({ fieldId, cap, settings }) {
		if (fieldId.startsWith('button')) {
			if (settings[fieldId + 'Disabled'] !== true)
				this.registerCapabilityListener(cap, (async (value, options) => {
					let oldValue = this.getStoreValue(fieldId + "Value");
					if (settings[fieldId + 'ShowAs'] === "pushbutton_indicator") {
						let val = this.getStoreValue(fieldId + "Value") === true;
						//await this.setCapabilityValue(cap, val); //Why twice?
						setTimeout(async () => {
							await this.setCapabilityValue(cap, val);
							await this.activateReact({ fieldId, value: val });
							this.driver.triggerFlowButton(this, !val, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
						}, 1);
						return true;
					} else {
						await this.driver.setSecondCapability({ val: value, device: this, fieldId });
						await this.setStoreValue(fieldId + "Value", value === true);
						await this.activateReact({ fieldId, value });
						this.driver.triggerFlowButton(this, value, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
					}
					return true;
				}).bind(this));
		}
		if (fieldId.startsWith('boolean')) {
			if (cap.indexOf('_button') > -1)
				this.registerCapabilityListener(cap, (async (value, options) => {
					let oldValue = this.getStoreValue(fieldId + "Value");
					await this.driver.setSecondCapability({ val: value, device: this, fieldId });
					await this.setStoreValue(fieldId + "Value", value === true);
					await this.activateReact({ fieldId, value });
					this.driver.triggerFlowBoolean(this, value, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
				}).bind(this));
		}
		if (fieldId.startsWith('number')) {
			this.registerCapabilityListener(cap, (async (value, options) => {
				let oldValue = this.getStoreValue(fieldId + "Value");
				await this.driver.setSecondCapability({ val: value, device: this, fieldId });
				await this.setStoreValue(fieldId + "Value", value);
				await this.activateReact({ fieldId, value });
				this.driver.triggerFlowNumber(this, value, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
			}).bind(this));
		}
		if (fieldId.startsWith('text')) {
			this.registerCapabilityListener(cap, (async (value, options) => {
				let oldValue = this.getStoreValue(fieldId + "Value");
				await this.driver.setSecondCapability({ val: value, device: this, fieldId });
				await this.setStoreValue(fieldId + "Value", value);
				await this.activateReact({ fieldId, value });
				this.driver.triggerFlowText(this, value, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
			}).bind(this));
		}
		if (fieldId.startsWith('list')) {
			this.registerCapabilityListener(cap, (async (value, options) => {
				let oldValue = this.getStoreValue(fieldId + "Value");
				await this.driver.setSecondCapability({ val: value, device: this, fieldId });
				await this.setStoreValue(fieldId + "Value", value);
				await this.activateReact({ fieldId, value });
				this.driver.triggerFlowList(this, value, { field: { id: fieldId }, changed: value !== oldValue }); //Do we need to await for triggerFlow?
			}).bind(this));
		}
	}


	async setCameras(settings) {
		if (!this.Cameras) this.Cameras = {};
		for (let i = 1; i <= settings.numberOfCameraFields || 0; i++) {
			const ref = "camera" + i;
			//if (settings[ref + "Name"] && settings[ref + "Url"] && settings[ref + "Name"] != "" && settings[ref + "Url"] != "") {
			if (settings[ref + "Name"] && settings[ref + "Name"] != "") {
				if (!this.Cameras[ref]) this.Cameras[ref] = { id: ref, image: await this.homey.images.createImage(), url: settings[ref + "Url"], name: settings[ref + "Name"] };
				else {
					this.Cameras[ref].url = settings[ref + "Url"];
					this.Cameras[ref].name = settings[ref + "Name"];
				}
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

		let attach = async () => {
			await this.setCameraImage(ref, this.Cameras[ref].name, this.Cameras[ref].image);
			this.Cameras[ref].attached = true;
		};
		try {
			if (this.Cameras[ref].imageByFlow) {
				const image = this.Cameras[ref].imageByFlow;
				delete this.Cameras[ref].imageByFlow;

				this.Cameras[ref].image.setStream(async (stream) => {
					return image.pipe(stream);
				});

				await this.Cameras[ref].image.update();
			}
			else if (this.Cameras[ref].url && this.Cameras[ref].url.length) {
				this.Cameras[ref].image.setUrl(this.Cameras[ref].url);
				await this.Cameras[ref].image.update();
			}

			if (!this.Cameras[ref].attached) await attach();
		} catch (error) {

		}
	}

	async setReflections(settings) {
		if (!this.homey.app.Reflections) this.homey.app.Reflections = {};

		for (let iTypes = 0; iTypes < types.length; iTypes++) {
			const type = types[iTypes];
			const fieldCount = type == "status" ? 1 : settings['numberOf' + this.capitalizeFirstLetter(type) + 'Fields'];

			for (let i = 1; i <= fieldCount; i++) {
				const reflect = settings[type + i + 'Reflect'];
				if (reflect === DC_DEVICES) {
					if (settings[type + i + 'ReflectDevices'] && settings[type + i + 'ReflectDevices'].length) for (let j = 0; j < settings[type + i + 'ReflectDevices'].length; j++) {
						const reflectDevice = settings[type + i + 'ReflectDevices'][j];
						if (!reflectDevice || !reflectDevice.id) continue;
						if (!this.homey.app.Reflections[reflect]) this.homey.app.Reflections[reflect] = {};
						if (!this.homey.app.Reflections[reflect][reflectDevice.id]) this.homey.app.Reflections[reflect][reflectDevice.id] = {};
						if (!this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property]) this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property] = { fields: [] }
						if (!this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property].fields.find(x => x.device == this && x.fieldId == type + i)) this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property].fields.push({
							device: this, fieldId: type + i, method: async (r, capability, {startUpRun} = {startUpRun:false}) => {
								if (this.Settings[r.fieldId + 'React'] === 'true_only_react') return;

								let property = this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property];
								// if(property.value === null ) {
								// 	let a = 1;
								// }

								//if (this.Settings[r.fieldId + 'React'] === 'true' && this.ReactLocks && this.ReactLocks[r.fieldId] && this.ReactLocks[r.fieldId] > (Date.now() - 1_000)) return;
								let devices = this.Settings[r.fieldId + 'ReflectDevices'];
								const calculations = this.Settings[r.fieldId + 'ReflectCalculation'];
								if (!devices) return;
								let value;
								let values;
								if (devices.length === 1) {
									value = capability.value;
								} else {
									values = [];
									for (let i = 0; i < devices.length; i++) {
										const device = devices[i];
										try {

											if (property.value === null || property.value === undefined || !this.Settings[r.fieldId + 'ReflectExcludeSeconds'] || this.homey.app.Reflections[reflect][device.id][device.property].lastUpdated > (Date.now() - (this.Settings[r.fieldId + 'ReflectExcludeSeconds'] * 1_000)))
												values.push(this.homey.app.Reflections[reflect][device.id][device.property].value);
										} catch (error) {

										}

									}
									//this.homey.app.log('r.fieldId', r.fieldId, 'r.device.name', r.device?r.device.getName():null, 'capability', capability, 'values', values);
									switch (calculations) {
										case 'bll': {
											const formatCalculation = this.Settings[r.fieldId + 'ReflectCalculationFormat'];
											if (formatCalculation) {
												try {
													value = await BL.express(formatCalculation, { values });
												} catch (error) {
													if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
												}
											}
										} break;
										case 'any': value = !!_.find(values, val => val === true); break;
										case 'all': value = _.every(values, val => val === true); break;

										case 'falseIfAny': value = !_.find(values, val => val === true); break;
										case 'falseIfAll': value = !_.every(values, val => val === true); break;

										case 'sum': value = _.sum(values); break;
										case 'mean': value = _.mean(values); break;
										case 'min': value = _.min(values); break;
										case 'max': value = _.max(values); break;
										case 'median': {
											const median = (array) => { array.sort((a, b) => b - a); const length = array.length; if (length % 2 == 0) { return (array[length / 2] + array[(length / 2) - 1]) / 2; } else { return array[Math.floor(length / 2)]; } };
											value = median(values);
										} break;
										default:
											break;
									}
								}

								//console.log('method ', capability, 'value', value, 'r.field', r.field);


								const format = this.Settings[r.fieldId + 'ReflectFormat'];
								if (format) {
									try {
										value = await BL.express(format, { value, values });
									} catch (error) {
										if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
									}
								}

								if (values && !values.length && (isNaN(value) || value === null || value === undefined) && property.value !== null) value = property.value;
								let valueUnit = undefined;
								if (type == 'status' && this.Settings[r.fieldId + 'ReflectFormatUnit']) {
									valueUnit = value;
									const formatUnit = this.Settings[r.fieldId + 'ReflectFormatUnit'];
									if (formatUnit) {
										try {
											valueUnit = await BL.express(formatUnit, { value, values });
										} catch (error) {
											if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
										}
									}
								}

								try {

									let args = { field: { id: r.fieldId }, device: r.device, value, mode: 'executewhencards', source: DC_DEVICES, startUpRun };
									if (type == 'status' && this.Settings[r.fieldId + 'ReflectFormatUnit']) args.units = valueUnit;
									await this.driver.setValue(args);
								} catch (error) {

								}

								// if (type == 'status' && this.Settings[r.fieldId + 'ReflectFormatUnit']) {
								// 	let valueUnit = value;
								// 	const formatUnit = this.Settings[r.fieldId + 'ReflectFormatUnit'];
								// 	if (formatUnit) {
								// 		try {
								// 			valueUnit = await BL.express(formatUnit, { value, values });
								// 		} catch (error) {
								// 			if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
								// 		}

								// 		try {
								// 			await this.driver.setSecondCapability({ field: { id: r.fieldId }, device: r.device, units: valueUnit });
								// 		} catch (error) {

								// 		}
								// 	}

								// }


								//let value = devices ? capability[devices] : capability.value;
								// const format = this.Settings[r.fieldId + 'ReflectFormat'];
								// let date, time;
								// if (property == 'lastChanged' && value) date = value = new Date(value);
								// if (format) {
								// 	try {
								// 		value = await BL.express(format, { value, variable: capability, date, timeMs: time });
								// 	} catch (error) {
								// 		if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
								// 	}
								// }
								// else if (property == 'lastChanged' && value) {
								// 	if (['status', 'number'].indexOf(type) > -1) value = value.getTime();
								// 	else if (['text'].indexOf(type) > -1) value = value.toISOString();
								// }
								// try {
								// 	await this.driver.setValue({ field: { id: r.fieldId }, device: r.device, value });
								// } catch (error) {

								// }
							}
						});

						this.setMethodDebounce(type, i, settings, this.homey.app.Reflections[reflect][reflectDevice.id][reflectDevice.property].fields.find(x => x.device == this && x.fieldId == type + i));

					}

					continue;
				}
				let reflectId = settings[type + i + 'ReflectId'];
				const reflectIdOri = reflectId;
				if (reflectId && reflect === 'nl.fellownet.chronograph') {
					reflectId = reflectId.type + '|' + reflectId.name;
				}
				if (reflectId && reflect === 'net.i-dev.betterlogic') {
					reflectId = reflectId.name;
				}
				if (reflect && reflectId) {
					if (!this.homey.app.Reflections[reflect]) this.homey.app.Reflections[reflect] = {};
					if (!this.homey.app.Reflections[reflect][reflectId]) {
						this.homey.app.Reflections[reflect][reflectId] = [];
					}

					if (reflect === 'net.i-dev.betterlogic') {

						if (!this.homey.app.Reflections[reflect][reflectId].find(x => x.device == this && x.fieldId == type + i)) this.homey.app.Reflections[reflect][reflectId].push({
							device: this, fieldId: type + i, method: async (r, variable, {startUpRun}) => {
								let property = this.Settings[r.fieldId + 'ReflectProperty'];
								let value = property ? variable[property] : variable.value;
								const format = this.Settings[r.fieldId + 'ReflectFormat'];
								let date, time;
								if (property == 'lastChanged' && value) date = value = new Date(value);
								if (format) {
									try {
										value = await BL.express(format, { value, variable, date, timeMs: time });
									} catch (error) {
										if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
									}
								}
								else if (property == 'lastChanged' && value) {
									if (['status', 'number'].indexOf(type) > -1) value = value.getTime();
									else if (['text'].indexOf(type) > -1) value = value.toISOString();
								}
								try {
									await this.driver.setValue({ field: { id: r.fieldId }, device: r.device, value, mode: 'executewhencards', startUpRun });
								} catch (error) {

								}
							}
						});
						//this.setMethodDebounce(type, i, settings, this.homey.app.Reflections[reflect][reflectId].find(x => x.device == this && x.fieldId == type + i));

					}
					else if (reflect === 'nl.fellownet.chronograph') {
						if (!this.homey.app.Reflections[reflect][reflectId].find(x => x.device == this && x.fieldId == type + i)) this.homey.app.Reflections[reflect][reflectId].push({
							device: this, fieldId: type + i, method: async (r, chronograph, { startUpRun }) => {
								let property = this.Settings[r.fieldId + 'ReflectProperty'];
								if (chronograph.removed) chronograph.remaining = 0;
								let value = chronograph[property];
								const format = this.Settings[r.fieldId + 'ReflectFormat'];
								let timeMs;
								if ((value !== undefined && value !== null) && (property == 'elapsed' || property == 'remaining')) timeMs = value;

								if (format) try {
									value = await BL.express(format, { value, chronograph, timeMs });
								} catch (error) {
									if (error != 'Better Logic Library is not loaded.');//through an alert anywhere?;
								} else {
									if (['elapsed', 'remaining'].indexOf(property) > -1) value = value / 1_000;
								}
								try {
									await this.driver.setValue({ field: { id: r.fieldId }, device: r.device, value: value, mode: 'executewhencards' , startUpRun});
								} catch (error) {

								}
								//await this.setCapabilityValue(this.getStoreValue(r.fieldId), x.value);
							}
						});

						//this.setMethodDebounce(type, i, settings, this.homey.app.Reflections[reflect][reflectId].find(x => x.device == this && x.fieldId == type + i));
					}
				}
			}
		}
		let api;
		for (const reflect in this.homey.app.Reflections) {
			for (const reflectId in this.homey.app.Reflections[reflect]) {
				if (reflect == DC_DEVICES) {
					continue;
				} else {
					this.homey.app.Reflections[reflect][reflectId] = this.homey.app.Reflections[reflect][reflectId].filter(x => x.device !== this || (settings[x.fieldId + 'Reflect'] && settings[x.fieldId + 'ReflectId'] && (settings[x.fieldId + 'ReflectId'].name == reflectId || reflectId == (settings[x.fieldId + 'ReflectId'].type + '|' + settings[x.fieldId + 'ReflectId'].name))));
					if (!this.homey.app.Reflections[reflect][reflectId].length) delete this.homey.app.Reflections[reflect][reflectId];
				}
			}
			if (reflect == DC_DEVICES) {
				const _this = this;
				if (!api) api = await this.homey.app.refreshHomeyAPI();
				//disconnect first
				for (const deviceId in this.homey.app.Reflections[reflect]) {
					try {

						if (!this.homey.app.devices) continue;
						const device = await this.homey.app.getDevice({ id: deviceId, full: true });
						if (!device) continue;
						for (const propertyId in this.homey.app.Reflections[reflect][deviceId]) {
							const property = this.homey.app.Reflections[reflect][deviceId][propertyId];
							try {

								if (!property.listener) {
									const cap = device.capabilitiesObj[propertyId];
									property.value = cap.value;
									property.lastUpdated = new Date(cap.lastUpdated).getTime();
									property.listener = device.makeCapabilityInstance(propertyId, async function (value) {
										//_this.homey.log('makeCapabilityInstance', device.name, 'propertyId', propertyId, 'property.value', property.value, 'value', value);
										if (property.value === value) return;
										property.value = value;
										property.lastUpdated = Date.now();
										for (let i = 0; i < property.fields.length; i++) {
											const field = property.fields[i];
											await field.method(field, { value, id: propertyId });
										}
									});
								}
							} catch (error) {
								this.homey.error('setReflections - const reflect in this.homey.app.Reflections device:', device, '\nPropertyId: ', propertyId, '\nError:', error);
							}

							// for (let i = 0; i < property.fields.length; i++) {
							// 	const field = property.fields[i];
							// 	process.nextTick(()=> {[tef:AVD,FLOWS:"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":/tef]number
							// 		field.method(field, { value:property.value, id: propertyId });
							// 	})
							// }
						}
					} catch (error) {
						this.error('setReflections for (const deviceId in) Error: ', error);
					}
				}
			}
		}
		this.homey.app.updateReflection({ device: this });
	}



	setMethodDebounce(type, i, settings, prop) {

		//const prop = this.homey.app.Reflections[reflect][reflectId].find(x => x.device == this && x.fieldId == type + i);
		if (!prop.originalMethod) prop.originalMethod = prop.method;
		prop.method = _.debounce(prop.originalMethod, 250, { leading: true, maxWait: 250, trailing: true });

		// if (settings[type + i + 'ReflectDebounce']) prop.method = _.debounce(prop.originalMethod, settings[type + i + 'ReflectDebounce'], { leading: true, maxWait: settings[type + i + 'ReflectDebounce'], trailing: true });
		// else prop.method = prop.originalMethod;
	}

	async getOrderFields() {
		if (!this.Settings) return null;
		let result = { components: [] };
		let capabilities = {};
		let api = await this.homey.app.refreshHomeyAPI();



		for (let iTypes = 0; iTypes < types.length; iTypes++) {
			const type = types[iTypes];
			const fieldCount = type == "status" ? 1 : this.Settings['numberOf' + this.capitalizeFirstLetter(type) + 'Fields'] || 0;

			for (let i = 1; i <= fieldCount; i++) {
				let cap = this.getStoreValue(type + i);
				capabilities[cap] = type + i;
			}
		}
		let device = await api.devices.getDevice({ id: this.getId() });


		if (device.ui && device.ui.components)
			for (let i = 0; i < device.ui.components.length; i++) {
				const component = device.ui.components[i];
				if (component.id === 'media') continue;
				let resultComponent = result.components.find(x => x.id === component.id);
				if (!resultComponent) {
					resultComponent = { id: component.id, capabilities: [] };
					result.components.push(resultComponent);
				}
				for (let iCaps = 0; iCaps < component.capabilities.length; iCaps++) {
					const capability = component.capabilities[iCaps];
					let resultCapability = resultComponent.capabilities.find(x => x.id === capability);
					if (!resultCapability) {
						resultCapability = { id: capability, fieldId: capabilities[capability], name: device.capabilitiesObj[capability].title };
						resultComponent.capabilities.push(resultCapability);
					}

				}
			}

		return result;
	}

	async saveOrderFields(orderFields) {
		let oldOrderFields = await this.getOrderFields();
		if (!orderFields) return;
		let energy = this.getEnergy();
		for (let iComponent = 0; iComponent < orderFields.components.length; iComponent++) {
			const component = orderFields.components[iComponent];
			let reset = false;
			for (let iCapability = 0; iCapability < component.capabilities.length; iCapability++) {
				const capability = component.capabilities[iCapability];
				if (!reset && oldOrderFields.components[iComponent].capabilities[iCapability].id === capability.id) continue;
				reset = true;
				let capOptions = this.getCapabilityOptions(capability.id);
				let capValue = this.getCapabilityValue(capability.id);
				await this.removeCapability(capability.id);
				await this.addCapability(capability.id);
				await this.setCapabilityOptions(capability.id, capOptions);
				await this.setCapabilityValue(capability.id, capValue);
			}
		}
		this.setEnergy(energy);
	}


	async loadFromSettings(settings, oldSettings, changedKeys, saved, imported) {

		try {

			let cls = this.getClass();
			let customLists = (await this.homey.settings.get('custom_lists')) || [];

			if (cls != settings.cls) {
				try {
					await this.setClass(settings.cls);
				} catch (error) {
					settings.cls = cls;
				}
			}
			if (this.hasCapability('devicecapabilities_starttext') && saved) await this.removeCapability('devicecapabilities_starttext');

			if (settings.imported) {
				if (settings.deviceIcon) {
					await this.homey.app.createDeviceIcon({ type: "image/svg", id: this.getData().id, buffer: settings.deviceIcon });
					delete settings.deviceIcon;
				}
				if (settings.saveCustomIcons) {
					//await this.homey.app.createDeviceIcon({type:"image/svg", id:this.getData().id, buffer:settings.deviceIcon });
					for (const iconUsedKey in settings.saveCustomIcons) {
						if (Object.hasOwnProperty.call(settings.saveCustomIcons, iconUsedKey)) {
							const toIconName = settings.saveCustomIcons[iconUsedKey];
							try {
								let data = settings.customIcons[iconUsedKey];
								if (data && data.length > 0) {
									await this.homey.app.createCustomIcon({ type: "image/svg", id: toIconName, buffer: data });
								}
							} catch (error) {

							}
							this.driver.executeForAllTypes(this, (type, i) => {
								if (settings[type + i + "Icon"] == iconUsedKey) settings[type + i + "Icon"] = toIconName;
							});
						}
					}
					delete settings.saveCustomIcons;
				}

				if (settings.customIcons) delete settings.customIcons;
			}


			let button1Reset = false;
			let energyCumulative = false;
			let energyCumulativeImported = undefined;
			let energyCumulativeExported = undefined;
			for (let iTypes = 0; iTypes < types.length; iTypes++) {
				const type = types[iTypes];
				const fieldCount = type == "status" ? 1 : Math.max(settings['numberOf' + this.capitalizeFirstLetter(type) + 'Fields'] || 0, oldSettings['numberOf' + this.capitalizeFirstLetter(type) + 'Fields'] || 0);
				let fieldTypeCreated = false;

				for (let i = 1; i <= fieldCount; i++) {
					//if(type=="status" && i>1) continue;
					try {
						let name = settings[type + i + 'Name'];
						let oldCap = this.getStoreValue(type + i);
						let secondCap = type == 'status' ? ("measure_Status" + "." + type + i) : (this.capitalizeFirstLetter(type) + "." + type + i);
						if (name && name.length > 0) {
							let oldValue;
							let customListValues;
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
							let resetOptions = false;

							let sensor = false;

							//let isStatus = type=="status";
							let createSecondCap = (settings[type + i + 'CreateInsights'] === true || settings[type + i + 'CreateTag'] === true) && settings[type + i + 'SeparateCapabilities'] !== false;

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
									cap = (settings[type + i + 'CreateFlowCards'] !== true ? '' : 'measure_') + 'devicecapabilities_' + (settings[type + i + 'ShowAs'] === 'slider' ? 'slider_' : '') + type +
										(settings[type + i + 'ShowAs'] !== 'slider' ? icon : '') + '.' + type + i;
									switch (settings[type + i + 'ShowAs']) {
										case undefined:
										case null:
										case "": break;
										case "sensor": break;
										case "slider": break;
										// case "measure_sensor" :
										// 	cap = 'measure_devicecapabilities_number' + icon + '.' + type + i;
										// 	 break;
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
									if (createSecondCap) cap = 'devicecapabilities_number' + icon + '.' + type + i;
									else cap = 'measure_devicecapabilities_number' + icon + '.' + type + i;
									break;
								case "list":
									switch (settings[type + i + 'ShowAs']) {
										case undefined:
										case null:
										case "":
										case "picker":
										case "ternary":
											cap = settings[type + i + 'PrefixedList'] && settings[type + i + 'PrefixedList'].length ?
												(settings[type + i + 'OnlyThroughFlows'] === true ? settings[type + i + 'PrefixedList'].replace('devicecapabilities_picker', 'devicecapabilities_picker_onlythroughflows') : settings[type + i + 'PrefixedList'])
												: (settings[type + i + 'ShowAs'] == 'ternary' ? 'devicecapabilities_ternary-up-idle-down_list' : 'devicecapabilities_picker-up-idle-down_list');
											break;
										case "customlist":
											cap = (settings[type + i + 'OnlyThroughFlows'] === true ? 'devicecapabilities_custom_list_onlythroughflows' : 'devicecapabilities_custom_list') + '.' + type + i;
											customListValues = customLists ? _.find(customLists, x => x.name == settings[type + i + 'CustomList']) : null;
											if (customListValues) customListValues = customListValues.values;
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
								case "boolean":
									let isAlarm, quickAction;
									switch (settings[type + i + 'ShowAs']) {
										case undefined:
										case null:
										case "":
										case "sensor": sensor = true; break;
										case "alarm": isAlarm = true; break;
										case "onoff": quickAction = true; break; // Is not in use anymore.
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
										if (settings[type + i + 'CreateFlowCards'] === true && i === 1 && !isOnOffButtonTab) {
											cap = (isOnOff ? 'onoff' : type) + (settings[type + i + 'CreateFlowCards'] !== true ? "." + type + i : '');
										} else {
											cap = ((isOnOff ? 'onoff_' : '') + (isOnOffButtonTab ? 'onoffbuttontab_' : '') + ("devicecapabilities" + (disabled ? "_disabled" : "") + "_button" + icon + "." + type + i));
										}
									}
									//if (!oldCap && i===1) oldCap = 'button';

									break;
							}
							if (oldCap) oldValue = this.getCapabilityValue(oldCap) || oldValue;
							else if (type == "status") oldValue = 0;


							if (oldCap && cap != oldCap && this.hasCapability(oldCap)) {
								await this.removeCapability(oldCap);
								resetOptions = true;
								//await api.insights.deleteLog({ uri: targetInsight.uri, id: targetInsight.id }); // Do i want this automatic, or after a restart?
							}
							//else targetInsight = null;





							fieldTypeCreated = true;

							if ((type == "button" || (type == "boolean" && cap.indexOf('_button') > -1)) && button1Reset) {
								resetOptions = true;
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
								try {
									if (oldValue !== undefined) await this.setCapabilityValue(cap, oldValue);
								} catch (error) {

								}
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
							//let values = null;
							// if(type=="dropdown") {
							// 	if(opt.values!=settings["dropdown"+i+"Values"] || changedKeys.indexOf("dropdown"+i+"Values")>-1)
							// 	values = this.getDropDownValues(settings["dropdown"+i+"Values"]);
							// }

							let decimals = settings[type + i + 'Decimals'];// decimals = decimals===1?undefined:null;
							let max = settings[type + i + 'Max'];///max = max===1?undefined:null;
							let min = settings[type + i + 'Min'];///min = min===1?undefined:null;
							let step = settings[type + i + 'Step'];
							let disableZoneActivity = settings[type + i + 'DisableZoneActivity'];

							let customListValuesJson = customListValues ? JSON.stringify(customListValues) : null;
							let values = opt.values ? JSON.stringify(opt.values) : null;

							// let var1= (settings[type + i + 'SeparateCapabilities']!==true && (opt.preventTag!= !settings[type + i + 'CreateTag'] || opt.preventInsights!= !settings[type + i + 'CreateInsights']));
							// let var2= (settings[type + i + 'SeparateCapabilities']===true && (opt.preventTag!==true || opt.preventInsights!==true)) ;
							// let var3= ((opt.preventInsights!==true && settings[type + i + 'SeparateCapabilities']!==false)) ;
							// let var4= (opt.preventInsights === settings[type + i + 'CreateInsights'] && settings[type + i + 'SeparateCapabilities']===false);
							// let var5= (settings[type + i + 'Units'] != oldSettings[type + i + 'Units'] && type != 'status');

							let capOptionsChanged = 
								resetOptions ||
								opt.title != name ||
								//(opt.preventTag!==true && (settings[type + i + 'SeparateCapabilities']===true || settings[type + i + 'CreateTag']===true)) ||
								//(opt.preventTag===true && (settings[type + i + 'SeparateCapabilities']!==true && settings[type + i + 'CreateTag']===true)) ||
								(settings[type + i + 'SeparateCapabilities'] !== true && (opt.preventTag === settings[type + i + 'CreateTag'] || opt.preventInsights === settings[type + i + 'CreateInsights'])) ||
								(settings[type + i + 'SeparateCapabilities'] === true && (opt.preventTag !== true || opt.preventInsights !== true)) ||
								//((opt.preventInsights!==true && settings[type + i + 'SeparateCapabilities']!==false) || 
								//(opt.preventInsights === settings[type + i + 'CreateInsights'] && settings[type + i + 'SeparateCapabilities']===false)) ||
								//opt.preventInsights != settings[type + i + 'PreventInsights'] ||
								(settings[type + i + 'Units'] != oldSettings[type + i + 'Units'] && type != 'status') ||
								(opt.decimals != decimals) ||
								disableZoneActivity != oldSettings[type + i + 'DisableZoneActivity'] ||
								(opt.insightsTitleTrue != settings[type + i + 'InsightsTitleTrue'] && settings[type + i + 'InsightsTitleTrue'] && settings[type + i + 'InsightsTitleTrue'] != '') ||
								(opt.insightsTitleFalse != settings[type + i + 'InsightsTitleFalse'] && settings[type + i + 'InsightsTitleFalse'] && settings[type + i + 'InsightsTitleFalse'] != '') ||
								customListValuesJson != values ||
								(decimals != oldSettings[type + i + 'Decimals']) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  ||
								(min != oldSettings[type + i + 'Min']) || //&& decimals!==-1 && !oldSettings[type + i + 'Decimals'])  || && min!==-1 && !oldSettings[type + i + 'Min'])  ||
								(max != oldSettings[type + i + 'Max']) ||
								(step != oldSettings[type + i + 'Step']);
							//|| opt.uiQuickAction != settings[type + i + 'UiQuickAction']
							//|| (type == 'button' && disabled && !pushbutton && opt.value!=checked );
							if (capOptionsChanged) {
								let optionValues = { type, i, settings, decimals, min, max, name, step, disableZoneActivity, values: customListValues };
								if (type == "status") optionValues.units = opt.units || name;
								let optNew = this.getOptions(optionValues);
								if (settings[type + i + 'SeparateCapabilities'] !== true) {
									optNew.preventInsights = !settings[type + i + 'CreateInsights'];
									optNew.preventTag = !settings[type + i + 'CreateTag'];
								}
								//if (cap === 'measure_power' || cap.startsWith('measure_power.')) optNew.approximated = true; //Does not do much usefulls, only remove the graph from Mobile--> Energy, or not?

								if (this.hasCapability(cap))
									await this.setCapabilityOptions(cap, optNew);
							}
							let secondCapRemoved = false;
							//Status needs it second capability?
							//if(isStatus || ((settings[type + i + 'CreateInsights']===true ||settings[type + i + 'CreateTag']===true) && settings[type + i + 'SeparateCapabilities']!==false)) {
							if (createSecondCap) {
								if (!this.hasCapability(secondCap)) {
									await this.addCapability(secondCap);
									capOptionsChanged = true;
								}
								//let secondOpt; try { secondOpt = this.getCapabilityOptions(cap); } catch (error) { }
								if (
									capOptionsChanged ||
									//(isStatus && )
									settings[type + i + 'CreateInsights'] != oldSettings[type + i + 'CreateInsights'] ||
									settings[type + i + 'CreateTag'] != oldSettings[type + i + 'CreateTag']) {
									let optionValues = { type, i, settings, decimals, min, max, name, step };
									if (type == "status") optionValues.units = opt.units || name;
									let optNew = this.getOptions({ type, i, settings, decimals, min, max, name, step, disableZoneActivity });
									optNew.preventInsights = settings[type + i + 'CreateInsights'] !== true;
									optNew.preventTag = settings[type + i + 'CreateTag'] !== true;
									//if(settings[type + i + 'CreateInsights']===true)
									if (this.hasCapability(secondCap))
										await this.setCapabilityOptions(secondCap, optNew);
								}

								if (oldValue !== undefined && capOptionsChanged)
									await this.setCapabilityValue(secondCap, oldValue);


							} else {
								if (this.hasCapability(secondCap))
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

							if (settings[type + i + 'EnergyCumulativeImported']) energyCumulativeImported = createSecondCap ? secondCap : cap;
							if (settings[type + i + 'EnergyCumulativeExported']) energyCumulativeExported = createSecondCap ? secondCap : cap;

							if (type == 'button' && disabled && !pushbutton) {
								await this.setCapabilityValue(cap, checked);
							}

						} else {
							this.setStoreValue(type + i, null);
							await device.setStoreValue(type + i+"Value", null);

							if(oldCap) {
								this.setStoreValue(oldCap, null);
								if (this.hasCapability(oldCap)) await this.removeCapability(oldCap);
							}
							if (this.hasCapability(secondCap)) await this.removeCapability(secondCap);
						}
					}
					catch (err) {
						this.error(err);
					}

				}
			}
			if (settings['energyCumulative']) energyCumulative = true;

			let energy = await this.getEnergy();

			if (!energy || energyCumulative != energy.cumulative
				|| energyCumulativeImported != energy.cumulativeImportedCapability
				|| energyCumulativeExported != energy.cumulativeExportedCapability
			) {
				// if (!energy) energy = { cumulative: energyCumulative };
				// else energy.cumulative = energyCumulative;
				// if (!energyCumulative) energy = {};
				energy = {};//cumulative: energyCumulative };
				if (energyCumulative) energy.cumulative = energyCumulative;
				if (energyCumulativeImported) energy.cumulativeImportedCapability = energyCumulativeImported;
				if (energyCumulativeExported) energy.cumulativeExportedCapability = energyCumulativeExported;

				//if (!energyCumulative) energy = {};
				// energy = {
				// 	approximation: {
				// 		usageConstant: 0
				// 	}
				// };
				await this.setEnergy(energy);
			}

			// if(settings.batteries != oldSettings.batteries) {
			// 	let energy = this.getEnergy();
			// 	if(settings.batteries.trim()=='') delete energy.batteries;
			// 	else energy.batteries = settings.batteries.replace(' ', '').split(',');
			// 	this.setEnergy(energy);
			// } 

			await this.setCameras(settings);

			if (settings.imported) delete settings.imported;
			if (settings.flows) delete settings.flows;
			if (settings.advancedflows) delete settings.advancedflows;
			//if(settings.originalId) delete settings.originalId; // Maybe we will use this later?

			await this.setStoreValue('Settings', settings);



			//if(command=="") command = null;
			this.Settings = settings;

			await this.setReflections(settings);

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
	// 	let results = [];
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
	// 		let seperators = {
	// 			"," : {"sep":",", "count": (text.match(/\,/g) ||[]).length},
	// 			";" : {"sep":";", "count": (text.match(/\;/g) ||[]).length}
	// 		};
	// 		let sep1 = _.orderBy(seperators,"count",'desc');
	// 		let sep = _.first(sep1) ? sep1[0].sep : "null";
	// 		let arr = text.split(sep);
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

	getOptions({ type, i, settings, decimals, min, max, name, units, step, disableZoneActivity, values }) {
		let optNew = {
			title: name,
			preventInsights: true,
			preventTag: true,
			//decimals: decimals,
			insightsTitleTrue: settings[type + i + 'InsightsTitleTrue'],
			insightsTitleFalse: settings[type + i + 'InsightsTitleFalse']
		};
		if (units) optNew.units = units;
		else if (settings[type + i + 'Units']) optNew.units = settings[type + i + 'Units'];

		if (decimals !== undefined) optNew.decimals = decimals;
		if (min !== undefined) optNew.min = min;
		if (max !== undefined) optNew.max = max;
		if (step !== undefined) optNew.step = step;
		if (disableZoneActivity === true) optNew.zoneActivity = false;
		if (values !== undefined) optNew.values = values;
		return optNew;
	}
};
