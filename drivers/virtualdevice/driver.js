"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');
const {gzip, ungzip } = require('node-gzip');

//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');
//const zlib = require('zlip');

const Homey = require('homey');
const path = require('path');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');
const { Defer } = require('../../lib/proto');
const TYPES = ['status', 'text', 'number', 'button', 'boolean'];
const CUSTOM_ICONS = [
    'custom_1',  'custom_2',  'custom_3',
    'custom_4',  'custom_5',  'custom_6',  'custom_7',
    'custom_8',  'custom_9',  'custom_10', 'custom_11',
    'custom_12', 'custom_13', 'custom_14', 'custom_15',
    'custom_16', 'custom_17', 'custom_18', 'custom_19',
    'custom_20', 'custom_21', 'custom_22', 'custom_23',
    'custom_24', 'custom_25', 'custom_26', 'custom_27',
    'custom_28', 'custom_29', 'custom_30', 'custom_31',
    'custom_32', 'custom_33', 'custom_34', 'custom_35',
    'custom_36', 'custom_37', 'custom_38', 'custom_39',
    'custom_40', 'custom_41', 'custom_42', 'custom_43',
    'custom_44', 'custom_45', 'custom_46', 'custom_47',
    'custom_48', 'custom_49', 'custom_50', 'custom_51',
    'custom_52', 'custom_53', 'custom_54', 'custom_55',
    'custom_56', 'custom_57', 'custom_58', 'custom_59',
    'custom_60',
    'custom_61', 'custom_62', 'custom_63',
    'custom_64', 'custom_65', 'custom_66', 'custom_67',
    'custom_68', 'custom_69', 'custom_70', 'custom_71',
    'custom_72', 'custom_73', 'custom_74', 'custom_75',
    'custom_76', 'custom_77', 'custom_78', 'custom_79',
    'custom_80'
  ];


let allDevices,  allDrivers, actionCards, conditionCards, triggerCards, allUsers, allVariables, allTokens, allPrivateKeys;

