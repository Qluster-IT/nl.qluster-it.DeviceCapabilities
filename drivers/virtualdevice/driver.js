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
    
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_button', 'virtualdevice_set_status'];
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
                                cap = cap || (i===1 ? 'button' : 'button'+i);
                                if(args.boolean!==undefined && args.boolean!=='undefined') {
                                    if(args.device.hasCapability(cap)) args.device.setCapabilityValue(cap, args.boolean);                                    
                                }
                                else args.device.setCapabilityValue(cap, null);
                                return true;
                            case 'virtualdevice_set_status':
                                cap = cap || 'measure_devicecapabilities_status.status1';
                                if(args.text!==undefined && args.text!=='undefined') {
                                    var opt = args.device.getCapabilityOptions(cap);
					                if (!opt) opt = {};
                                    opt.units = args.text;
                                    args.device.setCapabilityOptions(cap, opt);
                                }
                                if(args.number!==undefined && args.number!=='undefined') args.device.setCapabilityValue(cap, args.number); 
                                else args.device.setCapabilityValue(cap, null);
                                
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
                var actiontype = action.split('_')[2];
                var typeText = action=='text' ? 'Text' : action=='number' ? 'Number' : action=='boolean' ? 'Yes/No' : 'unknown';
                var caps = args.device.getCapabilities();
                for(var i=1;i<=10;i++){
                    var cap = undefined;
                    if((cap =_.find(caps, c=> c.endsWith('.'+actiontype+i)))) ret.push({'id':actiontype+i, 'name':args.device.getCapabilityOptions(cap).title || (actiontype+' ' + i), description:(actiontype+' ' + i)});
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

    async triggerFlow(device, value, state) {
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
                  //,icon : '/../../../userdata/icon-bak.svg'
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
            //return icons;
            return;
        });

        session.setHandler('done', async (data) => {
            device = devices[0];
            device.icon = '/icon-default.svg';
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




