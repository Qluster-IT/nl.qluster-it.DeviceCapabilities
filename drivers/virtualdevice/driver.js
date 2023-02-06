"use strict";

//const zlib = require('zlip');

const Homey = require('homey');
const path = require('path');
const https = require('https');
const DeviceSetter = require('../../app');
const _ = require('lodash-core');
const { Defer, gzip, ungzip } = require('../../lib/proto');
const TYPES = ['status', 'text', 'number', 'button', 'boolean', 'list'];
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

const { AppsInfo } = require('../virtualdevice/appinfo');

let allDevices,  allDrivers, actionCards, conditionCards, triggerCards, allUsers, allVariables, allTokens, allPrivateKeys, allAdvancedFlows, allZones, allApps;
let app;

const TOPICS = {
    tfe : {
        German:{
            topicId:69584,
            topicUrl:'https://community.homey.app/t/the-flow-exchange-r-tauschen-sie-ihre-flows-mit-anderen-aus',
            helpTopicUrl:"https://community.homey.app/t/the-flow-exchange-r-helfen-und-fragen-stellen/69807"
        },
        English:{
            topicId:68981,
            topicUrl:'https://community.homey.app/t/the-flow-exchange-r-exchange-your-flows-with-others',
            helpTopicUrl:'https://community.homey.app/t/app-pro-device-capabilities-enhance-the-capabilities-of-devices/43287'
        },    
        HCS:{
            topicId:69556,
            topicUrl:'https://community.homey.app/t/the-flow-exchange-r-hcs-edition-exchange-your-flows-with-others',
            helpTopicUrl:'https://community.homey.app/t/app-pro-device-capabilities-enhance-the-capabilities-of-devices/43287'
        }
    },
    avd: {
        German:{
            topicId:69583,
            topicUrl:'https://community.homey.app/t/teilen-sie-ihr-gerat-erweiterte-virtuelle-gerate-aus-den-geratefahigkeiten',
            helpTopicUrl:"https://community.homey.app/t/app-pro-erweitertes-virtuelles-gerat-device-capabilities-app-mit-eindeutiger-textstatus-anzeige/69806"
        },
        English:{
            topicId:68676,
            topicUrl:'https://community.homey.app/t/share-your-device-advanced-virtual-devices-from-device-capabilities',
            helpTopicUrl:'https://community.homey.app/t/app-pro-advanced-virtual-device-device-capabilities-app-with-unique-text-status-indicator/68198'
        },
        HCS:{
            topicId:69558,
            topicUrl:'https://community.homey.app/t/share-your-device-hcs-edition-advanced-virtual-devices-from-device-capabilities',
            helpTopicUrl:'https://community.homey.app/t/app-pro-advanced-virtual-device-device-capabilities-app-with-unique-text-status-indicator/68198'
        }
    }
};

