"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

const Homey = require('homey');
const Homeyman = require('../../app');

module.exports = class VirtualDeviceDriver extends Homey.Driver {

    async onInit() {
        this.log('VirtualDeviceDriver onInit');

        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean'];//, 'set_capability_zone_anders'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
					try {
						if (!args || !args.device || !args.field) return false;
                        switch (action) {
                            case 'virtualdevice_set_text':
                                if(args.text!==undefined && args.text!=='undefined') args.device.setCapabilityValue("devicecapatilies_text." + args.field.id, args.text);
                                return true;
                            case 'virtualdevice_set_number':
                                if(args.number!==undefined && args.number!=='undefined') args.device.setCapabilityValue("measure_devicecapatilies_number." + args.field.id, args.number);
                                return true;
                            case 'virtualdevice_set_boolean':
                                if(args.boolean!==undefined && args.boolean!=='undefined') args.device.setCapabilityValue("alarm_devicecapatilies_boolean." + args.field.id, args.boolean);
                                return true;
                        }
                        return null;
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				}).bind(this));
            set_value.getArgument('field')
            .registerAutocompleteListener(( query, args ) => {
                var ret = [];
                switch (action) {
                    case 'virtualdevice_set_text':
                        for(var i=1;i<=10;i++)if(args.device.hasCapability('devicecapatilies_text.text'+i)) ret.push({'id':'text'+i, 'name':'Text '+i});
                        break;
                    case 'virtualdevice_set_number':
                        for(var i=1;i<=10;i++)if(args.device.hasCapability('measure_devicecapatilies_number.number'+i)) ret.push({'id':'number'+i, 'name':'Number '+i});
                        break;
                    case 'virtualdevice_set_boolean':
                        for(var i=1;i<=10;i++)if(args.device.hasCapability('alarm_devicecapatilies_boolean.boolean'+i)) ret.push({'id':'boolean'+i, 'name':'Yes/No '+i});
                        break;
                                
                }
                
              return Promise.resolve(ret);
            });
		}).bind(this));

       
    }
    // This method is called when a user is adding a device
    // and the 'list_devices' view is called
      async onPairListDevices( ) {
        var count =Object.keys(Homeyman.Current.VirtualDevices).length;
        var id = count>0 ?'_' + (count + 1) : '';
        return [
              {
                  name: 'DeviceCapability device'+id,
                  data: {
                      id: 'DeviceCapabilityDevice'+id
                  }
              }
          ];
      }  
  }
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




