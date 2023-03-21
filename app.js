'use strict';
const crypto = require("crypto");

const Homey = require('homey');
//const { HomeyAPI } = require('homey-api');
//const { HomeyAPIApp } = require('homey-api');
const { HomeyAPI } = require('athom-api');
const _ = require('lodash-core');

const { Defer } = require('./lib/proto');

const { join } = require('path');
const { readFile, writeFile, unlink, rename, exists, mkdir, copyFile, readdir, stat } = require('fs');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const fs = require('fs');

const sandbox = require('./lib/sandbox');
const FindObject = require('./lib/TheFindObjectsinFlowsScript');

const { BL } = require('betterlogiclibrary');
const { CG } = require('chronograph-npm');

const APP_ID_BLL = 'net.i-dev.betterlogic';
const APP_ID_CG = 'nl.fellownet.chronograph';
const DC_DEVICES = 'dc:devices';

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
	static get Current() { return this._current; }
	static set Current(v) { this._current = v; }

	Triggers = {
		triggercapabilitychanged: { List: [], Card: null },
		triggercapabilitychanged2: { List: [], Card: null },
		triggerappstarted: { List: [], Card: null }
	};
	Tracking = {
		/** @type {HomeyAPI} homeyAPI; */
		homeyAPI: null,
		//homeyAPIStatic: null,
		devices: {}
	}
	Tracking2 = {
		/** @type {HomeyAPI} homeyAPI; */
		homeyAPI: null,
		//homeyAPIStatic: null,
		devices: {}
	}



	async onInit() {
		DeviceSetter.Current = this;
		this.DEFAULT_ICONS_PATH = '/userdata/defaulticons/';
		//this.VirtualDevices = {};

		//return null;

		// if (process.env.DEBUG === '1' && this.homey.platform=='local' && this.homey.platformVersion==1) require('inspector').open(9219, '0.0.0.0', true);
		if (process.env.DEBUG === '1' || false) {
			try {
				require('inspector').waitForDebugger();
			}
			catch (error) {
				require('inspector').open(9219, '0.0.0.0', true);
			}
		}


		//this.homey.settings.unset('reflectAppsSettings');

		await this.resetReflectAppsSettings();

		this.appPath = this.homey.platform == 'local' && this.homey.platformVersion == 1 ? '/' : '/app/';


		this.localURL = await this.homey.api.getLocalUrl();
		this.sessionToken = await this.homey.api.getOwnerApiToken();


		this.log('DeviceSetter is running...');
		if (!await this.homey.settings.get('notification_bll_chronograph_update')) {
			this.homey.notifications.createNotification({ excerpt: "The next update of DC will optionally include the Better Logic Library and Chronograph, to reflect it's values in AVDs (without flows).\nBecause of this, auto-update will not update the DC app.\nYou need to manually update the DC app once the new version is available, because it needs permissions to BLL and Chronograph." });
			this.homey.settings.set('notification_bll_chronograph_update', true);
		}

		// if(!await this.homey.settings.get('notification_petition_zerodash')) {
		// 	this.homey.notifications.createNotification({excerpt : "For everyone who wants a Text Status Indicator (as Device Tile) without a zero or dash in front of it, please go to the Device Capability Homey Forum Topic, click on the petition link at the top or bottom of the topic and hit that Like!\n\n The target is 61 likes, we are almost there!\n Your Like counts!" });  
		// 	this.homey.settings.set('notification_petition_zerodash', true);
		// }

		// this.refreshHomeyAPI().then(async api => {
		// 	this.Tracking.homeyAPIStatic = api;
		// });

		const capabilityZoneActions = ['set_capability_zone_text', 'set_capability_zone_number', 'set_capability_zone_percentage', 'set_capability_zone_boolean', 'set_capability_zone_2_boolean', 'set_capability_zone_json'];//, 'set_capability_zone_anders'];
		_.forEach(capabilityZoneActions, (action => {
			var set_capability_zone = this.homey.flow.getActionCard(action);
			set_capability_zone
				.on('update', (() => {
					this.clearHomeyAPI(action);
				}).bind(this))
				.registerRunListener((async (args, state) => {
					try {
						if (!args || (!args.zone || !args.zone.id) && (!args.zonebytag)) return Promise.reject(new Error('Zone must be zet.'));
						let zoneId = args.zone && args.zone.id ? args.zone.id : args.zonebytag;
						var defer = new Defer();
						var devices = this.devices;
						var zones = this.zones;

						var cls = args.deviceclass ? args.deviceclass.id : args.capability.id.split('.')[0];
						var capability = args.deviceclass ? args.capability.id : args.capability.id.substr(args.capability.id.indexOf('.') + 1);
						var devicesToSet = [];
						setZone(zoneId);
						var val = args.value;
						if (action.endsWith('_boolean')) val = val === 'true' || val === true;
						if (action.endsWith('_json')) val = JSON.parse(val);// === 'true' || val ===true;
						var promises = [];
						var values = null;//capability.values;
						for (let i = 0; i < devicesToSet.length; i++) {
							let d = devicesToSet[i];
							if (d && d.capabilitiesObj && d.capabilitiesObj && d.capabilitiesObj[capability] && !d.setCapabilityValue) {
								this.devices[d.id] = await this.homeyAPI.devices.getDevice({ id: d.id, $skipCache: true });
								d = this.devices[d.id];
							}
							if (d && d.capabilitiesObj && d.capabilitiesObj && d.capabilitiesObj[capability] && d.setCapabilityValue) {
								values = d.capabilitiesObj[capability].values;
								promises.push(d.setCapabilityValue(capability, val));
								//promises.push(d.setCapabilityValue({capabilityId:capability, value:val}));
							}
						}
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
								//d &&
								d.zone == zoneId &&
								(!args.brand || !args.brand.id || d.driverUri === args.brand.id) &&
								(!args.devicetype || !args.devicetype.id || (d.driverUri === args.devicetype.brandUri && d.driverId === args.devicetype.id)) &&
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
					}).catch(err => {
						this.error(action + '.deviceclass error:');
						this.error(err);
						defer.reject(err);
					});
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
			set_capability_zone.getArgument('zone').registerAutocompleteListener(async (query, args) => {
				return await this.getZones();
			});
		}).bind(this));


		//#region Old Trigger
		const trigger_capability_changedTrigger = this.homey.flow.getTriggerCard('trigger_capability_changed');
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
							if (!deviceToSet) return;
							if (!deviceToSet.capabilities) deviceToSet.capabilities = {};
							if (!deviceToSet.capabilities[capability]) deviceToSet.capabilities[capability] = { id: capability };
						});
						this.updateTracking(false, this.Triggers.triggercapabilitychanged);
					});

				}).bind(this));
		}
		//#endregion


		const trigger_capability_changed2Trigger = this.homey.flow.getTriggerCard('trigger_capability_changed2');
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
							if (!deviceToSet) return;
							if (!deviceToSet.capabilities) deviceToSet.capabilities = {};
							if (!deviceToSet.capabilities[capability]) deviceToSet.capabilities[capability] = { id: capability };
						});
						this.updateTracking2(false, this.Triggers.triggercapabilitychanged2);
					});

				}).bind(this));
		}



		const trigger_app_startedTrigger = this.homey.flow.getTriggerCard('trigger_app_started');
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


		const condition_app_running = this.homey.flow.getConditionCard('condition_app_running');
		condition_app_running.registerRunListener(async (args, state) => {
			if (!args.app || !args.app.id || !this.apps || !this.apps[args.app.id]) return false;
			else return this.apps[args.app.id].state === 'running';
		})
			.getArgument('app').registerAutocompleteListener(this.autocompleteApp());


		const condition_change_capability_boolean = this.homey.flow.getConditionCard('condition_change_capability_boolean');
		condition_change_capability_boolean
			.registerRunListener((args, state) => {
				console.log('condition_change_capability_boolean.registerRunListener');
				var defer = new Defer();
				if (!(args.device && args.device.id && args.capability && args.capability.id)) {
					defer.reject('Reject');
					return defer.promise;
				}
				this.refreshHomeyAPI().then((async api => {
					var device = await api.devices.getDevice({ id: args.device.id, $skipCache: true });
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


		const action_capability_logs = ['action_capability_log'];//, 'set_capability_zone_anders'];
		_.forEach(action_capability_logs, (action => {
			const set_capability_log = this.homey.flow.getActionCard(action);
			set_capability_log
				.on('update', (() => { this.clearHomeyAPI(action); }).bind(this))
				.registerRunListener((async (args, state) => {
					let tokens = { number: 0, boolean: false, user: '', client: '', changedon: '', durationtillnow: 0, changedonms: 0, device: '', capability: '' };
					try {
						if (!args || !args.device || !args.capability) return false;
						tokens.device = args.device.name;
						tokens.capability = args.capability.name;

						// var targetInsight = _.find(device.device.insights, x => { return x.id == capability.id; });

						let api = await this.refreshHomeyAPI();

						//next is for Testing
						// var user = await api.users.getUserMe();
						// var users = await api.users.getUsers();
						// var sessionMe = await api.sessions.getSessionMe();
						// var sessions = await api.sessions.getSessions();
						// var homey = this.homey;
						//End test

						let targetInsight;

						let device = this.devices[args.device.id];
						if (args.capability.uri) {
							targetInsight = { uri: args.capability.uri, id: args.capability.id };
						} else {
							if (device) targetInsight = _.find(device.insights, x => { return (x.id == args.capability.id || (x.id == 'homey:device:' + args.capability.deviceId + ':' + args.capability.id)); });
						}

						if (targetInsight) {
							let insights, lastOne = null;
							// if(args.numberof==0) {
							// 	insights = await api.insights.getLogEntries({ uri: targetInsight.uri, id: targetInsight.id });
							// } else {
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
							//}
							var now = new Date();
							now.setMinutes(now.getMinutes() - args.numberof);
							insights.values = _.filter(insights.values, i => { return new Date(i.t) <= now && (i.v !== null && i.v !== undefined); });
							if (insights && (lastOne = _.last(insights.values))) {
								if (lastOne.originUserName) tokens.user = lastOne.originUserName;
								if (lastOne.originName) tokens.client = lastOne.originName;
								else if (lastOne.originClientName) tokens.client = lastOne.originClientName;
								let v = lastOne.v;
								if (args.numberof == 0 && device) {
									this.devices[device.id] = await this.homeyAPI.devices.getDevice({ id: device.id, $skipCache: true });
									device = this.devices[args.device.id];
									v = device.capabilitiesObj[args.capability.id].value;
								}
								// if (typeof (lastOne.v) == typeof (tokens.text)) tokens.text = lastOne.v; // / There are no text insights (yet).
								// else 
								if (typeof (lastOne.v) == typeof (tokens.number)) {
									tokens.number = lastOne.v;
									if (Number.isInteger(targetInsight.decimals)) tokens.number = parseFloat(targetInsight.decimals ? lastOne.v.toFixed(targetInsight.decimals) : lastOne.v);
								}
								else if (typeof (lastOne.v) == typeof (tokens.boolean)) tokens.boolean = lastOne.v;

								if (insights.step && args.numberof == 0) {

									let endD = device ? this.getLastUpdated(device.capabilitiesObj[args.capability.id]).toISOString() : new Date().toISOString();
									let end = new Date(endD);
									tokens.changedon = endD;
									tokens.changedonms = end.getTime();
									tokens.durationtillnow = new Date().getTime() - end.getTime();

								}
								else if (insights.end && args.numberof == 0) {

									let endD = device ? this.getLastUpdated(device.capabilitiesObj[args.capability.id]).toISOString() : new Date().toISOString();
									let end = new Date(endD);
									tokens.changedon = endD;
									tokens.changedonms = end.getTime();
									tokens.durationtillnow = new Date().getTime() - end.getTime();

								}
								else if (insights.end) {
									let end = new Date(insights.start);
									tokens.changedon = insights.start;
									tokens.changedonms = end.getTime();
									tokens.durationtillnow = new Date().getTime() - end.getTime();
								}
							}
						}
					} catch (error) {
						this.log('set_capability-error:');
						this.log(error);
					}

					if (!tokens.user) tokens.user = '';
					if (!tokens.client) tokens.client = '';
					if (!tokens.client) tokens.client = '';
					return tokens;

				}).bind(this));


			set_capability_log.getArgument('device')
				.registerAutocompleteListener(this.autocompleteDevice({ api: 'set_capability_log', insights: true }));
			set_capability_log.getArgument('capability')
				.registerAutocompleteListener(this.autocompleteCapability({ getable: true, api: 'set_capability_log', insights: true }));
		}).bind(this));


		const virtualdevice_set_available = this.homey.flow.getActionCard('virtualdevice_set_available').registerRunListener(async (args, state) => {
			try {
				var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
				var device = _.find(devices, dv => dv.__id == args.device.id);
				device.setAvailable();
				//args.device.setAvailable();
			} catch (error) {
				this.log('action_virtualdevice_set_name:');
				this.error(error);
			}
		});
		virtualdevice_set_available.getArgument('device').registerAutocompleteListener(this.autocompleteDevice({ app: 'homey:app:' + this.id }));

		const virtualdevice_set_unavailable = this.homey.flow.getActionCard('virtualdevice_set_unavailable').registerRunListener(async (args, state) => {
			try {
				var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
				var device = _.find(devices, dv => dv.__id == args.device.id);
				device.setUnavailable(args.text);
			} catch (error) {
				this.log('action_virtualdevice_set_name:');
				this.error(error);
			}
		});
		virtualdevice_set_unavailable.getArgument('device').registerAutocompleteListener(this.autocompleteDevice({ app: 'homey:app:' + this.id }));


		this.homey.flow.getActionCard('execute_expression').registerRunListener(async (args, state) => {
			try {
				if (args.expression !== undefined && args.expression !== 'undefined') {
					let value = this.runSandBox(args.expression);
					let tokens = { text: '', number: 0, boolean: false };
					switch (typeof (value)) {
						case "string": tokens.text = value; break;
						case "number": tokens.number = value; break;
						case "boolean": tokens.boolean = value; break;
						default:
							break;
					}
					return tokens;
				}
			} catch (error) {
				this.log('execute_expression:');
				this.error(error);
				return new Error(error);
			}
		});

		const action_app_writeindiagnostic = this.homey.flow.getActionCard('action_app_writeindiagnostic').registerRunListener(async (args, state) => {
			try {
				if (args.avd && args.avd.id) {
					var avds = this.homey.drivers.getDriver('virtualdevice').getDevices();
					var avd = _.find(avds, dv => dv.__id == args.avd.id);
					let dev = {
						id: avd.__id,
						name: avd.getName(),
						available: avd.getAvailable(),
						capabilities: avd.getCapabilities(),
						class: avd.getClass(),
						data: avd.getData(),
						energy: avd.getEnergy(),
						settings: avd.getSettings(),
						store: avd.getStore(),
						state: avd.getState()
					};
					//let b = dev;
					this.log("DIAGNOSTIC App Device: ", JSON.stringify(dev));
					this.log("DIAGNOSTIC Web Device: ", JSON.stringify(this.devices[dev.id]));
				}
				return true;
			} catch (error) {
				this.log('action_virtualdevice_set_name:');
				this.error(error);
			}
		});
		action_app_writeindiagnostic.getArgument('avd').registerAutocompleteListener(this.autocompleteDevice({ app: 'homey:app:' + this.id }));


		const action_app_get_flows_containing = this.homey.flow.getActionCard('action_app_get_flows_containing').registerRunListener(async (args, state) => {
			try {
				let filter = args.filter;
				if (filter && ((filter.startsWith('{') && filter.endsWith('}')) || (filter.startsWith('[') && filter.endsWith(']')))) filter = JSON.parse(filter);
				var api = await this.refreshHomeyAPI();
				let flows = await FindObject(args.objecttype, filter, api);
				if (args.flat === true) flows = _.map(flows, x => { x.flows = _.join(_.map(x.flows, 'name'), ','); return x; });
				return { flows: JSON.stringify(flows) };
			} catch (error) {
				this.log('action_app_get_flows_containing:');
				this.error(error);
			}
		});





		this.trigger_app_zone_activated = this.homey.flow.getTriggerCard('trigger_app_zone_activated');
		this.trigger_app_zone_activated.registerRunListener(async (args, state) => {
			try {
				return ((args.active === 'active' && state.active === true) || (args.active === 'inactive' && state.active === false) || args.active === 'both' || args.active === 'undefined' || !args.active);
			} catch (error) {
				this.log('trigger_app_zone_activated:'); this.error(error); return new Error(error);
			}
		});


		// {
		// 	"highlight": true,
		// 	"deprecated":true,
		// 	"id": "trigger_app_zone_device_changed",
		// 	"title": {
		// 	  "en": "Device in Zone changed",
		// 	  "nl1": "..",
		// 	  "de1": ".."
		// 	},
		// 	"titleFormatted": {
		// 	  "en": "Device in [[zone]] changed ",
		// 	  "nl1": "Ruimte werd [[zone]]",
		// 	  "de1": "Zone wurde [[zone]]"
		// 	},
		// 	"args": [          
		// 	  {
		// 		"type": "autocomplete",
		// 		"required": false,
		// 		"name": "zone",
		// 		"title": {
		// 		  "en": "Zone",
		// 		  "nl": "Ruimte",
		// 		  "de": "Zone"
		// 		},
		// 		"placeholder": {
		// 		  "en": "Zone",
		// 		  "nl": "Ruimte",
		// 		  "de": "Zone"
		// 		}
		// 	  }
		// 	],
		// 	"tokens": [
		// 	  {
		// 		"name": "zoneId",
		// 		"type": "string",
		// 		"title": {
		// 		  "en": "Zone ID",
		// 		  "nl": "Ruimte ID",
		// 		  "de": "Zonen-ID"
		// 		}
		// 	  },
		// 	  {
		// 		"name": "zoneName",
		// 		"type": "string",
		// 		"title": {
		// 		  "en": "Zone Name",
		// 		  "nl": "Ruimte naam",
		// 		  "de": "Zonen-Name"
		// 		}
		// 	  },
		// 	  {
		// 		"name": "deviceName",
		// 		"type": "string",
		// 		"title": {
		// 		  "en": "Device",
		// 		  "nl": "Apparaat",
		// 		  "de": "Gerät"
		// 		}
		// 	  }
		// 	]
		//   },

		// this.trigger_app_zone_device_changed = this.homey.flow.getTriggerCard('trigger_app_zone_device_changed');
		// this.trigger_app_zone_device_changed.registerRunListener(async (args, state) => {
		// 	try {
		// 		return (args.zone.id === state.zone.id);
		// 	} catch (error) {
		// 		this.log('trigger_app_zone_device_changed:'); this.error(error); return new Error(error);
		// 	}
		// });
		// this.trigger_app_zone_device_changed.getArgument('zone').registerAutocompleteListener(async (query, args) => {
		// 	return await this.getZones();
		// });
		// const trigger_app_zone_device_changedUpdate = async ()=> {
		// 	// if(device && this.trigger_app_zone_device_changedArguments) {
		// 	// 	let find = this.trigger_app_zone_device_changedArguments.find(x=> x.zone.id===device.zone);
		// 	// 	let zone;
		// 	// 	if(find && (zone=this.zones[device.zone])) this.trigger_app_zone_device_changed.trigger({zoneId:device.zone, zoneName:zone.name, deviceName:device.name}, {zone:{id:device.zone}})
		// 	// }
		// 	const newArguments = await this.trigger_app_zone_device_changed.getArgumentValues();
		// 	if(this.trigger_app_zone_device_changedArguments && this.trigger_app_zone_device_changedArguments.length) {
		// 		const missing = this.trigger_app_zone_device_changedArguments.filter(x=>x.zone.id);
		// 	}
		// 	this.trigger_app_zone_device_changedArguments = newArguments;//.map(x=>{return x;});
		// };
		// this.trigger_app_zone_device_changed.on('update', ()=> {  trigger_app_zone_device_changedUpdate(); })
		// await trigger_app_zone_device_changedUpdate();
		// if(this.trigger_app_zone_device_changedArguments && this.trigger_app_zone_device_changedArguments.length) await this.refreshHomeyAPI();


		this.trigger_app_device_available = this.homey.flow.getTriggerCard('trigger_app_device_available');
		this.trigger_app_device_available.registerRunListener(async (args, state) => {
			try {
				return ((args.available === 'available' && state.available === true) || (args.available === 'unavailable' && state.available === false) || args.available === 'both' || args.available === 'undefined' || !args.available) &&
					(!args.brand || args.brand === 'undefined' || args.brand.id === "homey:app:" + state.brand) &&
					(!args.devicetype || args.devicetype === 'undefined' || args.devicetype.id === state.devicetype);
			} catch (error) {
				this.log('trigger_app_device_available:'); this.error(error); return new Error(error);
			}
		});
		this.trigger_app_device_available.getArgument('brand').registerAutocompleteListener(this.autocompleteApp());
		this.trigger_app_device_available.getArgument('devicetype').registerAutocompleteListener(this.autocompleteDeviceType());

		this.condition_app_devices_available = this.homey.flow.getConditionCard('condition_app_devices_available');
		this.condition_app_devices_available.registerRunListener(async (args, state) => {
			try {
				let devices = _.toArray(this.devices);
				if (args.brand && args.brand.id) devices = _.filter(devices, d => d.driverUri === 'homey:app:' + args.brand.id);
				if (args.devicetype && args.devicetype.id) devices = _.filter(devices, d => d.driverId === args.devicetype.id);
				let t = _.every(devices, d => d.available === args.inverted != true);
				let tt = _.filter(devices, d => d.available === (args.inverted != true));
				return _.every(devices, d => d.available === (args.inverted != true));

			} catch (error) {
				this.log('condition_app_devices_available:'); this.error(error); return new Error(error);
			}
		});
		this.condition_app_devices_available.getArgument('brand').registerAutocompleteListener(this.autocompleteApp());
		this.condition_app_devices_available.getArgument('devicetype').registerAutocompleteListener(this.autocompleteDeviceType());


		this.homey.settings.on('set', (async function (settingName) {
			if (settingName == 'javascript_functions') {
				this.setFunctions();
			}
			else if (settingName == 'reflectAppsSettings') {
				this.resetReflectAppsSettings();
			}

		}).bind(this));

		await this.setFunctions();


	}

	async onUninit() {
		
	}

	async resetReflectAppsSettings() {
		this._reflectAppsSettings = this.homey.settings.get('reflectAppsSettings');
		let changed = false;
		if (!this._reflectAppsSettings && (changed = true)) this._reflectAppsSettings = {};
		if (!this._reflectAppsSettings['net.i-dev.betterlogic'] && (changed = true)) this._reflectAppsSettings['net.i-dev.betterlogic'] = { enabled: true }
		if (!this._reflectAppsSettings['nl.fellownet.chronograph'] && (changed = true)) this._reflectAppsSettings['nl.fellownet.chronograph'] = { enabled: true }
		if (changed) this.homey.settings.set('reflectAppsSettings', this._reflectAppsSettings);
		await this.resetReflectApps();
	}

	async resetReflectApps() {
		if (this._reflectAppsSettings && this._reflectAppsSettings['nl.fellownet.chronograph'].enabled) {
			if (!this._cg) {
				this._cg = await CG.init({ homey: this.homey });
				CG.onChronographUpdate = async ({ chronograph }) => {
					if (!chronograph || !chronograph.data || !chronograph.data.type) return;
					//this.homey.log('onChronographUpdate', chronograph);
					let type = chronograph.data.type.toLowerCase();
					if (this.Reflections && this.Reflections[APP_ID_CG] && this.Reflections[APP_ID_CG][type + '|' + chronograph.name])
						for (let i = 0; i < this.Reflections[APP_ID_CG][type + '|' + chronograph.name].length; i++) {
							const field = this.Reflections[APP_ID_CG][type + '|' + chronograph.name][i];
							if (field.lastSet && field.lastSet > chronograph.now) continue;
							field.lastSet = chronograph.now;
							await field.method(field, chronograph);

						}
				}
				this._cg.ready.then(() => {
					try {
						this.updateReflection({ appId: APP_ID_CG });
					} catch (error) {

					}
				});
			}
		} else if (CG && CG.destroy) {
			try {
				CG.destroy();
			} catch (error) {

			}
			delete this._cg;
		}


		if (this._reflectAppsSettings && this._reflectAppsSettings['net.i-dev.betterlogic'].enabled) {
			if (!this._bl) {
				this._bl = await BL.init({ homey: this.homey });
				BL.onVariableUpdate = async ({ variable, formattedDate }) => {
					if (this.Reflections && this.Reflections[APP_ID_BLL] && this.Reflections[APP_ID_BLL][variable.name])
						for (let i = 0; i < this.Reflections[APP_ID_BLL][variable.name].length; i++) {
							const field = this.Reflections[APP_ID_BLL][variable.name][i];
							if (field.lastSet && field.lastSet > variable.lastChanged) continue;
							field.lastSet = variable.lastChanged;
							await field.method(field, variable);

						}
				}
				this._bl.ready.then(() => {
					try {
						this.updateReflection({ appId: APP_ID_BLL });
					} catch (error) {

					}
				});
			}
		} else if (BL && BL.destroy) {
			try {
				BL.destroy();
			} catch (error) {

			}
			delete this._bl;
		}
	}



	async updateReflection({ device, appId } = {}) {

		if (this.Reflections && this.Reflections[DC_DEVICES] && (!appId || appId === DC_DEVICES))// && this.Reflections[APP_ID_BLL][variable.name])
		{
			//let api = await this.homey.app.refreshHomeyAPI();
			const runnedDevices = {};
			for (const deviceId in this.homey.app.Reflections[DC_DEVICES]) {
				for (const propertyId in this.homey.app.Reflections[DC_DEVICES][deviceId]) {
					const property = this.homey.app.Reflections[DC_DEVICES][deviceId][propertyId];
					for (let i = 0; i < property.fields.length; i++) {
						const field = property.fields[i];
						if (device && field.device !== device) 
							continue;
						if (runnedDevices[field.device.id] && runnedDevices[field.device.id][field.fieldId])
							continue;
						field.method(field, { value: property.value, id: propertyId });
						if (!runnedDevices[field.device.id]) runnedDevices[field.device.id] = {};
						if (!runnedDevices[field.device.id][field.fieldId]) runnedDevices[field.device.id][field.fieldId] = true;

					}
				}
			}
		}

		if (this.Reflections && this.Reflections[APP_ID_BLL] && (!appId || appId === APP_ID_BLL))// && this.Reflections[APP_ID_BLL][variable.name])
		{
			try {

				const vars = await this.getBllVariables();
				if (vars) for (const variableName in this.Reflections[APP_ID_BLL]) {
					let _var;
					if ((_var = _.find(vars, x => x.name == variableName))) for (let i = 0; i < this.Reflections[APP_ID_BLL][variableName].length; i++) {
						const field = this.Reflections[APP_ID_BLL][variableName][i];
						if (device && field.device !== device) continue;
						try {
							await field.method(field, _var);
						} catch (error) {

						}
					}
				}
			} catch (error) {

			}
		}
		if (this.Reflections && this.Reflections[APP_ID_CG] && (!appId || appId === APP_ID_CG))// && this.Reflections[APP_ID_BLL][variable.name])
		{
			try {
				const chronographs = await this.getChronographs();
				for (const chronographName in this.Reflections[APP_ID_CG]) {
					let type = chronographName.substring(0, chronographName.indexOf('|'));
					let name = chronographName.substring(chronographName.indexOf('|') + 1);
					const chronograph = _.find(chronographs, x => x.name == name && x.type == type)
					for (let i = 0; i < this.Reflections[APP_ID_CG][chronographName].length; i++) {
						const field = this.Reflections[APP_ID_CG][chronographName][i];
						if (device && field.device !== device) continue;
						try {

							await field.method(field, chronograph || { elapsed: 0, remaining: 0, running: false, removed: true });
						} catch (error) {

						}

					}
				}
			} catch (error) {

			}
		}

	}

	async getBllVariables() {
		let vars;
		if ((vars = this._bllVariables)) return vars;
		vars = BL.isReady ? await BL.getVariables() : null;
		if (vars) {
			this._bllVariables = vars;
			this.homey.setTimeout(() => { delete this._bllVariables; }, 10_000);
			return vars;
		}
	}

	async getChronographs() {
		let chronographs;
		if ((chronographs = this._Chronographs)) return chronographs;
		chronographs = CG.isReady ? await CG.getChronographs() : null;
		if (chronographs) {
			this._Chronographs = chronographs;
			this.homey.setTimeout(() => { delete this._Chronographs; }, 10_000);
			return chronographs;
		}
	}
	getGuid() {
		return [8, 4, 4, 4, 12].map(n => crypto.randomBytes(n / 2).toString("hex")).join("-");
	}

async getDevice({deviceId, full=false}) {
	let device = this.homey.app.devices[deviceId];
	if (!device || (device && device.capabilitiesObj && !device.setCapabilityValue && full)) {
		const api = await this.homey.app.refreshHomeyAPI();
		device = this.homey.app.devices[deviceId] = await api.devices.getDevice({ id: deviceId, $skipCache: true });
	}
	return device;

}





	async setFunctions() {
		this.functions = await this.homey.settings.get('javascript_functions');
		//this.log('this.functions', typeof(this.functions), this.functions);
		this.context = {
			_: _
		};
		if (this.functions && this.functions.length > 0) for (let i = 0; i < this.functions.length; i++) {
			try {
				const funcObj = this.functions[i];

				let func = funcObj.value.parseFunction();
				//func.bind(this.context);
				this.log('func', func);
				this.context[funcObj.name] = func;
			} catch (error) {
				this.log('Error creating function ' + this.functions[i].name);
				this.error(error);
			}
		}
	}


	async getZones() {
		await this.refreshHomeyAPI();
		var zones = this.zones;
		var home = _(zones).find(z => !z.parent);
		var arr = [];

		fill(home);
		return _.map(arr, zone => { return { id: zone.id, name: zone.name }; });

		function fill(obj, spaces) {
			spaces = spaces || '';
			arr.push({ id: obj.id, name: spaces + obj.name });
			let subzones = _.filter(zones, z => z.parent == obj.id);
			subzones = _.orderBy(subzones, 'name');
			_(subzones).forEach(z => fill(z, spaces + '\t'));
		}
	}


	runSandBox(code) {
		var context = this.context;
		//this.log('this.context', this.context);
		//try {
		return sandbox(code, context);
		//} catch (error) {

		//} 
	}

	getDevices() {
		if (this._getDevices) return this._getDevices;
		var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
		var ret = devices.map(vd => {
			return {
				id: vd.getData().id,
				name: vd.getName(),
				icon: vd.getData().icon,
				apiId: vd.__id
			};
		});
		this._getDevices = ret;
		return ret;
	}

	// getAdvancedFlows() {
	// 	var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
	// 	var ret = devices.map(vd => {
	// 		return {
	// 			id: vd.getData().id,
	// 			name:vd.getName(),
	// 			icon: vd.getData().icon,
	// 		};			
	// 	});
	// 	return ret;
	// }


	getCustomIcons() {
		return this.homey.drivers.getDriver('virtualdevice').getCustomIcons();
	}

	async setFromDefaultIcon({ customicon, defaulticon, deviceicon }) {
		if (deviceicon) {
			return await this.setDeviceIconFromDefault({ device: { data: { id: deviceicon.id } }, icon: defaulticon });
		}

		let filePathAssets = this.DEFAULT_ICONS_PATH;
		let file = defaulticon;// + '.svg';

		let filePath = '/userdata/customicons/';
		let iconName = customicon.file + '.svg';

		if (await this.homey.app.fileExists(filePathAssets + file)) {
			await this.homey.app.copyFile(filePathAssets + file, filePath + iconName, filePath);
		}
	}

	async setDeviceIconFromDefault({ icon, device }) {
		let filePathAssets = this.DEFAULT_ICONS_PATH;
		let file = icon;// + '.svg';

		let filePath = '/userdata/virtualdeviceicons/';
		let iconName = device.data.id + '.svg';

		if (await this.homey.app.fileExists(filePathAssets + file)) {// && !await this.homey.app.fileExists(filePath + iconName)){
			await this.homey.app.copyFile(filePathAssets + file, filePath + iconName, filePath);
		}
		return filePath + iconName;
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
		if (!icon) throw new Error('invalid_icon');
		return icon;
	}
	async writeFile(path, buf) { return await writeFileAsync(path, buf); }
	async readFile(path, ops) { return await readFileAsync(path, ops); }
	async exists(path) { return await existsAsync(path); }
	async mkdir(path, ops) { return await mkdirAsync(path, ops); }

	async createIcon({ type, name, buffer, id }) {
		if (!TYPES_MAP[type])
			throw new Error(`invalid_type:${type}`);

		const buf = new Buffer(buffer, 'base64');
		if (!Buffer.isBuffer(buf))
			throw new Error("invalid_buffer");

		id = id || randomBytes(12).toString('hex');
		const ext = this.getExtByType(type);
		const path = `/userdata/icons/${id}${ext}`;

		if (!(await existsAsync('/userdata/icons/'))) await mkdirAsync('/userdata/icons/');


		await writeFileAsync(path, buf);

		await this.homey.settings.set(`${SETTING_PREFIX}${id}`, {
			id,
			type,
			name,
			path,
		});
		return this.getIcon({ id });
	}
	async createDeviceIcon({ type, buffer, id }) {
		return await this._createIcon({ type, buffer, id, subpath: 'virtualdeviceicons' });
	}
	async createCustomIcon({ type, buffer, id }) {
		return await this._createIcon({ type, buffer, id, subpath: 'customicons' });
	}

	async fileExists(path) {
		return await existsAsync(path);
	}

	async copyFile(from, to, toPath) {
		if (await existsAsync(from)) {
			if (!(await existsAsync(toPath))) await mkdirAsync(toPath);
			await copyFile(from, to, fs.constants.COPYFILE_FICLONE, function (err) {
				if (err) console.log('error', err);//throw err;
				// console.log('source.txt was copied to destination.txt');
			});
		}
	}
	async readdir(dir) {
		return await readdirAsync(dir);
	}
	async fsstat(file) {
		return await statAsync(file);
	}
	async _createIcon({ type, buffer, id, subpath }) {
		if (!TYPES_MAP[type])
			throw new Error(`invalid_type:${type}`);

		const base64 = buffer.replace("data:image/svg+xml;base64,", '');

		const buf = new Buffer(base64, 'base64');
		if (!Buffer.isBuffer(buf))
			throw new Error("invalid_buffer");

		id = id;
		const ext = this.getExtByType(type);
		const path = `/userdata/${subpath}/${id}${ext}`;

		if (!(await existsAsync(`/userdata/${subpath}/`))) await mkdirAsync(`/userdata/${subpath}/`);
		if (await existsAsync(path)) await unlinkAsync(path);
		await writeFileAsync(path, buf);

		// var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
		// var device = devices.filter(d=>d);

		return {
			id,
			type,
			path,
		};
	}


	async updateIcon({ id, name, path }) {
		const icon = await this.getIcon({ id });

		if (typeof name === 'string')
			icon.name = name;

		if (typeof path === 'string')
			icon.path = path;

		await this.homey.settings.set(`${SETTING_PREFIX}${id}`, icon);

		return this.getIcon({ id });

	}

	async deleteIcon({ id }) {
		const icon = await this.getIcon({ id });
		try {
			await unlinkAsync(icon.path);
		} catch (err) {
			this.error(err);
		}
		await this.homey.settings.unset(`${SETTING_PREFIX}${id}`);

	}


	async deleteFile(path) {
		try {
			await unlinkAsync(path);
		} catch (err) {
			this.error(err);
		}

	}

	getExtByType(type) {
		const typeSimple = TYPES_MAP[type];
		if (!typeSimple)
			throw new Error('unsupported_type');

		return `.${typeSimple}`;
	}


	//#region Old Trigger
	async updateTracking(refresh, trigger) {
		var hm = this;
		if (hm.Tracking.homeyAPI === true) return;
		if (!hm.Tracking.homeyAPI || refresh) {
			hm.Tracking.homeyAPI = true;
			hm.Tracking.homeyAPI = await hm.refreshHomeyAPI();//'tracker');
		}
		//var devices = null;
		_.each(hm.Tracking.devices, async device => {
			if (!device.device) {
				try {
					this.devices[device.id] = await this.homeyAPI.devices.getDevice({ id: device.id, $skipCache: true });
				} catch (error) {
					return;
				}
				device.device = this.devices[device.id];
			}
			//let realDevice;
			let keys = Object.keys(device.capabilities);
			for (let i = 0; i < keys.length; i++) {
				const capability = device.capabilities[keys[i]];
				if (!capability.listener) {
					try {

						capability.listener = device.device.makeCapabilityInstance(capability.id, async function (value) {
							//if(trigger==hm.Triggers.triggercapabilitychanged)  // Only ever this one
							trigger.Card.trigger({ "value": value.toString ? value.toString() : value }, { device: { id: device.id }, capability: { id: capability.id } }, function () { });
						});
					} catch (error) {
						this.error("capability: " + capability.id + ', ' + (error.message || error));
						//this.error(error);						
					}
				}
			}
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
			hm.Tracking2.homeyAPI = await hm.refreshHomeyAPI();//'tracker2');
		}

		//var devices = null;
		for (const deviceKey in hm.Tracking2.devices) {
			if (Object.hasOwnProperty.call(hm.Tracking2.devices, deviceKey)) {
				const device = hm.Tracking2.devices[deviceKey];
				if (!device.device) {
					try {
						this.devices[device.id] = await this.homeyAPI.devices.getDevice({ id: device.id, $skipCache: true });
						device.device = this.devices[device.id];
					} catch (error) {
						this.error(error);
						this.log('continueing');
						continue;
					}
				}
				let keys = Object.keys(device.capabilities);
				for (let i = 0; i < keys.length; i++) {
					const capability = device.capabilities[keys[i]];
					if (!capability.listener) {
						try {
							capability.listener = device.device.makeCapabilityInstance(capability.id, async function (value) {
								let targetInsight = device.device && device.device.insights ? _.find(device.device.insights, x => { return x.id == capability.id; }) : null;
								var tokens = { text1: '', number1: 0, boolean1: false, user: '', client: '' };
								if (typeof (value) == typeof (tokens.text1)) tokens.text1 = value;
								else if (typeof (value) == typeof (tokens.number1)) {
									tokens.number1 = value;
									//if (Number.isInteger(targetInsight.decimals)) tokens.number = parseFloat(targetInsight.decimals ? lastOne.v.toFixed(targetInsight.decimals) : lastOne.v);
								}
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

										// if (typeof (lastOne.v) == typeof (tokens.text)) tokens.text = lastOne.v;
										// else if (typeof (lastOne.v) == typeof (tokens.number)) {
										// 	tokens.number = lastOne.v;
										// 	if (Number.isInteger(targetInsight.decimals)) tokens.number = parseFloat(lastOne.v.toFixed(targetInsight.decimals));
										// }
										// else if (typeof (lastOne.v) == typeof (tokens.boolean)) tokens.boolean = lastOne.v;
									}
									//if(lastOne) tokens
								}

								tokens.deviceName = device.name;
								tokens.deviceId = device.id;



								trigger.Card.trigger(tokens, { device: { id: device.id }, capability: { id: capability.id } }, function () { });

							});
						} catch (error) {
							this.log(error);
						}
					}
				}
			}
		}

		// console.log('Size of hm.Tracking:', this.roughSizeOfObject(hm.Tracking) );
		// console.log('Size of hm.Tracking2:', this.roughSizeOfObject(hm.Tracking2) );
		// console.log('Size of hm:', this.roughSizeOfObject(hm) );
		// //hm.Tracking2.homeyAPI = null;
		// console.log('Size of hm.Tracking after:', this.roughSizeOfObject(hm.Tracking) );
		// console.log('Size of hm.Tracking2 after:', this.roughSizeOfObject(hm.Tracking2) );
	}
	refreshTracking2(trigger) {
		this.updateTracking2.call(this, true, trigger);
	}

	roughSizeOfObject(object) {

		var objectList = [];
		var stack = [object];
		var bytes = 0;

		while (stack.length) {
			var value = stack.pop();

			if (typeof value === 'boolean') {
				bytes += 4;
			}
			else if (typeof value === 'string') {
				bytes += value.length * 2;
			}
			else if (typeof value === 'number') {
				bytes += 8;
			}
			else if
				(
				typeof value === 'object' && objectList.indexOf(value) === -1
			) {
				objectList.push(value);

				for (var i in value) {
					stack.push(value[i]);
				}
			}
		}
		return bytes;
	}

	async getDeviceclasss(action, query, args) {
		var all = await this.getDeviceclasssAndCapabilities({ action: action, queryDeviceclass: query });
		all = _.sortBy(_.filter(all, dt => dt && Object.keys(dt.capabilities).length), 'name');
		return all.length == 0 ? [] : _.map(all, x => { return { id: x.name, name: x.name }; });// all;//_.map(all, x=> x.id.split('.')[0]);
	}
	async getDeviceclassBrands(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({ action: action, deviceclass: args.deviceclass.id });
		all = _.filter(all, dt => dt && Object.keys(dt.capabilities).length);
		all = _.flatMap(all[0].capabilities, x => { return _.filter(x.brands); });
		all = _.uniqBy(all, 'id');
		if (query && query.length > 0) all = _.filter(all, cls => cls.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
		return all.length == 0 ? [] : _.map(_.sortBy(all, "name"), x => { return { id: x.id, name: x.name }; });
	}
	async getDeviceclassDeviceTypes(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({ action: action, deviceclass: args.deviceclass.id });
		all = _.filter(all, dt => dt && Object.keys(dt.capabilities).length);
		all = _.flatMap(all[0].capabilities, x => { return _.filter(x.brands); });
		if (args.brand && args.brand.id) all = _.filter(all, x => x.id === args.brand.id);
		all = _.flatMap(all, x => { return _.map(x.devicetypes, dt => { var d = _.find(this.drivers, _d => _d.id == dt.id && (_d.uri || _d.ownerUri) == x.id); return { id: dt.id, name: d ? d.name : dt.name, brandUri: x.id, brandName: x.name }; }); });
		all = _.uniqBy(all, x => x.brandUri + ':' + x.id);
		if (query && query.length > 0) all = _.filter(all, dt => dt.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
		return all.length == 0 ? [] : _.map(_.sortBy(all, "name"), x => { return { id: x.id, name: x.name, description: x.brandName, brandUri: x.brandUri }; });
	}
	async getDeviceclassCapabilities(action, query, args) {
		if (!args.deviceclass || !args.deviceclass.id) return [];
		var all = await this.getDeviceclasssAndCapabilities({ action: action, queryCapability: query, deviceclass: args.deviceclass.id });
		all = _.filter(all, dt => _.countBy(dt.capabilities, 1));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));
		all = all[0].capabilities;
		if (args.brand && args.brand.id) all = _.filter(all, cap => _.find(cap.brands, (b) => b.id === args.brand.id));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));
		if (args.devicetype && args.devicetype.id) all = _.filter(all, cap => _.find(cap.brands, (b) => _.find(b.devicetypes, (dt) => dt.id === args.devicetype.id)));// && _.countBy(dt.capabilities, cap=> _.countBy(cap.brands,1)));

		return all.length == 0 ? [] : _.map(_.sortBy(all, "id"), x => { return { id: x.id, name: x.id }; });
	}

	async getDeviceclasssAndCapabilities({ action, queryDeviceclass, queryCapability, deviceclass } = {}) {
		//let api = await this.refreshHomeyAPI();
		//var devices = await api.devices.getDevices({ $skipCache: true });

		await this.refreshHomeyAPI();
		var devices = this.devices;
		var classes = {};
		var actionType = _.last(action.split('_'));

		_(devices).forEach(d => {
			if ((!queryDeviceclass || queryDeviceclass == '' || (d.class && d.class.indexOf(queryDeviceclass.toLowerCase()) > -1)) && (!deviceclass || d.class == deviceclass) && Object.keys(classes).indexOf(d.class) == -1 && !d.virtualClass) classes[d.class] = { name: d.class, capabilities: {} };
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
		if (!cls) return;
		if (!cls.capabilities[capability]) cls.capabilities[capability] = { id: capability };
		if (!cls.capabilities[capability].brands) cls.capabilities[capability].brands = {};
		if (!cls.capabilities[capability].brands[driverUri]) cls.capabilities[capability].brands[driverUri] = { id: driverUri, name: this.apps[driverUriLast] ? this.apps[driverUriLast].name : driverUri, devicetypes: {} };
		if (!cls.capabilities[capability].brands[driverUri].devicetypes[device.driverId]) cls.capabilities[capability].brands[driverUri].devicetypes[device.driverId] = { id: device.driverId };

	}

	autocompleteDevice({ api, app, insights } = {}) {

		return (async (query, args, a, b, c,) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			//var defer = new Defer(10000);
			let api = await this.refreshHomeyAPI();
			var devices = this.devices;
			var list = _.filter(devices, device => _.every(queries, q => device.name.toLowerCase().indexOf(q) > -1));
			if (app) list = _.filter(list, device => device.driverUri == app);
			if (insights) {
				//let a = await (api).insights.getLogs();
				var logs = _.map(_.uniqBy(_.filter(await (api).insights.getLogs(), l => l.uriObj ? l.uriObj.type == 'manager' : l.ownerUri.startsWith('homey:manager:')), 'uri'), l => { return { uri: (l.uri || l.ownerUri), uriName: 'Manager - ' + (l.uriObj ? l.uriObj.name : l.ownerName) }; });
				_.each(logs, l => list.push({ id: (l.uri || l.ownerUri), name: l.uriName }));
			}
			if (query) list = _.filter(list, cap => cap.name.toLowerCase().indexOf(query) > -1);
			list = _.orderBy(list, 'name');
			var array = _.map(list, device => { return { id: device.id, name: device.name }; });
			return Promise.resolve(array);
			// defer.resolve(array);

			// return defer.promise;
		}).bind(this);
	}
	autocompleteCapability({ getable, setable, api, insights } = {}) {
		return ((query, args) => {
			var defer = new Defer();
			this.refreshHomeyAPI().then((async api => {
				var list = [];
				if (query) query = query.toLowerCase();
				if (!args || !args.device || !args.device.id) return defer.resolve(list);
				if (args.device.id.startsWith('homey:manager:') && insights) {

					//let a = await (api).insights.getLogs();
					list = _.map(_.filter(await api.insights.getLogs(), l => (l.uri || l.ownerUri) == args.device.id), l => { return { uri: (l.uri || l.ownerUri), id: l.id, name: l.title }; });
				} else {
					var device = this.devices[args.device.id];
					if (!device && (!args.device.id || !insights)) return defer.resolve([]);
					list = _.map(device.capabilitiesObj, (capability, key) => { return { id: key, name: key, getable: capability.getable, setable: capability.setable, deviceId: device.id }; });
					if (getable === true || getable === false) list = _.filter(list, cap => cap.getable == getable);
					if (setable === true || setable === false) list = _.filter(list, cap => cap.setable == setable);
					if (insights === true || insights === false) list = _.filter(list, cap => { return (!!_.find(device.insights, insight => { return (insight.id == cap.id || insight.id == 'homey:device:' + cap.deviceId + ':' + cap.id); })) === insights; });

				}
				if (query) list = _.filter(list, cap => cap.name.toLowerCase().indexOf(query) > -1);
				list = _.orderBy(list, 'name');
				defer.resolve(list);
			}).bind(this));
			return defer.promise;
		}).bind(this);
	}
	autocompleteApp({ api } = {}) {
		return (async (query, args) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			//var defer = new Defer(10000);
			let api = await this.refreshHomeyAPI();
			var apps = this.apps;
			var list = _.filter(apps, app => _.every(queries, q => app.name.toLowerCase().indexOf(q) > -1));
			list = _.orderBy(list, 'name');
			var array = _.map(list, app => { return { id: app.id, name: app.name }; });
			return array;
			//defer.resolve(array);

			//return defer.promise;
		}).bind(this);
	}
	autocompleteDeviceType({ api } = {}) {
		return ((query, args) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			var defer = new Defer(10000);

			var drivers = this.drivers;
			var list = _.filter(drivers, driver => _.every(queries, q => driver.name.toLowerCase().indexOf(q) > -1) && (!args.brand || args.brand === 'undefined' || (driver.uri || driver.ownerUri) === 'homey:app:' + args.brand.id));
			list = _.orderBy(list, 'name');
			var array = _.map(list, driver => { return { id: driver.id, name: driver.name }; });
			defer.resolve(array);

			return defer.promise;
		}).bind(this);
	}
	// async getDisconnectedHomeyApi() {
	// 	const api = new HomeyAPIApp({
	// 		localUrl: this.localURL,
	// 		baseUrl: this.localURL,
	// 		token: this.sessionToken,
	// 		apiVersion: 2,
	// 		online: true,
	// 	}, () => {
	// 		// called by HomeyAPI on 401 requests
	// 		api.setToken(this.sessionToken);
	// 	});
	// 	return api;
	// }

	async destroyAndRefreshHomeyAPI() {
		this.homeyAPI.destroy();
		this.homeyAPI = null;
		this.homeyAPI = await HomeyAPI.forCurrentHomey(this.homey);
		//this.homeyAPI = new HomeyAPI(this.homey);


		//this.homeyAPI = new HomeyAPIApp({homey:this.homey});

		// this.homeyAPI = await HomeyAPI.createAppAPI({
		// 	homey: this.homey,
		//   });
	}

	async refreshHomeyAPI(id) {
		if (id === undefined && this.homeyAPI) {
			if (this.refreshDefer) await this.refreshDefer;
			return this.homeyAPI;
		}
		this.log('id', id == undefined, id === undefined, id === 'undefined');
		if (!id) {
			this.log('refreshHomeyAPI', id);
			this.refreshDefer = new Defer();

			try {
				//this.homeyAPI = new HomeyAPIApp({homey:this.homey}); // SET THE CONNECTS

				// this.homeyAPI = HomeyAPI.createAppAPI({
				// 	homey: this.homey,
				//   });
				// this.homeyAPI.then(x => this.homeyAPI = x);
				// await this.homeyAPI;



				// this.homeyAPI.devices.connect();
				// this.homeyAPI.zones.connect();
				// this.homeyAPI.apps.connect();
				// this.homeyAPI.drivers.connect();
				// this.homeyAPI.flow.connect();

				// SET THE CONNECTS
				// SET THE CONNECTS
				// SET THE CONNECTS

				this.homeyAPI = HomeyAPI.forCurrentHomey(this.homey); // Refresh
				this.homeyAPI.then(x => this.homeyAPI = x);
				await this.homeyAPI;


				////this.homeyAPI.devices.on(['device.create', 'device.delete', 'device.update'], x => { this.refreshDevices(x); });
				////this.homeyAPI.zones.on(['zone.create', 'zone.delete', 'zone.update'], x => { this.refreshZones(x); });
				////this.homeyAPI.apps.on(['app.create', 'app.delete', 'app.update'], x => { this.refreshApps(x); });			




				await this.refreshDevices();
				await this.refreshZones();
				await this.refreshApps();
				await this.refreshDrivers();


				// console.log('Size of this.devices:', this.homey.app.roughSizeOfObject(this.devices) );
				// console.log('Size of this.zones:', this.homey.app.roughSizeOfObject(this.zones) );
				// console.log('Size of this.apps:', this.homey.app.roughSizeOfObject(this.apps) );
				// console.log('Size of this.drivers:', this.homey.app.roughSizeOfObject(this.drivers) );


				//// Does this help? Seems a little bit.
				//await this.destroyAndRefreshHomeyAPI();


				// this.homeyAPI.destroy();
				// this.homeyAPI = null;
				// this.homeyAPI = await HomeyAPI.forCurrentHomey(this.homey);


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

				this.homeyAPI.flow.on('advancedflow.create', x => {
					this.homey.api.realtime('createdadvancedflow', x);
					// let avdDriver = this.homey.drivers.getDriver('virtualdevice');
					// if (avdDriver && avdDriver.onCreatedAdvancedFlows) avdDriver.onCreatedAdvancedFlows(x);
				});

				this.refreshDefer.resolve(this.homeyAPI);
				this.refreshDefer = null;
				//this.log('App size: ', this.roughSizeOfObject(this));
				return this.homeyAPI;
			} catch (error) {
				this.error(error);
				this.refreshDefer = null;
				return;
			}
		}
		if (!this.apis) this.apis = {};
		if (!this.apis[id]) {
			this.log('refreshHomeyAPI id:', id);
			this.apis[id] = new HomeyAPIApp({ homey: this.homey });

			// this.apis[id] = await HomeyAPI.createAppAPI({
			// 	homey: this.homey,
			//   });
			// this.apis[id] = await HomeyAPI.forCurrentHomey(this.homey);
		}
		return this.apis[id];
	}
	async clearHomeyAPI(id) {
		if (id && this.apis) delete this.apis[id];
	}

	// async refreshCapabilities(capabilty, type) {
	// 	let b = capabilty;
	// }

	async refreshDevices(device, type) {
		this.log('refreshDevices');

		//return this.devices = await this.homeyAPI.devices.getDevices({ $skipCache: true });
		if (!this.devices || !type) {
			this.devices = await this.homeyAPI.devices.getDevices({ $skipCache: true });
			_.each(this.devices, (d, key) => this.devices[key] = this.getReducedDevice(d));
		}
		//this.log('refreshDevices size', this.roughSizeOfObject(this.devices));
		switch (type) {
			case 'create':
			case 'update':
				if (this.devices[device.id] && this.devices[device.id].available !== device.available) {
					if (device.unavailableMessage && typeof (device.unavailableMessage) === 'object') this.error('device.unavailableMessage  is object: ', device.unavailableMessage);
					let zone = this.zones[device.zone];
					try {

						this.trigger_app_device_available.trigger({
							deviceName: device.name,
							deviceId: device.id,
							available: !!device.available,
							unavailableMessage: (device.unavailableMessage || '').toString(),
							zoneName: zone.name,
							zoneId: zone.id
						}, { available: !!device.available, brand: device.driverUri, devicetype: device.driverId });
					} catch (error) {
						this.error(error);
					}
				}
				if (this.devices[device.id] && this.devices[device.id].setCapabilityValue) this.devices[device.id] = await this.homeyAPI.devices.getDevice({ id: this.devices[device.id].id, $skipCache: true });
				else this.devices[device.id] = this.getReducedDevice(device);
				break;
			case 'delete':
				delete this.devices[device.id];
				break;
		}
	}
	getReducedDevice(d) {
		return {
			available: d.available,
			unavailableMessage: d.unavailableMessage,
			id: d.id,
			capabilities: d.capabilities,
			capabilitiesObj: d.capabilitiesObj,
			class: d.class,
			driverId: d.driverId,
			driverUri: d.driverUri,
			insights: d.insights,
			name: d.name,
			zone: d.zone,
			virtualClass: d.virtualClass
		};
	}
	async refreshDrivers(driver, type) {
		this.log('refreshDrivers');
		//this.drivers = await this.homeyAPI.drivers.getDrivers({ $skipCache: true });
		if (!this.drivers || !type) {
			this.drivers = await this.homeyAPI.drivers.getDrivers({ $skipCache: true });
			_.each(this.drivers, (d, key) => this.drivers[key] = this.getReducedDriver(d));
		}
		//this.log('refreshDrivers size', this.roughSizeOfObject(this.drivers));
		switch (type) {
			case 'create':
			case 'update':
				this.drivers[driver.id] = this.getReducedDriver(driver);
				break;
			case 'delete':
				delete this.drivers[driver.id];
				break;
		}
	}
	getReducedDriver(d) {
		return {
			id: d.id,
			uri: d.uri,
			ownerUri: d.ownerUri,
			name: d.name
		};
	}
	async refreshZones(zone, type) {
		//this.zones = await this.homeyAPI.zones.getZones({ $skipCache: true });
		if (!this.zones || !type) this.zones = await this.homeyAPI.zones.getZones({ $skipCache: true });
		//this.log('refreshZones size', this.roughSizeOfObject(this.zones));
		switch (type) {
			case 'create':
			case 'update':
				if (this.zones[zone.id] && this.zones[zone.id].active !== zone.active) {
					this.trigger_app_zone_activated.trigger({ zoneName: zone.name, zoneId: zone.id, active: zone.active }, { active: zone.active });
				}
				this.zones[zone.id] = zone;
				break;
			case 'delete':
				delete this.zones[zone.id];
				break;
		}
	}
	async refreshApps(app) {
		//this.log('refreshApps', app);
		if (this.apps == 'waiting') return;
		var firstrun = !this.apps;
		this.apps = 'waiting';
		this.apps = await this.homeyAPI.apps.getApps({ $skipCache: true });
		//this.log('refreshZones size', this.roughSizeOfObject(this.apps));

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

	getLastUpdated(capability) {
		return (typeof (capability.lastUpdated) == 'number' ? new Date(capability.lastUpdated) : capability.lastUpdated instanceof Date ? capability.lastUpdated : new Date(capability.lastUpdated));
	}

}

module.exports = DeviceSetter;