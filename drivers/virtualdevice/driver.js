"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

const Homey = require('homey');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');

const sandbox = require('./../../lib/sandbox');

const NUMBEROFFIELDS = 10;

module.exports = class VirtualDeviceDriver extends Homey.Driver {

    async onInit() {
        this.log('VirtualDeviceDriver onInit');
        //return null;

		this.log("Capabilities", Object.keys(this.homey.app.manifest.capabilities).length);
        
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_button', 'virtualdevice_set_status', 'virtualdevice_set_status_optionalnumber'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
                    if (!args || !args.device) return false;
                    let fieldId = args.field? args.field.id : 'status1';
                    let cap = args.device.getStoreValue(fieldId);
                    try {
                        let val;
                        switch (action) {
                            case 'virtualdevice_set_text':
                                if(args.text!==undefined && args.text!=='undefined') val = args.text;
                                else val = null;
                                break;
                            case 'virtualdevice_set_number':
                                if(args.number!==undefined && args.number!=='undefined') val = args.number;                                
                                else val = null;
                                break;
                            case 'virtualdevice_set_boolean':
                                if(args.boolean!==undefined && args.boolean!=='undefined') val = args.boolean;
                                else val = null;
                                break;
                            case 'virtualdevice_set_button':
                                if(args.boolean!==undefined && args.boolean!=='undefined') val = args.boolean;
                                else val = null;
                                break;
                            case 'virtualdevice_set_status':
                            case 'virtualdevice_set_status_optionalnumber':
                                if(args.text!==undefined && args.text!=='undefined') {
                                    var opt = args.device.getCapabilityOptions(cap);
					                if (!opt) opt = {};
                                    opt.units = args.text;
                                    args.device.setCapabilityOptions(cap, opt);
                                }
                                if(args.number!==undefined && args.number!=='undefined') val = args.number;
                                else if(action=="virtualdevice_set_status_optionalnumber") val = null;
                                break;
                        }

                        if(args.device.hasCapability(cap)) await args.device.setCapabilityValue(cap, val);
                        await args.device.setStoreValue(fieldId+"Value", val);
                        return true;
					} catch (error) {
                        throw new Error(error.message.replace(cap.split('.')[0]+' ', ''));
					}
				}).bind(this));
                if(action.endsWith('_text') || action.endsWith('_number') || action.endsWith('_boolean') || action.endsWith('_button')) 
                    set_value.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
                
		}).bind(this));

        var virtualdevice_set_expression = this.homey.flow.getActionCard('virtualdevice_set_expression');
        virtualdevice_set_expression.registerRunListener(async (args, state) => {
            let fieldId = args.field.id;
            let type = args.field.type;
            let cap = args.field && args.field.id.indexOf('.')>-1 ? args.field.id : args.device.getStoreValue(fieldId);
            if(fieldId && fieldId.indexOf('.')>-1) fieldId = fieldId.split('.')[1];
            cap = args.device.getStoreValue(fieldId) || cap;

            try {
                    if(args.expression!==undefined && args.expression!=='undefined') {
                        let result = this.runSandBox(args.expression);
                        await args.device.setCapabilityValue(cap, result);
                        await args.device.setStoreValue(fieldId+"Value", result);
                    }
                    else {
                        await args.device.setCapabilityValue(cap, null);
                        await args.device.setStoreValue(fieldId+"Value", null);
                    }
                    return true;                    
            } catch (error) {
                //this.log('action_virtualdevice_set_name:');
                //this.error(error);
                throw new Error(error.message.replace(cap.split('.')[0]+' ', ''));
            }
        });
        virtualdevice_set_expression.getArgument('field').registerAutocompleteListener(this.registerAutocompleteFieldExpression());

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

        var trigger_virtualdevice_number = ['trigger_virtualdevice_number'];
        trigger_virtualdevice_number.forEach((action => {
			var number = this.homey.flow.getDeviceTriggerCard(action);
            this.trigger_virtualdevice_number = number;
			number.registerRunListener(async (args, state) => {
                    try {
					    return args.field.id==state.field.id;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				});
            number.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
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
		
            
            this.homey.settings.on('set', (function(settingName) {
                if(settingName=='javascript_functions') {
                  this.setFunctions();
                }
          
              }).bind(this));
              
              this.setFunctions();
          }
          async setFunctions() {			  	  
            this.functions = await this.homey.settings.get('javascript_functions');
            //this.log('this.functions', typeof(this.functions), this.functions);
            this.context = {
              _:_
            };
            if(this.functions && this.functions.length>0) for (let i = 0; i < this.functions.length; i++) {
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
    

    runSandBox(code) {
        var context = this.context;
        //this.log('this.context', this.context);
        //try {
          return sandbox(code, context);
        //} catch (error) {
          
        //} 
      }

    registerAutocompleteField(action) {
        return async( query, args ) => {
            var ret = [];
            var actiontype = action.split('_')[2];
            for(var i=1;i<=NUMBEROFFIELDS;i++){
                let cap = args.device.getStoreValue(actiontype + i);
                if(cap) {
                    var typeText = actiontype=='text' ? 'Text ' +i : actiontype=='number' ? 'Number ' +i : actiontype=='boolean' ? 'Yes/No ' +i : actiontype=='button' ? 'Button ' +i : 'unknown';
                    ret.push({'id':actiontype + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                }
            }
          return ret;
        };
    }
    registerAutocompleteFieldExpression() {
        return async( query, args ) => {
            let settings = args.device.getSettings();
            let ret = [];
            let caps = args.device.getCapabilities();
            let types = ['status', 'text', 'number', 'boolean', 'button'];
            for (let k = 0; k < types.length; k++) {
                const actiontype = types[k];
                for(let i=1;i<=NUMBEROFFIELDS;i++){
                    let cap = args.device.getStoreValue(actiontype + i);
                    if(cap) {
                        var typeText = actiontype=='text' ? 'Tekst ' + i : actiontype=='number' ? 'Number ' + i : actiontype=='boolean' ? 'Yes/No ' + i : actiontype=='button' ? 'Button ' + i : actiontype=='status' ? 'Status' : 'unknown';
                        ret.push({'id':actiontype + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                    }
                    
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
    async triggerFlowNumber(device, value, state) {
        this.trigger_virtualdevice_number.trigger(device, {value:value===null?-1:value} , state);
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
            return [
                {
                    title:'Alarms',
                    icons:[   
                        'alarm_smoke', 
                        'alarm_water',
                        ]
                },
                {
                    title:'Devices',
                    icons:[   
                        'battery',
                        'circle',
                        'device_capabilities', 
                        'game',  
                        'onoff',
                        'settings',
                        'tv',
                        'virtual_device',
                        ]
                },
                {
                    title:'Gauges & Meters',
                    icons:[   
                        'measure_noise', 
                        'measure_pressure',
                        'meter_gas', 
                        'meter_power',
                        'sensor'
                        ]
                },
                {
                title:'Media',
                icons:[
                    'music',
                    'speaker_next',
                    'speaker_play',
                    'speaker_prev',
                    'volume_down',
                    'volume_mute',
                    'volume_up'
                    ]
                },                
                {
                    title:'Buttons',
                    icons:[
                        'button',
                        'devices',
                        'energy',
                        'insights',
                        'home',
                        'homeyscript',
                        'search',
                        'ternary',
                        'toggle'
                    ]
                },                
                {
                    title:'Flows',
                    icons:[
                        'advanced-flow',
                        'flow-bold',
                        'logic',
                        'tag'
                    ]
                },
                {
                    title:'Other',
                    icons:[   
                        'measure_clouds',
                        'measure_humidity',
                        'measure_luminance',
                        'measure_power',
                        'measure_rain',
                        'measure_temperature',
                        'measure_wind_angle',
                        'measure_wind_strength',
                        'heart-outline',
                        'bell',
                        'moon-round'
                        ]
                },
                {
                    title:'Custom',
                    icons:[
                        '../../userdata/customicons/custom_1',
                        '../../userdata/customicons/custom_2',
                        '../../userdata/customicons/custom_3',
                        '../../userdata/customicons/custom_4',
                        '../../userdata/customicons/custom_5',
                        '../../userdata/customicons/custom_6',
                        '../../userdata/customicons/custom_7',
                        '../../userdata/customicons/custom_8',
                        '../../userdata/customicons/custom_9',
                        '../../userdata/customicons/custom_10',
                        '../../userdata/customicons/custom_11',
                        '../../userdata/customicons/custom_12',
                        '../../userdata/customicons/custom_13',
                        '../../userdata/customicons/custom_14',
                        '../../userdata/customicons/custom_15',
                        '../../userdata/customicons/custom_16',
                        '../../userdata/customicons/custom_17',
                        '../../userdata/customicons/custom_18',
                        '../../userdata/customicons/custom_19',
                        '../../userdata/customicons/custom_20',
                        '../../userdata/customicons/custom_21',
                        '../../userdata/customicons/custom_22',
                        '../../userdata/customicons/custom_23',
                        '../../userdata/customicons/custom_24',
                        '../../userdata/customicons/custom_25',
                        '../../userdata/customicons/custom_26',
                        '../../userdata/customicons/custom_27',
                        '../../userdata/customicons/custom_28',
                        '../../userdata/customicons/custom_29',
                        '../../userdata/customicons/custom_30',
                        '../../userdata/customicons/custom_31',
                        '../../userdata/customicons/custom_32',
                        '../../userdata/customicons/custom_33',
                        '../../userdata/customicons/custom_34',
                        '../../userdata/customicons/custom_35',
                        '../../userdata/customicons/custom_36',
                        '../../userdata/customicons/custom_37',
                        '../../userdata/customicons/custom_38',
                        '../../userdata/customicons/custom_39',
                        '../../userdata/customicons/custom_40'
                    ]
                }

            ];

        //     return ['alarm_smoke', 
        //     'alarm_water',
        //     'battery', 
        //     'circle',
        //     'game',
        //     'device_capabilities',
        //     'measure_clouds',
        //     'measure_humidity',
        //     'measure_luminance',
        //     'measure_noise', 
        //     'measure_power',
        //     'measure_pressure',
        //     'measure_rain',
        //     'measure_temperature',
        //     'measure_wind_angle',
        //     'measure_wind_strength',
        //     'meter_gas', 
        //     'meter_power', 
        //     'meter_water',
        //     'meter_rain',
        //     'music',
        //     'onoff',
        //     'sensor',
        //     'speaker_next',
        //     'speaker_play',
        //     'speaker_prev',
        //     'tv',
        //     'virtual_device',
        //     'volume_down',
        //     'volume_mute',
        //     'volume_up'
        // ];

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




