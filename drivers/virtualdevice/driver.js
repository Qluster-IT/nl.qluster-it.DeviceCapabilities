"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

const Homey = require('homey');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');

const NUMBEROFFIELDS = 10;

module.exports = class VirtualDeviceDriver extends Homey.Driver {

    async onInit() {
        this.log('VirtualDeviceDriver onInit');

        // var manifest = Homeyman.Current.manifest;
		// manifest.capabilities.measure_devicecapabilities_number.units = 'TE';
    
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_button', 'virtualdevice_set_status', 'virtualdevice_set_status_optionalnumber'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
					try {
						if (!args || !args.device) return false;
                        var fieldId = args.field? args.field.id : 'status1';
                        var cap = args.device.getStoreValue(fieldId);
                        switch (action) {
                            case 'virtualdevice_set_text':
                                cap = cap || 'devicecapabilities_text.text1';
                                if(args.text!==undefined && args.text!=='undefined') args.device.setCapabilityValue(cap, args.text);
                                else args.device.setCapabilityValue(cap, null);
                                return true;
                            case 'virtualdevice_set_number':
                                cap = cap || 'measure_devicecapabilities_number.number1';
                                if(args.number!==undefined && args.number!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.number);                                   
                                }
                                else args.device.setCapabilityValue(cap, null);
                                return true;
                            case 'virtualdevice_set_boolean':
                                cap = cap || 'alarm_devicecapabilities_boolean.boolean1';
                                if(args.boolean!==undefined && args.boolean!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.boolean);                                    
                                }
                                else args.device.setCapabilityValue(cap, null);
                                return true;
                            case 'virtualdevice_set_button':
                                cap = cap || 'button';
                                if(args.boolean!==undefined && args.boolean!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.boolean);                                    
                                }
                                else args.device.setCapabilityValue(cap, null);
                                return true;
                            case 'virtualdevice_set_status':
                            case 'virtualdevice_set_status_optionalnumber':
                                cap = cap || 'measure_devicecapabilities_status.status1';
                                if(args.text!==undefined && args.text!=='undefined') {
                                    var opt = args.device.getCapabilityOptions(cap);
					                if (!opt) opt = {};
                                    opt.units = args.text;
                                    args.device.setCapabilityOptions(cap, opt);
                                }
                                if(args.number!==undefined && args.number!=='undefined') args.device.setCapabilityValue(cap, args.number); 
                                else if(action=="virtualdevice_set_status_optionalnumber") args.device.setCapabilityValue(cap, null);
                                
                                return true;
                        }
                        return null;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				}).bind(this));
            if(action.endsWith('_text') || action.endsWith('_number') || action.endsWith('_boolean') || action.endsWith('_button')) set_value.getArgument('field')
            .registerAutocompleteListener(this.registerAutocompleteField(action));
		}).bind(this));


        var trigger_virtualdevice_button = ['trigger_virtualdevice_button'];
        trigger_virtualdevice_button.forEach((action => {
			var button = this.homey.flow.getDeviceTriggerCard(action);
            this.trigger_virtualdevice_button = button;
			button
				.registerRunListener(async (args, state) => {
                    try {
					    return args.field.id==state.field.id;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				});
            button.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
		}).bind(this));

        var trigger_virtualdevice_boolean = ['trigger_virtualdevice_boolean'];
        trigger_virtualdevice_boolean.forEach((action => {
			var boolean = this.homey.flow.getDeviceTriggerCard(action);
            this.trigger_virtualdevice_boolean = boolean;
			boolean
				.registerRunListener(async (args, state) => {
                    try {
					    return args.field.id==state.field.id;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				});
            boolean.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
		}).bind(this));


        // var action_virtualdevice_set_name = ['virtualdevice_set_name'];
        // action_virtualdevice_set_name.forEach((action => {
		// 	var actionCard = this.homey.flow.getActionCard(action);
        //     this.action_virtualdevice_set_name = actionCard;
		// 	actionCard
		// 		.registerRunListener(async (args, state) => {
        //             try {
        //                 var id = args.device.getData().id;
		// 			    var device = _.find(DeviceSetter.Current.devices, device=> device.data.id==id);
        //                 device.name = args.text;
        //                 DeviceSetter.Current.homeyAPI.devices.updateDevice({id:device.id, device:device});
		// 			} catch (error) {
		// 				this.log('set_value:');
		// 				this.log(error);
		// 			}
		// 		});            
		// }).bind(this));
       
        	this.homey.flow.getActionCard('virtualdevice_set_warning').registerRunListener(async (args, state) => {
                try {
                    args.device.setWarning(args.text);                    
                } catch (error) {
                    this.log('action_virtualdevice_set_name:');
                    this.error(error);
                }
            });
		
            

            this.homey.flow.getActionCard('virtualdevice_clear_warning').registerRunListener(async (args, state) => {
                try {
                    args.device.unsetWarning();                    
                } catch (error) {
                    this.log('action_virtualdevice_set_name:');
                    this.error(error);
                }
            });
		
            

    }

    registerAutocompleteField(action) {
        return async( query, args ) => {
            var settings = args.device.getSettings();
            var ret = [];
            //var title = await args.device.getCapabilityOptions('devicecapabilities_text.text'+i).title;
            var actiontype = action.split('_')[2];
            var typeText = actiontype=='text' ? 'Text' : actiontype=='number' ? 'Number' : actiontype=='boolean' ? 'Yes/No' : actiontype=='button' ? 'Button' : 'unknown';
            var caps = args.device.getCapabilities();
            for(var i=1;i<=NUMBEROFFIELDS;i++){
                var cap = undefined;
                var searchs = ['.'+actiontype+i];
                if(actiontype=='button'){
                    if(i===1) searchs = ['.'+actiontype+i, 'onoff', 'button', 'locked', 'garagedoor_closed', 'windowcoverings_closed'];
                } 
                for(var j=0;j<searchs.length;j++){
                    if((cap =_.find(caps, c=> c.endsWith(searchs[j])))) ret.push({'id':actiontype+i, 'name':args.device.getCapabilityOptions(cap).title || (typeText+' ' + i), description:(typeText+' ' + i)});
                }
                
            }
          return ret;
        };
    }

    async triggerFlow(device, value, state) {
        this.trigger_virtualdevice_button.trigger(device, {value:value===null?true:value} , state);
    }
    async triggerFlowBoolean(device, value, state) {
        this.trigger_virtualdevice_boolean.trigger(device, {value:value===null?true:value} , state);
    }
    // This method is called when a user is adding a device
    // and the 'list_devices' view is called
      async onPairListDevices( ) {
        var index = 0;
        var count = Object.keys(DeviceSetter.Current.VirtualDevices).length;
        for (const key in DeviceSetter.Current.VirtualDevices) {
            if (Object.hasOwnProperty.call(DeviceSetter.Current.VirtualDevices, key)) {
                const element = DeviceSetter.Current.VirtualDevices[key];
                try {                    
                    var _id = element.getData().id;
                    var nr =Number.parseInt(_id.split('_')[1]);
                    index = Math.max(index,nr);
                } catch (error) {
                    //index = Math.max(index,nr);
                }

            }
        }
        var id = '_'+(index+1).toString();
        return [
              {
                  name: 'DeviceCapability VD '+(index+1),
                  data: {
                      id: 'DeviceCapabilityVirtualDevice'+id
                  }
              }
          ];
      }
      
      async onPair(session, arg1) {
        // var s = session;
        // await session.nextView();
        let devices = await this.onPairListDevices();
        var device;

        session.setHandler('list_devices', async (data) => {
            // // emit when devices are still being searched
            // session.emit('list_devices', devices);
      
            // return devices when searching is done
            return devices;
        });
      
        session.setHandler('list_devices_selection', async (selectedDevices) => {
            device = selectedDevices[0];
            device.icon = '/icon-default.svg';
        });

        session.setHandler('list_icons', async (data) => {            
            return ['alarm_smoke', 
            'alarm_water',
            'battery', 
            'circle', 
            'device_capabilities',
            'measure_clouds',
            'measure_humidity',
            'measure_luminance',
            'measure_noise', 
            'measure_power',
            'measure_pressure',
            'measure_rain',
            'measure_temperature',
            'measure_wind_angle',
            'measure_wind_strength',
            'meter_gas', 
            'meter_power', 
            'meter_water',
            'meter_rain',
            'music',
            'onoff',
            'sensor',
            'speaker_next',
            'speaker_play',
            'speaker_prev',
            'virtual_device',
            'volume_down',
            'volume_mute',
            'volume_up'
        ];

        });

        session.setHandler('icon_picked', async (data) => {
            device = devices[0];
            var iconPath = "../../../assets/icons/" + data.icon+'.svg';
            device.data.icon = iconPath;
            device.icon = iconPath;
            return device;
        });
        
        session.setHandler('icon_save', async (data)=> {     
            device = devices[0];       
            var icon = await DeviceSetter.Current.createDeviceIcon({ type:'image/svg', buffer:data, id:device.data.id });              
            var iconPath = "../../." + icon.path;      
            device.data.icon = iconPath;
            device.icon = iconPath;
            return device;      
            
          });

        session.setHandler('done', async (data) => {
            device = devices[0];            
            //session.nextView();
            return device;
        });

        session.setHandler('list_icons_selection', async (selectedIcons) => {
            // device.icon = '../../../userdata/icon.svg';
        });
          
        session.setHandler('add_device', async (device) => {
            // device.icon = '../../../userdata/icon.svg';
            console.log('on device added', device);
            
        });

        // Show a specific view by ID
        // await session.showView("my_view");
    
        // // Show the next view
        // await session.nextView();
    
        // // Show the previous view
        // await session.prevView();
    
        // // Close the pair session
        // await session.done();
    
        // // Received when a view has changed
        // session.setHandler("showView", async function (viewId) {
        //   console.log("View: " + viewId);
        // });
      }

  };
