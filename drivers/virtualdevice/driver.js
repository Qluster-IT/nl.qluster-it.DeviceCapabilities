"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

const Homey = require('homey');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');


module.exports = class VirtualDeviceDriver extends Homey.Driver {

    async onInit() {
        this.log('VirtualDeviceDriver onInit');

        // var manifest = Homeyman.Current.manifest;
		// manifest.capabilities.measure_devicecapabilities_number.units = 'TE';
    
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_status'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
					try {
						if (!args || !args.device) return false;
                        let cap = args.device.getStoreValue(args.field.id);
                        switch (action) {
                            case 'virtualdevice_set_text':
                                if(args.text!==undefined && args.text!=='undefined') args.device.setCapabilityValue(cap, args.text);
                                return true;
                            case 'virtualdevice_set_number':
                                if(args.number!==undefined && args.number!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.number);                                   
                                }
                                return true;
                            case 'virtualdevice_set_boolean':
                                if(args.boolean!==undefined && args.boolean!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.boolean);                                    
                                }                                
                                return true;
                            case 'virtualdevice_set_status':
                                if(args.text!==undefined && args.text!=='undefined') {
                                    var opt = args.device.getCapabilityOptions(cap);
					                if (!opt) opt = {};
                                    opt.units = args.text;
                                    args.device.setCapabilityOptions(cap, opt);
                                }
                                if(args.number!==undefined && args.number!=='undefined') args.device.setCapabilityValue(cap, args.number);
                                
                                return true;
                        }
                        return null;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				}).bind(this));
            if(action.endsWith('_text') || action.endsWith('_number') || action.endsWith('_boolean')) set_value.getArgument('field')
            .registerAutocompleteListener(async( query, args ) => {
                var ret = [];
                //var title = await args.device.getCapabilityOptions('devicecapabilities_text.text'+i).title;
                switch (action) {
                    case 'virtualdevice_set_text':
                        for(var i=1;i<=10;i++)if(args.device.hasCapability('devicecapabilities_text.text'+i)) ret.push({'id':'text'+i, 'name':args.device.getCapabilityOptions('devicecapabilities_text.text'+i).title || ('Text ' + i), description:('Text ' + i)});
                        break;
                    case 'virtualdevice_set_number':
                        for(var i=1;i<=10;i++)if(args.device.hasCapability('measure_devicecapabilities_number.number'+i)) ret.push({'id':'number'+i, 'name':args.device.getCapabilityOptions('measure_devicecapabilities_number.number'+i).title || ('Number ' + i), description:('Number ' + i)});
                        break;
                    case 'virtualdevice_set_boolean':
                        for(var i=1;i<=10;i++){
                            if(args.device.hasCapability('alarm_devicecapabilities_boolean.boolean'+i)) ret.push({'id':'boolean'+i, 'name':args.device.getCapabilityOptions('alarm_devicecapabilities_boolean.boolean'+i).title || ('Yes/No ' + i), description:('Yes/No ' + i)});
                            else if(args.device.hasCapability('devicecapabilities_boolean.boolean'+i)) ret.push({'id':'boolean'+i, 'name':args.device.getCapabilityOptions('devicecapabilities_boolean.boolean'+i).title || ('Yes/No ' + i), description:('Yes/No ' + i)});
                        }
                        break;
                    // case 'virtualdevice_set_status':
                    //     for(var i=1;i<=10;i++)if(args.device.hasCapability('measure_devicecapabilities_status.status'+i)) ret.push({'id':'status'+i, 'name':'Status '+i});
                    //     break;
                                
                }
                
              return ret;
            });
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
            button.getArgument('field').registerAutocompleteListener(( query, args ) => {
                var ret =[];
                for(var i=1;i<=10;i++)
                {
                    var cap = 'button.button'+i;
                    if(i===1) {
                        if(args.device.hasCapability('button')) cap = 'button';
                        else if(args.device.hasCapability('onoff')) cap = 'onoff';
                    } else {
                        if(args.device.hasCapability('button.button'+i)) cap = 'button.button'+i;
                        else if(args.device.hasCapability('onoff.button'+i)) cap = 'onoff.button'+i;
                    }
                    if(args.device.hasCapability(cap)) ret.push({'id':'button'+i, 'name':args.device.getCapabilityOptions(cap).title, description:('Button ' + i)});
                }
                return Promise.resolve(ret);
            });
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

    async triggerButton(device, value, state) {
        this.trigger_virtualdevice_button.trigger(device, {value:value===null?true:value} , state);
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
        var id = '_'+(index+1).toString();//count>0 ?'_' + (count + 1) : '';
        return [
              {
                  name: 'DeviceCapability VD '+id,
                  data: {
                      id: 'DeviceCapabilityVirtualDevice'+id
                  }
              }
          ];
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




