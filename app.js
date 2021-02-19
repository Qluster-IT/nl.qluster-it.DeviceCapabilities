'use strict';

const Homey = require('homey');
const { HomeyAPI } = require('athom-api');
const _ = require('lodash-core');

const { Defer} = require('./lib/proto');

class DeviceSetter extends Homey.App {
	
	Triggers ={
        triggercapabilitychanged:{List:[], Card:null}
    };
    Tracking = {        
        /** @type {HomeyAPI} homeyAPI; */
        homeyAPI:null,
        devices:{}
    }

	onInit() {
		this.log('DeviceSetter is running...');

		var capabilityZoneActions = ['set_capability_zone_text', 'set_capability_zone_percentage', 'set_capability_zone_boolean'];//, 'set_capability_zone_anders'];
		_.forEach(capabilityZoneActions, (action=> {
			var set_capability_zone = this.homey.flow.getActionCard(action);
			set_capability_zone
			//.register()
			.on('update', (() => {
				this.clearHomeyAPI(action);
			}).bind(this))
			.registerRunListener((async ( args, state ) => {
				try {
					if(!args || !args.zone || !args.zone.id) return false;
					var api = await this.refreshHomeyAPI();
					var devices = await api.devices.getDevices();				
					var zones = await api.zones.getZones();
					var cls = args.capability.id.split('.')[0];
					var capability = args.capability.id.substr(args.capability.id.indexOf('.')+1);	
					var devicesToSet = [];					
					setZone(args.zone.id);
					var val = args.value;
					if(action=='set_capability_zone_boolean') val = val=='true';
					var promises = [];
					_.forEach(devicesToSet, d=>{
						if(d && d.capabilitiesObj && d.capabilitiesObj && d.capabilitiesObj[capability] && d.setCapabilityValue) {
							promises.push(d.setCapabilityValue(capability, val));
						}
					});
					var all = Promise.all(promises);
					all.then(x=>true);
					all.catch(x=>false);
					return all;
	
					function setZone(zoneId) {
						var devs = _.filter(devices, d=>d.zone==zoneId && (d.class==cls || d.virtualClass==cls ) && d.capabilities && d.capabilities.indexOf(capability)>-1);
						_.forEach(devs, d=> devicesToSet.push(d));	
						if(args.subzones=='yes') _.forEach(zones, z=> {
							if(z.parent==zoneId) setZone(z.id);
						});
					}
	
					
				} catch (error) {
					this.log('set_capability-error:');
					this.log(error);
				}
			}).bind(this))
			.getArgument('capability').registerAutocompleteListener(( query, args ) => {
				this.log('args');
				this.log(args);
				var defer = new Defer(10000);
				this.refreshHomeyAPI(action).then( (async api=>{
					var devices = await api.devices.getDevices();
					var classes={};
					var actionType = _.last(action.split('_'));
					
					_(devices).forEach(d=>{
						if(Object.keys(classes).indexOf(d.class)==-1 && !d.virtualClass) classes[d.class] = {capabilities:[]};
						if(Object.keys(classes).indexOf(d.virtualClass)==-1) classes[d.virtualClass] = {capabilities:[]};					
					});
					_(classes).forEach((cls, key)=> {
						var devs = _(devices).filter(d=> d.class==key || d.virtualClass==key);
						_(devs).forEach(d=>{
							_(d.capabilities).forEach(c=>{
								if(d.capabilitiesObj[c] && d.capabilitiesObj[c].setable && cls.capabilities.indexOf(c)==-1) {
									switch (actionType) {
										case "percentage": if(d.capabilitiesObj[c].type=='number' && d.capabilitiesObj[c].min==0 && d.capabilitiesObj[c].max==1 && d.capabilitiesObj[c].decimals==2) cls.capabilities.push(c);
											break;						
										case "text":
											if(d.capabilitiesObj[c].type=='string') cls.capabilities.push(c);
											break;
										case "boolean":
											if(d.capabilitiesObj[c].type=='boolean') cls.capabilities.push(c);
											break;
										default:
											if(d.capabilitiesObj[c].type=='string') ;
											else if(d.capabilitiesObj[c].type=='boolean') ;
											else if(d.capabilitiesObj[c].type=='number' && d.capabilitiesObj[c].min==0 && d.capabilitiesObj[c].max==1 && d.capabilitiesObj[c].decimals==2);
											else cls.capabilities.push(c);
											break;
									}
								}
							});
						});
					});
					try {
						var r= _.flatMap(_.orderBy(Object.keys(classes)), (clsKey)=> { return _.map(_.orderBy(classes[clsKey].capabilities), cap=> { return {id:clsKey + '.' + cap, name:clsKey + '.' + cap}; }) } );
						defer.resolve(r);
					} catch (error) {
						this.log(error);
					}
				}).bind(this));
			  return defer.promise;
			});
			set_capability_zone
			.getArgument('zone').registerAutocompleteListener(( query, args ) => {
				var defer = new Defer(10000);
				this.refreshHomeyAPI(action).then( (async api=>{
					var zones = await api.zones.getZones();
					var home = _(zones).find(z=> !z.parent);
					var arr = [];
					
					fill(home);
					defer.resolve(_.map(arr, zone=> { return {id:zone.id, name:zone.name} }));
	
					function fill(obj, spaces) {
						spaces=spaces||'';
						arr.push({id:obj.id, name:spaces+obj.name});
						var subzones = _(zones).filter(z=>z.parent==obj.id);
						_(subzones).forEach(z=> fill(z, spaces + '.. '));
					}
				}).bind(this));
			  return defer.promise;
			});
		}).bind(this));

		let trigger_capability_changedTrigger = this.homey.flow.getTriggerCard('trigger_capability_changed');
        this.Triggers.triggercapabilitychanged.Card = trigger_capability_changedTrigger;
        trigger_capability_changedTrigger
        //.register()
        .on('update', (() => {
            refreshcapabilityChangedTriggers.call(this);
        }).bind(this))
        .registerRunListener(( args, state ) => {  
            var r = args.device && args.device.id && state.device && state.device.id && args.device.id === state.device.id &&
            	args.capability && args.capability.id && state.capability && state.capability.id && args.capability.id === state.capability.id ;
            return Promise.resolve(r);
        })
        .getArgument('device')
        .registerAutocompleteListener(( query, args, a, b, c,  ) => {
            query = query.toLowerCase();
            var defer = new Defer(10000);
            this.refreshHomeyAPI('trigger_capability_changed').then((async api=>{
				var devices = await api.devices.getDevices();
                var list = _.filter(devices, device=>{ return device.name.toLowerCase().indexOf(query)>-1});
                list = _.orderBy(list, 'name');
                var array = _.map(list, device=> { return {id:device.id, name:device.name} });
                defer.resolve(array);
                
            }).bind(this));
            return defer.promise;
        });
        trigger_capability_changedTrigger.getArgument('capability')
        .registerAutocompleteListener(( query, args) => {
            var defer = new Defer();
			this.refreshHomeyAPI('trigger_capability_changed').then((async api=>{
				var devices = await api.devices.getDevices();
				var device = _.find(devices, d=> d.name==query);
				if(!device) return defer.resolve([]);
				//var list = _.filter(, cap=> cap.getable);
				var list = _.map(device.capabilitiesObj, (capability, key)=> { return {id:key, name:key, getable:capability.getable} });
				list = _.filter(list, cap=> cap.getable);
				defer.resolve(list);
			}).bind(this));
            return defer.promise;
        }) ;
        refreshcapabilityChangedTriggers.call(this);

        function refreshcapabilityChangedTriggers() {
            this.clearHomeyAPI('trigger_capability_changed');
            trigger_capability_changedTrigger.getArgumentValues()
            .then((args => {
                this.Triggers.triggercapabilitychanged.List = args;
                var devices = _.map(_.uniqBy(args, arg=>{return arg.device.id; }), arg=>{ return arg.device;});
                _.each(devices, device=>{                    
                    if(!this.Tracking.devices[device.id])this.Tracking.devices[device.id] = device;
                    var capabilitiesArgs = _.filter(args, _arg=>{ return _arg.device.id==device.id; });
                    capabilitiesArgs = _.uniqBy(capabilitiesArgs, capArg=>{ return capArg.capability.id; });
                    capabilitiesArgs = _.map(capabilitiesArgs, capArg=>{ return capArg.capability.id; });
                    _.each(capabilitiesArgs, capability=>{
                        var deviceToSet = this.Tracking.devices[device.id];
                        if(!deviceToSet.capabilities) deviceToSet.capabilities = {};
                        if(!deviceToSet.capabilities[capability]) deviceToSet.capabilities[capability] = {id:capability};
                    });                    
                    this.updateTracking();
                 });

            }).bind(this))
		}


		
		let condition_change_capability_boolean = this.homey.flow.getConditionCard('condition_change_capability_boolean');
        condition_change_capability_boolean        
        .registerRunListener(( args, state ) => {
			console.log('condition_change_capability_boolean.registerRunListener');
			var defer = new Defer();
			if(!(args.device && args.device.id && args.capability && args.capability.id)) {
				defer.reject('Reject');
				return defer.promise;
			};
			this.refreshHomeyAPI().then((async api=>{
				var device = await api.devices.getDevice({id:args.device.id});
				if(!device) {
					defer.reject('Reject');
					return defer.promise;
				};
				
				var startTime = new Date().getTime();
				_setTimeout()
				function _setTimeout() {
					setTimeout(async ()=> {
							device.setCapabilityValue(args.capability.id, args.value=='true')
							.then(()=>{
								if(new Date().getTime() - startTime < 20*1000) _setTimeout() ;
								else defer.reject();
							})
							.catch((e)=>{
								if(e.name==args.error) defer.resolve();
								else if(new Date().getTime() - startTime < 20*1000) _setTimeout() ;
								else defer.reject('"'+e+'"');
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
        .registerAutocompleteListener(( query, args, a, b, c,  ) => {
            query = query.toLowerCase();
            var defer = new Defer(10000);
            this.refreshHomeyAPI().then((async api=>{
				var devices = await api.devices.getDevices();
                var list = _.filter(devices, device=>{ return device.name.toLowerCase().indexOf(query)>-1});
                list = _.orderBy(list, 'name');
                var array = _.map(list, device=> { return {id:device.id, name:device.name} });
                defer.resolve(array);
                
            }).bind(this));
            return defer.promise;
        });
        condition_change_capability_boolean.getArgument('capability')
        .registerAutocompleteListener(( query, args) => {
            var defer = new Defer();
			this.refreshHomeyAPI().then((async api=>{
				var devices = await api.devices.getDevices();
				var device = _.find(devices, d=> d.name==query);
				if(!device) return defer.resolve([]);
				//var list = _.filter(, cap=> cap.getable);
				var list = _.map(device.capabilitiesObj, (capability, key)=> { return {id:key, name:key, getable:capability.getable} });
				list = _.filter(list, cap=> cap.getable);
				defer.resolve(list);
			}).bind(this));
            return defer.promise;
        }) ;


	}

	async updateTracking(refresh) {
        var hm = this;
        if(hm.Tracking.homeyAPI===true) return;
        if(!hm.Tracking.homeyAPI || refresh) {
            hm.Tracking.homeyAPI = true;
            hm.Tracking.homeyAPI = await hm.refreshHomeyAPI();
        }
        //var devices = null;
        _.each(hm.Tracking.devices, async device=>{
            if(!device.device) device.device = await hm.Tracking.homeyAPI.devices.getDevice({id:device.id});       
			_.each(device.capabilities, capability=>{             
				if(!capability.listener) capability.listener = device.device.makeCapabilityInstance(capability.id, function (s) {
					var trigger = hm.Triggers.triggercapabilitychanged;
					trigger.Card.trigger({"value":s.toString()}, {device:{id:device.id}, capability:{id:capability.id}}, function () {
					});
				});
			});
		});
        
    }
    refreshTracking() {
        updateTracking.call(this, true);
    }

	
    // async waitForSio(times, defer) {
    //     if(!times) times=0;
    //     times++;
    //     if(!defer) defer = new Defer(10000);
    //     if(Homeyman.Current.Tracking.homeyAPI && Homeyman.Current.Tracking.homeyAPI._sio) defer.resolve(Homeyman.Current.Tracking.homeyAPI._sio);
    //     else if (times>=5) defer.resolve();
    //     else setTimeout(()=>{
    //         Homeyman.Current.waitForSio(times, defer);
    //     }, 500);
    //     return defer.promise;
        
    // }

	

    async refreshHomeyAPI(id) {
		if(!id) {
        	this.homeyAPI =  HomeyAPI.forCurrentHomey(this.homey); // Refresh
        	return this.homeyAPI;                
		}
		if(!this.apis) this.apis = {};
		if(!this.apis[id]) this.apis[id] = HomeyAPI.forCurrentHomey(this.homey);
		return this.apis[id];
    }
	async clearHomeyAPI(id) {
		if(id && this.apis) delete this.apis[id];
    }


	
}

module.exports = DeviceSetter;