let categories = [            
            {
                title:'Devices',
                icons:[
                    {name:"device_1", file:'custom_1', defaultIcon:'device_capabilities'},
                    {name:"device_2", file:'custom_2', defaultIcon:'virtual_device'},
                    {name:"device_3", file:'custom_3', defaultIcon:'circle'},
                    {name:"device_4", file:'custom_4', defaultIcon:'curtain-half'},
                    {name:"device_5", file:'custom_5', defaultIcon:'game'},
                    {name:"device_6", file:'custom_6', defaultIcon:'onoff'},
                    {name:"device_7", file:'custom_7', defaultIcon:'settings'},
                    {name:"device_8", file:'custom_8', defaultIcon:'tv'},
                    {name:"device_9", file:'custom_9', defaultIcon:'button'},
                    {name:"device_10", file:'custom_10', defaultIcon:'devices'},
                    {name:"device_11", file:'custom_11', defaultIcon:'energy'},
                    {name:"device_12", file:'custom_12', defaultIcon:'insights'},
                    {name:"device_13", file:'custom_13', defaultIcon:'home'},
                    {name:"device_14", file:'custom_14', defaultIcon:'homeyscript'},
                    {name:"device_15", file:'custom_15', defaultIcon:'search'},
                    {name:"device_16", file:'custom_16', defaultIcon:'ternary'},
                    {name:"device_17", file:'custom_17', defaultIcon:'toggle'},
                    {name:"device_18", file:'custom_18', defaultIcon:'advanced-flow'},
                    {name:"device_19", file:'custom_19', defaultIcon:'flow-bold'},
                    {name:"device_20", file:'custom_20', defaultIcon:'logic'}
                ]
            },
            {
                title:'Capabilities', 
                icons:[
                    {name:"capabilities_1", file:'custom_21', defaultIcon:'measure_clouds'},
                    {name:"capabilities_2", file:'custom_22', defaultIcon:'measure_humidity'},
                    {name:"capabilities_3", file:'custom_23', defaultIcon:'measure_luminance'},
                    {name:"capabilities_4", file:'custom_24', defaultIcon:'measure_power'},
                    {name:"capabilities_5", file:'custom_25', defaultIcon:'measure_rain'},
                    {name:"capabilities_6", file:'custom_26', defaultIcon:'measure_temperature'},
                    {name:"capabilities_7", file:'custom_27', defaultIcon:'measure_wind_angle'},
                    {name:"capabilities_8", file:'custom_28', defaultIcon:'measure_wind_strength'},
                    {name:"capabilities_9", file:'custom_29', defaultIcon:'heart-outline'},
                    {name:"capabilities_10", file:'custom_30', defaultIcon:'bell'},
                    {name:"capabilities_11", file:'custom_31', defaultIcon:'moon-round'},
                    {name:"capabilities_12", file:'custom_32', defaultIcon:'measure_noise'},
                    {name:"capabilities_13", file:'custom_33', defaultIcon:'measure_pressure'},
                    {name:"capabilities_14", file:'custom_34', defaultIcon:'meter_gas'},
                    {name:"capabilities_15", file:'custom_35', defaultIcon:'meter_power'},
                    {name:"capabilities_16", file:'custom_36', defaultIcon:'sensor'},
                    {name:"capabilities_17", file:'custom_37', defaultIcon:'alarm_smoke'},
                    {name:"capabilities_18", file:'custom_38', defaultIcon:'alarm_water'},
                    {name:"capabilities_19", file:'custom_39', defaultIcon:'battery'},
                    {name:"capabilities_20", file:'custom_40', defaultIcon:'tag'}
                ]
            },
            {
                title:'Other',
                icons:[
                    {name:"other_1", file:'custom_41', defaultIcon:'music'},
                    {name:"other_2", file:'custom_42', defaultIcon:'speaker_next'},
                    {name:"other_3", file:'custom_43', defaultIcon:'speaker_play'},
                    {name:"other_4", file:'custom_44', defaultIcon:'speaker_prev'},
                    {name:"other_5", file:'custom_45', defaultIcon:'volume_down'},
                    {name:"other_6", file:'custom_46', defaultIcon:'volume_mute'},
                    {name:"other_7", file:'custom_47', defaultIcon:'volume_up'},
                    {name:"other_8", file:'custom_48', defaultIcon:''},
                    {name:"other_9", file:'custom_49', defaultIcon:''},
                    {name:"other_10", file:'custom_50', defaultIcon:''},
                    {name:"other_11", file:'custom_51', defaultIcon:''},
                    {name:"other_12", file:'custom_52', defaultIcon:''},
                    {name:"other_13", file:'custom_53', defaultIcon:''},
                    {name:"other_14", file:'custom_54', defaultIcon:''},
                    {name:"other_15", file:'custom_55', defaultIcon:''},
                    {name:"other_16", file:'custom_56', defaultIcon:''},
                    {name:"other_17", file:'custom_57', defaultIcon:''},
                    {name:"other_18", file:'custom_58', defaultIcon:''},
                    {name:"other_19", file:'custom_59', defaultIcon:''},
                    {name:"other_20", file:'custom_60', defaultIcon:''}
                ]
            }

        ];


if(false) {
  let newIcons = [''];
  for(let i=0;i<categories.length;i++)
    for(let j=0;j<categories[i].icons.length;j++)
      newIcons.push(categories[i].icons[j].file);

  console.log(newIcons);
  return;
} 

let str='';
for(let i=0;i<categories.length;i++){
  str+= '\'                {"id": "'+"".padStart(i+1,' ')+'","label": {"en": "-----   '+categories[i].title.padEnd(15, ' ')+'   -----"}}, \\r\\n\' + \r\n';
    for(let j=0;j<categories[i].icons.length;j++) {
      var icon  = categories[i].icons[j];
      str+= '\'                {"id": "'+icon.file+'","label": {"en": "'+icon.name+'"}}';
      if(i===categories.length-1 && j===categories[i].icons.length-1)str+="\\r\\n\' + \r\n";else str+=", \\r\\n\' + \r\n";
    }
}
console.log(str);

//'                {"id": "","label": {"en": ""}}, \r\n' +