module.exports = class VirtualDeviceDriver extends Homey.Driver {
    async sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
    async onInit() {
        app = this.homey.app;
        this.log('VirtualDeviceDriver onInit');
        //this.getTefTemplatesFromPosts();

		//this.log("Capabilities", Object.keys(app.manifest.capabilities).length);
        this.activeAvdSource = await this.homey.settings.get('activeAvdSource');
        this.activeTfeSource = await this.homey.settings.get('activeTfeSource');
        this.homey.settings.on('set', async (settingName)=> {
            // if(settingName=='activeAvdSource') {
            //     this.activeAvdSource = await this.homey.settings.get('activeAvdSource');
            // } else 
            if(settingName=='activeTfeSource') {
                this.activeTfeSource = await this.homey.settings.get('activeTfeSource');
            }           
        });
        
        //true || process.env.DEBUG === '1' || 
        if(this.getVersionChanged(this.homey.settings.get('Version') || "0.0.0")) {
            await this.homey.settings.set('Version', app.manifest.version);
        } else {
            try {             
                this.defaultIcons =  await this.homey.settings.get('DefaultIcons');
            } catch (error) {
                
            }
        }
        await this.sleep(1000);
        // let filesandfolders1 = await app.readdir('/');
        // let filesandfoldersApp = await app.readdir('/app');

        /// Get Compressed Icon File
        if(false) {
            //Dont forget to add and remove the Icons to the App
            // and get it from: 
            let strCompressedFile = '';
            let _path = this.homey.app.appPath+ 'icons/';
            let filesandfolders = await app.readdir(_path);
            
            let f = async (dir, file)=> {
                let p=_path + file;
                strCompressedFile+= p + "\r\n";
                strCompressedFile+= await this.getIconZipped(p) + "\r\n\r\n";
            };

            for (let i = 0; i < filesandfolders.length; i++) {
                const faf = filesandfolders[i];
                let stats = await app.fsstat(path.join(_path,faf));
                if(stats.isDirectory()) {
                    let files = await app.readdir(path.join(_path,faf));
                    for (let j = 0; j < files.length; j++) {
                        const file = files[j];
                        let stats = await app.fsstat(path.join(_path,faf, file));
                        if(stats.isFile() ) await f(faf, path.join(faf, file));
                    }

                } else if(stats.isFile()) await f('Unsorted', faf); //isFile!                
            }
            //const buf = new Buffer(strCompressedFile, 'base64');
            app.writeFile('/userdata/icons.compressed', strCompressedFile);
            let zipped = await gzip(strCompressedFile);
            app.writeFile('/userdata/icons.zipped', zipped);
        }

        
        ///  Load all default icons into a array
        if(!this.defaultIcons ) {
            let defaultPath = app.DEFAULT_ICONS_PATH; 
        //let filesandfolders1 = await app.readdir(defaultPath);
    
            //save all files from compressed icon files first
            let zippedIcons = await app.readFile(this.homey.app.appPath+ 'assets/icons.zipped');
            let compressedIcons = (await ungzip(zippedIcons)).toString('utf8');
            let icons = compressedIcons.split('\r\n\r\n');
            icons.pop();
            if(!(await app.exists(`${defaultPath}`))) await app.mkdir(`${defaultPath}`);
                    
            for (let i = 0; i < icons.length; i++) {
                const icon = icons[i];
                if(!icon) continue;
                let path = icon.split('\r\n')[0];
                const subpath = path.replace('./assets/icons/', '').split('/')[0];
                path = path.replace('./assets/icons/', defaultPath);
                if(!await app.exists(path)) {
                    try {                        
                        let unzipped = await this.unzip(icon.split('\r\n')[1]);
                        if(!(await app.exists(`${defaultPath}${subpath}/`))) await app.mkdir(`${defaultPath}${subpath}/`);
                        await app.writeFile(path, unzipped);
                    } catch (error) {
                        this.error(error);
                    }
                }
            }



            this.defaultIcons = {};
            let filesandfolders = await app.readdir(defaultPath);
            
            let f = (dir, file)=> {
                if(!this.defaultIcons[dir]) this.defaultIcons[dir] = {title:dir, icons:[]};
                this.defaultIcons[dir].icons.push(file);
                    
            };

            for (let i = 0; i < filesandfolders.length; i++) {
                const faf = filesandfolders[i];
                let stats = await app.fsstat(path.join(defaultPath,faf));
                if(stats.isDirectory()) {
                    let files = await app.readdir(path.join(defaultPath,faf));
                    for (let j = 0; j < files.length; j++) {
                        const file = files[j];
                        let stats = await app.fsstat(path.join(defaultPath,faf, file));
                        if(stats.isFile() ) f(faf, path.join(faf, file));
                    }

                } else if(stats.isFile()) f('Unsorted', faf); //isFile!                
            }
            await this.homey.settings.set('DefaultIcons', this.defaultIcons);

            /// Set custom icons with default if not set yet.
            let categories = (await this.getCustomIcons()).icons;
			for(let i=0;i<categories.length;i++)
			{
				for(let j=0;j<categories[i].icons.length;j++){
                    if(categories[i].icons[j].defaultIcon=='') continue;
					let filePathAssets = app.DEFAULT_ICONS_PATH;
                    let file = categories[i].icons[j].defaultIcon + '.svg';
                    
                    let filePath = '/userdata/customicons/';
					let iconName = categories[i].icons[j].file + '.svg';

                    if(await app.fileExists(filePathAssets + file) && !await app.fileExists(filePath + iconName)){
                        await app.copyFile(filePathAssets + file, filePath + iconName , filePath);
                    }
				}
			}

        }
        
        var set_camera_image = this.homey.flow.getActionCard('virtualdevice_set_camera_image');
			set_camera_image
            .registerRunListener(async (args, state) => {
                if (!args || !args.device) return false;
                    let fieldId = args.field? args.field.id : 'status1';
                    let fieldIds = [fieldId];
                    try {
                        if(fieldId.startsWith('set_all_')) {
                            fieldIds.length=0;
                            let type = fieldId.split('_')[2];
                            const fieldCount = args.device.Settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0;
                            for(var i=1;i<=fieldCount;i++){
                                if(args.device.Settings[type+i+'Name'] && args.device.Settings[type+i+'Name'].length>0) fieldIds.push(type+i);
                            }
                        }
                        for (let fieldIdIndex = 0; fieldIdIndex < fieldIds.length; fieldIdIndex++) {
                            const fieldId = fieldIds[fieldIdIndex];
                            if(args.device.Cameras[fieldId]) {
                                args.device.Cameras[fieldId].imageByFlow = args.droptoken;                                
                                await args.device.setCameraImageFromRef(fieldId);
                            }
                        }
                        return true;
					} catch (error) {
                        throw new Error(error);
					}
            });
            set_camera_image.getArgument('field').registerAutocompleteListener(this.registerAutocompleteFieldFromName('virtualdevice_set_camera_image', true));
                

        
        var action_virtualdevice_sets = ['virtualdevice_set_text', 'virtualdevice_set_number', 'virtualdevice_set_boolean', 'virtualdevice_set_button', 'virtualdevice_set_list', 'virtualdevice_set_status', 'virtualdevice_set_status_optionalnumber'];
        action_virtualdevice_sets.forEach((action => {
			var set_value = this.homey.flow.getActionCard(action);
			set_value
				.registerRunListener((async (args, state) => {
                    if (!args || !args.device) return false;
                    let fieldId = args.field? args.field.id : 'status1';
                    let fieldIds = [fieldId];
                    try {
                        if(fieldId.startsWith('set_all_')) {
                            fieldIds.length=0;
                            let type = fieldId.split('_')[2];
                            const fieldCount = args.device.Settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0;
                            for(var i=1;i<=fieldCount;i++){
                                if(args.device.Settings[type+i+'Name'] && args.device.Settings[type+i+'Name'].length>0)
                                fieldIds.push(type+i);
                            }
                        }
                        for (let fieldIdIndex = 0; fieldIdIndex < fieldIds.length; fieldIdIndex++) {
                            const fieldId = fieldIds[fieldIdIndex];
                            let cap = args.device.getStoreValue(fieldId);
                            if(!cap) throw new Error(this.homey.__("field-not-set", {fieldId}) || (fieldId + '__fieldId__ has not been set. Goto Device Settings and add the field.'));
                            try {                             
                                let dontUpdateField = false;
                                let value;
                                let triggerCard;
                                let statusTextChanged = false;
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
                                    case 'virtualdevice_set_list':
                                        if(args.value!==undefined && args.value!=='undefined') value = args.value?args.value.id:'';
                                        else value = null;
                                        triggerCard = this.triggerFlowList;
                                        break;
                                    case 'virtualdevice_set_status':
                                    case 'virtualdevice_set_status_optionalnumber':                                
                                        triggerCard = this.triggerFlowStatus;
                                        if(args.text!==undefined && args.text!=='undefined') {
                                            var opt = args.device.getCapabilityOptions(cap);
                                            if (!opt) opt = {};
                                            if(opt.units!=args.text) {
                                                statusTextChanged = true;
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
                                let statusNumberChanged = false;
                                let statusNumberSet = false;
                                if(args.device.hasCapability(cap) && !dontUpdateField) {
                                    statusNumberSet = true;
                                    statusNumberChanged = true;
                                    await this.setSecondCapability({ val: value, device:args.device , fieldId});
                                    await args.device.setCapabilityValue(cap, value);
                                    // //Remove logs here
                                    // let a = await this.homey.insights.getLogs();
                                    // let b = a;
                                    // //await this.homey.insights.deleteLog({id:secondCap});
                                }
                                if(args.mode==="executewhencards" && triggerCard) {
                                    let oldValue = args.device.getStoreValue(fieldId+"Value");
                                    statusNumberChanged = statusNumberChanged && oldValue!==value;
                                    if(triggerCard == this.triggerFlowStatus) {
                                        triggerCard.call(this,args.device, args.text , value, { field: { id: fieldId }, textChanged:statusTextChanged, textSet:true, numberChanged:statusNumberChanged, numberSet:statusNumberSet });
                                    } else 
                                    triggerCard.call(this,args.device, value, { field: { id: fieldId }, changed:value!==oldValue });
                                }
                                await args.device.setStoreValue(fieldId+"Value", value);
                            
                            } catch (innerError) {
                                throw new Error(innerError.message.replaceAll(cap.split('.')[0]+' ', ''));
                            }   
                        }
                        return true;
					} catch (error) {
                        throw new Error(error);
					}
				}).bind(this));
                if(action.endsWith('_text') || action.endsWith('_number') || action.endsWith('_boolean') || action.endsWith('_button') || action.endsWith('_list')) 
                    set_value.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(action, true));
                if(action.endsWith('_list')) 
                    set_value.getArgument('value').registerAutocompleteListener(this.registerAutocompleteListValue(action));
                
		}).bind(this));

        var virtualdevice_set_expression = this.homey.flow.getActionCard('virtualdevice_set_expression');
        virtualdevice_set_expression.registerRunListener(async (args, state) => {
            let _fieldId = args.field ? args.field.id : undefined;
            let fieldIds = [_fieldId];
            try {
                if(_fieldId.startsWith('set_all_')) {
                    fieldIds.length=0;
                    let type = _fieldId.split('_')[2];
                    const fieldCount = args.device.Settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0;
                    for(var i=1;i<=fieldCount;i++){
                        if(args.device.Settings[type+i+'Name'] && args.device.Settings[type+i+'Name'].length>0)
                        fieldIds.push(type+i);
                    }
                }
                for (let fieldIdIndex = 0; fieldIdIndex < fieldIds.length; fieldIdIndex++) {
                    let fieldId = fieldIds[fieldIdIndex];
                    
                    let cap = fieldId && fieldId.indexOf('.')>-1 ? fieldId : args.device.getStoreValue(fieldId);
                    if(fieldId && fieldId.indexOf('.')>-1) fieldId = fieldId.split('.')[1];
                    
                    cap = args.device.getStoreValue(fieldId) || cap;
                    let type = this.getTypeFromField(fieldId);
                    //let  energy = args.device.getEnergy();
                    try {
                        let oldValue = args.device.getStoreValue(fieldId+"Value");
                        let value = null;
                                
                        if(args.expression!==undefined && args.expression!=='undefined') {
                            value = app.runSandBox(args.expression);                
                        }
                        await this.setSecondCapability({ val:value, device:args.device , fieldId});
                        await args.device.setCapabilityValue(cap, value);
                        await args.device.setStoreValue(fieldId+"Value", value);

                        if(args.mode==="executewhencards") {
                            if(type=="status")this.triggerFlowStatus(args.device, null , value , { field: { id: fieldId }, textChanged:false, textSet:false, numberChanged:oldValue!==value, numberSet:true });
                            else if(this['triggerFlow'+this.capitalizeFirstLetter(type)]) this['triggerFlow'+this.capitalizeFirstLetter(type)].call(this,args.device, value, { field: { id: fieldId }, changed:value!==oldValue });
                        }                   
                    } catch (error) {
                        throw new Error(error.message.replaceAll(cap.split('.')[0]+' ', ''));
                    }
                }
                return true; 
            } catch(err) {                
                throw new Error(err);
            }
        });
        virtualdevice_set_expression.getArgument('field').registerAutocompleteListener(this.registerAutocompleteFieldExpression());

        let triggers = ['trigger_virtualdevice_button', 'trigger_virtualdevice_boolean', 'trigger_virtualdevice_number', 'trigger_virtualdevice_text', 'trigger_virtualdevice_status', 'trigger_virtualdevice_list'];
        triggers.forEach((trigger => {
			var triggerCard = this.homey.flow.getDeviceTriggerCard(trigger);
            this[trigger]= triggerCard;
			triggerCard
				.registerRunListener(async (args, state) => {
                    try {
					    let r = ((state.field && args.field && args.field.id==state.field.id && (args.mode!="changed" || state.changed)) || 
                        ((args.statusfield==='either' || args.statusfield==='text') && ((args.mode!="changed" && state.textSet) ||  state.textChanged)) ||
                        ((args.statusfield==='either' || args.statusfield==='number') && ((args.mode!="changed" && state.numberSet) ||  state.numberChanged))
                        ) || false;
                        return r;
					} catch (error) {
						this.error('trigger_virtualdevice_*:');
						this.error(error);
					}
				});
            if(!trigger.endsWith('_status')) triggerCard.getArgument('field').registerAutocompleteListener(this.registerAutocompleteField(trigger, false));
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
		

        var virtualdevice_update_capability_name = this.homey.flow.getActionCard('virtualdevice_update_capability_name');
        virtualdevice_update_capability_name.registerRunListener(async (args, state) => {
            let fieldId = args.field.id;
            let cap = args.field && args.field.id.indexOf('.')>-1 ? args.field.id : args.device.getStoreValue(fieldId);
            if(fieldId && fieldId.indexOf('.')>-1) fieldId = fieldId.split('.')[1];
            cap = args.device.getStoreValue(fieldId) || cap;
            let type = this.getTypeFromField(fieldId);
            //let  energy = args.device.getEnergy();
            try {
                let opt;
                try {
                    opt = args.device.getCapabilityOptions(cap);
                } catch (error) {}
                if (!opt) opt = {};
                opt.title = args.name;
                try {
                    await args.device.setCapabilityOptions(cap, opt);
                } catch (error) {}

                return true;                    
            } catch (error) {
                //this.log('action_virtualdevice_set_name:');
                //this.error(error);
                throw new Error(error.message.replaceAll(cap.split('.')[0]+' ', ''));
            }
        });
        virtualdevice_update_capability_name.getArgument('field').registerAutocompleteListener(this.registerAutocompleteFieldExpression({useSetAll:false}));


        this.homey.settings.on('set', (async function(settingName) {
            if(settingName=='customIconNames') {
                this.customIconNames = await this.homey.settings.get('customIconNames');
                }                
        
        }).bind(this));
        this.customIconNames = await this.homey.settings.get('customIconNames');
        
            
            //this.log('Driver size: ', app.roughSizeOfObject(this));
    }

    async httpsGet({url}) {
        let defer = new Defer();
        const https = require('https');

        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                defer.resolve(data);
            });

            }).on("error", (err) => {defer.reject(err);});
        return defer.promise;
    }
    decodeHtml (string) {
        //var string = new String(this);
        string = string.replace(/&lt;/g, "<");
        string = string.replace(/&gt;/g, ">");
        string = string.replace(/&quot;/g,  "\"");
        string = string.replace(/&39;/g,  "'");
        string = string.replace(/&amp;/g, "&");
        return string;
    }
    async getTefTemplatesFromPostsByIdAndTopic({postId, topicId, topicUrl, type}) {
        try {                
            let topicHtml = await this.httpsGet({url:`${topicUrl}/${topicId}/${postId}`});
            if(topicHtml) {

                let preloaderString = topicHtml.matchAll(/<div class="hidden" id="data-preloaded" data-preloaded="(.*?)"/gmsi);
                let preloaderFound = preloaderString? [...preloaderString] : [];
                let preloader;                
                let templates = [];
                let postsFound ;
                let lastNumberFound = 0;
                
                if(preloaderFound && preloaderFound.length) {
                    preloader = this.decodeHtml(preloaderFound[0][1]);
                    try {
                        let json = JSON.parse(preloader);
                        let topicInfo = JSON.parse(json['topic_'+topicId]);
                        let a=topicInfo;
                        postsFound = _.filter(topicInfo.post_stream.posts, p=>p.post_number>=postId).length;
                        _.each(topicInfo.post_stream.posts, (post, postIndex)=>{
                            let postId = post.id;
                            let postNumber = post.post_number;
                            lastNumberFound = postNumber;
                    
                            let postCreatedOn = new Date(post.created_at);
                            let autherName = post.display_username;
                            let autherId = post.user_id;

                            let postText = post.cooked;
                            if(postText.startsWith('\n')) postText=postText.substring(1);//.trim();
                    
                            let tefs = [], header;
                            
                            let tefMatches = postText.matchAll(/(?:<p>.{0,2}TEF.{0,2}:.{0,2}<\/p>.{0,2})?(?:<p>.{0,2}THE Exchanger? File.*?:.{0,2}<\/p>.{0,2})?(?:<ul>.{0,2}<li>(?:.{0,2}The Exchanger? File.*?:.{0,2})?(?:.{0,2}TEF.*?:.{0,2})?<\/li>.{0,2}<\/ul>.{0,2})?<pre><code class="lang-auto">.{0,10}((?:\[TEF:){1}(.+):(?:")?)??(H4s(?:.*?))(?:")?(?:])?(?:\/TEF])?(?:(?:\s)+.*?)?<\/code><\/pre>/gmsi);
                            let tefsFound = tefMatches? [...tefMatches] : [];
                            for(let j=0;j<tefsFound.length;j++) {
                                if(tefsFound[j].length>1) {
                                    if(tefsFound[j][2]) {
                                        if(type==='avd' && tefsFound[j][2].indexOf('AVD')===-1) continue;
                                        if(type==='flows' && (tefsFound[j][2].indexOf('FLOWS')===-1 || tefsFound[j][2].indexOf('AVD')>-1)) continue;
                                    }
                                    tefs.push(tefsFound[j][3]);
                                    postText = postText.replace(tefsFound[j][0], '');
                                }
                            }
                            if(tefs.length) {
                                let headerMatches = postText.matchAll(/<h1>.*?(<a.*?<\/a>)!?(.*?)<\/h1>/gmsi);
                                let headersFound = headerMatches? [...headerMatches] : [];
                                if(headersFound && headersFound.length>0 && headersFound[0].length>2) header = headersFound[0][2].trim();
                                //console.log(header);
                                if(header && header.length>0) templates.push({
                                    id:postId,
                                    number:postNumber,
                                    post:postText,
                                    createdOn:postCreatedOn,
                                    autherId,
                                    header,
                                    tefs,
                                    topicId
                                });
                            }
                        });
                        
                    } catch (error) {
                        
                    }
                }
                //if(templates.length) return {templates, postsFound};

                let posts = topicHtml.matchAll(/(?:<div\sid=\'post_.{1,4}\'){1}(?:.*?)(?:itemtype="http:\/\/schema\.org\/Person")(?:.*?)(?:href='(.*?)\')(?:.*?)(?:itemprop='name'>)(.*?)(?:<\/)(?:.*?)<span itemprop='position'>(?:#)?([\d]*)<\/span>.*?<div class='post' itemprop='articleBody'>(.*?)<meta itemprop='headline'(?:.*?)(?:post-likes'>)([0-9]*)(\s)?/gmsi);
                //Crashes - Above
                //let posts = topicHtml.matchAll(/(?:<div\sid=\'post_.{1,4}\')(.*?)<meta itemprop='headline'(?:.*?)(?:post-likes'>)([0-9]*)(\s)?/gmsi);

                let matchesFound = posts? [...posts] : [];
                postsFound = postsFound===undefined ? matchesFound.length : postsFound;
                for (let i = 0; i < matchesFound.length; i++) {
                    const postNumber = Number.parseInt(matchesFound[i][3]);
                    const likes = matchesFound[i][2] ? Number.parseInt(matchesFound[i][2]) : 0;
                    
                    // const matchText = matchesFound[i][1];                    
                    // let postsData = matchText.matchAll(/(?:.*?)(?:itemtype="http:\/\/schema\.org\/Person")(?:.*?)(?:href='(.*?)\')(?:.*?)(?:itemprop='name'>)(.*?)(?:<\/)(?:.*?)<span itemprop='position'>([\d]*)/gmsi);
                    // let postsNumberMatchesFound = postsData? [...postsData] : [];                    
                    // const postNumber = Number.parseInt(postsNumberMatchesFound[0][3]);

                    //let post = matchesFound[i][4];
                    //if(post.startsWith('\n')) post=post.substring(1);
                    let template = _.find(templates, t=>t.number==postNumber);
                    if(template) template.likes = likes;
                }
                return {templates, postsFound, lastNumberFound};
            }
        } catch (error) {
            this.error(error);
        }
        return {templates:[], postsFound:0};
    }


    
    async getTefTemplatesFromPosts() {
        let templates = [];
        let run = true;
        const postsPerRun = 20;
        let runs = 0;
        let lastNumber = 0;
        let topic = TOPICS.tfe[this.activeTfeSource] || TOPICS.tfe.English;
        
        while (run) {            
            //let _templates = await this.getTefTemplatesFromPostsById({postId:(runs===0?0:runs*postsPerRun) + 1});
            let _templates = await this.getTefTemplatesFromPostsById({postId:lastNumber+1, topicId:topic.topicId, topicUrl:topic.topicUrl});
            templates = _.union(templates, _.filter(_templates.templates, _t=>!_.find(templates, t=>t.number==_t.number)));
            if(lastNumber == _templates.lastNumberFound) run = false;
            lastNumber = _templates.lastNumberFound;
            if(_templates.postsFound<postsPerRun) run = false;
            runs++;
        }
        let settingName = !this.activeTfeSource || this.activeTfeSource==='English' ? '' : '_'+  this.activeTfeSource;
        this['tefTemplates'+settingName] = templates;
        await this.homey.settings.set('tefTemplates'+settingName, templates);
        return templates;
    }
    async getTefTemplatesFromPostsById({topicId, topicUrl, postId}) {
        return await this.getTefTemplatesFromPostsByIdAndTopic({type:'flows', postId, topicId:topicId, topicUrl:topicUrl});
    }
    

    // async openTemplate({template}) {
    //     try {                
    //         let templateHtml = await this.httpsGet({url:'https://community.homey.app/t/the-flow-exchange-r-exchange-your-flows-with-others/68981/' + template.postId});
    //         if(templateHtml) {
    //             templateHtml = _.last(templateHtml.split('<span itemprop=\'position\'>#'+template.postId+'</span>'));
    //             templateHtml = templateHtml.split('<div class=\'post\' itemprop=\'articleBody\'>')[1];
    //             templateHtml = _.first(templateHtml.split('<meta itemprop=\'headline\''));
    //             templateHtml = templateHtml.replaceAll('\n', '');
    //             templateHtml = templateHtml.trimStart();
    //             template.post = templateHtml;
    //             let ulTemplates = templateHtml.matchAll(/(<p>TEF:<\/p>)?<pre><code class="lang-auto">(.*?)<\/code><\/pre>/gms);
    //             if(ulTemplates) {                
    //                 let matchesFound = [...ulTemplates];
    //                 for (let i = 0; i < matchesFound.length; i++) {
    //                     template.post = template.post.replace(matchesFound[i][0], '');
    //                     template.tef = matchesFound[i][2].trim();
    //                     template.updatedOn = Date.now();
    //                 }
    //             }
    //             let t = _.find(this.tefTemplates, _t=>_t.postId==template.postId);
    //             if(t) {
    //                 t.post = template.post;
    //                 t.tef = template.tef;                    
    //                 await this.homey.settings.set('tefTemplates', this.tefTemplates); 
    //             }
    //             return {template};
    //         }
    //     } catch (error) {
    //         this.error(error);
    //     }
    // }


    async getAvdTemplatesFromPosts() {
        let templates = [];
        let run = true;
        const postsPerRun = 20;
        let runs = 0;
        let lastNumber = 0;
        let topic = TOPICS.avd[this.activeAvdSource] || TOPICS.avd.English;
        
        while (run) {            
            //let _templates = await this.getAvdTemplatesFromPostsById({postId:(runs===0?0:runs*postsPerRun) + 1});
            let _templates = await this.getAvdTemplatesFromPostsById({postId:lastNumber+1, topicId:topic.topicId, topicUrl:topic.topicUrl});
            templates = _.union(templates, _.filter(_templates.templates, _t=>!_.find(templates, t=>t.number==_t.number)));
            if(lastNumber == _templates.lastNumberFound) run = false;
            lastNumber = _templates.lastNumberFound;
            if(_templates.postsFound<postsPerRun) run = false;
            runs++;
        }
        let settingName = !this.activeAvdSource || this.activeAvdSource==='English' ? '' : '_'+  this.activeAvdSource;
        this['avdTemplates'+ settingName] = templates;
        await this.homey.settings.set('avdTemplates'+ settingName, templates);
        return templates;
    }
    async getAvdTemplatesFromPostsById({topicId, topicUrl, postId}) {
        return await this.getTefTemplatesFromPostsByIdAndTopic({type:'avd', postId, topicId:topicId, topicUrl:topicUrl});
    }
    async getTopics() {
        return TOPICS;
    }
    

    getTypeFromField(fieldId) {
       return fieldId.startsWith('text') ? 'text' : 
            fieldId.startsWith('number') ? 'number' : 
            fieldId.startsWith('boolean') ? 'boolean' : 
            fieldId.startsWith('button') ? 'button' : 
            fieldId.startsWith('list') ? 'list' : 
            fieldId.startsWith('status') ? 'status' : 'unknown';
    }

    /**
     * 
     * @param {*} param0 
     * @returns True if value has changed
     */
    async setSecondCapability({fieldId, device, val, units}={}) {
        var type = fieldId.startsWith('text') ? 'Text' : 
            fieldId.startsWith('number') ? 'Number' : 
            fieldId.startsWith('boolean') ? 'Boolean' : 
            fieldId.startsWith('button') ? 'Button' : 
            fieldId.startsWith('list') ? 'List' : 
            fieldId.startsWith('status') ? 'measure_Status' : 'unknown';
        let cap = type+"."+fieldId;
        if(device.hasCapability(cap)) {
            if(units) {
                var opt = device.getCapabilityOptions(cap);
                if (!opt) opt = {};
                if(opt.units!=units) {
                    opt.units = units;
                    await device.setCapabilityOptions(cap, opt);
                    //return true;
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
        return {icons:r, iconnames:this.customIconNames, languagecode:await this.homey.i18n.getLanguage(), homeyId:  await this.homey.cloud.getHomeyId()};

    }

    getDefaultIcons() {
    return this.defaultIcons;        
    }

    getVersionChanged(versionUpdatedTo) {
        if(app.manifest.version!=versionUpdatedTo) {
			let versionArr = app.manifest.version.split(".");
			let versionUpdatedToArr = versionUpdatedTo.split(".");
			return (
				parseInt(versionArr[0])> parseInt(versionUpdatedToArr[0]) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])> parseInt(versionUpdatedToArr[1])) || 
				(parseInt(versionArr[0])=== parseInt(versionUpdatedToArr[0]) && parseInt(versionArr[1])=== parseInt(versionUpdatedToArr[1]) && parseInt(versionArr[2])> parseInt(versionUpdatedToArr[2]))
				);
		}
        return false;
    }

    getTypeFromAction(action) {
        return action.split('_')[2];
    }

    

    registerAutocompleteFieldFromName(action, useAll) {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;
            var type = this.getTypeFromAction(action);// action.split('_')[2];
            var ret = [];
            let actionAllSet = false;
            const fieldCount = type=="status" ? 1 : (settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
            for(var i=1;i<=fieldCount;i++){
                let name = settings['camera' + i + 'Name'];
                if(name) {
                    if(!actionAllSet) actionAllSet = ret.push | ret.push({id:'set_all_'+type, name:'All ' + this.capitalizeFirstLetter(type) + 's' });
                    var typeText = type=='text' ? 'Text ' +i : type=='number' ? 'Number ' +i : type=='boolean' ? 'Yes/No ' +i : type=='button' ? 'Button ' +i :  type=='list' ? 'List ' +i :  type=='camera' ? 'Camera ' +i : 'unknown';
                    ret.push({'id':type + i, 'name':name || typeText, description:typeText});
                }
            }
          return ret;
        };
    }


    registerAutocompleteField(action, useAll) {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;
            var type = this.getTypeFromAction(action);// action.split('_')[2];
            var ret = [];
            let actionAllSet = false;
            const fieldCount = type=="status" ? 1 : (settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
            for(var i=1;i<=fieldCount;i++){
                let cap = args.device.getStoreValue(type + i);
                if(cap) {
                    if(!actionAllSet) actionAllSet = ret.push | ret.push({id:'set_all_'+type, name:'All ' + this.capitalizeFirstLetter(type) + 's' });
                    var typeText = type=='text' ? 'Text ' +i : type=='number' ? 'Number ' +i : type=='boolean' ? 'Yes/No ' +i : type=='button' ? 'Button ' +i :  type=='list' ? 'List ' +i : type=='camera' ? 'Camera ' +i : 'unknown';
                    ret.push({'id':type + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                }
            }
          return ret;
        };
    }
    registerAutocompleteFieldExpression({useSetAll} = {}) {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;
            let ret = [];
            let retSetAll = [];
            let caps = args.device.getCapabilities();
            let types = ['status', 'text', 'number', 'boolean', 'button', 'list'];
            for (let k = 0; k < types.length; k++) {
                const type = types[k];                
                let actionAllSet = false;
                const fieldCount = type=="status" ? 1 : (settings['numberOf'+this.capitalizeFirstLetter(type)+'Fields'] || 0);
                for(let i=1;i<=fieldCount;i++){
                    let cap = args.device.getStoreValue(type + i);
                    if(cap) {
                        if(!actionAllSet && useSetAll!==false && type!=='status') actionAllSet = retSetAll.push | retSetAll.push({id:'set_all_'+type, name:'All ' + this.capitalizeFirstLetter(type) + 's' });
                    
                        var typeText = type=='text' ? 'Tekst ' + i : type=='number' ? 'Number ' + i : type=='boolean' ? 'Yes/No ' + i : type=='button' ? 'Button ' + i : type=='status' ? 'Status' : type=='list' ? 'List' : 'unknown';
                        ret.push({'id':type + i, 'name':args.device.getCapabilityOptions(cap).title || typeText, description:typeText});
                    }
                    
                }
            }
            if(retSetAll.length) ret = _.union(retSetAll, ret);
          return ret;
        };
    }

    registerAutocompleteListValue(action) {
        return async( query, args ) => {
            let settings = args.device.Settings;
            if(!settings) return;            
            let cap = args.device.getStoreValue(args.field.id);
            let dev = this.homey.app.devices[args.device.__id];
            let values = dev==null?null : dev.capabilitiesObj && dev.capabilitiesObj[cap] ?  dev.capabilitiesObj[cap].values : undefined;
            return values;
            //let a = 0;
            //var type = this.getTypeFromAction(action);
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
    async triggerFlowList(device, value, state) {
        return await this.trigger_virtualdevice_list.trigger(device, {value:value===null?'':value} , state);
    }
    async triggerFlowStatus(device, text, number, state) {
        return await this.trigger_virtualdevice_status.trigger(device, {text:text===null || text===undefined?'':text, number:number===null || number===undefined?0:number} , state);
    }
    // This method is called when a user is adding a device
    // and the 'list_devices' view is called
    async onPairListDevices(deviceName) {//}, withIcon) {
        let index = 0;
        let devices = this.homey.drivers.getDriver('virtualdevice').getDevices();

        //var count = Object.keys(devices).length;
        for (const key in devices) {
            if (Object.hasOwnProperty.call(devices, key)) {
                const element = devices[key];
                try {                    
                    let _id = element.getData().id;
                    let nr =Number.parseInt(_id.split('_')[1]);
                    index = Math.max(index,nr);
                } catch (error) {
                    //index = Math.max(index,nr);
                }

            }
        }
        if(deviceName) {        
            let nr =Number.parseInt(deviceName.split('_')[1]);
            index = Math.max(index,nr);
        }
        let id = '_'+(index+1).toString();
        
        let device = {
            name: 'Advanced Virtual Device '+(index+1),
            data: {
                id: 'DeviceCapabilityVirtualDevice'+id
            }
        };
        if(true) {
            var iconPath = "../../../userdata/virtualdeviceicons/" + device.data.id + ".svg";    
            device.data.icon = iconPath;
            device.icon = iconPath;
        }
        return [device];
    }

      
    async loadAdvancedFlows() {
        let api = await app.refreshHomeyAPI();
        return _.mapValues(await api.flow.getAdvancedFlows(), af => { return { id: af.id, name:af.name, cards:_.mapValues(af.cards, card=> {return {ownerUri:card.ownerUri, id:card.id};}) }; });
    }
    async loadStuff({reload, reloadAf} = {}) {
        this.log('LoadStuff reload:', reload);
        let api = await app.refreshHomeyAPI();
        allDevices = app.devices;
        allZones = app.zones;
        allApps = app.apps;
        
        allUsers = !reload && allUsers ? allUsers : _.mapValues(await api.users.getUsers(), ({name, athomId, avatar})=>{ return {name, athomId, avatar}; });
        allVariables = !reload && allVariables ? allVariables : _.mapValues(await api.logic.getVariables(), ({name, type})=>{ return {name, type}; });
        allTokens = !reload && allTokens ? allTokens : _.map(await api.flowToken.getFlowTokens(), ({uri, id, title, type, uriObj:{name}})=>{ return {uri, id, title, type, uriObj:{name}}; });
        allAdvancedFlows = (!reload || reloadAf===false) && allAdvancedFlows ? allAdvancedFlows : await this.loadAdvancedFlows();
        
        actionCards = !reload && actionCards ? actionCards : _.map(await api.flow.getFlowCardActions(), ({uri, id})=>{ return {uri, id}; });
        conditionCards = !reload && conditionCards ? conditionCards : _.map(await api.flow.getFlowCardConditions(), ({uri, id})=>{ return {uri, id}; });
        triggerCards = !reload && triggerCards ? triggerCards : _.map(await api.flow.getFlowCardTriggers(), ({uri, id})=>{ return {uri, id}; });
        
        if(reload || !allPrivateKeys) {
            allPrivateKeys = [api._token, await this.homey.cloud.getHomeyId()];
            if(api.session) allPrivateKeys.push(api.session.id);
            _.each(allUsers, u=>allPrivateKeys.push(u.athomId));
        }
        if(this.loadStuffTimer) clearTimeout(this.loadStuffTimer);
        this.loadStuffTimer = setTimeout(()=>{
            this.log('LoadStuff cleared.');
            allUsers = null;
            allVariables = null;
            allTokens = null;
            allAdvancedFlows = null;
            actionCards = null;
            conditionCards = null;
            triggerCards = null;
            
            if(global && global.gc) global.gc();

        }, 10 * 60000); // clear every 10 minutes 
        this.log('LoadStuff done.');

        if(global && global.gc) global.gc();
        return api;
    }
    async getAdvancedFlows({ homey, query }) {
        try {
                
            //this.loadStuff();
            //return [];
            let defer = new Defer();
            defer.then(async ()=> { this.loadStuff({reload:true, reloadAf:false}); });

            allAdvancedFlows = await this.loadAdvancedFlows();
            setTimeout(()=> { defer.resolve(); }, 1);
            return _.sortBy(allAdvancedFlows, x=> x.name );
            //return _.sortBy(allAdvancedFlows, x=> (x.name.startsWith() ? '1.' :'0.') + x.name );

        } catch (error) {
            this.error(error);
        }
    }


    async getAdvancedFlowsJSON({ homey,   advancedflowsselected, dev, device, copyWithFlows=true }) {        
        function addDeviceToReplace(deviceId) {
            let _device = allDevices[deviceId];
            if(devicesToReplace && _device) devicesToReplace[deviceId] = {name:_device.name, class:_device.class};
        }
        function addZoneToReplace(zoneId) {
            let _zone = allZones[zoneId];
            if(zonesToReplace && _zone) zonesToReplace[zoneId] = {name:_zone.name};
        }
        let devicesToReplace = {};
        let usersToReplace = {};
        let variablesToReplace = {};
        let tokensToReplace = {};
        let zonesToReplace = {};
        //advancedflowsselected = advancedflowsselected || [];

        dev = dev || {};
        let api =await this.loadStuff();
        if(device && dev) dev.deviceName = device.getName();


        let advancedflowsselectedKeys = advancedflowsselected ? Object.keys(advancedflowsselected) : 0;
        let advancedflows = !copyWithFlows ? [] : _.filter(await api.flow.getAdvancedFlows(), x=> 
            ((advancedflowsselectedKeys && advancedflowsselectedKeys.indexOf(x.id)>-1 && advancedflowsselected[x.id]===true) ||
            (x.enabled && device && _.find(x.cards, c=>c.ownerUri=='homey:device:' + device.__id)))
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
                let id;
                if(card.ownerUri && card.ownerUri.startsWith('homey:device:') && (id=card.ownerUri.substring('homey:device:'.length))) {
                    if( Object.keys(devicesToReplace).indexOf(id)===-1 ) addDeviceToReplace(id) ;
                } else if(card.ownerUri && card.ownerUri.startsWith('homey:zone:') && (id=card.ownerUri.substring('homey:zone:'.length))) {
                    if( Object.keys(zonesToReplace).indexOf(id)===-1 ) addZoneToReplace(id) ;
                }
                if(card.droptoken) {
                    if(!card.args) card.args = {};
                    card.args._$droptoken$_ = card.droptoken;
                    delete card.droptoken;
                }
                if(card.args) for (const argKey in card.args) {
                    if (Object.hasOwnProperty.call(card.args, argKey)) {
                        //const argument = card.args[argKey];
                        if(card.ownerUri && card.ownerUri.startsWith('homey:app:') && (id=card.ownerUri.substring('homey:app:'.length))) {
                            if(AppsInfo[id] && AppsInfo[id].canCreateByName({argName:argKey}))  {
                                if(!tokensToReplace[id]) tokensToReplace[id] =  {name:allApps[id].name};
                            }
                            if(!tokensToReplace[id]) tokensToReplace[id] =  {name:allApps[id].name}; // Add an App always so whe now which apps are used.
                        }
                        switch (typeof(card.args[argKey])) {
                            case "string":
                                let a = card.args[argKey].matchAll(/\[\[homey:([a-zA-Z]+)[:]?([^:|]+)?[:|]?(.+?)]]/gm);// || card.args[argKey].matchAll(/^homey:([a-zA-Z]+)[:]?([^:|]+)?[:|]?(.+?)$/gm) ;
                                if(!a) continue;
                                let tokens = [...a];
                                if(tokens.length==0) {
                                    if((a=card.args[argKey].matchAll(/^homey:([a-zA-Z]+)[:]?([^:|]+)?[:|]?(.+?)$/gm))) tokens = [...a];
                                }
                                for (let i = 0; i < tokens.length; i++) {
                                    const tokenMatchs = tokens[i];
                                    //console.log(tokenMatchs[2]);
                                    switch (tokenMatchs[1]) {
                                        case "manager": 
                                            switch (tokenMatchs[2]) {
                                                case "presence":
                                                    let presenceId = tokenMatchs[3].substring(0,36);
                                                    let user = _.find(allUsers, (u, uKey)=>uKey==presenceId);
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
                                            let cap = allDevices[deviceId] && allDevices[deviceId].capabilitiesObj ? allDevices[deviceId].capabilitiesObj[capId] : null;
                                            let capType;
                                            let capName;
                                            //This is only needed because the other app was Paused
                                            // if(!cap) 
                                            //     cap = _.find(allTokens, t=>t.uri==='homey:device:'+deviceId && t.id===capId);
                                            if(cap) {
                                                capName = cap.title;
                                                capType = 'string';
                                                switch (cap.type) {
                                                    case "number":
                                                        capType = "number";
                                                        break;
                                                    case "boolean":
                                                        capType = "boolean";
                                                        break;
                                                }
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
                                            let appId = tokenMatchs[2];
                                            let tokenId = tokenMatchs[3];
                                                if(AppsInfo[appId] && AppsInfo[appId].byToken && AppsInfo[appId].byToken()){ //NOT IN USE!
                                                    let type = AppsInfo[appId].getType({argName:argKey, cardId:card.id});
                                                    if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                                    if(!tokensToReplace[appId].types) tokensToReplace[appId].types = {};
                                                    
                                                    if(!tokensToReplace[appId].types[type]) tokensToReplace[appId].types[type] = [];
                                                    if(!_.find(tokensToReplace[appId].types[type], x=>x.name===tokenId)) tokensToReplace[appId].types[type].push({name:tokenId});    
                                                    
                                                } else {
                                                    let token = _.find(allTokens, t=>t.uri=='homey:app:' + tokenMatchs[2] &&t.id == tokenId );                                            
                                                    if(token) {
                                                        if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:token.uriObj?token.uriObj.name:null, tokens:{}};
                                                        if(!tokensToReplace[appId].tokens) tokensToReplace[appId].tokens =  {};
                                                        if(!tokensToReplace[appId].tokens[token.id]) tokensToReplace[appId].tokens[token.id] =  {name:token.title, type:token.type};
                                                    }
                                                }
                                                
                                            if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                            break;
                                        case "zone": 
                                            let zoneId = tokenMatchs[2];
                                            let zone = _.find(allZones, (zone, zoneKey)=>zoneKey == zoneId );
                                            if(zone) {
                                                if(!zonesToReplace[zoneId]) zonesToReplace[zoneId] =  {name:zone.name};
                                            }
                                            
                                            break;                                                
                                    }
                                }
                                break;
                                
                            case "object":
                                let id = Object.keys(card.args[argKey]).indexOf('id')>-1? card.args[argKey].id : Object.keys(card.args[argKey]).indexOf('name')>-1? card.args[argKey].name : null;
                                if(id!==undefined && id!==null && card.ownerUri) {                                    
                                    if(card.ownerUri=='homey:manager:presence' || card.ownerUri=='homey:manager:mobile') {
                                        let user = _.find(allUsers, (u, uKey)=>uKey==id);
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
                                        
                                        let appId = card.ownerUri.substring(10);
                                        let token, autocomplete;// = _.find(allTokens, t=>t.uri=='homey:app:' + appIp &&t.id==id );
                                        
                                        if(AppsInfo[appId] && AppsInfo[appId].canCreateByName({argName:argKey})) {
                                            if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                        }
                                        else if((token = _.find(allTokens, t=>t.uri=='homey:app:' + appId &&t.id==id ))) {
                                            if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:token.uriObj?token.uriObj.name:null, tokens:{}};
                                            if(!tokensToReplace[appId].tokens) tokensToReplace[appId].tokens = {};
                                            if(!tokensToReplace[appId].tokens[token.id]) tokensToReplace[appId].tokens[token.id] =  {name:token.title, type:token.type};
                                        }
                                        if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                        // else {
                                        //     if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                        // }
                                    }
                                    
                                }
                                break;
                        }
                    }
                }
            });
        });
        if(Object.keys(zonesToReplace).length>0) dev.zonesToReplace = zonesToReplace;
        if(Object.keys(devicesToReplace).length>0) dev.devicesToReplace = devicesToReplace;
        if(Object.keys(usersToReplace).length>0) dev.usersToReplace = usersToReplace;
        if(Object.keys(variablesToReplace).length>0) dev.variablesToReplace = variablesToReplace;
        if(Object.keys(tokensToReplace).length>0) dev.tokensToReplace = tokensToReplace;

        dev.advancedflows = advancedflows;
        const devCopy = JSON.parse(JSON.stringify(dev));
        const devCopyMinified = this.minifyExchangerFile(devCopy);

        const stringy = this.removeKeys(JSON.stringify(dev));        
        const stringyMinified = this.removeKeys(JSON.stringify(devCopyMinified));        
        const compressed = this.getReplacedZippedForForum(Buffer.from(await gzip(stringy, {level:9} )).toString('base64'));
        const compressedMinified = this.getReplacedZippedForForum(Buffer.from(await gzip(stringyMinified, {level:9})).toString('base64'));
        dev.flowName = advancedflows && advancedflows.length ? _.first(advancedflows).name : null;
        let tefType = dev.flowName && dev.deviceName ? 'AVD,FLOWS' : dev.flowName ? 'FLOWS' : dev.deviceName ? 'AVD' : 'UNKNOWN';					
        let s = "[tef:" + tefType + ":\"" ;
        dev.compressed = s + compressed + "\":/tef]";
        dev.uncompressed = s + stringy + "\":/tef]";
        
        dev.compressedMinified = s + compressedMinified + "\":/tef]";
        dev.uncompressedMinified = s + stringyMinified + "\":/tef]";
        //dev.doublecompressedMinified = Buffer.from(await gzip(compressedMinified)).toString('base64'); 
        return dev;
    }

    async readAdvancedFlowsJSON({ homey,  exchangerFile, device }) { 
        try {
            exchangerFile = await this.getNormalExchangerFile(exchangerFile);
           
            
            let api = await this.loadStuff();
            // allDevices = allDevices ? allDevices : await app.devices;
            // allUsers = allUsers ? allUsers : await api.users.getUsers();
            // allVariables = allVariables ? allVariables : await api.logic.getVariables();
            // allTokens = allTokens ? allTokens : await api.flowToken.getFlowTokens();
            
            // actionCards = actionCards ? actionCards : await api.flow.getFlowCardActions();
            // conditionCards = conditionCards ? conditionCards : await api.flow.getFlowCardConditions();
            // triggerCards = triggerCards ? triggerCards : await api.flow.getFlowCardTriggers();
        

            let _allDevices = allDevices;
            let _allApps = allApps;

            //let apiCommand = "";
            //let cards = _.flatMap(exchangerFile.advancedflows, f=>_.toArray(f.cards));
            if(!exchangerFile.devicesToReplace) exchangerFile.devicesToReplace = {};
            if(!exchangerFile.tokensToReplace) exchangerFile.tokensToReplace = {};
            let devicesToReplace = exchangerFile.devicesToReplace;
            let tokensToReplace = exchangerFile.tokensToReplace;
            if(device &&!exchangerFile.devicesToReplace[exchangerFile.originalId]) exchangerFile.devicesToReplace[exchangerFile.originalId] = {};//replaceWith: {id:device.__id, name:device.getName()}, original:true};
            if(device &&!exchangerFile.devicesToReplace[exchangerFile.originalId].replaceWith) exchangerFile.devicesToReplace[exchangerFile.originalId].replaceWith = {id:device.__id, name:device.getName(), original:true};

            _.each(exchangerFile.advancedflows, (flow, flowKey)=>{
                _.each(flow.cards, (card, cardKey)=>{
                    let deviceId;
                    if(card.ownerUri) {
                        if(card.ownerUri.startsWith('homey:device:') && (deviceId=card.ownerUri.substring(13))) { //!=device.__id) {
                            if( Object.keys(devicesToReplace).indexOf(deviceId)===-1 ) {
                                devicesToReplace[deviceId] = {replacements: [], actions:[]};
                            }
                            if(!devicesToReplace[deviceId].replacements)devicesToReplace[deviceId].replacements = [];                            
                            if(!devicesToReplace[deviceId][card.type +'s'])devicesToReplace[deviceId][card.type +'s'] = [];
                            if(devicesToReplace[deviceId][card.type +'s'].indexOf(card.id)===-1) devicesToReplace[deviceId][card.type +'s'].push(card.id);                         
                        }
                        if(card.ownerUri === 'homey:manager:flow' && card.args && card.args.flow && card.args.flow.id) {
                            if(!exchangerFile.flowsToReplace) exchangerFile.flowsToReplace = {};
                            let type = '';
                            if(card.id.indexOf('_string_tag')>-1) type='string';
                            else if(card.id.indexOf('_number_tag')>-1) type='number';
                            else if(card.id.indexOf('_boolean_tag')>-1) type='boolean';
                            else if(card.id.indexOf('_image_tag')>-1) type='image';                            
                            if(!exchangerFile.flowsToReplace[card.args.flow.id]) exchangerFile.flowsToReplace[card.args.flow.id] = {types:{}};
                            if(!exchangerFile.flowsToReplace[card.args.flow.id].types[type]) exchangerFile.flowsToReplace[card.args.flow.id].types[type] = { name:card.args.flow.name, type:card.args.flow.type };
                        }
                        if(card.ownerUri.startsWith('homey:app:')) {
                            _.each(card.args, (arg, argKey)=> {
                                let appId = card.ownerUri.substring(10);
                                
                                if(typeof(card.args[argKey])==='string' && AppsInfo[appId] && AppsInfo[appId].canCreateByName({argName:argKey})){
                                    let type = AppsInfo[appId].getType({argName:argKey, cardId:card.id});
                                                                     
                                    if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].names};
                                    if(!tokensToReplace[appId].types) tokensToReplace[appId].types = {};
                                    if(!tokensToReplace[appId].types[type]) tokensToReplace[appId].types[type] = [];
                                    if(!_.find(tokensToReplace[appId].types[type], x=>x.name===card.args[argKey])) tokensToReplace[appId].types[type].push({name:card.args[argKey]});

                                    return;
                                }
                                // if(typeof(card.args[argKey])==='string' && (!AppsInfo[appId] || !AppsInfo[appId].canCreateByName({argName:argKey}))){
                                //     if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                //     if(!tokensToReplace[appId].args) tokensToReplace[appId].args = {};
                                //     if(!tokensToReplace[appId].args[argKey]) tokensToReplace[appId].args[argKey] = {};
                                //     if(!tokensToReplace[appId].args[argKey].name) tokensToReplace[appId].args[argKey].name = card.args[argKey];                                    
                                //     return;
                                // }

                                if(typeof(card.args[argKey])!=='object') return;
                                let id = Object.keys(card.args[argKey]).indexOf('id')>-1? card.args[argKey].id : Object.keys(card.args[argKey]).indexOf('name')>-1? card.args[argKey].name : null;

                                // if(!_.find(allTokens, t=>t.uri=='homey:app:' + appId &&t.id===id)) {                                    
                                //     if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                //     if(!tokensToReplace[appId].args) tokensToReplace[appId].args = {};
                                //     if(!tokensToReplace[appId].args[argKey]) tokensToReplace[appId].args[argKey] = {};
                                //     if(!tokensToReplace[appId].args[argKey].name) tokensToReplace[appId].args[argKey].name = card.args[argKey].name;
                                //     if(!tokensToReplace[appId].args[argKey].id) tokensToReplace[appId].args[argKey].valueId = card.args[argKey].id;
                                //     if(!tokensToReplace[appId].args[argKey][card.type+'s']) tokensToReplace[appId].args[argKey][card.type+'s'] =  {};
                                //     if(!tokensToReplace[appId].args[argKey][card.type+'s'][card.id]) tokensToReplace[appId].args[argKey][card.type+'s'][card.id] =  {name:card.args[argKey].name, valueId:card.args[argKey].id};
                                // }
                                
                                //!_.find(allTokens, t=>t.uri=='homey:app:' + appId &&t.id===id) && 
                                if(AppsInfo[appId] && AppsInfo[appId].canCreateByName({argName:argKey}))
                                {
                                    let type = AppsInfo[appId].getType({argName:argKey, cardId:cardKey});
                                    if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].names};
                                    if(!tokensToReplace[appId].types) tokensToReplace[appId].types = {};
                                    if(!tokensToReplace[appId].types[type]) tokensToReplace[appId].types[type] = [];
                                    if(!_.find(tokensToReplace[appId].types[type], x=>x.name===card.args[argKey].name)) tokensToReplace[appId].types[type].push({name:card.args[argKey].name});
                                }
                                // if(typeof(card.args[argKey])==='string' && AppsInfo[appId] && AppsInfo[appId].canCreateByName({argName:argKey})){
                                //     let type = AppsInfo[appId].getType({argName:argKey, cardId:cardKey});
                                    
                                //     if(!tokensToReplace[appId]) tokensToReplace[appId] =  {name:allApps[appId].name};
                                //     if(!tokensToReplace[appId].types) tokensToReplace[appId].types = {};
                                //     if(!tokensToReplace[appId].types[type]) tokensToReplace[appId].types[type] = {};
                                //     if(!tokensToReplace[appId].types[type].name) tokensToReplace[appId].types[type].name = card.args[argKey];                                    
                                //     return;
                                // }
                            });
                        }
                    }
                });
            });

            let actionIdsDevices = _.uniqBy(_.filter(_.flatMap(devicesToReplace, d=>d.actions), x=>x));
            let conditionIdsDevices = _.uniqBy(_.filter(_.flatMap(devicesToReplace, d=>d.conditions), x=>x));
            let triggerIdsDevices = _.uniqBy(_.filter(_.flatMap(devicesToReplace, d=>d.triggers), x=>x));

            let _actionCardsDevices = _.filter(actionCards, x=> actionIdsDevices.indexOf(x.id)>-1 && x.uri && x.uri.startsWith('homey:device'));
            let _conditionCardsDevices = _.filter(conditionCards, x=> conditionIdsDevices.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:device'));
            let _triggerCardsDevices = _.filter(triggerCards, x=> triggerIdsDevices.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:device'));
            //if(actionIdsDevices.length || conditionIdsDevices.length || triggerIdsDevices.length)
            _allDevices =  _.filter(_allDevices, (d, dKey)=>
                _.find(_actionCardsDevices, x=>x.uri && x.uri=='homey:device:'+dKey) ||
                _.find(_conditionCardsDevices, x=>x.uri && x.uri=='homey:device:'+dKey) ||
                _.find(_triggerCardsDevices, x=>x.uri && x.uri=='homey:device:'+dKey)
            );
            // let _allDevicesForTags = _.filter(allDevices, (d, dKey)=>
            //     _.find(d.capabilities, cap => _.find(allTokens, t=>t.uri=='homey:device:'+d.id && t.id==cap)) 
            // );


            // let actionIdsApps = _.uniqBy(_.flatMap(tokensToReplace, d=>d.actions));
            // let conditionIdsApps = _.uniqBy(_.flatMap(tokensToReplace, d=>d.conditions));
            // let triggerIdsApps = _.uniqBy(_.flatMap(tokensToReplace, d=>d.triggers));

            // let _actionCardsApps = _.filter(actionCards, x=> actionIdsApps.indexOf(x.id)>-1 && x.uri && x.uri.startsWith('homey:app'));
            // let _conditionCardsApps = _.filter(conditionCards, x=> conditionIdsApps.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:app'));
            // let _triggerCardsApps = _.filter(triggerCards, x=> triggerIdsApps.indexOf(x.id)>-1 &&  x.uri && x.uri.startsWith('homey:app'));
            
            // _allApps = _.filter(_allApps, (d, dKey)=>
            //     _.find(_actionCardsApps, x=>x.uri && x.uri=='homey:app:'+dKey) ||
            //     _.find(_conditionCardsApps, x=>x.uri && x.uri=='homey:app:'+dKey) ||
            //     _.find(_triggerCardsApps, x=>x.uri && x.uri=='homey:app:'+dKey)
            // );
            
            _.each(exchangerFile.flowsToReplace, (flow, flowId)=>{
                _.each(flow.types, (type, typeId)=>{                        
                    type.replacements = _.sortBy(_.map(_.filter(exchangerFile.advancedflows, (f, uKey)=> "advanced"===type.type && _.find(f.cards, c=>c.ownerUri==='homey:manager:flow' && c.id==='programmatic_trigger' + (typeId===''?'': '_' + typeId + '_tag' ))), x=> { return {id:x.id, name:x.name};}), 'name');
                    type.replacements = _.union(type.replacements, 
                        _.sortBy(_.map(_.pickBy(allAdvancedFlows, (f, fKey)=> "advanced"===type.type && !_.find(type.replacements, r=>r.id===fKey) && _.find(f.cards, c=>c.ownerUri==='homey:manager:flow' && c.id==='programmatic_trigger' + (typeId===''?'': '_' + typeId + '_tag' ))) , (x, xKey)=> { return {id:xKey, name:x.name};}), 'name')
                    );
                    type.replaceWith = _.find(type.replacements, x=>x.id==flowId);
                    if(type.replaceWith) type.replaceWithId = type.replaceWith.id;
                });
            });
            _.each(exchangerFile.zonesToReplace, (zone, zoneId)=>{
                zone.replacements = _.sortBy(_.map(_.pickBy(allZones, ()=> true),
                    d=> { return {id:d.id, name:d.name};}), 'name');
                if(!zone.replaceWith) zone.replaceWith = _.find(zone.replacements, x=>x.id==zoneId);
                if(zone.replaceWith) zone.replaceWithId = zone.replaceWith.id;
            });

            
            _.each(exchangerFile.devicesToReplace, (device, deviceId)=>{
                let devices = _.filter(_allDevices, (d, dKey)=> 
                (!_.size(device.actions) || _.every(device.actions, a=>_.find(_actionCardsDevices, ac=> ac.uri=='homey:device:' + d.id && ac.id===a) )) && 
                (!_.size(device.conditions)  || _.every(device.conditions, c=>_.find(_conditionCardsDevices, cc=> cc.uri=='homey:device:' + d.id && cc.id===c) )) && //_.find(_conditionCardsDevices, ac=> ac.uri=='homey:device:' + d.id && _.every(device.conditions, a=>a==ac.id))) &&
                (!_.size(device.triggers)  || _.every(device.triggers, t=>_.find(_triggerCardsDevices, tc=> tc.uri=='homey:device:' + d.id && tc.id===t) ))); //_.find(_triggerCardsDevices, ac=> ac.uri=='homey:device:' + d.id && _.every(device.triggers, a=>a==ac.id)) ));
                // if((devices || device.length===0) && _.size(device.tags) ) devices = _.toArray(allDevices);
                // if(_.size(device.tags)) devices = _.filter(devices, d=>
                //     _.find(device.tags, (tag, tagKey)=> _.find(allTokens, t=>t.uri=='homey:device:'+d.id && t.id==tagKey)) 
                // );
                
                device.replacements = _.sortBy(_.map(devices,d=> { return {id:d.id, name:d.name};}), 'name');                
                if(!device.replaceWith) device.replaceWith = _.find(device.replacements, x=>x.id==deviceId);
                if(device.replaceWith) device.replaceWithId = device.replaceWith.id;
                _.each(device.tags, (tag, tagId)=>{
                    tag.replacements = _.sortBy(_.map( _.filter(allTokens, t=> t.type==tag.type) , x=> { return {id:x.uri + "|" + x.id, name: x.uriObj? x.uriObj.name + ' - ' + x.title : x.title};}), 'name');
                   if(!device.replacements.length) tag.replaceWith = _.find(tag.replacements, x=>x.id=='homey:device:' + deviceId + '|' + tagId);
                    if(tag.replaceWith) tag.replaceWithId = tag.replaceWith.id;
                });
            });

            _.each(exchangerFile.usersToReplace, (user, userId)=>{
                user.replacements = _.sortBy(_.map(_.pickBy(allUsers, (u, uKey)=> true), (x, xKey)=> { return {id:xKey, name:x.name, athomId:x.athomId, image:x.avatar};}), 'name');
                user.replaceWith = _.find(user.replacements, x=>x.id==userId);
                if(user.replaceWith) user.replaceWithId = user.replaceWith.id;
            });
            _.each(exchangerFile.variablesToReplace, (variable, variableId)=>{
                variable.replacements =  _.union( [{"id":-1, "name":"-- Create --", newName:variable.name}], _.sortBy(_.map(_.pickBy(allVariables, (v, vKey)=> v.type==variable.type ), (x, xKey)=> { return {id:xKey, name:x.name};}), 'name'));
                variable.replaceWith =_.find(variable.replacements, x=>x.id==variableId);
                if(!variable.replaceWith) variable.replaceWith = _.find(variable.replacements, x=>x.name===variable.name);
                if(!variable.replaceWith) variable.replaceWith = _.find(variable.replacements, x=>x.id===-1);
                if(variable.replaceWith) variable.replaceWithId = variable.replaceWith.id;
            });
            
            _.each(exchangerFile.tokensToReplace, (app, appId)=>{
                _.each(app.tokens, (token, tokenId)=>{
                    token.replacements = _.sortBy(_.map(_.filter(allTokens, t=> t.uri=="homey:app:" + appId && t.type==token.type ), x=> { return {id:x.id, name:x.title};}), 'name');
                    token.replaceWith = _.find(token.replacements, x=>x.id==tokenId);
                    if(token.replaceWith) token.replaceWithId = token.replaceWith.id;
                });
                // _.each(app.args, (arg, argId)=>{
                //     /// Next part is for automatic finding of ID's
                //     // if(!flowcards) flowcards = _.filter(allAdvancedFlows, af=>_.find(af.cards, card=>card.ownerUri && card.ownerUri.startsWith('homey:app:')));
                //     // let t = _.flatMap(_.filter(flowcards, af=>_.find(af.cards, card=>card.ownerUri && card.ownerUri=== 'homey:app:' + appId )), fc=>_.toArray(fc.cards));
                //     // let appCards = _.map(_.filter(
                //     //     _.flatMap(_.filter(flowcards, af=>_.find(af.cards, card=>card.ownerUri && card.ownerUri=== 'homey:app:' + appId )), fc=>_.toArray(fc.cards)),
                //     //     c=>c.args && c.args[argId]),
                //     //     m=>m.args[argId]);
                // });
                _.each(app.types, (type, typeId)=>{       //this runs Always/only for supported Apps
                    _.each(type, (name, typeId)=>{       
                        name.replacements = [];
                        let appInfo = AppsInfo[appId];
                        let a = _.filter(allTokens, t=> t.uri=="homey:app:" + appId );
                        if(appInfo && appInfo.canCreateByName()) name.replacements.push({"id":-1, "name":"-- Create --", newName:name.name});
                        if(appInfo && appInfo.byToken && appInfo.byToken()) name.replacements = _.union(name.replacements, _.sortBy(_.map(_.filter(allTokens, t=> t.uri=="homey:app:" + appId ), x=> { return {id:x.id, name:x.title};}), 'name'));
                        
                        //if(!type.replaceWith) type.replaceWith = _.find(type.replacements, x=>x.id===type.name);
                        if(!name.replaceWith) name.replaceWith = _.find(name.replacements, x=>x.name===name.name || x.id===name.name); //Can this go wrong?
                        if(!name.replaceWith) name.replaceWith = _.find(name.replacements, x=>x.id===-1);
                        if(name.replaceWith) name.replaceWithId = name.replaceWith.id;
                    });
                });
            });


            //Turn it into arrays
            exchangerFile.flowsToReplace = _.map(exchangerFile.flowsToReplace, (x, id)=> { x.id=id; x.types=_.map(x.types, (t, tId)=> { t.id=tId;return t; } ); return x; } );
            exchangerFile.zonesToReplace = _.map(exchangerFile.zonesToReplace, (x, id)=> { x.id=id;return x; } );
            exchangerFile.devicesToReplace = _.map(exchangerFile.devicesToReplace, (x, id)=> { x.id=id;
                x.tags=_.map(x.tags, (a, aId)=> { a.id=aId; return a; } ); 
                return x; } );
            exchangerFile.usersToReplace = _.map(exchangerFile.usersToReplace, (x, id)=> { x.id=id;return x; } );
            exchangerFile.variablesToReplace = _.map(exchangerFile.variablesToReplace, (x, id)=> { x.id=id;return x; } );
            exchangerFile.tokensToReplace = _.map(exchangerFile.tokensToReplace, (x, id)=> { x.id=id; 
                x.tokens=_.map(x.tokens, (t, tId)=> { t.id=tId;return t; } ); 
                x.args=_.map(x.args, (a, aId)=> { a.id=aId; return a; } ); 
                x.types=_.map(x.types, (a, aId)=> { a.id=aId; return a; } ); 
                return x; } );

            
            /// Does not work
            // _.each(exchangerFile.advancedflows, (flow, flowKey)=>{
            //     flow.id = app.getGuid();
            // });

            // _.each(exchangerFile.advancedflows, f=>{
            //     apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
            // });
            //apiCommand: apiCommand, 
            return exchangerFile;//{devicesToReplace:exchangerFile.devicesToReplace, advancedflows: exchangerFile.advancedflows, usersToReplace:exchangerFile.usersToReplace, variablesToReplace:exchangerFile.variablesToReplace, tokensToReplace:exchangerFile.tokensToReplace};
        } catch (error) {
            this.error(error);                
        }

    }
    async updateAdvancedFlowsJSON({ homey,  exchangerFile }) { 
        try {
            let apiCommand = "";
            let cards = _.flatMap(exchangerFile.advancedflows, f=>_.toArray(f.cards));

            await this.loadStuff();
            
            // _.each(exchangerFile.flowsToReplace, (flow)=>{
            //     if(!flow.replaceWith) return;
            //     flow.searchFor = "homey:flow:"+flow.id;
            //     flow.searchReplaceWith = "homey:flow:" + flow.replaceWith.id;
            // });

            _.each(exchangerFile.zonesToReplace, (zone)=>{
                if(!zone.replaceWith) return;
                zone.searchFor = "homey:zone:"+zone.id;
                zone.searchReplaceWith = "homey:zone:" + zone.replaceWith.id;
            });
            _.each(exchangerFile.devicesToReplace, (device)=>{
                if(device.replaceWith)  {                    
                    device.searchFor = "homey:device:"+device.id;
                    device.searchReplaceWith = "homey:device:" + device.replaceWith.id;
                }
                _.each(device.tags, (tag)=>{
                    if(!tag.replaceWith) return;
                    tag.searchFor = "homey:device:"+device.id+'|'+tag.id;
                    tag.searchReplaceWith = tag.replaceWith.id;
                });
            });

            _.each(exchangerFile.usersToReplace, (user)=>{
                if(!user.replaceWith) return;
                user.searchFor = "homey:manager:presence|"+user.id;
                user.searchReplaceWith = "homey:manager:presence|" + user.replaceWith.id;
            });
            _.each(exchangerFile.variablesToReplace, (variable)=>{
                if(!variable.replaceWith || variable.replaceWith.id===-1) return;
                variable.searchFor = "homey:manager:logic|"+variable.id;
                variable.searchReplaceWith = "homey:manager:logic|" + variable.replaceWith.id;
            });
            _.each(exchangerFile.tokensToReplace, (app)=>{
                _.each(app.tokens, (token)=>{
                    if(!token.replaceWith) return;
                    token.searchFor = "homey:app:"+app.id+"|"+token.id;
                    token.searchReplaceWith = "homey:app:"+app.id+"|"+token.replaceWith.id;
                });
                // _.each(app.args, (arg)=>{
                //     if(!arg.replaceWith) return;
                //     arg.searchFor = "homey:app:"+app.id+"|"+arg.id;
                //     arg.searchReplaceWith = "homey:app:"+app.id+"|"+arg.replaceWith.id;
                // });
                _.each(app.types, (type)=>{                    
                    _.each(type, (name, typeId)=>{       
                        if(!name.replaceWith) return;
                        name.searchFor = "homey:app:"+app.id+"|"+name.name;
                        name.searchReplaceWith = "homey:app:"+app.id+"|"+ (name.replaceWith.id===-1?name.replaceWith.newName : name.replaceWith.name);
                    });
                });
            });
            _.each(cards, card=>{
                if(card && card.ownerUri) {                    
                    if(card.ownerUri.startsWith('homey:device:')) _.each(exchangerFile.devicesToReplace, (device)=>{ if(device.searchFor && card.ownerUri === device.searchFor) card.ownerUri = device.searchReplaceWith;});
                    else if(card.ownerUri.startsWith('homey:zone:')) _.each(exchangerFile.zonesToReplace, (zone)=>{ if(zone.searchFor && card.ownerUri === zone.searchFor) card.ownerUri = zone.searchReplaceWith;});
                }
                if(card.args) for (const argKey in card.args) {
                    if (Object.hasOwnProperty.call(card.args, argKey)) {
                        //const c.args[argKey] = c.args[argKey];
                        let id;
                        if(card.ownerUri && card.ownerUri.startsWith('homey:app:') && (id=card.ownerUri.substring('homey:app:'.length))) {
                            if(AppsInfo[id] && AppsInfo[id].canCreateByName({argName:argKey})) 
                            _.each(exchangerFile.tokensToReplace, (app)=>{ if(app.id===id) _.each(app.types, (type, typeId)=>{ _.each(type, (name)=>{ 
                                    if(name.searchFor) {
                                        if(card.args[argKey] === name.name) card.args[argKey] = name.replaceWith.id===-1?name.replaceWith.newName : name.replaceWith.name;
                                        else if(card.args[argKey].name === name.name) card.args[argKey].name = name.replaceWith.id===-1?name.replaceWith.newName : name.replaceWith.name;
                                        // else if(card.args[argKey].indexOf("[[" + arg.searchFor + "]]")>-1)card.args[argKey] = card.args[argKey].replaceAll("[[" + arg.searchFor + "]]", "[[" + arg.searchReplaceWith + "]]");
                                    }
                                }); 
                            }); 
                            });
                            //if(!exchangerFile.tokensToReplace[id]) exchangerFile.tokensToReplace[id] =  {name:allApps[id].name};
                            // if(!tokensToReplace[appId].args) tokensToReplace[appId].args = {};
                            // if(!tokensToReplace[appId].args[argKey]) tokensToReplace[appId].args[argKey] = {};
                            // if(!tokensToReplace[appId].args[argKey].name) tokensToReplace[appId].args[argKey].name = card.args[argKey].name;
                            // if(!tokensToReplace[appId].args[argKey].id) tokensToReplace[appId].args[argKey].valueId = card.args[argKey].id;
                        }
                        switch (typeof(card.args[argKey])) {
                            case "string":      
                                _.each(exchangerFile.zonesToReplace, (zone)=>{ 
                                    if(zone.searchFor) {
                                        if(card.args[argKey] === zone.searchFor)card.args[argKey] = zone.searchReplaceWith;
                                        else if(card.args[argKey].indexOf("[[" + zone.searchFor + "]]")>-1) card.args[argKey] = card.args[argKey].replaceAll("[[" + zone.searchFor + "]]", "[[" + zone.searchReplaceWith + "]]"); 
                                    } 
                                });
                                _.each(exchangerFile.devicesToReplace, (device)=>{ 
                                    //First replace tokens, then device                                    
                                    _.each(device.tags, (tag)=>{ 
                                        if(tag.searchFor) {
                                            if(card.args[argKey] === tag.searchFor)card.args[argKey] = tag.searchReplaceWith;
                                            else if(card.args[argKey].indexOf("[[" + tag.searchFor + "]]")>-1) card.args[argKey] = card.args[argKey].replaceAll("[[" + tag.searchFor + "]]", "[[" + tag.searchReplaceWith + "]]"); 
                                        }
                                    });
                                    if(device.searchFor) {
                                        if(card.args[argKey] === device.searchFor) card.args[argKey] = device.searchReplaceWith;
                                        else if(card.args[argKey].startsWith(device.searchFor + "|")>-1) card.args[argKey] = card.args[argKey].replaceAll(device.searchFor + "|", device.searchReplaceWith + "|"); 
                                        else if(card.args[argKey].indexOf("[[" + device.searchFor)>-1) card.args[argKey] = card.args[argKey].replaceAll("[[" + device.searchFor , "[[" + device.searchReplaceWith ); 
                                    }
                                });
                                _.each(exchangerFile.usersToReplace, (user)=>{ 
                                    if(user.searchFor) {
                                        if(card.args[argKey] === user.searchFor) card.args[argKey] = user.searchReplaceWith;
                                        else if(card.args[argKey].indexOf("[[" + user.searchFor + "]]")>-1) card.args[argKey] = card.args[argKey].replaceAll("[[" + user.searchFor + "]]", user.searchReplaceWith + "]]");  
                                    } 
                                });
                                _.each(exchangerFile.variablesToReplace, (variable)=>{ 
                                    if(variable.searchFor) {
                                         if(card.args[argKey] === variable.searchFor) card.args[argKey] = variable.searchReplaceWith;
                                         else if(card.args[argKey].indexOf("[[" + variable.searchFor + "]]")>-1) card.args[argKey] = card.args[argKey].replaceAll("[[" + variable.searchFor + "]]", "[[" + variable.searchReplaceWith + "]]");  
                                    }
                                });
                                _.each(exchangerFile.tokensToReplace, (app)=>{ 
                                    _.each(app.tokens, (token, tokenId)=>{ 
                                        if(token.searchFor) {
                                            if(card.args[argKey] === token.searchFor) card.args[argKey] = token.searchReplaceWith;
                                            else if(card.args[argKey].indexOf("[[" + token.searchFor + "]]")>-1)card.args[argKey] = card.args[argKey].replaceAll("[[" + token.searchFor + "]]", "[[" + token.searchReplaceWith + "]]");
                                        }
                                    });
                                    _.each(app.types, (type, typeId)=>{
                                        _.each(type, (name)=>{ 
                                            if(name.searchFor) {
                                                if(card.args[argKey] === name.searchFor) card.args[argKey] = name.searchReplaceWith;
                                                else if(card.args[argKey].indexOf("[[" + name.searchFor + "]]")>-1)card.args[argKey] = card.args[argKey].replaceAll("[[" + name.searchFor + "]]", "[[" + name.searchReplaceWith + "]]");
                                            }
                                        });
                                    });
                                });
                                break;
                            case "object":      
                                //_.each(exchangerFile.devicesToReplace, (device, deviceId)=>{ if(device.searchFor && c.args[argKey].indexOf("[[" + device.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll("[[" + device.searchFor, "[[" + device.searchReplaceWith);  });
                                if(card.args[argKey].id && card.ownerUri && (card.ownerUri=='homey:manager:presence' || card.ownerUri=='homey:manager:mobile'))
                                    _.each(exchangerFile.usersToReplace, (user)=>{ if(card.args[argKey].id==user.id && user.replaceWith) {card.args[argKey].id = user.replaceWith.id ;card.args[argKey].name = user.replaceWith.name;card.args[argKey].athomId = user.replaceWith.athomId;card.args[argKey].image = user.replaceWith.image; }   });
                                if(card.args[argKey].id && card.ownerUri && card.ownerUri=='homey:manager:logic') _.each(exchangerFile.variablesToReplace, (variable)=>{ if(variable.searchFor && card.args[argKey].id==variable.id && variable.replaceWith) {card.args[argKey].id = variable.replaceWith.id; card.args[argKey].name = variable.replaceWith.name;}  });
                                
                                if((card.args[argKey].id || card.args[argKey].name) && card.ownerUri && card.ownerUri.startsWith('homey:app:')) {
                                    _.each(exchangerFile.tokensToReplace, (app)=>{
                                        if("homey:app:" + app.id!==card.ownerUri) return;
                                        _.each(app.tokens, (token)=>{ 
                                            if(token.searchFor && (card.args[argKey].id===token.id || card.args[argKey].name===token.id)) {
                                                if(card.args[argKey].id) {
                                                    card.args[argKey].id = token.replaceWith.id;
                                                    card.args[argKey].name = token.replaceWith.name;
                                                }
                                                else if(card.args[argKey].name) card.args[argKey].name = token.replaceWith.id;
                                            }
                                        }); 
                                        //// _.each(app.types, (type)=>{  //No object!
                                                
                                        //     let appInfo = AppsInfo[app.id];
                                        //     if(appInfo && appInfo.canCreateByName({argName:argKey})) {
                                        //         if(type.searchFor && (card.args[argKey].id===type.valueId || card.args[argKey].name===type.name)) {
                                        //             if(card.args[argKey].id) {
                                        //                 card.args[argKey].id = type.replaceWith.id;
                                        //                 card.args[argKey].name = type.replaceWith.name;
                                        //             }
                                        //             else if(card.args[argKey].name) card.args[argKey].name = type.replaceWith.name;
                                        //         }
                                        //     }
                                        // }); 
                                        ////

                                        // _.each(app.args, (arg)=>{ 
                                                
                                        //     let appInfo = AppsInfo[app.id];
                                        //     if(appInfo && appInfo.canCreateByName({argName:argKey})) {
                                        //         if(arg.searchFor && (card.args[argKey].id===arg.valueId || card.args[argKey].name===arg.name)) {
                                        //             if(card.args[argKey].id) {
                                        //                 card.args[argKey].id = arg.replaceWith.id;
                                        //                 card.args[argKey].name = arg.replaceWith.name;
                                        //             }
                                        //             else if(card.args[argKey].name) card.args[argKey].name = arg.replaceWith.name;
                                        //         }
                                        //     }
                                        // }); 
                                    });
                                }
                                //_.each(exchangerFile.variablesToReplace, (variable, variableId)=>{ if(variable.searchFor && c.args[argKey].indexOf(variable.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(variable.searchFor, variable.searchReplaceWith);  });
                                //_.each(exchangerFile.tokensToReplace, (app, appId)=>{ _.each(app.tokens, (token, tokenId)=>{ if(token.searchFor && c.args[argKey].indexOf(token.searchFor)>-1)c.args[argKey] = c.args[argKey].replaceAll(token.searchFor, token.searchReplaceWith); }); });
                                break;
                        }
                    }
                }
             });
            
             _.each(cards, card=>{
                if(card && card.args && Object.keys(card.args).indexOf('_$droptoken$_')>-1)  {
                    card.droptoken = card.args._$droptoken$_;
                    delete card.args._$droptoken$_;
                    if(Object.keys(card.args).length===0) delete card.args;
                }
                if(card.ownerUri==='homey:app:com.athom.homeyscript') {
                    card.ownerUri = 'homey:app:nl.qluster-it.DeviceCapabilities';
                    card.id = 'hs_' + card.id;
                }
            });

            
            

            delete exchangerFile.apiCommand;
            apiCommand = 'async function run() { let exchangerFile=' + JSON.stringify(exchangerFile) + `;
                for(let i=0;i<exchangerFile.advancedflows.length;i++) {
                    let oldId = exchangerFile.advancedflows[i].id;
                    exchangerFile.advancedflows[i] = await Homey.flow.createAdvancedFlow({advancedflow:exchangerFile.advancedflows[i]});
                    if(exchangerFile.flowsToReplace && exchangerFile.flowsToReplace[oldId]) {
                        _.each(exchangerFile.flowsToReplace[oldId].types, type=> {
                            if(type.replaceWithId===oldId) type.replaceWith = {id:exchangerFile.advancedflows[i].id, name:exchangerFile.advancedflows[i].name};
                        });
                    }
                }
                for (let i = 0; i < exchangerFile.variablesToReplace.length; i++) {
                    const variable = exchangerFile.variablesToReplace[i];
                    if(variable.replaceWithId===-1) {
                        let val = variable.type=='string' ? '' : variable.type=='boolean' ? false : variable.type=='number' ? 0 : undefined;

                        variable.replaceWith = await Homey.logic.createVariable({ variable: {name:variable.replaceWith.id===-1?variable.replaceWith.newName : variable.replaceWith.name, type:variable.type, value:val} });
                        variable.searchFor = "homey:manager:logic|"+variable.id;
                        variable.searchReplaceWith = "homey:manager:logic|" + variable.replaceWith.id;
                    }  else exchangerFile.variablesToReplace[i] = null;
                }

                for(let afIndex=0;afIndex<exchangerFile.advancedflows.length;afIndex++) {
                    let update = false;
                    for (const cardKey in exchangerFile.advancedflows[afIndex].cards) {
                        if (Object.hasOwnProperty.call(exchangerFile.advancedflows[afIndex].cards, cardKey)) {
                            const card = exchangerFile.advancedflows[afIndex].cards[cardKey];
                            const c=card;
                            if(card && card.ownerUri && card.ownerUri==='homey:manager:flow' && card.args && card.args.flow) {                            
                                for(let i=0;i<exchangerFile.flowsToReplace.length;i++) {
                                    for(let j=0;j<exchangerFile.flowsToReplace[i].types.length;j++) {                                
                                        if(card.id === ('programmatic_trigger' + (exchangerFile.flowsToReplace[i].types[j].id===''?'': '_' + exchangerFile.flowsToReplace[i].types[j].id + '_tag' )) && card.args.flow.id===exchangerFile.flowsToReplace[i].id && exchangerFile.flowsToReplace[i].types[j].replaceWith) {
                                            card.args.flow.id = exchangerFile.flowsToReplace[i].types[j].replaceWith.id;
                                            card.args.flow.name = exchangerFile.flowsToReplace[i].types[j].replaceWith.name;
                                            update = true;
                                        }
                                    }
                                    
                                }
                            }

                            if(c.args) for (const argKey in c.args) {
                                if (Object.hasOwnProperty.call(c.args, argKey)) {
                                    //const c.args[argKey] = c.args[argKey];
                                    switch (typeof(c.args[argKey])) {
                                        case "string":      
                                            _.each(exchangerFile.variablesToReplace, (variable)=>{
                                                if(!variable) return;
                                                if(variable.searchFor) {
                                                    if(c.args[argKey] === variable.searchFor) 
                                                    { c.args[argKey] = variable.searchReplaceWith; update = true; }
                                                    else if(c.args[argKey].indexOf("[[" + variable.searchFor + "]]")>-1) 
                                                    { c.args[argKey] = c.args[argKey].replaceAll("[[" + variable.searchFor + "]]", "[[" +variable.searchReplaceWith + "]]");  update = true; }
                                                } 
                                            });
                                            break;
                                        case "object":      
                                            if(c.args[argKey].id && c.ownerUri && c.ownerUri=='homey:manager:logic') _.each(exchangerFile.variablesToReplace, (variable)=>{ 
                                                if(!variable) return;
                                                if(variable.searchFor && c.args[argKey].id==variable.id && variable.replaceWith) {                                                
                                                    c.args[argKey].id = variable.replaceWith.id; c.args[argKey].name = variable.replaceWith.name;
                                                    update = true;
                                                }  
                                            });                                        
                                            break;
                                    }
                                }
                            }
                            if(c.droptoken) _.each(exchangerFile.variablesToReplace, (variable)=>{ 
                                if(!variable) return;
                                if(variable.searchFor && c.droptoken==variable.searchFor && variable.replaceWith) {                                                
                                    c.droptoken = variable.searchReplaceWith;
                                    update = true;
                                }  
                            }); 
                        }

                        if(update) {
                            exchangerFile.advancedflows[afIndex] = await Homey.flow.updateAdvancedFlow({id: exchangerFile.advancedflows[afIndex].id, advancedflow:
                                {cards: exchangerFile.advancedflows[afIndex].cards}
                            });
                        }
                    }
                }
            };
            run();
            `;
                
            // _.each(exchangerFile.advancedflows, f=>{
            //     apiCommand += "Homey.flow.createAdvancedFlow({advancedflow:" + JSON.stringify(f)  + "});\r\n";
            // });
            return {apiCommand: apiCommand, homeyId:this.homeyId};
        } catch (error) {
            this.error(error);
        }
    }

    async getNormalExchangerFile(exchangerFile) {
        if(typeof(exchangerFile)=='string') {
            if(exchangerFile.startsWith('[tef:') && exchangerFile.endsWith(':/tef]'))  {
                exchangerFile = exchangerFile.replace(/^(?:\[tef:(.*?):(?:")?)/, '');
                exchangerFile = exchangerFile.substring(0, exchangerFile.length-6);
                if(exchangerFile.endsWith('"')) exchangerFile.substring(0, exchangerFile.length-1);
            } else if(exchangerFile.startsWith('[TEF:'))  {
                exchangerFile = exchangerFile.replace(/^(?:\[TEF:(.*?):(?:")?)/, '');
                exchangerFile = exchangerFile.substring(0, exchangerFile.length-1);
                if(exchangerFile.endsWith('"')) exchangerFile.substring(0, exchangerFile.length-1);
            }
            if(exchangerFile.startsWith('H4s')) {
                exchangerFile = this.getNormalZippedForForum(exchangerFile);
                exchangerFile = JSON.parse(await this.unzip(exchangerFile));
            }
            else exchangerFile = JSON.parse(exchangerFile);
        }

        if(typeof(exchangerFile)=='object' && exchangerFile.a) exchangerFile = this.maxifyExchangerFile(exchangerFile);
        return exchangerFile;
    }

    getNormalZippedForForum(str) {
        return str;//.replaceAll('|', '/');//.replaceAll('/\\t', '/t').replaceAll('/\\o', '/o').replaceAll('/\\c', '/c').replaceAll('/\\v', '/v');
    }
    getReplacedZippedForForum(str) {
        return str;//.replaceAll('/', '|');//str.replaceAll('/t', '/\\t').replaceAll('/o', '/\\o').replaceAll('/c', '/\\c').replaceAll('/v', '/\\v');
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
            if(json.t[key].name!==undefined) json.t[key].n=json.t[key].name; delete json.t[key].name;
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
                    if(json.a[afKey].c[cardKey].outputTrue!==undefined) json.a[afKey].c[cardKey].ot=json.a[afKey].c[cardKey].outputTrue; delete json.a[afKey].c[cardKey].outputTrue;
                    if(json.a[afKey].c[cardKey].outputFalse!==undefined) json.a[afKey].c[cardKey].of=json.a[afKey].c[cardKey].outputFalse; delete json.a[afKey].c[cardKey].outputFalse;
                    if(json.a[afKey].c[cardKey].args!==undefined) json.a[afKey].c[cardKey].a=json.a[afKey].c[cardKey].args; delete json.a[afKey].c[cardKey].args;
                    if(json.a[afKey].c[cardKey].inverted!==undefined) json.a[afKey].c[cardKey].r=json.a[afKey].c[cardKey].inverted; delete json.a[afKey].c[cardKey].inverted;
                });
            }
        });

        return json;
    }

    maxifyExchangerFile(json) {
        if(json.d) {json.devicesToReplace=json.d; delete json.d;} 
        _.each(json.devicesToReplace, (device, key)=> {
            if(json.devicesToReplace[key].n!==undefined) json.devicesToReplace[key].name=json.devicesToReplace[key].n; delete json.devicesToReplace[key].n;
            if(json.devicesToReplace[key].c!==undefined) json.devicesToReplace[key].class=json.devicesToReplace[key].c; delete json.devicesToReplace[key].c;
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
        if(json.t) {json.tokensToReplace=json.t; delete json.t;} 
        _.each(json.tokensToReplace, (app, key)=> {
            if(json.tokensToReplace[key].n!==undefined) json.tokensToReplace[key].name=json.tokensToReplace[key].n; delete json.tokensToReplace[key].n;
            if(json.tokensToReplace[key].t) {
                json.tokensToReplace[key].tokens=json.tokensToReplace[key].t; delete json.tokensToReplace[key].t;
                _.each(json.tokensToReplace[key].tokens, (token, tokenKey)=> { 
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
                    if(json.advancedflows[afKey].cards[cardKey].ot!==undefined) json.advancedflows[afKey].cards[cardKey].outputTrue=json.advancedflows[afKey].cards[cardKey].ot; delete json.advancedflows[afKey].cards[cardKey].ot;
                    if(json.advancedflows[afKey].cards[cardKey].of!==undefined) json.advancedflows[afKey].cards[cardKey].outputFalse=json.advancedflows[afKey].cards[cardKey].of; delete json.advancedflows[afKey].cards[cardKey].of;
                    if(json.advancedflows[afKey].cards[cardKey].a!==undefined) json.advancedflows[afKey].cards[cardKey].args=json.advancedflows[afKey].cards[cardKey].a; delete json.advancedflows[afKey].cards[cardKey].a;
                    if(json.advancedflows[afKey].cards[cardKey].r!==undefined) json.advancedflows[afKey].cards[cardKey].inverted=json.advancedflows[afKey].cards[cardKey].r; delete json.advancedflows[afKey].cards[cardKey].r;
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
    
    async unzip(str, returnType) {
        var gzippedJson = Buffer.from(str, 'base64');
        var jsonBuffer = await ungzip(gzippedJson, {level:9});
        return returnType ? jsonBuffer.toString(returnType) : jsonBuffer.toString();
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
    
    sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

    async getAvdTef(str) {
        try {                
            let exchangerFile = await this.getNormalExchangerFile(str);
            if(exchangerFile.deviceIcon && exchangerFile.deviceIcon.startsWith('H4s')) exchangerFile.deviceIcon = "data:image/svg+xml;base64," + await this.unzip(exchangerFile.deviceIcon, 'base64');
            if(exchangerFile.customIcons)  for (const customKey in exchangerFile.customIcons) {
                if (Object.hasOwnProperty.call(exchangerFile.customIcons, customKey)) {
                    if(exchangerFile.customIcons[customKey] && exchangerFile.customIcons[customKey].startsWith("H4s")) exchangerFile.customIcons[customKey] = "data:image/svg+xml;base64," + await this.unzip(exchangerFile.customIcons[customKey], 'base64');
                }
            }
                //exchangerFile.deviceIcon = this.unzip(exchangerFile.deviceIcon);
            
            // await this.executeForAllTypes(device, async (type, i )=> {
            //     if(device.Settings[type+i+"Icon"] && device.Settings[type+i+"Icon"].startsWith('custom') && !exchangerFile.customIcons[device.Settings[type+i+"Icon"]]){
            //         let a =exchangerFile.customIcons[device.Settings[type+i+"Icon"]];
            //         let b =device.Settings[type+i+"Icon"];
            //         //exchangerFile.customIcons[device.Settings[type+i+"Icon"]] = await this.getIconZipped("/userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
            //     }
            // });
            return exchangerFile;

            //return JSON.parse(await this.unzip(str));
        } catch (error) {
            this.error(error);
        }
    }

    
      
    async onPair(session, arg1) {
    // var s = session;
    // await session.nextView();
    let devices = await this.onPairListDevices();
    var device;
    //let useTemplate;
    let tefs;

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

    session.setHandler('virtualdeviceicons_load', async (data) => {
        
        let settingName = !this.activeAvdSource || this.activeAvdSource==='English' ? '' : '_'+  this.activeAvdSource;        
        return {tefTemplates: await this.homey.settings.get('avdTemplates' + settingName), device:devices[0], 
            favoriteTemplates: await this.homey.settings.get('avdFavoriteTemplates'), activeAvdSource:this.activeAvdSource,
            defaultIcons: this.getDefaultIcons()
        };
    });

    session.setHandler('use_template', async (data) => {
        ///useTemplate = data.template;
        tefs = data.tefs;
        //return this.getCustomIcons();
        return true;
    });
    session.setHandler('use_tef', async (data) => {
        ///useTemplate = data.template;
        let tef = await this.getAvdTef(data.tef);
        let device = devices[0];
        if(tef.deviceName) device.name = tef.deviceName;
        tefs = [{tef, device}];
        //return this.getCustomIcons();
        return true;
    });
    session.setHandler('getAvdTemplates', async (str) => {
        try {
            let settingName = !this.activeAvdSource || this.activeAvdSource==='English' ? '' : '_'+  this.activeAvdSource;
            return await this.homey.settings.get('avdTemplates'+settingName);
        } catch (error) {
            this.error(error);
        }
    });
    session.setHandler('set:activeAvdSource', async (source) => {
        await this.homey.settings.set('activeAvdSource', source);
        this.activeAvdSource = source;
    });
    // session.setHandler('list_icons', async (data) => {
    //     //return this.getCustomIcons();
    //     return this.getDefaultIcons();


    // });

    session.setHandler('icon_picked', async ({icon, name}) => {
        try {
                
            device = devices[0];
            
            let iconpath = "../../." +(await app.setDeviceIconFromDefault({device, icon:icon}));
            
            //var iconPath = "../../../userdata/virtualdeviceicons/"  + iconName;
            device.data.icon = iconpath;//iconPath;
            device.icon = iconpath;//iconPath;            
            if(name && name.length>0) device.name = name;
            tefs = null;
            return device;
        } catch (error) {
            this.error(error);
            this.log('Fault picking icon: ', icon);
            throw new Error(error);
        }

        // This is for custom icon picked
        // device = devices[0];
        // var iconPath = "../../../userdata/customicons/" + data.icon.file+'.svg';
        // device.data.icon = iconPath;
        // device.icon = iconPath;
        // return device;
    });
    
    session.setHandler('icon_save', async ({image, name})=> {     
        try
        {
            device = devices[0];       
            var icon = await DeviceSetter.Current.createDeviceIcon({ type:'image/svg', buffer:image, id:device.data.id });              
            var iconPath = "../../." + icon.path;      
            device.data.icon = iconPath;
            device.icon = iconPath;
            if(name && name.length>0) device.name = name;
            tefs = null;
            return device;      
        } catch (error) {
            this.error(error);
            this.log('Fault saving icon: ', image);
            throw new Error(error);
        }
    });

    
    session.setHandler('virtualdeviceicons_getTefs', async (obj) => {
        let tefs = [];
        let template = obj.template;
        let device = obj.device;
        for (let i = 0; i < template.tefs.length; i++) {
            const tef = template.tefs[i];
            let tefPlain = await this.getAvdTef(tef);
            //tefs.push();
            if(tefPlain.originalId) {
                if(tefPlain && tefPlain.settings) {
                    tefPlain.settings.postNumber = template.number;
                    tefPlain.settings.postId = template.id;
                    tefPlain.settings.topicId = template.topicId;
                }
                tefs.push({tef:tefPlain, device:i===0?(device?device:devices[0]):await this.onPairListDevices(tefs[i-1].device.data.id)});
                if(tefPlain.deviceName) _.last(tefs).device.name = tefPlain.deviceName;
            }
        }
        return {tefs};
    });


    session.setHandler('done', async () => {
        console.log('done');
        device = devices[0]; 
        let _devices;
        if(tefs) {
            _devices = [];
            for (let i = 0; i < tefs.length; i++) {
                const tef = tefs[i];
                _devices.push(tef.device);        
                if(tef.tef.deviceIcon) {
					await this.homey.app.createDeviceIcon({type:"image/svg", id:tef.device.data.id, buffer:tef.tef.deviceIcon });					
				}         
            }
        }
        return {device, devices:_devices};
    });
    session.setHandler('done_finished', async () => {
        console.log('done_finished');
        if(tefs) {
            //await this.sleep(1000);
            let devices = await this.getDevices();
            console.log('done_finished devices');
            for (let i = 0; i < tefs.length; i++) {
                const tef = tefs[i];
                let device = _.find(devices, d=>d.getData().id===tef.device.data.id);
                tef.realDevice = device;
                if(!device) {                    
                    let tries = 3;
                    let _try =1;
                    while(_try<=tries) {
                        await this.sleep(_try*1000);
                        devices = await this.getDevices();
                        device = _.find(devices, d=>d.getData().id===tef.device.data.id);
                        if(device) break;
                        _try++;
                    }
                }
                if(device) {
                    let settings = tefs[i].tef.settings;                    
                    settings.imported = 2;
					settings.deviceIcon = tefs[i].tef.deviceIcon; 
					settings.customIcons = tefs[i].tef.customIcons;
					settings.saveCustomIcons = tefs[i].tef.saveCustomIcons;
                    await device.ready();

                    await device.loadFromSettings(settings, device.Settings , [], true);
                }
                
            }
        }
        if(tefs && tefs.length) {
            await this.loadStuff({reload:true, reloadAf:false});
            return await this.readAdvancedFlowsJSON({exchangerFile:tefs[0].tef, device:tefs[0].realDevice});
        }
        return  null;
        //return {device, devices:_devices};
    });

    session.setHandler('virtualdevicesettings_updateFlowCommand', async (exchangerFile) => {            
        try {
            return await this.updateAdvancedFlowsJSON({exchangerFile});                
        } catch (error) {                
            this.error(error);
        }
        
    });

    session.setHandler('list_icons_selection', async (selectedIcons) => {
        // device.icon = '../../../userdata/icon.svg';
    });
        
    session.setHandler('add_device', async (device) => {
        // device.icon = '../../../userdata/icon.svg';
        console.log('on device added', device);
        
    });

    session.setHandler('refreshAvdTemplates', async (str) => {
        try {                
            return await this.getAvdTemplatesFromPosts();
        } catch (error) {
            this.error(error);
        }
    });

        
    session.setHandler('saveAvdTemplatesFavorites', async (avdTemplateFavorites) => {
        try {                
            return await this.homey.settings.set('avdFavoriteTemplates', avdTemplateFavorites);
        } catch (error) {
            this.error(error);
        }
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


    async onRepair(session, device) {
        //let allDevices,  allDrivers, actionCards, conditionCards, triggerCards, allUsers, allVariables, allTokens;
        

        // var s = session;
        // await session.nextView();
        //console.log(JSON.stringify(await this.getCustomIcons()));
        ///let data = device.getData();
        session.setHandler('virtualdevicesettings_loadStuff', async (data) => {
            await this.loadStuff({reload:true});
            return true;
        });

        session.setHandler('virtualdevicesettings_load', async (data) => {
            // // emit when devices are still being searched
            // session.emit('list_devices', devices);
      
            // return devices when searching is done
            // let defer = new Defer();
            // defer.then(async ()=> { this.loadStuff({reload:true}); });
            // setTimeout(()=> { defer.resolve(); }, 1);

            let settingName = !this.activeAvdSource || this.activeAvdSource==='English' ? '' : '_'+  this.activeAvdSource;
        return {settings:device.Settings, customicons:await this.getCustomIcons(), tefTemplates: await this.homey.settings.get('avdTemplates' + settingName), favoriteTemplates: await this.homey.settings.get('avdFavoriteTemplates'), activeAvdSource:this.activeAvdSource};

        });
        session.setHandler('virtualdevicesettings_save', async (settings) => {
            //console.log(settings, device.Settings , []);
            //device.data.icon = "../../../assets/icon.svg";
            //device.icon = "../../../assets/icon.svg";
            return await device.loadFromSettings(settings, device.Settings , [], true);
            
            //return {settings:device.Settings, customicons:await this.getCustomIcons()};
        });
        session.setHandler('set:activeAvdSource', async (source) => {
            await this.homey.settings.set('activeAvdSource', source);
            this.activeAvdSource = source;
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
            return await this.getAvdTef(str);
        });

        session.setHandler('virtualdevicesettings_getTextSettings', async (viewSettings) => {
            try {
                
                let dev = {deviceIcon:await this.getDeviceIconZipped(device), customIcons:{}, originalId:device.__id, settings:device.Settings};
                if(viewSettings && viewSettings.copyWithIcons) 
                    await this.executeForAllTypes(device, async (type, i )=> {
                        if(device.Settings[type+i+"Icon"] && device.Settings[type+i+"Icon"].startsWith('custom') && !dev.customIcons[device.Settings[type+i+"Icon"]]){
                            dev.customIcons[device.Settings[type+i+"Icon"]] = await this.getIconZipped("/userdata/customicons/" + device.Settings[type+i+"Icon"] + ".svg");
                        }
                    });
                dev = await this.getAdvancedFlowsJSON({dev, device, copyWithFlows:viewSettings.copyWithFlows });
                return dev;
            } catch (error) {
                this.error(error);
                
            }
        });

        
        session.setHandler('virtualdevicesettings_readFlows', async (exchangerFile) => {
            try {                    
                return await this.readAdvancedFlowsJSON({exchangerFile, device});
            } catch (error) {
                this.error(error);                
            }
        });

        session.setHandler('virtualdevicesettings_updateFlowCommand', async (exchangerFile) => {            
            try {
                return await this.updateAdvancedFlowsJSON({exchangerFile});                
            } catch (error) {                
                this.error(error);
            }
            
        });

        session.setHandler('getAvdTemplates', async (str) => {
            try {
                let settingName = !this.activeAvdSource || this.activeAvdSource==='English' ? '' : '_'+  this.activeAvdSource;
                return await this.homey.settings.get('avdTemplates'+settingName);
            } catch (error) {
                this.error(error);
            }
        });
        session.setHandler('refreshAvdTemplates', async (str) => {
            try {                
                return await this.getAvdTemplatesFromPosts();
            } catch (error) {
                this.error(error);
            }
        });

        
        session.setHandler('saveAvdTemplatesFavorites', async (avdTemplateFavorites) => {
            try {                
                return await this.homey.settings.set('avdFavoriteTemplates', avdTemplateFavorites);
            } catch (error) {
                this.error(error);
            }
        });
        this.onCreatedAdvancedFlows = (af)=> {
            if(session) session.emit("createdadvancedflow", af);
        };

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




