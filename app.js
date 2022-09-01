'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('athom-api');
const _ = require('lodash-core');

const { Defer } = require('./lib/proto');

const { join } = require('path');
const { readFile, writeFile, unlink, rename, exists, mkdir, copyFile, readdir, stat } = require('fs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const fs = require('fs');


const SETTING_PREFIX = 'icons_';
const TYPES_MAP = {
	'image/svg': 'svg',	
	'image/svg+xml': 'svg'
};

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const copyFileAsync = promisify(copyFile);
const unlinkAsync = promisify(unlink);
const renameAsync = promisify(rename);
const existsAsync = promisify(exists);
const mkdirAsync = promisify(mkdir);
const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);


class DeviceSetter extends Homey.App {
	/**@type {DeviceSetter} */
    static get Current() {return this._current; }
    static set Current(v) { this._current = v; }

	Triggers = {
		triggercapabilitychanged: { List: [], Card: null },
		triggercapabilitychanged2: { List: [], Card: null },
		triggerappstarted: { List: [], Card: null }
	};
	Tracking = {
		/** @type {HomeyAPI} homeyAPI; */
		homeyAPI: null,
		homeyAPIStatic: null,
		devices: {}
	}
	Tracking2 = {
		/** @type {HomeyAPI} homeyAPI; */
		homeyAPI: null,
		homeyAPIStatic: null,
		devices: {}
	}

