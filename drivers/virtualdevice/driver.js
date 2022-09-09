"use strict";
//var util = require('../../lib/util/util.js');
//var variableManager = require('../../lib/variablemanagement/variablemanagement.js');

const Homey = require('homey');
const path = require('path');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');



module.exports = class VirtualDeviceDriver extends Homey.Driver {

    
    async onInit() {
        this.log('VirtualDeviceDriver onInit');
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
                        throw new Error(error.message.replace(cap.split('.')[0]+' ', ''));
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
                throw new Error(error.message.replace(cap.split('.')[0]+' ', ''));
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
        // var s = session;
        // await session.nextView();
        //console.log(JSON.stringify(await this.getCustomIcons()));

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

        session.setHandler('icon_picked', async (data) => {

            device = devices[0];
            
            // let filePathAssets = './assets/icons/';
            // let file = data.icon;// + '.svg';
            
            // let filePath = './userdata/virtualdeviceicons/';
            // let iconName = device.data.id + '.svg';

            // if(await this.homey.app.fileExists(filePathAssets + file) && !await this.homey.app.fileExists(filePath + iconName)){
            //     await this.homey.app.copyFile(filePathAssets + file, filePath + iconName , filePath);
            // }
            let icon = "../../." +(await this.homey.app.setDeviceIconFromDefault({device, icon:data.icon}));
            
            //var iconPath = "../../../userdata/virtualdeviceicons/"  + iconName;
            device.data.icon = icon;//iconPath;
            device.icon = icon;//iconPath;
            return device;
            // This is for custom icon picked
            // device = devices[0];
            // var iconPath = "../../../userdata/customicons/" + data.icon.file+'.svg';
            // device.data.icon = iconPath;
            // device.icon = iconPath;
            // return device;
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