// var self = module.exports = class MyDriver  {
//     init: function(devices_data, call-back) {
//         Homey.log(devices_data);
//         for (var x = 0; x < devices_data.length; x++) {
//             devices.push(devices_data[x]);
//         }

//         call-back();
//     },
//     capabilities: {
//         speaker_track: {
//             set: function (device_data, button, call-back) {
//                 l('speaker_track set');
//                 // var variable = variableManager.getVariable(device_data.id);
//                 // if (variable) {
//                 //     variableManager.updateVariable(device_data.id, new Date().toISOString(), device_data.type);
                 
//                 //     self.realtime(device_data, 'button', !button);
//                 //     call-back(null, !button);
//                 //     return;
//                 // } else {
//                 //     call-back(null, false);
//                 // }
//             }
//         }
//     },
//     pair : function(socket) {
        
//         socket.on('list_devices', function (data, call-back) {
//             // Homey.log('list devices');
//             // var vars = variableManager.getVariables();
//             // Homey.log(vars);
//             // var bools = variableManager.getVariables().filter(util.findVariable('', 'trigger'));

//             // var devices = [];

//             // bools.forEach(function (variable) {
//             //     Homey.log(variable);
//             //     var device = {
//             //             name: variable.name,
//             //         data: {
//             //             id: variable.name,
//             //             type: variable.type
//             //         }
//             //     }
//             //     devices.push(device);

//             // });
//             // Homey.log(devices);
//             call-back(null, devices);

//         });
//         socket.on("add_device", function(device, call-back) {

//             Homey.log('add device');

//             // Store device masterly
//             devices.push(device);

//         });
//     }
// }