	onInit() {
		DeviceSetter.Current = this;        
        this.VirtualDevices = {};
		//return null;

		if (process.env.DEBUG === '1') require('inspector').open(9222, '0.0.0.0', true);
		

		this.log('DeviceSetter is running...');
		this.refreshHomeyAPI().then(async api => {
			this.Tracking.homeyAPIStatic = api;
		});

		var capabilityZoneActions = ['set_capability_zone_text', 'set_capability_zone_number', 'set_capability_zone_percentage', 'set_capability_zone_boolean', 'set_capability_zone_2_boolean', 'set_capability_zone_json'];//, 'set_capability_zone_anders'];
		_.forEach(capabilityZoneActions, (action => {
			var set_capability_zone = this.homey.flow.getActionCard(action);
			set_capability_zone
				.on('update', (() => {
					this.clearHomeyAPI(action);
				}).bind(this))
				.registerRunListener(((args, state) => {
					try {
						if (!args || !args.zone || !args.zone.id) return Promise.resolve(false);
						var defer = new Defer();
						var devices = this.devices;
						var zones = this.zones;

						var cls = args.deviceclass ? args.deviceclass.id : args.capability.id.split('.')[0];
						var capability = args.deviceclass ? args.capability.id : args.capability.id.substr(args.capability.id.indexOf('.') + 1);
						var devicesToSet = [];
						setZone(args.zone.id);
						var val = args.value;
						if (action.endsWith('_boolean')) val = val === 'true' || val === true;
						if (action.endsWith('_json')) val = JSON.parse(val);// === 'true' || val ===true;
						var promises = [];
						var values = null;//capability.values;
						_.forEach(devicesToSet, d => {
							if (d && d.capabilitiesObj && d.capabilitiesObj && d.capabilitiesObj[capability] && d.setCapabilityValue) {
								values = d.capabilitiesObj[capability].values;
								promises.push(d.setCapabilityValue(capability, val));
								//promises.push(d.setCapabilityValue({capabilityId:capability, value:val}));
							}
						});
						var all = Promise.all(promises);
						all.then(x => {
							defer.resolve(true);
							return true;
						});
						all.catch(x => {
							if (x.message.contains('InvalidEnumValueError') && values && values.length) return defer.reject(x.message + '\r\nPossible values are: ' + (_.map(values, v => v.id + ' (' + v.title + ')')).join(', '));
							defer.reject(x);
							return false;
						});
						return defer.promise;

						function setZone(zoneId) {
							var devs = _.filter(devices, d => 
								d.zone == zoneId && 
								(!args.brand || !args.brand.id || d.driverUri===args.brand.id) && 
								(!args.devicetype || !args.devicetype.id || (d.driverUri===args.devicetype.brandUri && d.driverId===args.devicetype.id )) && 
								(d.class == cls || d.virtualClass == cls) && 
								d.capabilities && d.capabilities.indexOf(capability) > -1);
							_.forEach(devs, d => devicesToSet.push(d));
							if (args.subzones == 'yes') _.forEach(zones, z => {
								if (z.parent == zoneId) setZone(z.id);
							});
						}


					} catch (error) {
						this.log('set_capability-error:');
						this.log(error);
					}
				}).bind(this))
				.getArgument('deviceclass').registerAutocompleteListener((query, args) => {
					this.log('args');
					this.log(args);
					var defer = new Defer(10000);
					this.getDeviceclasss(action, query, args).then((r) => {
						defer.resolve(r);
					}).catch(err => { defer.reject(err); });
					return defer.promise;
				});
			set_capability_zone.getArgument('brand').registerAutocompleteListener(async (query, args) => {
				if (!args.deviceclass || !args.deviceclass.id) throw new Error("First select Device Class.");
				return await this.getDeviceclassBrands(action, query, args);
			});

			set_capability_zone.getArgument('devicetype').registerAutocompleteListener(async (query, args) => {
				if (!args.deviceclass || !args.deviceclass.id) throw new Error("First select Device Class.");
				return await this.getDeviceclassDeviceTypes(action, query, args);
			});
			
			set_capability_zone.getArgument('capability').registerAutocompleteListener((query, args) => {
				if (!args.deviceclass || !args.deviceclass.id) return Promise.reject(new Error("First select Device Class."));
				var defer = new Defer(10000);

				this.getDeviceclassCapabilities(action, query, args).then((r) => {
					defer.resolve(r);
				}).catch(err => { defer.reject(err); });
				return defer.promise;
			});
			set_capability_zone
				.getArgument('zone').registerAutocompleteListener((query, args) => {
					var defer = new Defer(10000);
					//this.refreshHomeyAPI(action).then((async api => {
					var zones = this.zones;//await api.zones.getZones();
					var home = _(zones).find(z => !z.parent);
					var arr = [];

					fill(home);
					defer.resolve(_.map(arr, zone => { return { id: zone.id, name: zone.name }; }));

					function fill(obj, spaces) {
						spaces = spaces || '';
						arr.push({ id: obj.id, name: spaces + obj.name });
						let subzones = _.filter(zones, z => z.parent == obj.id);
						subzones = _.orderBy(subzones, 'name');
						_(subzones).forEach(z => fill(z, spaces + '.. '));
					}
					//}).bind(this));
					return defer.promise;
				});
		}).bind(this));


		//#region Old Trigger
		let trigger_capability_changedTrigger = this.homey.flow.getTriggerCard('trigger_capability_changed');
		this.Triggers.triggercapabilitychanged.Card = trigger_capability_changedTrigger;
		trigger_capability_changedTrigger
			.on('update', (() => {
				refreshcapabilityChangedTriggers.call(this);
			}).bind(this))
			.registerRunListener((args, state) => {
				var r = args.device && args.device.id && state.device && state.device.id && args.device.id === state.device.id &&
					args.capability && args.capability.id && state.capability && state.capability.id && args.capability.id === state.capability.id;
				return Promise.resolve(r);
			})
			.getArgument('device')
			.registerAutocompleteListener(this.autocompleteDevice({ api: 'trigger_capability_changed' }));
		trigger_capability_changedTrigger.getArgument('capability')
			.registerAutocompleteListener(this.autocompleteCapability({ getable: true, api: 'trigger_capability_changed' }));
		refreshcapabilityChangedTriggers.call(this);

		function refreshcapabilityChangedTriggers() {
			this.clearHomeyAPI('trigger_capability_changed');
			trigger_capability_changedTrigger.getArgumentValues()
				.then((args => {
					this.Triggers.triggercapabilitychanged.List = args;
					var devices = _.map(_.uniqBy(args, arg => { return arg.device.id; }), arg => { return arg.device; });
					_.each(devices, device => {
						if (!this.Tracking.devices[device.id]) this.Tracking.devices[device.id] = device;
						var capabilitiesArgs = _.filter(args, _arg => { return _arg.device.id == device.id; });
						capabilitiesArgs = _.uniqBy(capabilitiesArgs, capArg => { return capArg.capability.id; });
						capabilitiesArgs = _.map(capabilitiesArgs, capArg => { return capArg.capability.id; });
						_.each(capabilitiesArgs, capability => {
							var deviceToSet = this.Tracking.devices[device.id];
							if (!deviceToSet.capabilities) deviceToSet.capabilities = {};
							if (!deviceToSet.capabilities[capability]) deviceToSet.capabilities[capability] = { id: capability };
						});
						this.updateTracking(false, this.Triggers.triggercapabilitychanged);
					});

				}).bind(this));
		}
		//#endregion


		let trigger_capability_changed2Trigger = this.homey.flow.getTriggerCard('trigger_capability_changed2');
		this.Triggers.triggercapabilitychanged2.Card = trigger_capability_changed2Trigger;
		trigger_capability_changed2Trigger
			.on('update', (() => {
				refreshcapabilitychangedtrigger2s.call(this);
			}).bind(this))
			.registerRunListener((args, state) => {
				var r = args.device && args.device.id && state.device && state.device.id && args.device.id === state.device.id &&
					args.capability && args.capability.id && state.capability && state.capability.id && args.capability.id === state.capability.id;
				return Promise.resolve(r);
			})
			.getArgument('device')
			.registerAutocompleteListener(this.autocompleteDevice({ api: 'trigger_capability_changed2' }));
		trigger_capability_changed2Trigger.getArgument('capability')
			.registerAutocompleteListener(this.autocompleteCapability({ getable: true, api: 'trigger_capability_changed2' }));
		refreshcapabilitychangedtrigger2s.call(this);

		function refreshcapabilitychangedtrigger2s() {
			this.clearHomeyAPI('trigger_capability_changed2');
			trigger_capability_changed2Trigger.getArgumentValues()
				.then((args => {
					this.Triggers.triggercapabilitychanged2.List = args;
					var devices = _.map(_.uniqBy(args, arg => { return arg.device.id; }), arg => { return arg.device; });
					_.each(devices, device => {
						if (!this.Tracking2.devices[device.id]) this.Tracking2.devices[device.id] = device;
						var capabilitiesArgs = _.filter(args, _arg => { return _arg.device.id == device.id; });
						capabilitiesArgs = _.uniqBy(capabilitiesArgs, capArg => { return capArg.capability.id; });
						capabilitiesArgs = _.map(capabilitiesArgs, capArg => { return capArg.capability.id; });
						_.each(capabilitiesArgs, capability => {
							var deviceToSet = this.Tracking2.devices[device.id];
							if (!deviceToSet.capabilities) deviceToSet.capabilities = {};
							if (!deviceToSet.capabilities[capability]) deviceToSet.capabilities[capability] = { id: capability };
						});
						this.updateTracking2(false, this.Triggers.triggercapabilitychanged2);
					});

				}).bind(this));
		}



		let trigger_app_startedTrigger = this.homey.flow.getTriggerCard('trigger_app_started');
		this.Triggers.triggerappstarted.Card = trigger_app_startedTrigger;
		trigger_app_startedTrigger
			.on('update', (() => this.refreshAppStarted()))
			.registerRunListener((args, state) => {
				var r = args.app && args.app.id && state.app && state.app.id && args.app.id === state.app.id;
				return Promise.resolve(r);
			})
			.getArgument('app')
			.registerAutocompleteListener(this.autocompleteApp());
		//this.refreshAppStarted.call(this);


		let condition_app_running = this.homey.flow.getConditionCard('condition_app_running');
		condition_app_running.registerRunListener(async (args, state) => {
			if (!args.app || !args.app.id || !this.apps || !this.apps[args.app.id]) return false;
			else return this.apps[args.app.id].state === 'running';
		})
			.getArgument('app').registerAutocompleteListener(this.autocompleteApp());


		let condition_change_capability_boolean = this.homey.flow.getConditionCard('condition_change_capability_boolean');
		condition_change_capability_boolean
			.registerRunListener((args, state) => {
				console.log('condition_change_capability_boolean.registerRunListener');
				var defer = new Defer();
				if (!(args.device && args.device.id && args.capability && args.capability.id)) {
					defer.reject('Reject');
					return defer.promise;
				};
				this.refreshHomeyAPI().then((async api => {
					var device = await api.devices.getDevice({ id: args.device.id });
					if (!device) {
						defer.reject('Reject');
						return defer.promise;
					}

					var startTime = new Date().getTime();
					_setTimeout();
					function _setTimeout() {
						setTimeout(async () => {
							device.setCapabilityValue(args.capability.id, args.value == 'true')
								.then(() => {
									if (new Date().getTime() - startTime < 20 * 1000) _setTimeout();
									else defer.reject();
								})
								.catch((e) => {
									if (e.name == args.error) defer.resolve();
									else if (new Date().getTime() - startTime < 20 * 1000) _setTimeout();
									else defer.reject('"' + e + '"');
								});

						}, 250);
					}

					// var tracker = device.makeCapabilityInstance(args.capability.id, function (s) {
					// 	console.log('capability ' +  args.capability.id + ' changed:' + s );
					// });
					// defer.finally(x=> {
					// 	if(tracker && tracker.destroy) tracker.destroy();
					// });

					//await tracker.setValue(args.value=='true');

				}).bind(this));

				return defer.promise;
				//return Promise.resolve(r);
			})
			.getArgument('device')
			.registerAutocompleteListener(this.autocompleteDevice({ api: 'condition_change_capability_boolean' }));
		condition_change_capability_boolean.getArgument('capability')
			.registerAutocompleteListener(this.autocompleteCapability({ getable: true, setable: true, api: 'condition_change_capability_boolean' }));


		var action_capability_logs = ['action_capability_log'];//, 'set_capability_zone_anders'];
		_.forEach(action_capability_logs, (action => {
			var set_capability_log = this.homey.flow.getActionCard(action);
			set_capability_log
				.on('update', (() => { this.clearHomeyAPI(action); }).bind(this))
				.registerRunListener((async (args, state) => {
					try {
						if (!args || !args.device || !args.capability) return false;

						// var targetInsight = _.find(device.device.insights, x => { return x.id == capability.id; });

						var api = await this.refreshHomeyAPI();

						//next is for Testing
						// var user = await api.users.getUserMe();
						// var users = await api.users.getUsers();
						// var sessionMe = await api.sessions.getSessionMe();
						// var sessions = await api.sessions.getSessions();
						// var homey = this.homey;
						//End test

						var device = await api.devices.getDevice({ id: args.device.id });
						var targetInsight = _.find(device.insights, x => { return x.id == args.capability.id; });

						var tokens = { text: '', number: 0, boolean: false, user: '', client: '' };

						if (targetInsight) {
							var insights, lastOne = null;
							try {
								var resolution = undefined;
								if (args.numberof <= 60) resolution = 'lastHour';
								else if (args.numberof <= 60 * 6) resolution = 'last6Hours';
								else if (args.numberof <= 60 * 24) resolution = 'last24Hours';
								else if (args.numberof <= 60 * 24 * 3) resolution = 'last3Days';
								else if (args.numberof <= 60 * 24 * 7) resolution = 'last7Days';
								else if (args.numberof <= 60 * 24 * 14) resolution = 'last14Days';
								else if (args.numberof <= 60 * 24 * 31) resolution = 'last31Days';
								else if (args.numberof <= 60 * 24 * 30 * 3) resolution = 'last3Months';
								else if (args.numberof <= 60 * 24 * 30 * 6) resolution = 'last6Months';
								else if (args.numberof <= 60 * 24 * 365 * 2) resolution = 'last2Years';
								insights = await api.insights.getLogEntries({ uri: targetInsight.uri, id: targetInsight.id, resolution: resolution });//, resolution: 'lastHour' });
							} catch (error) {
								insights = await api.insights.getLogEntries({ uri: targetInsight.uri, id: targetInsight.id });
							}
							var now = new Date();
							now.setMinutes(now.getMinutes() - args.numberof);
							insights.values = _.filter(insights.values, i => { return new Date(i.t) < now && (i.v !== null || i.v !== undefined); });
							if (insights && (lastOne = _.last(insights.values))) {
								if (lastOne.originUserName) tokens.user = lastOne.originUserName;
								if (lastOne.originName) tokens.client = lastOne.originName;
								else if (lastOne.originClientName) tokens.client = lastOne.originClientName;

								if (typeof (lastOne.v) == typeof (tokens.text)) tokens.text = lastOne.v;
								else if (typeof (lastOne.v) == typeof (tokens.number)) {
									tokens.number = lastOne.v;
									if (Number.isInteger(targetInsight.decimals)) tokens.number = parseFloat(lastOne.v.toFixed(targetInsight.decimals));
								}
								else if (typeof (lastOne.v) == typeof (tokens.boolean)) tokens.boolean = lastOne.v;
							}
						}

						return tokens;
					} catch (error) {
						this.log('set_capability-error:');
						this.log(error);
					}
				}).bind(this));


			set_capability_log.getArgument('device')
				.registerAutocompleteListener(this.autocompleteDevice({ api: 'set_capability_log' }));
			set_capability_log.getArgument('capability')
				.registerAutocompleteListener(this.autocompleteCapability({ getable: true, api: 'set_capability_log', insights: true }));
		}).bind(this));


		var virtualdevice_set_available = this.homey.flow.getActionCard('virtualdevice_set_available').registerRunListener(async (args, state) => {
			try {
				var device = _.find(this.VirtualDevices, dv=> dv.__id==args.device.id);
				device.setAvailable();
				//args.device.setAvailable();
			} catch (error) {
				this.log('action_virtualdevice_set_name:');
				this.error(error);
			}
		});
		virtualdevice_set_available.getArgument('device').registerAutocompleteListener(this.autocompleteDevice({ app: 'homey:app:'+this.id}));
		
		var virtualdevice_set_unavailable = this.homey.flow.getActionCard('virtualdevice_set_unavailable').registerRunListener(async (args, state) => {
			try {
				var device = _.find(this.VirtualDevices, dv=> dv.__id==args.device.id);
				device.setUnavailable(args.text);
			} catch (error) {
				this.log('action_virtualdevice_set_name:');
				this.error(error);
			}
		});
		virtualdevice_set_unavailable.getArgument('device').registerAutocompleteListener(this.autocompleteDevice({ app: 'homey:app:'+this.id}));

	
	
	}

