'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('athom-api');
const _ = require('lodash-core');

const { Defer } = require('./lib/proto');

class DeviceSetter extends Homey.App {

	Triggers = {
		triggercapabilitychanged: { List: [], Card: null },
		triggercapabilitychanged2: { List: [], Card: null }
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
		if (process.env.DEBUG === '1') require('inspector').open(9222, '0.0.0.0', false);
		this.log('DeviceSetter is running...');
		this.refreshHomeyAPI().then(async api => {
			this.Tracking.homeyAPIStatic = api;
		});

		var capabilityZoneActions = ['set_capability_zone_text', 'set_capability_zone_percentage', 'set_capability_zone_boolean'];//, 'set_capability_zone_anders'];
		_.forEach(capabilityZoneActions, (action => {
			var set_capability_zone = this.homey.flow.getActionCard(action);
			set_capability_zone
				//.register()
				.on('update', (() => {
					this.clearHomeyAPI(action);
				}).bind(this))
				.registerRunListener((async (args, state) => {
					try {
						if (!args || !args.zone || !args.zone.id) return false;
						var api = await this.refreshHomeyAPI();
						var devices = await api.devices.getDevices();
						var zones = await api.zones.getZones();
						var cls = args.capability.id.split('.')[0];
						var capability = args.capability.id.substr(args.capability.id.indexOf('.') + 1);
						var devicesToSet = [];
						setZone(args.zone.id);
						var val = args.value;
						if (action == 'set_capability_zone_boolean') val = val == 'true';
						var promises = [];
						_.forEach(devicesToSet, d => {
							if (d && d.capabilitiesObj && d.capabilitiesObj && d.capabilitiesObj[capability] && d.setCapabilityValue) {
								promises.push(d.setCapabilityValue(capability, val));
								//promises.push(d.setCapabilityValue({capabilityId:capability, value:val}));
							}
						});
						var all = Promise.all(promises);
						all.then(x => true);
						all.catch(x => false);
						return all;

						function setZone(zoneId) {
							var devs = _.filter(devices, d => d.zone == zoneId && (d.class == cls || d.virtualClass == cls) && d.capabilities && d.capabilities.indexOf(capability) > -1);
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
				.getArgument('capability').registerAutocompleteListener((query, args) => {
					this.log('args');
					this.log(args);
					var defer = new Defer(10000);
					this.refreshHomeyAPI(action).then((async api => {
						var devices = await api.devices.getDevices();
						var classes = {};
						var actionType = _.last(action.split('_'));

						_(devices).forEach(d => {
							if (Object.keys(classes).indexOf(d.class) == -1 && !d.virtualClass) classes[d.class] = { capabilities: [] };
							if (Object.keys(classes).indexOf(d.virtualClass) == -1) classes[d.virtualClass] = { capabilities: [] };
						});
						_(classes).forEach((cls, key) => {
							var devs = _(devices).filter(d => d.class == key || d.virtualClass == key);
							_(devs).forEach(d => {
								_(d.capabilities).forEach(c => {
									if (d.capabilitiesObj[c] && d.capabilitiesObj[c].setable && cls.capabilities.indexOf(c) == -1) {
										switch (actionType) {
											case "percentage": if (d.capabilitiesObj[c].type == 'number' && d.capabilitiesObj[c].min == 0 && d.capabilitiesObj[c].max == 1 && d.capabilitiesObj[c].decimals == 2) cls.capabilities.push(c);
												break;
											case "text":
												if (d.capabilitiesObj[c].type == 'string') cls.capabilities.push(c);
												break;
											case "boolean":
												if (d.capabilitiesObj[c].type == 'boolean') cls.capabilities.push(c);
												break;
											default:
												if (d.capabilitiesObj[c].type == 'string');
												else if (d.capabilitiesObj[c].type == 'boolean');
												else if (d.capabilitiesObj[c].type == 'number' && d.capabilitiesObj[c].min == 0 && d.capabilitiesObj[c].max == 1 && d.capabilitiesObj[c].decimals == 2);
												else cls.capabilities.push(c);
												break;
										}
									}
								});
							});
						});
						try {
							var r = _.flatMap(_.orderBy(Object.keys(classes)), (clsKey) => { return _.map(_.orderBy(classes[clsKey].capabilities), cap => { return { id: clsKey + '.' + cap, name: clsKey + '.' + cap }; }) });
							defer.resolve(r);
						} catch (error) {
							this.log(error);
							defer.reject(error);
						}
					}).bind(this));
					return defer.promise;
				});
			set_capability_zone
				.getArgument('zone').registerAutocompleteListener((query, args) => {
					var defer = new Defer(10000);
					this.refreshHomeyAPI(action).then((async api => {
						var zones = await api.zones.getZones();
						var home = _(zones).find(z => !z.parent);
						var arr = [];

						fill(home);
						defer.resolve(_.map(arr, zone => { return { id: zone.id, name: zone.name } }));

						function fill(obj, spaces) {
							spaces = spaces || '';
							arr.push({ id: obj.id, name: spaces + obj.name });
							let subzones = _.filter(zones, z => z.parent == obj.id);
							subzones = _.orderBy(subzones, 'name');
							_(subzones).forEach(z => fill(z, spaces + '.. '));
						}
					}).bind(this));
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
									if(Number.isInteger(targetInsight.decimals)) tokens.number = parseFloat(lastOne.v.toFixed(targetInsight.decimals));
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

	}


	//#region Old Trigger
	async updateTracking(refresh, trigger) {
		var hm = this;
		if (hm.Tracking.homeyAPI === true) return;
		if (!hm.Tracking.homeyAPI || refresh) {
			hm.Tracking.homeyAPI = true;
			hm.Tracking.homeyAPI = await hm.refreshHomeyAPI();
		}
		//var devices = null;
		_.each(hm.Tracking.devices, async device => {
			if (!device.device) device.device = await hm.Tracking.homeyAPI.devices.getDevice({ id: device.id });
			_.each(device.capabilities, capability => {
				if (!capability.listener) {
					capability.listener = device.device.makeCapabilityInstance(capability.id, async function (value) {
						//if(trigger==hm.Triggers.triggercapabilitychanged)  // Only ever this one
						trigger.Card.trigger({ "value": value.toString() }, { device: { id: device.id }, capability: { id: capability.id } }, function () { });
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
			hm.Tracking2.homeyAPI = await hm.refreshHomeyAPI();
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



	autocompleteDevice({ api } = {}) {
		return ((query, args, a, b, c,) => {
			query = query.toLowerCase();
			var queries = query.split(' ');
			var defer = new Defer(10000);
			this.refreshHomeyAPI(api).then((async api => {
				var devices = await api.devices.getDevices();
				var list = _.filter(devices, device => _.every(queries, q => device.name.toLowerCase().indexOf(q) > -1));
				list = _.orderBy(list, 'name');
				var array = _.map(list, device => { return { id: device.id, name: device.name } });
				defer.resolve(array);

			}).bind(this));
			return defer.promise;
		}).bind(this);
	}
	autocompleteCapability({ getable, setable, api, insights } = {}) {
		return ((query, args) => {
			var defer = new Defer();
			this.refreshHomeyAPI(api).then((async api => {
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

	async refreshHomeyAPI(id) {
		if (!id) {
			this.homeyAPI = HomeyAPI.forCurrentHomey(this.homey); // Refresh
			return this.homeyAPI;
		}
		if (!this.apis) this.apis = {};
		if (!this.apis[id]) this.apis[id] = HomeyAPI.forCurrentHomey(this.homey);
		return this.apis[id];
	}
	async clearHomeyAPI(id) {
		if (id && this.apis) delete this.apis[id];
	}



}

module.exports = DeviceSetter;