module.exports = class VirtualDeviceDriver extends Homey.Driver {

    
    async onInit() {
        this.log('VirtualDeviceDriver onInit');
        this.on("virtualdevicesettings_updateFlowCommand", (obj)=> {
            this.log('virtualdevicesettings_updateFlowCommand');
        });
        //return null;

		this.log("Capabilities", Object.keys(this.homey.app.manifest.capabilities).length);

        //true || 
        if(process.env.DEBUG === '1' || this.getVersionChanged(this.homey.settings.get('Version') || "0.0.0")) {
            //if(await this.homey.app.fileExists('./assets/icons/bell.svg')) console.log('bell!!');					
            let categories = (await this.getCustomIcons()).icons;
			for(let i=0;i<categories.length;i++)
			{
				for(let j=0;j<categories[i].icons.length;j++){
                    if(categories[i].icons[j].defaultIcon=='') continue;
					let filePathAssets = './assets/icons/';
                    let file = categories[i].icons[j].defaultIcon + '.svg';
                    
                    let filePath = './userdata/customicons/';
					let iconName = categories[i].icons[j].file + '.svg';

                    if(await this.homey.app.fileExists(filePathAssets + file) && !await this.homey.app.fileExists(filePath + iconName)){
                        await this.homey.app.copyFile(filePathAssets + file, filePath + iconName , filePath);
                    }
				}
			}
            

            await this.homey.settings.set('Version', this.homey.app.manifest.version);
        } else {
            try {             
                this.defaultIcons =  await this.homey.settings.get('DefaultIcons');
            } catch (error) {
                
            }
        }

        if(!this.defaultIcons) {
            this.defaultIcons = {};
            var _path = './assets/icons/';
            let filesandfolders = await this.homey.app.readdir(_path);
            
            let f = (dir, file)=> {
                if(!this.defaultIcons[dir]) this.defaultIcons[dir] = {title:dir, icons:[]};
                this.defaultIcons[dir].icons.push(file);
                    
            };

            for (let i = 0; i < filesandfolders.length; i++) {
                const faf = filesandfolders[i];
                let stats = await this.homey.app.fsstat(path.join(_path,faf));
                if(stats.isDirectory()) {
                    let files = await this.homey.app.readdir(path.join(_path,faf));
                    for (let j = 0; j < files.length; j++) {
                        const file = files[j];
                        let stats = await this.homey.app.fsstat(path.join(_path,faf, file));
                        if(stats.isFile() ) f(faf, path.join(faf, file));
                    }

                } else if(stats.isFile()) f('Unsorted', faf); //isFile!                
            }
            await this.homey.settings.set('DefaultIcons', this.defaultIcons);
        }
        

        
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_button', 'virtualdevice_set_status', 'virtualdevice_set_status_optionalnumber'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
                    if (!args || !args.device) return false;
                    let fieldId = args.field? args.field.id : 'status1';
                    let cap = args.device.getStoreValue(fieldId);
                    if(!cap) throw new Error(this.homey.__("field-not-set", {fieldId}) || (fieldId + '__fieldId__ has not been set. Goto Device Settings and add the field.'));
                    let dontUpdateField = false;
                    try {
                        let value;
                        let triggerCard;
                        switch (action) {
                            case 'virtualdevice_set_text':
                                if(args.text!==undefined && args.text!=='undefined') value = args.text;
                                else value = null;
                                triggerCard = this.triggerFlowText;
                                break;
                            case 'virtualdevice_set_number':
                                if(args.number!==undefined && args.number!=='undefined') value = args.number;                                
                                else value = null;
                                triggerCard = this.triggerFlowNumber;
                                break;
                            case 'virtualdevice_set_boolean':
                                if(args.boolean!==undefined && args.boolean!=='undefined') value = args.boolean;
                                else value = null;
                                triggerCard = this.triggerFlowBoolean;
                                break;
                            case 'virtualdevice_set_button':
                                if(args.boolean!==undefined && args.boolean!=='undefined') value = args.boolean;
                                else value = null;
                                triggerCard = this.triggerFlowButton;
                                break;
                            case 'virtualdevice_set_status':
                            case 'virtualdevice_set_status_optionalnumber':
                                if(args.text!==undefined && args.text!=='undefined') {
                                    var opt = args.device.getCapabilityOptions(cap);
					                if (!opt) opt = {};
                                    if(opt.units!=args.text) {
                                        //await args.device.setUnavailable('Updating');
                                        opt.units = args.text;
                                        await args.device.setCapabilityOptions(cap, opt);
                                        //await args.device.setAvailable();
                                    }
                                    await this.setSecondCapability({ device:args.device , fieldId, units:args.text});
                                    
                                }
                                if(args.number!==undefined && args.number!=='undefined') value = args.number;
                                else if(action=="virtualdevice_set_status_optionalnumber") value = null;
                                else dontUpdateField = true;
                                if(args.refreshmobilebug===true) {
                                    await args.device.setUnavailable('Updating');
                                    await args.device.setAvailable();
                                }
                                break;
                        }

                        if(args.device.hasCapability(cap) && !dontUpdateField) {
                            await this.setSecondCapability({ val: value, device:args.device , fieldId});
                            await args.device.setCapabilityValue(cap, value);
							// //Remove logs here
							// let a = await this.homey.insights.getLogs();
							// let b = a;
							// //await this.homey.insights.deleteLog({id:secondCap});
						}
                        if(args.mode==="executewhencards" && triggerCard) {
                            let oldValue = args.device.getStoreValue(fieldId+"Value");
                            triggerCard.call(this,args.device, value, { field: { id: fieldId }, changed:value!==oldValue });
                        }
                        await args.device.setStoreValue(fieldId+"Value", value);
                        return true;
					} catch (error) {
                        throw new Error(error.message.replaceAll(cap.split('.')[0]+' ', ''));
					}
				}).bind(this));
                if(action.endsWith('_text') || action.endsWith('_number') || action.endsWith('_boolean') || action.endsWith('_button')) 
                    set_value.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
                
		}).bind(this));

        var virtualdevice_set_expression = this.homey.flow.getActionCard('virtualdevice_set_expression');
        virtualdevice_set_expression.registerRunListener(async (args, state) => {
            let fieldId = args.field.id;
            let cap = args.field && args.field.id.indexOf('.')>-1 ? args.field.id : args.device.getStoreValue(fieldId);
            if(fieldId && fieldId.indexOf('.')>-1) fieldId = fieldId.split('.')[1];
            cap = args.device.getStoreValue(fieldId) || cap;
            let type = this.getTypeFromField(fieldId);
            //let  energy = args.device.getEnergy();
            try {
                let oldValue = args.device.getStoreValue(fieldId+"Value");
                let value = null;
                        
                if(args.expression!==undefined && args.expression!=='undefined') {
                    value = this.homey.app.runSandBox(args.expression);                
                }
                await this.setSecondCapability({ val:value, device:args.device , fieldId});
                    await args.device.setCapabilityValue(cap, value);
                    await args.device.setStoreValue(fieldId+"Value", value);
                if(args.mode==="executewhencards") {
                    if(this['triggerFlow'+this.capitalizeFirstLetter(type)]) this['triggerFlow'+this.capitalizeFirstLetter(type)].call(this,args.device, value, { field: { id: fieldId }, changed:value!==oldValue });
                }
                return true;                    
            } catch (error) {
                //this.log('action_virtualdevice_set_name:');
                //this.error(error);
                throw new Error(error.message.replaceAll(cap.split('.')[0]+' ', ''));
            }
        });
        virtualdevice_set_expression.getArgument('field').registerAutocompleteListener(this.registerAutocompleteFieldExpression());

        let button = ['trigger_virtualdevice_button', 'trigger_virtualdevice_boolean', 'trigger_virtualdevice_number', 'trigger_virtualdevice_text'];
        button.forEach((action => {
			var button = this.homey.flow.getDeviceTriggerCard(action);
            this[action]= button;
			button
				.registerRunListener(async (args, state) => {
                    try {
					    return args.field.id==state.field.id && (args.mode!="changed" || state.changed);
					} catch (error) {
						this.log('set_value:');
						this.log(error);
					}
				});
            button.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action));
		}).bind(this));

        
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
		
            this.homey.settings.on('set', (async function(settingName) {
                if(settingName=='customIconNames') {
                    this.customIconNames = await this.homey.settings.get('customIconNames');
                  }                
          
              }).bind(this));
              this.customIconNames = await this.homey.settings.get('customIconNames');
              
            
            //this.log('Driver size: ', this.homey.app.roughSizeOfObject(this));
    }

    getTypeFromField(fieldId) {
       return fieldId.startsWith('text') ? 'text' : 
            fieldId.startsWith('number') ? 'number' : 
            fieldId.startsWith('boolean') ? 'boolean' : 
            fieldId.startsWith('button') ? 'button' : 
            fieldId.startsWith('status') ? 'status' : 'unknown';
    }
    async setSecondCapability({fieldId, device, val, units}={}) {
        var type = fieldId.startsWith('text') ? 'Text' : 
            fieldId.startsWith('number') ? 'Number' : 
            fieldId.startsWith('boolean') ? 'Boolean' : 
            fieldId.startsWith('button') ? 'Button' : 
            fieldId.startsWith('status') ? 'measure_Status' : 'unknown';
        let cap = type+"."+fieldId;
        if(device.hasCapability(cap)) {
            if(units) {
                var opt = device.getCapabilityOptions(cap);
                if (!opt) opt = {};
                if(opt.units!=units) {
                    opt.units = units;
                    await device.setCapabilityOptions(cap, opt);
                }
            } else return await device.setCapabilityValue(cap, val);
        }
    }

    async getCustomIcons(){
        let r=[            
            {
                title:'Devices',
                icons:[
                    {name:"device_1", file:'custom_1', defaultIcon:'Devices/device_capabilities', title:{en:"Device 1", nl:"Apparaat 1", de:""}},
                    {name:"device_2", file:'custom_2', defaultIcon:'Devices/virtual_device', title:{en:"Device 2", nl:"Apparaat 2", de:""}},
                    {name:"device_3", file:'custom_3', defaultIcon:'Devices/circle', title:{en:"Device 3", nl:"Apparaat 3", de:""}},
                    {name:"device_4", file:'custom_4', defaultIcon:'Devices/curtain-half', title:{en:"Device 4", nl:"Apparaat 4", de:""}},
                    {name:"device_5", file:'custom_5', defaultIcon:'Devices/game', title:{en:"Device 5", nl:"Apparaat 5", de:""}},
                    {name:"device_6", file:'custom_6', defaultIcon:'Devices/onoff', title:{en:"Device 6", nl:"Apparaat 6", de:""}},
                    {name:"device_7", file:'custom_7', defaultIcon:'Devices/settings', title:{en:"Device 7", nl:"Apparaat 7", de:""}},
                    {name:"device_8", file:'custom_8', defaultIcon:'Devices/tv', title:{en:"Device 8", nl:"Apparaat 8", de:""}},
                    {name:"device_9", file:'custom_9', defaultIcon:'Buttons/button', title:{en:"Device 9", nl:"Apparaat 9", de:""}},
                    {name:"device_10", file:'custom_10', defaultIcon:'Buttons/devices', title:{en:"Device 10", nl:"Apparaat 10", de:""}},
                    {name:"device_11", file:'custom_11', defaultIcon:'Buttons/energy', title:{en:"Device 11", nl:"Apparaat 11", de:""}},
                    {name:"device_12", file:'custom_12', defaultIcon:'Buttons/insights', title:{en:"Device 12", nl:"Apparaat 12", de:""}},
                    {name:"device_13", file:'custom_13', defaultIcon:'Buttons/home', title:{en:"Device 13", nl:"Apparaat 13", de:""}},
                    {name:"device_14", file:'custom_14', defaultIcon:'Buttons/homeyscript', title:{en:"Device 14", nl:"Apparaat 14", de:""}},
                    {name:"device_15", file:'custom_15', defaultIcon:'Buttons/search', title:{en:"Device 15", nl:"Apparaat 15", de:""}},
                    {name:"device_16", file:'custom_16', defaultIcon:'Buttons/ternary', title:{en:"Device 16", nl:"Apparaat 16", de:""}},
                    {name:"device_17", file:'custom_17', defaultIcon:'Buttons/toggle', title:{en:"Device 17", nl:"Apparaat 17", de:""}},
                    {name:"device_18", file:'custom_18', defaultIcon:'Flows/advanced-flow', title:{en:"Device 18", nl:"Apparaat 18", de:""}},
                    {name:"device_19", file:'custom_19', defaultIcon:'Flows/flow-bold', title:{en:"Device 19", nl:"Apparaat 19", de:""}},
                    {name:"device_20", file:'custom_20', defaultIcon:'Flows/logic', title:{en:"Device 20", nl:"Apparaat 20", de:""}}
                ]
            },
            {
                title:'Capabilities', 
                icons:[
                    {name:"capabilities_1", file:'custom_21', defaultIcon:'Other/measure_clouds', title:{en:"Fields 1", nl:"Velden 1", de:""}},
                    {name:"capabilities_2", file:'custom_22', defaultIcon:'Other/measure_humidity', title:{en:"Fields 2", nl:"Velden 2", de:""}},
                    {name:"capabilities_3", file:'custom_23', defaultIcon:'Other/measure_luminance', title:{en:"Fields 3", nl:"Velden 3", de:""}},
                    {name:"capabilities_4", file:'custom_24', defaultIcon:'Other/measure_power', title:{en:"Fields 4", nl:"Velden 4", de:""}},
                    {name:"capabilities_5", file:'custom_25', defaultIcon:'Other/measure_rain', title:{en:"Fields 5", nl:"Velden 5", de:""}},
                    {name:"capabilities_6", file:'custom_26', defaultIcon:'Other/measure_temperature', title:{en:"Fields 6", nl:"Velden 6", de:""}},
                    {name:"capabilities_7", file:'custom_27', defaultIcon:'Other/measure_wind_angle', title:{en:"Fields 7", nl:"Velden 7", de:""}},
                    {name:"capabilities_8", file:'custom_28', defaultIcon:'Other/measure_wind_strength', title:{en:"Fields 8", nl:"Velden 8", de:""}},
                    {name:"capabilities_9", file:'custom_29', defaultIcon:'Other/heart-outline', title:{en:"Fields 9", nl:"Velden 9", de:""}},
                    {name:"capabilities_10", file:'custom_30', defaultIcon:'Other/bell', title:{en:"Fields 10", nl:"Velden 10", de:""}},
                    {name:"capabilities_11", file:'custom_31', defaultIcon:'Other/moon-round', title:{en:"Fields 11", nl:"Velden 11", de:""}},
                    {name:"capabilities_12", file:'custom_32', defaultIcon:'Gauges_and_meters/measure_noise', title:{en:"Fields 12", nl:"Velden 12", de:""}},
                    {name:"capabilities_13", file:'custom_33', defaultIcon:'Gauges_and_meters/measure_pressure', title:{en:"Fields 13", nl:"Velden 13", de:""}},
                    {name:"capabilities_14", file:'custom_34', defaultIcon:'Gauges_and_meters/meter_gas', title:{en:"Fields 14", nl:"Velden 14", de:""}},
                    {name:"capabilities_15", file:'custom_35', defaultIcon:'Gauges_and_meters/meter_power', title:{en:"Fields 15", nl:"Velden 15", de:""}},
                    {name:"capabilities_16", file:'custom_36', defaultIcon:'Gauges_and_meters/sensor', title:{en:"Fields 16", nl:"Velden 16", de:""}},
                    {name:"capabilities_17", file:'custom_37', defaultIcon:'Alarms/alarm_smoke', title:{en:"Fields 17", nl:"Velden 17", de:""}},
                    {name:"capabilities_18", file:'custom_38', defaultIcon:'Alarms/alarm_water', title:{en:"Fields 18", nl:"Velden 18", de:""}},
                    {name:"capabilities_19", file:'custom_39', defaultIcon:'Devices/battery', title:{en:"Fields 19", nl:"Velden 19", de:""}},
                    {name:"capabilities_20", file:'custom_40', defaultIcon:'Flows/tag', title:{en:"Fields 20", nl:"Velden 20", de:""}},
          
                    {name:"capabilities_21", file:'custom_61', defaultIcon:'Kawa/clock', title:{en:"Fields 21", nl:"Velden 21", de:""}},
                    {name:"capabilities_22", file:'custom_62', defaultIcon:'Kawa/cooking_icon', title:{en:"Fields 22", nl:"Velden 22", de:""}},
                    {name:"capabilities_23", file:'custom_63', defaultIcon:'Kawa/doorbell2', title:{en:"Fields 23", nl:"Velden 23", de:""}},
                    {name:"capabilities_24", file:'custom_64', defaultIcon:'Kawa/fan_big_black', title:{en:"Fields 24", nl:"Velden 24", de:""}},
                    {name:"capabilities_25", file:'custom_65', defaultIcon:'Kawa/fan_icon', title:{en:"Fields 25", nl:"Velden 25", de:""}},
                    {name:"capabilities_26", file:'custom_66', defaultIcon:'Kawa/fireplace_icon', title:{en:"Fields 26", nl:"Velden 26", de:""}},
                    {name:"capabilities_27", file:'custom_67', defaultIcon:'Kawa/ggl_hub', title:{en:"Fields 27", nl:"Velden 27", de:""}},
                    {name:"capabilities_28", file:'custom_68', defaultIcon:'Kawa/homey_fake', title:{en:"Fields 28", nl:"Velden 28", de:""}},
                    {name:"capabilities_29", file:'custom_69', defaultIcon:'Kawa/homey_pro', title:{en:"Fields 29", nl:"Velden 29", de:""}},
                    {name:"capabilities_30", file:'custom_70', defaultIcon:'Kawa/kitchen_icon', title:{en:"Fields 30", nl:"Velden 30", de:""}},
                    {name:"capabilities_31", file:'custom_71', defaultIcon:'Kawa/lamp_desklight_icon', title:{en:"Fields 31", nl:"Velden 31", de:""}},
                    {name:"capabilities_32", file:'custom_72', defaultIcon:'Kawa/light_ceilinglight', title:{en:"Fields 32", nl:"Velden 32", de:""}},
                    {name:"capabilities_33", file:'custom_73', defaultIcon:'Kawa/location-pin-compact-outline', title:{en:"Fields 33", nl:"Velden 33", de:""}},
                    {name:"capabilities_34", file:'custom_74', defaultIcon:'Kawa/lock_fingerprint2', title:{en:"Fields 34", nl:"Velden 34", de:""}},
                    {name:"capabilities_35", file:'custom_75', defaultIcon:'Kawa/microwave', title:{en:"Fields 35", nl:"Velden 35", de:""}},
                    {name:"capabilities_36", file:'custom_76', defaultIcon:'Kawa/relay', title:{en:"Fields 36", nl:"Velden 36", de:""}},
                    {name:"capabilities_37", file:'custom_77', defaultIcon:'Kawa/remote_bluebtn', title:{en:"Fields 37", nl:"Velden 37", de:""}},
                    {name:"capabilities_38", file:'custom_78', defaultIcon:'Kawa/solarpower', title:{en:"Fields 38", nl:"Velden 38", de:""}},
                    {name:"capabilities_39", file:'custom_79', defaultIcon:'Kawa/stove_icon', title:{en:"Fields 39", nl:"Velden 39", de:""}},
                    {name:"capabilities_40", file:'custom_80', defaultIcon:'Kawa/wc_icon', title:{en:"Fields 40", nl:"Velden 40", de:""}}
                ]
            },
            {
                title:'Other',
                icons:[
                    {name:"other_1", file:'custom_41', defaultIcon:'Media/music', title:{en:"Other 1", nl:"Overige 1", de:""}},
                    {name:"other_2", file:'custom_42', defaultIcon:'Media/speaker_next', title:{en:"Other 2", nl:"Overige 2", de:""}},
                    {name:"other_3", file:'custom_43', defaultIcon:'Media/speaker_play', title:{en:"Other 3", nl:"Overige 3", de:""}},
                    {name:"other_4", file:'custom_44', defaultIcon:'Media/speaker_prev', title:{en:"Other 4", nl:"Overige 4", de:""}},
                    {name:"other_5", file:'custom_45', defaultIcon:'Media/volume_down', title:{en:"Other 5", nl:"Overige 5", de:""}},
                    {name:"other_6", file:'custom_46', defaultIcon:'Media/volume_mute', title:{en:"Other 6", nl:"Overige 6", de:""}},
                    {name:"other_7", file:'custom_47', defaultIcon:'Media/volume_up', title:{en:"Other 7", nl:"Overige 7", de:""}},
                    {name:"other_8", file:'custom_48', defaultIcon:'Weather/bewolkt-blk', title:{en:"Other 8", nl:"Overige 8", de:""}},
                    {name:"other_9", file:'custom_49', defaultIcon:'Weather/dampn-blk', title:{en:"Other 9", nl:"Overige 9", de:""}},
                    {name:"other_10", file:'custom_50', defaultIcon:'Weather/hagel-blk', title:{en:"Other 10", nl:"Overige 10", de:""}},
                    {name:"other_11", file:'custom_51', defaultIcon:'Weather/hardewind-blk', title:{en:"Other 11", nl:"Overige 11", de:""}},
                    {name:"other_12", file:'custom_52', defaultIcon:'Weather/regen-blk', title:{en:"Other 12", nl:"Overige 12", de:""}},
                    {name:"other_13", file:'custom_53', defaultIcon:'Weather/storm-blk', title:{en:"Other 13", nl:"Overige 13", de:""}},
                    {name:"other_14", file:'custom_54', defaultIcon:'Kawa/watch', title:{en:"Other 14", nl:"Overige 14", de:""}},
                    {name:"other_15", file:'custom_55', defaultIcon:'Weather/zeerkoud-blk', title:{en:"Other 15", nl:"Overige 15", de:""}},
                    {name:"other_16", file:'custom_56', defaultIcon:'Weather/zeerwarm-blk', title:{en:"Other 16", nl:"Overige 16", de:""}},
                    {name:"other_17", file:'custom_57', defaultIcon:'Weather/zonnigeperioden-blk', title:{en:"Other 17", nl:"Overige 17", de:""}},
                    {name:"other_18", file:'custom_58', defaultIcon:'Weather/zonnign-blk', title:{en:"Other 18", nl:"Overige 18", de:""}},
                    {name:"other_19", file:'custom_59', defaultIcon:'Kawa/bathroom_icon', title:{en:"Other 19", nl:"Overige 19", de:""}},
                    {name:"other_20", file:'custom_60', defaultIcon:'Kawa/human', title:{en:"Other 20", nl:"Overige 20", de:""}}
                ]
            }
          ];

        let id=1;
        for(let i=0;i<r.length;i++)
        {
            for(let j=0;j<r[i].icons.length;j++){
                r[i].icons[j].id = id++;
                r[i].icons[j].subid = j+1;
                r[i].icons[j].customname = this.customIconNames ? this.customIconNames[r[i].icons[j].file] : undefined;
            }
        }
        return {icons:r, iconnames:this.customIconNames, languagecode:await this.homey.i18n.getLanguage()};

      }

      getDefaultIcons() {
        return this.defaultIcons;        
      }

    getVersionChanged(versionUpdatedTo) {
        if(this.homey.app.manifest.version!=versionUpdatedTo) {
			let versionArr = this.homey.app.manifest.version.split(".");
			let versionUpdatedToArr = versionUpdatedTo.split(".");
			return (
				parseInt(versionArr[0])> parseInt(versionUpdatedToArr[0]) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])> parseInt(versionUpdatedToArr[1])) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])=== parseInt(versionUpdatedToArr[1]) && parseInt(versionArr[2])> parseInt(versionUpdatedToArr[1]))
				);
		}
        return false;
    }



    registerAutocompleteField(action) {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;
            var ret = [];
            var type = action.split('_')[2];            
            const fieldCount = type=="status" ? 1 : (settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
            for(var i=1;i<=fieldCount;i++){
                let cap = args.device.getStoreValue(type + i);
                if(cap) {
                    var typeText = type=='text' ? 'Text ' +i : type=='number' ? 'Number ' +i : type=='boolean' ? 'Yes/No ' +i : type=='button' ? 'Button ' +i : 'unknown';
                    ret.push({'id':type + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                }
            }
          return ret;
        };
    }
    registerAutocompleteFieldExpression() {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;
            let ret = [];
            let caps = args.device.getCapabilities();
            let types = ['status', 'text', 'number', 'boolean', 'button'];
            for (let k = 0; k < types.length; k++) {
                const type = types[k];
                const fieldCount = type=="status" ? 1 : (settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
                for(let i=1;i<=fieldCount;i++){
                    let cap = args.device.getStoreValue(type + i);
                    if(cap) {
                        var typeText = type=='text' ? 'Tekst ' + i : type=='number' ? 'Number ' + i : type=='boolean' ? 'Yes/No ' + i : type=='button' ? 'Button ' + i : type=='status' ? 'Status' : 'unknown';
                        ret.push({'id':type + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                    }
                    
                }
            }
            
          return ret;
        };
    }

    async triggerFlowButton(device, value, state) {
        try {
            
            this.trigger_virtualdevice_button.trigger(device, {value:value===null?true:value} , state);
        } catch (error) {
            this.error(error);
        }
        //return await this.trigger_virtualdevice_button.trigger(device, {value:value===null?true:value} , state);
    }
    async triggerFlowBoolean(device, value, state) {
        return await this.trigger_virtualdevice_boolean.trigger(device, {value:value===null?true:value} , state);
    }
    async triggerFlowNumber(device, value, state) {
        return await this.trigger_virtualdevice_number.trigger(device, {value:value===null?-1:value} , state);
    }
    async triggerFlowText(device, value, state) {
        return await this.trigger_virtualdevice_text.trigger(device, {value:value===null?'':value} , state);
    }
    // This method is called when a user is adding a device
    // and the 'list_devices' view is called
      async onPairListDevices( ) {
        var index = 0;
        var devices = this.homey.drivers.getDriver('virtualdevice').getDevices();
        //var count = Object.keys(devices).length;
        for (const key in devices) {
            if (Object.hasOwnProperty.call(devices, key)) {
                const element = devices[key];
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
                  name: 'Advanced Virtual Device '+(index+1),
                  data: {
                      id: 'DeviceCapabilityVirtualDevice'+id
                  }
              }
          ];
      }

      async onRepair(session, device) {
        //let allDevices,  allDrivers, actionCards, conditionCards, triggerCards, allUsers, allVariables, allTokens;
        

        // var s = session;
        // await session.nextView();
        //console.log(JSON.stringify(await this.getCustomIcons()));
        ///let data = device.getData();

        session.setHandler('virtualdevicesettings_load', async (data) => {
            // // emit when devices are still being searched
            // session.emit('list_devices', devices);
      
            // return devices when searching is done
            
            return {settings:device.Settings, customicons:await this.getCustomIcons()};
        });
        session.setHandler('virtualdevicesettings_save', async (settings) => {
            //console.log(settings, device.Settings , []);
            //device.data.icon = "../../../assets/icon.svg";
            //device.icon = "../../../assets/icon.svg";
            return await device.loadFromSettings(settings, device.Settings , [], true);
            
            //return {settings:device.Settings, customicons:await this.getCustomIcons()};
        });

        
        session.setHandler('virtualdevicesettings_getCustomIconsAvailable', async () => {
            
            let dev = {};

            
            dev.customIconsAvailable = [];
            let iconsInUse = {};
            let devices  = await this.getDevices();
            for (const deviceId in devices) {
                if (Object.hasOwnProperty.call(devices, deviceId)) {
                    const device = devices[deviceId];
                    await this.executeForAllTypes(device, (type, i )=> {
                        if(device.Settings[type+i+"Icon"] && device.Settings[type+i+"Icon"].length>0 && !iconsInUse[device.Settings[type+i+"Icon"]]) iconsInUse[device.Settings[type+i+"Icon"]] = true;

                    });
                }
            }   
            let keys = Object.keys(iconsInUse);
            for (let i = 0; i < CUSTOM_ICONS.length; i++) {
                const icon = CUSTOM_ICONS[i];
                if(keys.indexOf(icon)===-1)dev.customIconsAvailable.push(icon);
            }

            for (const iconUsedKey in iconsInUse) {
                if (Object.hasOwnProperty.call(iconsInUse, iconUsedKey)) {
                    
                }
            }            
            return dev;
        });        

        session.setHandler('virtualdevicesettings_getJson', async (str) => {
            try {                
                return JSON.parse(await this.unzip(str));
            } catch (error) {
                this.error(error);
            }
        });

        session.setHandler('virtualdevicesettings_getTextSettings', async (obj) => {
            try {
                
                let dev = {deviceIcon:await this.getDeviceIconZipped(device), customIcons:{}, originalId:device.__id};
                if(obj&& obj.copyWithIcons) 
                    await this.executeForAllTypes(device, async (type, i )=> {
                        if(device.Settings[type+i+"Icon"] && device.Settings[type+i+"Icon"].startsWith('custom') && !dev.customIcons[device.Settings[type+i+"Icon"]]){
                            //let buffer = await this.getIconZipped("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");                            
                            //const compressed = await gzip(buffer);
                            //var str = Buffer.from(await gzip(buffer)).toString('base64');
                            //var str2 = await this.getIcon("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
                            dev.customIcons[device.Settings[type+i+"Icon"]] = await this.getIconZipped("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
                            //dev.customIcons[device.Settings[type+i+"Icon"]] = await this.getIcon("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
                        }
                    });
                dev = await this.getAdvancedFlowsJSON({dev, device });
                return dev;
            } catch (error) {
                this.error(error);
                
            }
                
            //let v = await this.getAdvancedFlowsJSON();
            
            // let devicesToReplace = {};
            // let usersToReplace = {};
            // let variablesToReplace = {};            
            // let tokensToReplace = {};

            // function addDeviceToReplace(deviceId) {
            //     let _device = allDevices[deviceId];
            //     if(devicesToReplace && _device) devicesToReplace[deviceId] = {name:_device.name, class:_device.class};
            // }
            // try {                
            //     let dev = {deviceIcon:await this.getDeviceIconZipped(device), customIcons:{}, originalId:device.__id};
            //     if(obj&& obj.copyWithIcons) 
            //         await this.executeForAllTypes(device, async (type, i )=> {
            //             if(device.Settings[type+i+"Icon"] && device.Settings[type+i+"Icon"].startsWith('custom') && !dev.customIcons[device.Settings[type+i+"Icon"]]){
            //                 //let buffer = await this.getIconZipped("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");                            
            //                 //const compressed = await gzip(buffer);
            //                 //var str = Buffer.from(await gzip(buffer)).toString('base64');
            //                 //var str2 = await this.getIcon("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
            //                 dev.customIcons[device.Settings[type+i+"Icon"]] = await this.getIconZipped("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
            //                 //dev.customIcons[device.Settings[type+i+"Icon"]] = await this.getIcon("./userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
            //             }
            //         });
                
            //     if(obj&& obj.copyWithFlows) {
            //         allDevices = allDevices ? allDevices : await this.homey.app.devices;
            //         allUsers = allUsers ? allUsers : await this.homey.app.homeyAPI.users.getUsers();
            //         allVariables = allVariables ? allVariables : await this.homey.app.homeyAPI.logic.getVariables();
            //         allTokens = allTokens ? allTokens : await this.homey.app.homeyAPI.flowToken.getFlowTokens();
            //         let advancedflows = _.filter(await this.homey.app.homeyAPI.flow.getAdvancedFlows(), x=> x.enabled && _.find(x.cards, c=>c.ownerUri=='homey:device:' + device.__id));
            //         _.each(advancedflows, f=> {
            //             delete f.__athom_api_type;
            //             delete f.triggerable;
            //             delete f.broken;
                        
            //             delete f.folder;
            //             _.each(f.cards, c=> {
            //             });
            //         });
            //         _.each(advancedflows, (flow, flowKey)=>{
            //             _.each(flow.cards, (card, cardKey)=>{
            //                 let deviceId;
            //                 if(card.ownerUri && card.ownerUri.startsWith('homey:device:') && (deviceId=card.ownerUri.substring(13))!=device.__id) {
            //                     if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) addDeviceToReplace(deviceId) ;
            //                     //if(devicesToReplace[deviceId][card.type +'s'].indexOf(card.id)===-1) devicesToReplace[deviceId][card.type +'s'].push(card.id);
            //                 }
            //                 if(card.args) for (const argKey in card.args) {
            //                     if (Object.hasOwnProperty.call(card.args, argKey)) {
            //                         const argument = card.args[argKey];
            //                         switch (typeof(argument)) {
            //                             case "string":
            //                                 let a = argument.matchAll(/\[\[homey:([a-zA-Z]+)[:]?([^:|]+)?[:|]?(.+?)]]/gm);
            //                                 if(!a) continue;
            //                                 const tokens = [...a];
            //                                 for (let i = 0; i < tokens.length; i++) {
            //                                     const tokenMatchs = tokens[i];
            //                                     //console.log(tokenMatchs[2]);
            //                                     switch (tokenMatchs[1]) {
            //                                         case "manager": 
            //                                             switch (tokenMatchs[2]) {
            //                                                 case "presence":
            //                                                   let presenceId = tokenMatchs[3].substring(0,36);//.split('-')[0];
            //                                                   //console.log(presenceId);
            //                                                   let user = _.find(allUsers, y=>y.id==presenceId);
            //                                                   if(!usersToReplace[presenceId]) usersToReplace[presenceId] =  {name:user.name};
            //                                                     break;
            //                                                 case "logic":
            //                                                     if(!variablesToReplace[tokenMatchs[3]]) variablesToReplace[tokenMatchs[3]] = {
            //                                                         name:allVariables[tokenMatchs[3]].name, 
            //                                                         type:allVariables[tokenMatchs[3]].type};
            //                                                     break;
            //                                             }
            //                                         break;
            //                                         case "device": 
            //                                             let deviceId = tokenMatchs[2];
            //                                             let capId = tokenMatchs[3];
            //                                             let cap = allDevices[deviceId].capabilitiesObj[capId];
            //                                             let capType = 'string';
            //                                             switch (cap.type) {
            //                                                 case "number":
            //                                                     capType = "number";
            //                                                     break;
            //                                                 case "boolean":
            //                                                     capType = "boolean";
            //                                                     break;
            //                                             }
            //                                             if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) addDeviceToReplace(deviceId) ;
            //                                             if(!devicesToReplace[deviceId].tags) devicesToReplace[deviceId].tags = {};
            //                                             if(!devicesToReplace[deviceId].tags[capId]) {
            //                                                 let token = _.find(allTokens, t=>t.uri=='homey:device:'+deviceId && t.id==capId);
            //                                                 if(token) devicesToReplace[deviceId].tags[capId] = {name:token.title, type:token.type};
            //                                                 else devicesToReplace[deviceId].tags[capId] = {name:cap.title, type:capType};
            //                                             }
            //                                         break;
            //                                         case "app": 
            //                                             let token = _.find(allTokens, y=>y.uri=='homey:app:' + tokenMatchs[2] &&y.id==tokenMatchs[3] );
            //                                             let appIp = tokenMatchs[2];
            //                                             if(!tokensToReplace[appIp]) tokensToReplace[appIp] =  {tokens:{}};
            //                                             if(!tokensToReplace[appIp].tokens[token.id]) tokensToReplace[appIp].tokens[token.id] =  {name:token.title, type:token.type};
            //                                             break;                                                
            //                                     default:
            //                                             break;
            //                                     }
            //                                 }
            //                                 break;
            //                         }
            //                     }
            //                 }
            //             });
            //         });
            //         if(Object.keys(devicesToReplace).length>0) dev.devicesToReplace = devicesToReplace;
            //         if(Object.keys(usersToReplace).length>0) dev.usersToReplace = usersToReplace;
            //         if(Object.keys(variablesToReplace).length>0) dev.variablesToReplace = variablesToReplace;
            //         if(Object.keys(tokensToReplace).length>0) dev.tokensToReplace = tokensToReplace;

            //         dev.advancedflows = advancedflows;
            //     }
            //     if(!Object.keys(dev.customIcons)) dev.customIcons=null;
            //     dev.settings = device.Settings;
            //     const json = JSON.stringify(dev);
            //     const compressed = Buffer.from(await gzip(json, {level:9})).toString('base64');                
            //     dev.compressed = compressed;
            //     return dev;
            // } catch (error) {
            //     this.error(error);
            // }
        });

        
        session.setHandler('virtualdevicesettings_readFlows', async (settings) => {
            try {                    
                settings = JSON.parse(await this.unzip(settings));
                
                allDevices = allDevices ? allDevices : await this.homey.app.devices;
                allUsers = allUsers ? allUsers : await this.homey.app.homeyAPI.users.getUsers();
                allVariables = allVariables ? allVariables : await this.homey.app.homeyAPI.logic.getVariables();
                allTokens = allTokens ? allTokens : await this.homey.app.homeyAPI.flowToken.getFlowTokens();
                
                actionCards = actionCards ? actionCards : await this.homey.app.homeyAPI.flow.getFlowCardActions();
                conditionCards = conditionCards ? conditionCards : await this.homey.app.homeyAPI.flow.getFlowCardConditions();
                triggerCards = triggerCards ? triggerCards : await this.homey.app.homeyAPI.flow.getFlowCardTriggers();
            
                let apiCommand = "";
                let cards = _.flatMap(settings.advancedflows, f=>_.toArray(f.cards));
                //let cardsNeeded = _.filter(cards, c=>c.ownerUri.startsWith('homey:device:'));
                //let devicesNeeded = _.map(cardsNeeded, c=>c.ownerUri.substring(13));
                if(!settings.devicesToReplace) settings.devicesToReplace = {};
                let devicesToReplace = settings.devicesToReplace;
                if(!settings.devicesToReplace[settings.originalId]) settings.devicesToReplace[settings.originalId] = {replaceWith: {id:device.__id}};
                if(!settings.devicesToReplace[settings.originalId].replaceWith) settings.devicesToReplace[settings.originalId].replaceWith = {id:device.__id};

                //_.each(cards, c=>{if(c.ownerUri=='homey:device:' + settings.originalId) c.ownerUri= c.ownerUri.replaceAll(settings.originalId, device.__id) ; });
                
                _.each(settings.advancedflows, (flow, flowKey)=>{
                    _.each(flow.cards, (card, cardKey)=>{
                        let deviceId;
                        if(card.ownerUri && card.ownerUri.startsWith('homey:device:') && (deviceId=card.ownerUri.substring(13))!=device.__id) {
                            if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) {
                                devicesToReplace[deviceId] = {replacements: [], actions:[]};
                            }
                            if(!devicesToReplace[deviceId].replacements)devicesToReplace[deviceId].replacements = [];
                            if(!devicesToReplace[deviceId].actions)devicesToReplace[deviceId].actions = [];
                            if(!devicesToReplace[deviceId].triggers)devicesToReplace[deviceId].triggers = [];
                            if(!devicesToReplace[deviceId].conditions)devicesToReplace[deviceId].conditions = [];
                            if(devicesToReplace[deviceId][card.type +'s'].indexOf(card.id)===-1) devicesToReplace[deviceId][card.type +'s'].push(card.id);                         
                        }
                    });
                });
                
                _.each(devicesToReplace, (device, deviceKey)=>{
                    device.replacements = _.map(_.filter(allDevices, (d, dKey)=> 
                        _.find(actionCards, ac=> ac.uri=='homey:device:' + dKey && _.find(device.actions, a=>a==ac.id)) || 
                        _.find(conditionCards, ac=> ac.uri=='homey:device:' + dKey && _.find(device.conditions, a=>a==ac.id)) || 
                        _.find(triggerCards, ac=> ac.uri=='homey:device:' + dKey && _.find(device.triggers, a=>a==ac.id))
                    ),
                        d=> { return {id:d.id, name:d.name};});
                });

                _.each(settings.usersToReplace, (user, userId)=>{
                    user.replacements = _.map(_.filter(allUsers, (u, uKey)=> true), d=> { return {id:d.id, name:d.name};});
                });
                _.each(settings.variablesToReplace, (variable, variableId)=>{
                    variable.replacements = _.map(_.filter(allVariables, (v, vKey)=> v.type==variable.type ), d=> { return {id:d.id, name:d.name};});
                });
                _.each(settings.tokensToReplace, (app, appId)=>{
                    _.each(app.tokens, (token, tokenId)=>{
                        token.replacements = _.map(_.filter(allTokens, (v, vKey)=> v.uri=="homey:app:" + appId && v.type==token.type ), d=> { return {id:d.id, name:d.title};});
                    });
                    //app.replacements = _.map(_.filter(allVariables, (v, vKey)=> v.type==app.type ), d=> { return {id:d.id, name:d.name};});
                });

                _.each(settings.advancedflows, f=>{
                    apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
                });
                return {apiCommand: apiCommand, devicesToReplace, advancedflows: settings.advancedflows, usersToReplace:settings.usersToReplace, variablesToReplace:settings.variablesToReplace, tokensToReplace:settings.tokensToReplace};
            } catch (error) {
                this.error(error);                
            }
        });

        session.setHandler('virtualdevicesettings_updateFlowCommand', async (settings) => {
            try {
                let apiCommand = "";
                let cards = _.flatMap(settings.advancedflows, f=>_.toArray(f.cards));
                
                _.each(settings.devicesToReplace, (device, deviceId)=>{
                    if(!device.replaceWith) return;
                    device.searchFor = "homey:device:"+deviceId;
                    device.searchReplaceWith = "homey:device:" + device.replaceWith.id;
                });

                _.each(settings.usersToReplace, (user, userId)=>{
                    if(!user.replaceWith) return;
                    user.searchFor = "[[homey:manager:presence|"+userId;
                    user.searchReplaceWith = "[[homey:manager:presence|" + user.replaceWith.id;
                });
                _.each(settings.variablesToReplace, (variable, variableId)=>{
                    if(!variable.replaceWith) return;
                    variable.searchFor = "[[homey:manager:logic|"+variableId;
                    variable.searchReplaceWith = "[[homey:manager:logic|" + variable.replaceWith;
                });
                _.each(settings.tokensToReplace, (app, appId)=>{
                    _.each(app.tokens, (token, tokenId)=>{
                        if(!token.replaceWith) return;
                        token.searchFor = "[[homey:app:"+appId+"|"+tokenId;
                        token.searchReplaceWith = "[[homey:app:"+appId+"|"+token.replaceWith;
                    });
                });
                _.each(cards, c=>{
                    if(c && c.ownerUri) {
                        _.each(settings.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && c.ownerUri.indexOf(device.searchFor)>-1)c.ownerUri = c.ownerUri.replaceAll(device.searchFor, device.searchReplaceWith);  });
                    }
                    if(c.args) for (const argKey in c.args) {
                        if (Object.hasOwnProperty.call(c.args, argKey)) {
                            const argument = c.args[argKey];
                            switch (typeof(argument)) {
                                case "string":      
                                    _.each(settings.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && argument.indexOf("[[" + device.searchFor)>-1)c.args[argKey] = argument.replaceAll("[[" + device.searchFor, "[[" + device.searchReplaceWith);  });
                                    _.each(settings.usersToReplace, (user, userId)=>{ if(user.searchFor && argument.indexOf(user.searchFor)>-1)c.args[argKey] = argument.replaceAll(user.searchFor, user.searchReplaceWith);  });
                                    _.each(settings.variablesToReplace, (variable, variableId)=>{ if(variable.searchFor && argument.indexOf(variable.searchFor)>-1)c.args[argKey] = argument.replaceAll(variable.searchFor, variable.searchReplaceWith);  });
                                    _.each(settings.tokensToReplace, (app, appId)=>{ _.each(app.tokens, (token, tokenId)=>{ if(token.searchFor && argument.indexOf(token.searchFor)>-1)c.args[argKey] = argument.replaceAll(token.searchFor, token.searchReplaceWith); }); });
                                    break;
                            }
                        }
                    }
                 });
                _.each(settings.advancedflows, f=>{
                    apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
                });
                return {apiCommand: apiCommand};
            } catch (error) {                
                this.error(error);
            }
            
        });
    }
    
    async loadStuff() {
        allDevices = allDevices ? allDevices : await this.homey.app.devices;
        allUsers = allUsers ? allUsers : await this.homey.app.homeyAPI.users.getUsers();
        allVariables = allVariables ? allVariables : await this.homey.app.homeyAPI.logic.getVariables();
        allTokens = allTokens ? allTokens : await this.homey.app.homeyAPI.flowToken.getFlowTokens();
        
        actionCards = actionCards ? actionCards : await this.homey.app.homeyAPI.flow.getFlowCardActions();
        conditionCards = conditionCards ? conditionCards : await this.homey.app.homeyAPI.flow.getFlowCardConditions();
        triggerCards = triggerCards ? triggerCards : await this.homey.app.homeyAPI.flow.getFlowCardTriggers();
        if(!allPrivateKeys) {
            allPrivateKeys = [this.homey.app.homeyAPI._token, this.homey.app.homeyAPI.session.id, await this.homey.cloud.getHomeyId()];
            _.each(allUsers, u=>allPrivateKeys.push(u.athomId));
        }
    }
    async getAdvancedFlows({ homey, query }) {
        let defer = new Defer();
        defer.then(async ()=> { this.loadStuff(); });

        var afs = await homey.app.homeyAPI.flow.getAdvancedFlows();
		var ret = _.map(afs, af => {
			return {
				id: af.id,
				name:af.name
			};			
		});
        setTimeout(()=> { defer.resolve(); }, 1);
        return ret;

    }


    async getAdvancedFlowsJSON({ homey,   advancedflowsselected, dev, device }) {        
        function addDeviceToReplace(deviceId) {
            let _device = allDevices[deviceId];
            if(devicesToReplace && _device) devicesToReplace[deviceId] = {name:_device.name, class:_device.class};
        }

        let devicesToReplace = {};
        let usersToReplace = {};
        let variablesToReplace = {};            
        let tokensToReplace = {};
        //advancedflowsselected = advancedflowsselected || [];

        dev = dev || {};
        await this.loadStuff();

        // allDevices = allDevices ? allDevices : await this.homey.app.devices;
        // allUsers = allUsers ? allUsers : await this.homey.app.homeyAPI.users.getUsers();
        // allVariables = allVariables ? allVariables : await this.homey.app.homeyAPI.logic.getVariables();
        // allTokens = allTokens ? allTokens : await this.homey.app.homeyAPI.flowToken.getFlowTokens();

        let advancedflowsselectedKeys = advancedflowsselected ? Object.keys(advancedflowsselected) : 0;
        let advancedflows = _.filter(await this.homey.app.homeyAPI.flow.getAdvancedFlows(), x=> x.enabled && 
            ((advancedflowsselectedKeys && advancedflowsselectedKeys.indexOf(x.id)>-1 && advancedflowsselected[x.id]===true) ||
            (device && _.find(x.cards, c=>c.ownerUri=='homey:device:' + device.__id)))
            );// && _.find(x.cards, c=>c.ownerUri=='homey:device:' + device.__id));
        _.each(advancedflows, f=> {
            delete f.__athom_api_type;
            delete f.triggerable;
            delete f.broken;
            
            delete f.folder;
            // _.each(f.cards, c=> {
            // });
        });
        _.each(advancedflows, (flow, flowKey)=>{
            _.each(flow.cards, (card, cardKey)=>{
                let deviceId;
                if(card.ownerUri && card.ownerUri.startsWith('homey:device:') && (deviceId=card.ownerUri.substring(13))){//!=device.__id) {
                    if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) addDeviceToReplace(deviceId) ;
                    //if(devicesToReplace[deviceId][card.type +'s'].indexOf(card.id)===-1) devicesToReplace[deviceId][card.type +'s'].push(card.id);
                }
                if(card.args) for (const argKey in card.args) {
                    if (Object.hasOwnProperty.call(card.args, argKey)) {
                        //const argument = card.args[argKey];
                        switch (typeof(card.args[argKey])) {
                            case "string":
                                let a = card.args[argKey].matchAll(/\[\[homey:([a-zA-Z]+)[:]?([^:|]+)?[:|]?(.+?)]]/gm);
                                if(!a) continue;
                                const tokens = [...a];
                                for (let i = 0; i < tokens.length; i++) {
                                    const tokenMatchs = tokens[i];
                                    //console.log(tokenMatchs[2]);
                                    switch (tokenMatchs[1]) {
                                        case "manager": 
                                            switch (tokenMatchs[2]) {
                                                case "presence":
                                                    let presenceId = tokenMatchs[3].substring(0,36);
                                                    let user = _.find(allUsers, y=>y.id==presenceId);
                                                    if(!usersToReplace[presenceId]) usersToReplace[presenceId] =  {name:user.name};
                                                    break;
                                                case "logic":
                                                    if(!variablesToReplace[tokenMatchs[3]]) variablesToReplace[tokenMatchs[3]] = {
                                                        name:allVariables[tokenMatchs[3]].name, 
                                                        type:allVariables[tokenMatchs[3]].type};
                                                    break;
                                            }
                                        break;
                                        case "device": 
                                            let deviceId = tokenMatchs[2];
                                            let capId = tokenMatchs[3];
                                            let cap = allDevices[deviceId].capabilitiesObj[capId];
                                            let capType = 'string';
                                            switch (cap.type) {
                                                case "number":
                                                    capType = "number";
                                                    break;
                                                case "boolean":
                                                    capType = "boolean";
                                                    break;
                                            }
                                            if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) addDeviceToReplace(deviceId) ;
                                            if(!devicesToReplace[deviceId].tags) devicesToReplace[deviceId].tags = {};
                                            if(!devicesToReplace[deviceId].tags[capId]) {
                                                let token = _.find(allTokens, t=>t.uri=='homey:device:'+deviceId && t.id==capId);
                                                if(token) devicesToReplace[deviceId].tags[capId] = {name:token.title, type:token.type};
                                                else devicesToReplace[deviceId].tags[capId] = {name:cap.title, type:capType};
                                            }
                                        break;
                                        case "app": 
                                            let token = _.find(allTokens, y=>y.uri=='homey:app:' + tokenMatchs[2] &&y.id==tokenMatchs[3] );
                                            let appIp = tokenMatchs[2];
                                            if(token) {
                                                if(!tokensToReplace[appIp]) tokensToReplace[appIp] =  {name:token.uriObj?token.uriObj.name:null, tokens:{}};
                                                if(!tokensToReplace[appIp].tokens[token.id]) tokensToReplace[appIp].tokens[token.id] =  {name:token.title, type:token.type};
                                                }
                                            break;                                                
                                    }
                                }
                                break;
                                
                            case "object":
                                let id = Object.keys(card.args[argKey]).indexOf('id')>-1? card.args[argKey].id : Object.keys(card.args[argKey]).indexOf('name')>-1? card.args[argKey].name : null;
                                if(id!==undefined && id!==null && card.ownerUri) {                                    
                                    if(card.ownerUri=='homey:manager:presence' || card.ownerUri=='homey:manager:mobile') {
                                        let user = _.find(allUsers, y=>y.id==id);
                                        if(!usersToReplace[id]) usersToReplace[id] =  {name:user.name};
                                        //delete card.args[argKey].image;
                                        //delete card.args[argKey].athomId;
                                    }
                                    else if(card.ownerUri=='homey:manager:logic') {
                                        if(!variablesToReplace[id]) variablesToReplace[id] = {
                                            name:allVariables[id].name, 
                                            type:allVariables[id].type};
                                    }
                                    else if(card.ownerUri.startsWith('homey:app:')) {
                                        
                                        let appIp = card.ownerUri.substring(10);
                                        let token = _.find(allTokens, y=>y.uri=='homey:app:' + appIp &&y.id==id );
                                        if(token) {
                                            if(!tokensToReplace[appIp]) tokensToReplace[appIp] =  {name:token.uriObj?token.uriObj.name:null, tokens:{}};
                                            if(!tokensToReplace[appIp].tokens[token.id]) tokensToReplace[appIp].tokens[token.id] =  {name:token.title, type:token.type};
                                        }
                                    }
                                    
                                }
                                break;
                        }
                    }
                }
            });
        });
        if(Object.keys(devicesToReplace).length>0) dev.devicesToReplace = devicesToReplace;
        if(Object.keys(usersToReplace).length>0) dev.usersToReplace = usersToReplace;
        if(Object.keys(variablesToReplace).length>0) dev.variablesToReplace = variablesToReplace;
        if(Object.keys(tokensToReplace).length>0) dev.tokensToReplace = tokensToReplace;

        dev.advancedflows = advancedflows;
        const devCopy = JSON.parse(JSON.stringify(dev));
        const devCopyMinified = this.minifyExchangerFile(devCopy);

        const stringy = this.removeKeys(JSON.stringify(dev));        
        const stringyMinified = this.removeKeys(JSON.stringify(devCopyMinified));        
        const compressed = Buffer.from(await gzip(stringy, {level:9} )).toString('base64');                
        const compressedMinified = Buffer.from(await gzip(stringyMinified, {level:9})).toString('base64');                
        dev.compressed = compressed;
        dev.uncompressed = stringy;
        
        dev.compressedMinified = compressedMinified;
        dev.uncompressedMinified = devCopyMinified;
        //dev.doublecompressedMinified = Buffer.from(await gzip(compressedMinified)).toString('base64'); 
        return dev;
    }

    async readAdvancedFlowsJSON({ homey,  json }) { 
        try {
            let exchangeFile = json;
            if(typeof(exchangeFile)=='string') {
                if(exchangeFile.startsWith('H4s')) exchangeFile = JSON.parse(await this.unzip(exchangeFile));
                else exchangeFile = JSON.parse(exchangeFile);
            }

            if(typeof(exchangeFile)=='object' && exchangeFile.a) exchangeFile = this.maxifyExchangerFile(exchangeFile);
                
            
            await this.loadStuff();
            // allDevices = allDevices ? allDevices : await this.homey.app.devices;
            // allUsers = allUsers ? allUsers : await this.homey.app.homeyAPI.users.getUsers();
            // allVariables = allVariables ? allVariables : await this.homey.app.homeyAPI.logic.getVariables();
            // allTokens = allTokens ? allTokens : await this.homey.app.homeyAPI.flowToken.getFlowTokens();
            
            // actionCards = actionCards ? actionCards : await this.homey.app.homeyAPI.flow.getFlowCardActions();
            // conditionCards = conditionCards ? conditionCards : await this.homey.app.homeyAPI.flow.getFlowCardConditions();
            // triggerCards = triggerCards ? triggerCards : await this.homey.app.homeyAPI.flow.getFlowCardTriggers();
        

            let _allDevices = allDevices;

            let apiCommand = "";
            let cards = _.flatMap(exchangeFile.advancedflows, f=>_.toArray(f.cards));
            if(!exchangeFile.devicesToReplace) exchangeFile.devicesToReplace = {};
            let devicesToReplace = exchangeFile.devicesToReplace;
            //if(!exchangeFile.devicesToReplace[exchangeFile.originalId]) exchangeFile.devicesToReplace[exchangeFile.originalId] = {replaceWith: device.__id};
            //if(!exchangeFile.devicesToReplace[exchangeFile.originalId].replaceWith) exchangeFile.devicesToReplace[exchangeFile.originalId].replaceWith = device.__id;

            _.each(exchangeFile.advancedflows, (flow, flowKey)=>{
                _.each(flow.cards, (card, cardKey)=>{
                    let deviceId;
                    if(card.ownerUri && card.ownerUri.startsWith('homey:device:') && (deviceId=card.ownerUri.substring(13))) { //!=device.__id) {
                        if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) {
                            devicesToReplace[deviceId] = {replacements: [], actions:[]};
                        }
                        if(!devicesToReplace[deviceId].replacements)devicesToReplace[deviceId].replacements = [];
                        if(!devicesToReplace[deviceId].actions)devicesToReplace[deviceId].actions = [];
                        if(!devicesToReplace[deviceId].triggers)devicesToReplace[deviceId].triggers = [];
                        if(!devicesToReplace[deviceId].conditions)devicesToReplace[deviceId].conditions = [];
                        if(devicesToReplace[deviceId][card.type +'s'].indexOf(card.id)===-1) devicesToReplace[deviceId][card.type +'s'].push(card.id);                         
                    }
                });
            });

            let actionIds = _.uniqBy(_.flatMap(devicesToReplace, d=>d.actions));
            let conditionIds = _.uniqBy(_.flatMap(devicesToReplace, d=>d.conditions));
            let triggerIds = _.uniqBy(_.flatMap(devicesToReplace, d=>d.triggers));

            let _actionCards = _.filter(actionCards, x=> actionIds.indexOf(x.id)>-1 && x.uri && x.uri.startsWith('homey:device'));
            let _conditionCards = _.filter(conditionCards, x=> conditionIds.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:device'));
            let _triggerCards = _.filter(triggerCards, x=> triggerIds.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:device'));
            _allDevices = _.filter(_allDevices, d=>_.find(_actionCards, x=>x.uri && x.uri=='homey:device:'+d.id));
            
            _.each(devicesToReplace, (device, deviceKey)=>{
                device.replacements = _.map(_.filter(_allDevices, (d, dKey)=> 
                    _.find(_actionCards, ac=> ac.uri=='homey:device:' + d.id && _.find(device.actions, a=>a==ac.id)) || 
                    _.find(_conditionCards, ac=> ac.uri=='homey:device:' + d.id && _.find(device.conditions, a=>a==ac.id)) || 
                    _.find(_triggerCards, ac=> ac.uri=='homey:device:' + d.id && _.find(device.triggers, a=>a==ac.id))
                ),
                    d=> { return {id:d.id, name:d.name};});
            });

            _.each(exchangeFile.usersToReplace, (user, userId)=>{
                user.replacements = _.map(_.filter(allUsers, (u, uKey)=> true), d=> { return {id:d.id, name:d.name, athomId:d.athomId, image:d.avatar};});
            });
            _.each(exchangeFile.variablesToReplace, (variable, variableId)=>{
                variable.replacements = _.map(_.filter(allVariables, (v, vKey)=> v.type==variable.type ), d=> { return {id:d.id, name:d.name};});
            });
            _.each(exchangeFile.tokensToReplace, (app, appId)=>{
                _.each(app.tokens, (token, tokenId)=>{
                    token.replacements = _.map(_.filter(allTokens, (v, vKey)=> v.uri=="homey:app:" + appId && v.type==token.type ), d=> { return {id:d.id, name:d.title};});
                });
            });

            _.each(exchangeFile.advancedflows, f=>{
                apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
            });
            
            return {apiCommand: apiCommand, devicesToReplace, advancedflows: exchangeFile.advancedflows, usersToReplace:exchangeFile.usersToReplace, variablesToReplace:exchangeFile.variablesToReplace, tokensToReplace:exchangeFile.tokensToReplace};
        } catch (error) {
            this.error(error);                
        }

    }
    async updateAdvancedFlowsJSON({ homey,  body: exchangerFile }) { 
        try {
            let apiCommand = "";
            let cards = _.flatMap(exchangerFile.advancedflows, f=>_.toArray(f.cards));
            
            _.each(exchangerFile.devicesToReplace, (device, deviceId)=>{
                if(!device.replaceWith) return;
                device.searchFor = "homey:device:"+deviceId;
                device.searchReplaceWith = "homey:device:" + device.replaceWith.id;
            });

            _.each(exchangerFile.usersToReplace, (user, userId)=>{
                if(!user.replaceWith) return;
                user.searchFor = "[[homey:manager:presence|"+userId;
                user.searchReplaceWith = "[[homey:manager:presence|" + user.replaceWith.id;
            });
            _.each(exchangerFile.variablesToReplace, (variable, variableId)=>{
                if(!variable.replaceWith) return;
                variable.searchFor = "[[homey:manager:logic|"+variableId;
                variable.searchReplaceWith = "[[homey:manager:logic|" + variable.replaceWith.id;
            });
            _.each(exchangerFile.tokensToReplace, (app, appId)=>{
                _.each(app.tokens, (token, tokenId)=>{
                    if(!token.replaceWith) return;
                    token.searchFor = "homey:app:"+appId+"|"+tokenId;
                    token.searchReplaceWith = "homey:app:"+appId+"|"+token.replaceWith.id;
                });
            });
            _.each(cards, c=>{
                if(c && c.ownerUri) {
                    _.each(exchangerFile.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && c.ownerUri.indexOf(device.searchFor)>-1)c.ownerUri = c.ownerUri.replaceAll(device.searchFor, device.searchReplaceWith);  });
                }
                if(c.args) for (const argKey in c.args) {
                    if (Object.hasOwnProperty.call(c.args, argKey)) {
                        //const c.args[argKey] = c.args[argKey];
                        switch (typeof(c.args[argKey])) {
                            case "string":      
                                _.each(exchangerFile.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && c.args[argKey].indexOf("[[" + device.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll("[[" + device.searchFor, "[[" + device.searchReplaceWith);  });
                                _.each(exchangerFile.usersToReplace, (user, userId)=>{ if(user.searchFor && c.args[argKey].indexOf(user.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(user.searchFor, user.searchReplaceWith);  });
                                _.each(exchangerFile.variablesToReplace, (variable, variableId)=>{ if(variable.searchFor && c.args[argKey].indexOf(variable.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(variable.searchFor, variable.searchReplaceWith);  });
                                _.each(exchangerFile.tokensToReplace, (app, appId)=>{ _.each(app.tokens, (token, tokenId)=>{ if(token.searchFor && c.args[argKey].indexOf("[[" + token.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll("[[" + token.searchFor, "[[" + token.searchReplaceWith); }); });
                                break;
                            case "object":      
                                //_.each(exchangerFile.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && c.args[argKey].indexOf("[[" + device.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll("[[" + device.searchFor, "[[" + device.searchReplaceWith);  });
                                if(c.args[argKey].id && c.ownerUri && (c.ownerUri=='homey:manager:presence' || c.ownerUri=='homey:manager:mobile'))
                                    _.each(exchangerFile.usersToReplace, (user, userId)=>{ if(c.args[argKey].id==userId && user.replaceWith) {c.args[argKey].id = user.replaceWith.id ;c.args[argKey].name = user.replaceWith.name;c.args[argKey].athomId = user.replaceWith.athomId;c.args[argKey].image = user.replaceWith.image; }   });
                                if(c.args[argKey].id && c.ownerUri && c.ownerUri=='homey:manager:logic') _.each(exchangerFile.variablesToReplace, (variable, variableId)=>{ if(c.args[argKey].id==variableId && variable.replaceWith) {c.args[argKey].id = variable.replaceWith.id; c.args[argKey].name = variable.replaceWith.name;}  });
                                
                                if((c.args[argKey].id || c.args[argKey].name) && c.ownerUri && c.ownerUri.startsWith('homey:app:')) {
                                    _.each(exchangerFile.tokensToReplace, (app, appId)=>{
                                        if("homey:app:" + appId!==c.ownerUri) return;
                                        _.each(app.tokens, (token, tokenId)=>{ 
                                            if(token.searchFor && (c.args[argKey].id===tokenId || c.args[argKey].name===tokenId)) {
                                                if(c.args[argKey].id) {
                                                    c.args[argKey].id = token.replaceWith.id;
                                                    c.args[argKey].name = token.replaceWith.name;
                                                }
                                                else if(c.args[argKey].name) c.args[argKey].name = token.replaceWith.id;
                                            }
                                        }); 
                                    });
                                }
                                //_.each(exchangerFile.variablesToReplace, (variable, variableId)=>{ if(variable.searchFor && c.args[argKey].indexOf(variable.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(variable.searchFor, variable.searchReplaceWith);  });
                                //_.each(exchangerFile.tokensToReplace, (app, appId)=>{ _.each(app.tokens, (token, tokenId)=>{ if(token.searchFor && c.args[argKey].indexOf(token.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(token.searchFor, token.searchReplaceWith); }); });
                                break;
                        }
                    }
                }
             });
            _.each(exchangerFile.advancedflows, f=>{
                apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
            });
            return {apiCommand: apiCommand};
        } catch (error) {
            this.error(error);
        }
    }

    
    minifyExchangerFile(json) {
        if(json.devicesToReplace) {json.d=json.devicesToReplace; delete json.devicesToReplace;} 
        _.each(json.d, (device, key)=> {
            if(json.d[key].name!==undefined) json.d[key].n=json.d[key].name; delete json.d[key].name;
            if(json.d[key].class!==undefined) json.d[key].c=json.d[key].class; delete json.d[key].class;
            if(json.d[key].tags) {
                json.d[key].t=json.d[key].tags; delete json.d[key].tags;
                _.each(json.d[key].t, (tag, tagKey)=> {
                    if(json.d[key].t[tagKey].name!==undefined) json.d[key].t[tagKey].n=json.d[key].t[tagKey].name; delete json.d[key].t[tagKey].name;
                    if(json.d[key].t[tagKey].type!==undefined) json.d[key].t[tagKey].t=json.d[key].t[tagKey].type; delete json.d[key].t[tagKey].type;
                });
            }
        });
        if(json.usersToReplace) {json.u=json.usersToReplace; delete json.usersToReplace;} 
        _.each(json.u, (user, key)=> { 
            if(json.u[key].name!==undefined) json.u[key].n=json.u[key].name; delete json.u[key].name;
        });
        if(json.variablesToReplace) {json.v=json.variablesToReplace; delete json.variablesToReplace;} 
        _.each(json.v, (variable, key)=> { 
            if(json.v[key].name!==undefined) json.v[key].n=json.v[key].name; delete json.v[key].name;
            if(json.v[key].type!==undefined) json.v[key].t=json.v[key].type; delete json.v[key].type;
        });
        if(json.tokensToReplace) {json.t=json.tokensToReplace; delete json.tokensToReplace;} 
        _.each(json.t, (app, key)=> { 
            if(json.t[key].tokens) {
                json.t[key].t=json.t[key].tokens; delete json.t[key].tokens;
                _.each(json.t[key].t, (token, tokenKey)=> { 
                    if(json.t[key].t[tokenKey].name!==undefined) json.t[key].t[tokenKey].n=json.t[key].t[tokenKey].name; delete json.t[key].t[tokenKey].name;
                    if(json.t[key].t[tokenKey].type!==undefined) json.t[key].t[tokenKey].t=json.t[key].t[tokenKey].type; delete json.t[key].t[tokenKey].type;
                });
            }
        });

        if(json.advancedflows) {json.a=json.advancedflows; delete json.advancedflows;} 
        _.each(json.a, (af, afKey)=> {
            if(json.a[afKey].id!==undefined) json.a[afKey].i=json.a[afKey].id; delete json.a[afKey].id;
            if(json.a[afKey].name!==undefined) json.a[afKey].n=json.a[afKey].name; delete json.a[afKey].name;
            if(json.a[afKey].enabled!==undefined) json.a[afKey].e=json.a[afKey].enabled; delete json.a[afKey].enabled;
            if(json.a[afKey].cards) {
                json.a[afKey].c=json.a[afKey].cards; delete json.a[afKey].cards;
                _.each(json.a[afKey].c, (card, cardKey)=> {
                    if(json.a[afKey].c[cardKey].ownerUri!==undefined) json.a[afKey].c[cardKey].o=json.a[afKey].c[cardKey].ownerUri; delete json.a[afKey].c[cardKey].ownerUri;
                    if(json.a[afKey].c[cardKey].id!==undefined) json.a[afKey].c[cardKey].i=json.a[afKey].c[cardKey].id; delete json.a[afKey].c[cardKey].id;
                    if(json.a[afKey].c[cardKey].type!==undefined) json.a[afKey].c[cardKey].t=json.a[afKey].c[cardKey].type; delete json.a[afKey].c[cardKey].type;
                    if(json.a[afKey].c[cardKey].outputSuccess!==undefined) json.a[afKey].c[cardKey].s=json.a[afKey].c[cardKey].outputSuccess; delete json.a[afKey].c[cardKey].outputSuccess;
                    if(json.a[afKey].c[cardKey].args!==undefined) json.a[afKey].c[cardKey].a=json.a[afKey].c[cardKey].args; delete json.a[afKey].c[cardKey].args;
                });
            }
        });

        return json;
    }

    maxifyExchangerFile(json) {
        if(json.d) {json.devicesToReplace=json.d; delete json.d;} 
        _.each(json.devicesToReplace, (device, key)=> {
            if(json.devicesToReplace[key].n!==undefined) json.devicesToReplace[key].name=json.devicesToReplace[key].n; delete json.devicesToReplace[key].n;
            if(json.devicesToReplace[key].c!==undefined) json.devicesToReplace[key].name=json.devicesToReplace[key].c; delete json.devicesToReplace[key].c;
            if(json.devicesToReplace[key].t) {
                json.devicesToReplace[key].tags=json.devicesToReplace[key].t; delete json.devicesToReplace[key].t;
                _.each(json.devicesToReplace[key].tags, (tag, tagKey)=> {
                    if(json.devicesToReplace[key].tags[tagKey].n!==undefined) json.devicesToReplace[key].tags[tagKey].name=json.devicesToReplace[key].tags[tagKey].n; delete json.devicesToReplace[key].tags[tagKey].n;
                    if(json.devicesToReplace[key].tags[tagKey].t!==undefined) json.devicesToReplace[key].tags[tagKey].type=json.devicesToReplace[key].tags[tagKey].t; delete json.devicesToReplace[key].tags[tagKey].t;
                });
            }
        });
        if(json.u) {json.usersToReplace=json.u; delete json.u;} 
        _.each(json.usersToReplace, (user, key)=> { 
            if(json.usersToReplace[key].n!==undefined) json.usersToReplace[key].name=json.usersToReplace[key].n; delete json.usersToReplace[key].n;
        });
        if(json.v) {json.variablesToReplace=json.v; delete json.v;} 
        _.each(json.variablesToReplace, (variable, key)=> { 
            if(json.variablesToReplace[key].n!==undefined) json.variablesToReplace[key].name=json.variablesToReplace[key].n; delete json.variablesToReplace[key].n;
            if(json.variablesToReplace[key].t!==undefined) json.variablesToReplace[key].type=json.variablesToReplace[key].t; delete json.variablesToReplace[key].t;
        });
        if(json.tokensToReplace) {json.t=json.tokensToReplace; delete json.tokensToReplace;} 
        _.each(json.t, (app, key)=> { 
            if(json.tokensToReplace[key].t) {
                json.tokensToReplace[key].tokens=json.tokensToReplace[key].t; delete json.tokensToReplace[key].t;
                _.each(json.tokensToReplace[key].t, (token, tokenKey)=> { 
                    if(json.tokensToReplace[key].tokens[tokenKey].n!==undefined) json.tokensToReplace[key].tokens[tokenKey].name=json.tokensToReplace[key].tokens[tokenKey].n; delete json.tokensToReplace[key].tokens[tokenKey].n;
                    if(json.tokensToReplace[key].tokens[tokenKey].t!==undefined) json.tokensToReplace[key].tokens[tokenKey].type=json.tokensToReplace[key].tokens[tokenKey].t; delete json.tokensToReplace[key].tokens[tokenKey].t;
                });
            }
        });

        if(json.a) {json.advancedflows=json.a; delete json.a;} 
        _.each(json.advancedflows, (af, afKey)=> {
            if(json.advancedflows[afKey].i!==undefined) json.advancedflows[afKey].id=json.advancedflows[afKey].i; delete json.advancedflows[afKey].i;
            if(json.advancedflows[afKey].n!==undefined) json.advancedflows[afKey].name=json.advancedflows[afKey].n; delete json.advancedflows[afKey].n;
            if(json.advancedflows[afKey].c!==undefined) json.advancedflows[afKey].enabled=json.advancedflows[afKey].e; delete json.advancedflows[afKey].e;
            if(json.advancedflows[afKey].c) {
                json.advancedflows[afKey].cards=json.advancedflows[afKey].c; delete json.advancedflows[afKey].c;
                _.each(json.advancedflows[afKey].cards, (card, cardKey)=> {
                    if(json.advancedflows[afKey].cards[cardKey].o!==undefined) json.advancedflows[afKey].cards[cardKey].ownerUri=json.advancedflows[afKey].cards[cardKey].o; delete json.advancedflows[afKey].cards[cardKey].o;
                    if(json.advancedflows[afKey].cards[cardKey].i!==undefined) json.advancedflows[afKey].cards[cardKey].id=json.advancedflows[afKey].cards[cardKey].i; delete json.advancedflows[afKey].cards[cardKey].i;
                    if(json.advancedflows[afKey].cards[cardKey].t!==undefined) json.advancedflows[afKey].cards[cardKey].type=json.advancedflows[afKey].cards[cardKey].t; delete json.advancedflows[afKey].cards[cardKey].t;
                    if(json.advancedflows[afKey].cards[cardKey].s!==undefined) json.advancedflows[afKey].cards[cardKey].outputSuccess=json.advancedflows[afKey].cards[cardKey].s; delete json.advancedflows[afKey].cards[cardKey].s;
                    if(json.advancedflows[afKey].cards[cardKey].a!==undefined) json.advancedflows[afKey].cards[cardKey].args=json.advancedflows[afKey].cards[cardKey].a; delete json.advancedflows[afKey].cards[cardKey].a;
                });
            }
        });
        return json;
    }


    removeKeys(str) {
        if(str)_.each(allPrivateKeys, key=> {if(str.indexOf(key)>-1)str=str.replaceAll(key, '');});
        return str;
    }
    
    async executeForAllTypes(device, func=(type, i)=> {}) {
        for (let i = 0; i < TYPES.length; i++) {
            const type = TYPES[i];
            const fieldCount = type=="status" ? 1 : Math.max(device.Settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
            for (let i = 1; i <= fieldCount; i++) {
                if(func && func.constructor.name === 'AsyncFunction') await func(type, i);
                else if(func && typeof(func)=='function') func(type, i);
            }
        }

    }

    async getDeviceIcon(device) {
        try {
            let getData = device.getData();
            return await this.getIcon(getData && getData.icon ? getData.icon.substring(7) : undefined);
        } catch (error) { return null; }
    }
    
    async getDeviceIconZipped(device) {
        try {
            let getData = device.getData();
            return await this.getIconZipped(getData && getData.icon ? getData.icon.substring(7) : undefined);
        } catch (error) { return null; }
    }
    
    async unzip(str) {
        var gzippedJson = Buffer.from(str, 'base64');
        var jsonBuffer = await ungzip(gzippedJson, {level:9});
        return jsonBuffer.toString();
    }
    
    async getIcon(path) {
        try {
            const fs = require('fs').promises;
            const contents = await fs.readFile(path, {encoding: 'base64'});
            return 'data:image/svg+xml;base64,'+contents;
        } catch (error) { return undefined; }
    }
    async getIconZipped(path) {
        try {
            const fs = require('fs').promises;
            const contents = await fs.readFile(path);            
            return Buffer.from(await gzip(contents, {level:9})).toString('base64');
        } catch (error) { return undefined; }
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
            //return this.getCustomIcons();
            return this.getDefaultIcons();


        });

        session.setHandler('icon_picked', async ({icon, name}) => {

            device = devices[0];
            
            // let filePathAssets = './assets/icons/';
            // let file = data.icon;// + '.svg';
            
            // let filePath = './userdata/virtualdeviceicons/';
            // let iconName = device.data.id + '.svg';

            // if(await this.homey.app.fileExists(filePathAssets + file) && !await this.homey.app.fileExists(filePath + iconName)){
            //     await this.homey.app.copyFile(filePathAssets + file, filePath + iconName , filePath);
            // }
            let iconpath = "../../." +(await this.homey.app.setDeviceIconFromDefault({device, icon:icon}));
            
            //var iconPath = "../../../userdata/virtualdeviceicons/"  + iconName;
            device.data.icon = iconpath;//iconPath;
            device.icon = iconpath;//iconPath;
            device.name = name;
            return device;
            // This is for custom icon picked
            // device = devices[0];
            // var iconPath = "../../../userdata/customicons/" + data.icon.file+'.svg';
            // device.data.icon = iconPath;
            // device.icon = iconPath;
            // return device;
        });
        
        session.setHandler('icon_save', async ({image, name})=> {     
            device = devices[0];       
            var icon = await DeviceSetter.Current.createDeviceIcon({ type:'image/svg', buffer:image, id:device.data.id });              
            var iconPath = "../../." + icon.path;      
            device.data.icon = iconPath;
            device.icon = iconPath;
            if(name && name.length>0) device.name = name;
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
      capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
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