	getDevices() {
		var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
		var ret = devices.map(vd => {
			return {
				id: vd.getData().id,
				name:vd.getName(),
				icon: vd.getData().icon,
			};			
		});
		return ret;
		// ;.getKeys()
		// 	.filter(key => {
		// 		return key.indexOf(SETTING_PREFIX) === 0;
		// 	})
		// 	.map(key => {
		// 		return this.getIcon({
		// 			id: key.substring(SETTING_PREFIX.length),
		// 		});			
		// 	});
	}

	getCustomIcons() {
		return this.homey.drivers.getDriver('virtualdevice').getCustomIcons();
	}

	async setFromDefaultIcon({ customicon, defaulticon }) {
		
		let filePathAssets = './assets/icons/';
		let file = defaulticon;// + '.svg';
		
		let filePath = './userdata/customicons/';
		let iconName = customicon.file + '.svg';
		if(await this.homey.app.fileExists(filePathAssets + file) ){
			await this.homey.app.copyFile(filePathAssets + file, filePath + iconName , filePath);
		}
	}


	getIcons() {
		return this.homey.settings.getKeys()
			.filter(key => {
				return key.indexOf(SETTING_PREFIX) === 0;
			})
			.map(key => {
				return this.getIcon({
					id: key.substring(SETTING_PREFIX.length),
				});			
			});
	}

	
	getIcon({ id }) {
		const icon = this.homey.settings.get(`${SETTING_PREFIX}${id}`);
		if( !icon ) throw new Error('invalid_icon');
		return icon;
	}
	
	async createIcon({ type, name, buffer, id }) {
		if( !TYPES_MAP[type] )
			throw new Error(`invalid_type:${type}`);
			
		const buf = new Buffer(buffer, 'base64');
		if( !Buffer.isBuffer(buf) )
			throw new Error("invalid_buffer");
			
		id = id || randomBytes(12).toString('hex');
		const ext = this.getExtByType(type);
		const path = `./userdata/icons/${id}${ext}`;

		if(!(await existsAsync('./userdata/icons/'))) await mkdirAsync('./userdata/icons/');
		

		await writeFileAsync(path, buf);
		
		await this.homey.settings.set(`${SETTING_PREFIX}${id}`, {
			id,
			type,
			name,
			path,
		});
		return this.getIcon({ id });
	}
	async createDeviceIcon({ type, name, buffer, id }) {
		return await this._createIcon({ type, name, buffer, id, subpath: 'virtualdeviceicons' });
	}
	async createCustomIcon({ type, name, buffer, id }) {
		return await this._createIcon({ type, name, buffer, id, subpath: 'customicons' });
	}

	async fileExists(path) {
		return await existsAsync(path);
	}

	async copyFile(from, to, toPath) {
		if(await existsAsync(from)) {
			if(!(await existsAsync(toPath))) await mkdirAsync(toPath);
			await copyFile(from, to, function(err) {
				// if (err) throw err;
				// console.log('source.txt was copied to destination.txt');
			  } );
		}
	}
	async readdir(dir) {
		return await readdirAsync(dir);
	}
	async fsstat(file) {
		return await statAsync(file);
	}
	async _createIcon({ type, name, buffer, id, subpath }) {
		if( !TYPES_MAP[type] )
			throw new Error(`invalid_type:${type}`);
			
		const base64 = buffer.replace("data:image/svg+xml;base64,", '');
		
		const buf = new Buffer(base64, 'base64');
		if( !Buffer.isBuffer(buf) )
			throw new Error("invalid_buffer");
			
		id = id;
		const ext = this.getExtByType(type);
		const path = `./userdata/${subpath}/${id}${ext}`;
		
		if(!(await existsAsync(`./userdata/${subpath}/`))) await mkdirAsync(`./userdata/${subpath}/`);

		await writeFileAsync(path, buf);

		// var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
		// var device = devices.filter(d=>d);
		
		return {
			id,
			type,
			name,
			path,
		};
	}

	
	async updateIcon({ id, name, path }) {
		const icon = await this.getIcon({ id });
		
		if( typeof name === 'string' )
			icon.name = name;
			
		if( typeof path === 'string' )
			icon.path = path;
		
		await this.homey.settings.set(`${SETTING_PREFIX}${id}`, icon);
		
		return this.getIcon({ id });
		
	}
	
	async deleteIcon({ id }) {
		const icon = await this.getIcon({ id });
		try {
			await unlinkAsync(icon.path);
		} catch( err ) {
			this.error(err);
		}
		await this.homey.settings.unset(`${SETTING_PREFIX}${id}`);
		
	}
	
	getExtByType(type) {
	  const typeSimple = TYPES_MAP[type];
	  if(!typeSimple)
  		throw new Error('unsupported_type');
  		
    return `.${typeSimple}`;		
	}


	//#region Old Trigger
	async updateTracking(refresh, trigger) {
		var hm = this;
		if (hm.Tracking.homeyAPI === true) return;
		if (!hm.Tracking.homeyAPI || refresh) {
			hm.Tracking.homeyAPI = true;
			hm.Tracking.homeyAPI = await hm.refreshHomeyAPI('tracker');
		}
		//var devices = null;
		_.each(hm.Tracking.devices, async device => {
			if (!device.device) device.device = await hm.Tracking.homeyAPI.devices.getDevice({ id: device.id });
			_.each(device.capabilities, capability => {
				if (!capability.listener) {
					capability.listener = device.device.makeCapabilityInstance(capability.id, async function (value) {
						//if(trigger==hm.Triggers.triggercapabilitychanged)  // Only ever this one
						trigger.Card.trigger({ "value": value.toString ? value.toString() : value }, { device: { id: device.id }, capability: { id: capability.id } }, function () { });
					});
				}
			});
		});

	}
	refreshTracking(trigger) {
		updateTracking.call(this, true, trigger);
	}


	//#endregion



	async updateTracking2(refresh, trigger) {
		var hm = this;
		if (hm.Tracking2.homeyAPI === true) return;
		if (!hm.Tracking2.homeyAPI || refresh) {
			hm.Tracking2.homeyAPI = true;
			hm.Tracking2.homeyAPI = await hm.refreshHomeyAPI('tracker2');
		}
		//var devices = null;
		_.each(hm.Tracking2.devices, async device => {
			if (!device.device) device.device = await hm.Tracking2.homeyAPI.devices.getDevice({ id: device.id });
			_.each(device.capabilities, capability => {
				if (!capability.listener) {
					var targetInsight = _.find(device.device.insights, x => { return x.id == capability.id; });
					capability.listener = device.device.makeCapabilityInstance(capability.id, async function (value) {
						var tokens = { text1: '', number1: 0, boolean1: false, user: '', client: '' };
						if (typeof (value) == typeof (tokens.text1)) tokens.text1 = value;
						else if (typeof (value) == typeof (tokens.number1)) tokens.number1 = value;
						else if (typeof (value) == typeof (tokens.boolean1)) tokens.boolean1 = value;

						if (targetInsight) {
							var insights, lastOne = null;
							try {
								insights = await hm.Tracking2.homeyAPI.insights.getLogEntries({ uri: targetInsight.uri, id: targetInsight.id, resolution: 'lastHour' });
							} catch (error) {
								insights = await hm.Tracking2.homeyAPI.insights.getLogEntries({ uri: targetInsight.uri, id: targetInsight.id });
							}
							if (insights && (lastOne = _.last(insights.values))) {
								if (lastOne.originUserName) tokens.user = lastOne.originUserName;
								if (lastOne.originName) tokens.client = lastOne.originName;
								else if (lastOne.originClientName) tokens.client = lastOne.originClientName;
							}
							//if(lastOne) tokens
						}


						trigger.Card.trigger(tokens, { device: { id: device.id }, capability: { id: capability.id } }, function () { });

					});
				}
			});
		});
	}
	refreshTracking2(trigger) {
		this.updateTracking2.call(this, true, trigger);
	}

	async getDeviceclasss(action, query, args) {
		var all = await this.getDeviceclasssAndCapabilities({action:action, queryDeviceclass:query});
		all = _.sortBy(_.filter(all, dt => Object.keys(dt.capabilities).length), 'name');
		return all.length == 0 ? [] : _.map(all, x => { return { id: x.name, name: x.name }; });// all;//_.map(all, x=> x.id.split('.')[0]);
	}
	async getDeviceclassBrands(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({action:action, deviceclass: args.deviceclass.id});
		all = _.filter(all, dt => Object.keys(dt.capabilities).length);
		all = _.flatMap(all[0].capabilities, x => { return _.filter(x.brands); });
		all = _.uniqBy(all, 'id');
		if(query && query.length>0) all = _.filter(all, cls => cls.name.toLowerCase().indexOf(query.toLowerCase())>-1);
		return all.length == 0 ? [] : _.map(_.sortBy(all, "name"), x => { return { id: x.id, name: x.name }; });
	}
	async getDeviceclassDeviceTypes(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({action:action,deviceclass: args.deviceclass.id});
		all = _.filter(all, dt => Object.keys(dt.capabilities).length);
		all = _.flatMap(all[0].capabilities, x => { return _.filter(x.brands); });
		if (args.brand && args.brand.id) all = _.filter(all, x => x.id === args.brand.id);
		all = _.flatMap(all, x => { return _.map(x.devicetypes, dt => { var d=_.find(this.drivers, _d=>_d.id==dt.id && _d.uri==x.id); return {id:dt.id, name:d?d.name:dt.name, brandUri:x.id, brandName:x.name}; }); });
		all = _.uniqBy(all, x=>x.brandUri + ':' + x.id);
		if(query && query.length>0) all = _.filter(all, dt => dt.name.toLowerCase().indexOf(query.toLowerCase())>-1);
		return all.length == 0 ? [] : _.map(_.sortBy(all, "name"), x => { return { id: x.id, name: x.name, description: x.brandName, brandUri:x.brandUri }; });
	}
	async getDeviceclassCapabilities(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({action:action,queryCapability:query, deviceclass:args.deviceclass.id});
		all = _.filter(all, dt => _.countBy(dt.capabilities,1));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));
		all = all[0].capabilities;
		if(args.brand && args.brand.id) all = _.filter(all, cap => _.find(cap.brands,(b)=>b.id===args.brand.id));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));
		if(args.devicetype && args.devicetype.id) all = _.filter(all, cap => _.find(cap.brands,(b)=>_.find(b.devicetypes,(dt)=>dt.id===args.devicetype.id)));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));

		return all.length == 0 ? [] : _.map(_.sortBy(all, "id"), x => { return { id: x.id, name: x.id }; });
	}

	async getDeviceclasssAndCapabilities({action, queryDeviceclass, queryCapability, deviceclass}={}) {
		let api = await this.refreshHomeyAPI();
		//var devices = await api.devices.getDevices({ $skipCache: true });
		var devices = this.devices;
		var classes = {};
		var actionType = _.last(action.split('_'));

		_(devices).forEach(d => {
			if ((!queryDeviceclass || queryDeviceclass == '' || d.class.indexOf(queryDeviceclass.toLowerCase()) > -1) && (!deviceclass || d.class == deviceclass) && Object.keys(classes).indexOf(d.class) == -1 && !d.virtualClass) classes[d.class] = { name: d.class, capabilities: {} };
			if (d.virtualClass && (!queryDeviceclass || queryDeviceclass == '' || d.virtualClass.indexOf(queryDeviceclass.toLowerCase()) > -1) && (!deviceclass || d.virtualClass == deviceclass) && Object.keys(classes).indexOf(d.virtualClass) == -1) classes[d.virtualClass] = { name: d.virtualClass, capabilities: {} };
		});
		_(classes).forEach((cls, key) => {
			var devs = _.filter(devices, d => d.class == key || d.virtualClass == key);
			_(devs).forEach(d => {
				_(d.capabilities).forEach(c => {
					if (
						//cls.capabilities.indexOf(c) == -1 &&
						(!queryCapability || queryCapability == '' || c.toLowerCase().indexOf(queryCapability.toLowerCase()) > -1) && d.capabilitiesObj &&
						d.capabilitiesObj[c] && d.capabilitiesObj[c].setable) {
						switch (actionType) {
							case "percentage": if (d.capabilitiesObj[c].type == 'number' && d.capabilitiesObj[c].min == 0 && d.capabilitiesObj[c].max == 1 && d.capabilitiesObj[c].decimals == 2) this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);
								break;
							case "number": if (d.capabilitiesObj[c].type == 'number') this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);
								break;
							case "text":
								if (d.capabilitiesObj[c].type == 'string' || d.capabilitiesObj[c].type == 'enum') this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);

								break;
							case "boolean":
								if (d.capabilitiesObj[c].type == 'boolean') this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);
								break;
							case "json":
								this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);
								break;
							default:
								if (d.capabilitiesObj[c].type == 'string' || d.capabilitiesObj[c].type == 'enum');
								else if (d.capabilitiesObj[c].type == 'boolean');
								else if (d.capabilitiesObj[c].type == 'number' && d.capabilitiesObj[c].min == 0 && d.capabilitiesObj[c].max == 1 && d.capabilitiesObj[c].decimals == 2);
								else if (d.capabilitiesObj[c].type == 'number');
								else this.addDeviceToCapabilities(d, c, cls);//cls.capabilities.push(c);
								break;
						}
					}
				});
			});
		});
		return classes;
	}

	addDeviceToCapabilities(device, capability, cls) {
		let driverUri = device.driverUri;
		let driverUriLast = _.last(device.driverUri.split(':'));
		if (!cls.capabilities[capability]) cls.capabilities[capability] = { id: capability };
		if (!cls.capabilities[capability].brands) cls.capabilities[capability].brands = {};
		if (!cls.capabilities[capability].brands[driverUri]) cls.capabilities[capability].brands[driverUri] = { id: driverUri, name: this.apps[driverUriLast] ? this.apps[driverUriLast].name : driverUri, devicetypes: {} };
		if (!cls.capabilities[capability].brands[driverUri].devicetypes[device.driverId]) cls.capabilities[capability].brands[driverUri].devicetypes[device.driverId] = { id: device.driverId };

	}

	autocompleteDevice({ api, app } = {}) {
		return ((query, args, a, b, c,) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			var defer = new Defer(10000);

			var devices = this.devices;
			var list = _.filter(devices, device => _.every(queries, q => device.name.toLowerCase().indexOf(q) > -1));
			if(app) list = _.filter(list, device => device.driverUri==app);
			list = _.orderBy(list, 'name');
			var array = _.map(list, device => { return { id: device.id, name: device.name } });
			defer.resolve(array);

			return defer.promise;
		}).bind(this);
	}
	autocompleteCapability({ getable, setable, api, insights } = {}) {
		return ((query, args) => {
			var defer = new Defer();
			this.refreshHomeyAPI().then((async api => {
				if (!args || !args.device || !args.device.id) return defer.resolve([]);
				var device = await api.devices.getDevice({ id: args.device.id });
				if (!device) return defer.resolve([]);
				var list = _.map(device.capabilitiesObj, (capability, key) => { return { id: key, name: key, getable: capability.getable, setable: capability.setable }; });
				if (getable === true || getable === false) list = _.filter(list, cap => cap.getable == getable);
				if (setable === true || setable === false) list = _.filter(list, cap => cap.setable == setable);
				if (insights === true || insights === false) list = _.filter(list, cap => { return (!!_.find(device.insights, insight => { return insight.id == cap.id; })) === insights; });
				list = _.filter(list, cap => cap.name.toLowerCase().indexOf(query) > -1);
				defer.resolve(list);
			}).bind(this));
			return defer.promise;
		}).bind(this);
	}
	autocompleteApp({ api } = {}) {
		return ((query, args) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			var defer = new Defer(10000);

			var apps = this.apps;
			var list = _.filter(apps, app => _.every(queries, q => app.name.toLowerCase().indexOf(q) > -1));
			list = _.orderBy(list, 'name');
			var array = _.map(list, app => { return { id: app.id, name: app.name }; });
			defer.resolve(array);

			return defer.promise;
		}).bind(this);
	}

	async refreshHomeyAPI(id) {
		if (id === undefined && this.homeyAPI) return this.homeyAPI;
		if (!id) {
			this.log('refreshHomeyAPI', id);

			// if(id!==null && this.homeyAPI) return this.homeyAPI;
			// if (true || !id) {
			this.homeyAPI = HomeyAPI.forCurrentHomey(this.homey); // Refresh
			this.homeyAPI.then(x => this.homeyAPI = x);
			await this.homeyAPI;

			//this.homeyAPI.devices.on(['device.create', 'device.delete', 'device.update'], x => { this.refreshDevices(x); });
			//this.homeyAPI.zones.on(['zone.create', 'zone.delete', 'zone.update'], x => { this.refreshZones(x); });
			//this.homeyAPI.apps.on(['app.create', 'app.delete', 'app.update'], x => { this.refreshApps(x); });			
			this.homeyAPI.devices.on('device.create', x => this.refreshDevices(x, 'create'));
			this.homeyAPI.devices.on('device.delete', x => this.refreshDevices(x, 'delete'));
			this.homeyAPI.devices.on('device.update', x => this.refreshDevices(x, 'update'));
			this.homeyAPI.zones.on('zone.create', x => this.refreshZones(x, 'create'));
			this.homeyAPI.zones.on('zone.delete', x => this.refreshZones(x, 'delete'));
			this.homeyAPI.zones.on('zone.update', x => this.refreshZones(x, 'update'));
			this.homeyAPI.apps.on('app.create', x => this.refreshApps(x, 'create'));
			this.homeyAPI.apps.on('app.delete', x => this.refreshApps(x, 'delete'));
			this.homeyAPI.apps.on('app.update', x => this.refreshApps(x, 'update'));
			this.homeyAPI.drivers.on('driver.create', x => this.refreshDrivers(x, 'create'));
			this.homeyAPI.drivers.on('driver.delete', x => this.refreshDrivers(x, 'delete'));
			this.homeyAPI.drivers.on('driver.update', x => this.refreshDrivers(x, 'update'));
			
			await this.refreshDevices();
			await this.refreshDrivers();
			await this.refreshZones();
			await this.refreshApps();
			return this.homeyAPI;
		}
		if (!this.apis) this.apis = {};
		if (!this.apis[id]) {
			this.log('refreshHomeyAPI id:', id);
			this.apis[id] = await HomeyAPI.forCurrentHomey(this.homey);
		}
		return this.apis[id];
	}
	async clearHomeyAPI(id) {
		if (id && this.apis) delete this.apis[id];
	}
	async refreshDevices(device, type) {
		this.log('refreshDevices');
		//return this.devices = await this.homeyAPI.devices.getDevices({ $skipCache: true });
		if(!this.devices || !type) this.devices = await this.homeyAPI.devices.getDevices({ $skipCache: true });
		switch (type) {
			case 'create':
			case 'update':
				this.devices[device.id] = device;				
				break;
			case 'delete':
				delete this.devices[device.id];
				break;
		}
	}
	async refreshDrivers(driver, type) {
		this.log('refreshDrivers');
		//this.drivers = await this.homeyAPI.drivers.getDrivers({ $skipCache: true });
		if(!this.drivers || !type) this.drivers = await this.homeyAPI.drivers.getDrivers({ $skipCache: true });
		switch (type) {
			case 'create':
			case 'update':
				this.drivers[driver.id] = driver;
				break;
			case 'delete':
				delete this.drivers[driver.id];
				break;
		}
	}
	async refreshZones(zone, type) {
		//this.zones = await this.homeyAPI.zones.getZones({ $skipCache: true });
		if(!this.zones || !type) this.zones = await this.homeyAPI.zones.getZones({ $skipCache: true });
		switch (type) {
			case 'create':
			case 'update':
				this.zones[zone.id] = zone;				
				break;
			case 'delete':
				delete this.zones[zone.id];
				break;
		}
	}
	async refreshApps(app) {
		this.log('refreshApps', app);
		if (this.apps == 'waiting') return;
		var firstrun = !this.apps;
		this.apps = 'waiting';
		this.apps = await this.homeyAPI.apps.getApps({ $skipCache: true });

		//if(firstrun) 
		await this.refreshAppStarted(firstrun);
	}

	async refreshAppStarted(firstRun) {
		this.log('refreshAppStarted', firstRun);
		if (!this.WatchersRunner) this.WatchersRunner = setInterval(() => {
			_.each(this.Watchers, watcher => {
				if (watcher.oldState != watcher.app.state) {
					watcher.oldState = watcher.app.state;
					if (watcher.app.state === 'running') this.Triggers.triggerappstarted.Card.trigger({ appId: watcher.app.id, appName: watcher.app.name }, { app: { id: watcher.app.id } });
				}
			});
		}, 3000);
		var args = await this.Triggers.triggerappstarted.Card.getArgumentValues();
		this.Triggers.triggerappstarted.List = args;
		var apps = _.map(_.uniqBy(args, arg => { return arg.app.id; }), arg => { return arg.app; });
		_.each(apps, app => this.watchAppState(app.id));
		_.each(this.Watchers, watcher => {
			if (!_.find(apps, app => app.id == watcher.app.id)) delete this.Watchers[watcher.app.id];
		});

		if (firstRun) this.Triggers.triggerappstarted.Card.trigger({ appId: this.manifest.id, appName: this.manifest.name }, { app: { id: this.manifest.id } });
	}

	async watchAppState(appId) {
		try {			
			if (!this.apps || appId === this.manifest.id || !this.apps[appId]) return;
			const app = this.apps[appId];
			if (this.Watchers[appId]) {
				this.Watchers[appId].app = app;
			} else {
				if (!this.Watchers[appId]) this.Watchers[appId] = { oldState: app.state, app: app };
			}
			this.watchAppStateUpdate(app);
		} catch (error) {
			
		}
	}
	async watchAppStateUpdate(app) {
		app.on(['update', 'delete'], (_app) => {
			var a = _app;
		});
	}



}

module.exports = DeviceSetter;