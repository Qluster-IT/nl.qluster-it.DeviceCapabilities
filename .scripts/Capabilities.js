var str = '';
let icons = ['',
    'alarm_smoke', 
    'alarm_water',
    'battery', 
    'circle', 
    'curtain-half', 
    'device_capabilities',
    'game',
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
    'tv',
    'virtual_device',
    'volume_down',
    'volume_mute',
    'volume_up',

    'custom_1',
    'custom_2',
    'custom_3',
    'custom_4',
    'custom_5',
    'custom_6',
    'custom_7',
    'custom_8',
    'custom_9',
    'custom_10',
    'custom_11',
    'custom_12',
    'custom_13',
    'custom_14',
    'custom_15',
    'custom_16',
    'custom_17',
    'custom_18',
    'custom_19',
    'custom_20',
    'custom_21',
    'custom_22',
    'custom_23',
    'custom_24',
    'custom_25',
    'custom_26',
    'custom_27',
    'custom_28',
    'custom_29',
    'custom_30',
    'custom_31',
    'custom_32',
    'custom_33',
    'custom_34',
    'custom_35',
    'custom_36',
    'custom_37',
    'custom_38',
    'custom_39',
    'custom_40'
];

str+='"devicecapabilities_starttext": { \r\n'+
'      "type": "string", \r\n'+
'      "title": { \r\n'+
'        "en": "And start creating your own device", "nl":"En begin met het aanmaken van je eigen apparaat" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": false, \r\n'+
'      "uiComponent": "sensor", \r\n'+
'      "insights": false, \r\n'+
'      "icon": "/assets/icons/virtual_device.svg", \r\n'+
'      "value": "And start creating your own device" \r\n'+
'    }, \r\n';

var sets1 = ['_hide', '_onoff_hide'];
for(var j=0;j<sets1.length;j++) {
  var val = sets1[j];
  str+= '"devicecapabilities'+val+'_button": { \r\n'+
  '      "type": "boolean", \r\n'+
  '      "title": { \r\n'+
  '        "en": "Button", "nl":"Knop" \r\n'+
  '      }, \r\n'+
  '      "getable": true, \r\n'+
  '      "setable": '+(val=='_hide'?'false':'true')+', \r\n'+
  (val=='_hide' || val=='_onoff_hide' ? '"uiComponent": null, \r\n' : (val=='' ? '' : '"uiComponent": "toggle", \r\n')) +
  '      "insights": true, \r\n'+
  '      "uiQuickAction": true \r\n'+
  '    },     \r\n';
}



/**                      HERE                   */
for(var i=0;i<icons.length;i++) {
  let header = (icons[i]!='' ? '-'+icons[i] : '');
  let icon = (icons[i]!='' ? 
    ', "icon": "' + ((icons[i].startsWith('custom_') ? '/userdata/customicons/'+icons[i] : '/assets/icons/' + icons[i] )  + '.svg') + '" \r\n'
    : '');

str+='"devicecapabilities_text'+header+'": { \r\n'+
'      "type": "string", \r\n'+
'      "title": { \r\n'+
'        "en": "Text", "nl":"Tekst" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor" \r\n'+
        icon+
'    }, \r\n';

str+='"measure_devicecapabilities_number'+header+'": { \r\n'+
'      "type": "number", \r\n'+
'      "title": { \r\n'+
'        "en": "Number", "nl":"Nummer" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor", \r\n'+
'      "insights": true \r\n'+
        icon+
'    }, \r\n';


str+='"alarm_devicecapabilities_boolean'+header+'": { \r\n'+
'      "type": "boolean", \r\n'+
'      "title": { \r\n'+
'        "en": "Yes/No", "nl":"Ja/Nee" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor", \r\n'+
'      "insights": true \r\n'+
        icon+
'    }, \r\n'+
'    "devicecapabilities_boolean'+header+'": { \r\n'+
'      "type": "boolean", \r\n'+
'      "title": { \r\n'+
'        "en": "Yes/No", "nl":"Ja/Nee" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor", \r\n'+
'      "insights": true \r\n'+
        icon+
'    },     \r\n' ;
// '    "devicecapabilities_dropdown'+header+'": { \r\n'+
// '      "type": "enum", \r\n'+
// '      "title": { \r\n'+
// '        "en": "Select list" \r\n'+
// '      }, \r\n'+
// '      "getable": true, \r\n'+
// '      "setable": true, \r\n'+
// '      "uiComponent": "picker", \r\n'+
// '      "insights": true, \r\n'+
// '      "values": [] \r\n'+
//         icon+
// '    },     \r\n';

var sets1 = ['', '_disabled'];//, , '_hide'];
for(var j=0;j<sets1.length;j++) {
  var val = sets1[j];
  var sets2 = ['', 'onoffbuttontab_'];
  for(var k=0;k<sets2.length;k++) {
    var val2 = sets2[k];
    str+=
    '    "'+val2+'devicecapabilities'+val+'_button'+header+'": { \r\n'+
    '      "type": "boolean", \r\n'+
    '      "title": { \r\n'+
    '        "en": "Yes/No", "nl":"Ja/Nee" \r\n'+
    '      }, \r\n'+
    '      "getable": '+(val2=='onoffbuttontab_'?'true':'false')+', \r\n'+
    '      "setable": '+(val=='_disabled'?'false':'true')+', \r\n'+
    '      "uiComponent": "button", \r\n' +
    '      "insights": true, \r\n'+
    '      "uiQuickAction": true \r\n';
    //str+= (val2==='_checked'? ',"value": true \r\n' : ',"value": false \r\n')
    str+= icon+
    '    }, \r\n';
  }
  
  str+=
  '    "onoff_devicecapabilities'+val+'_button'+header+'": { \r\n'+
  '      "type": "boolean", \r\n'+
  '      "title": { \r\n'+
  '        "en": "Yes/No", "nl":"Ja/Nee" \r\n'+
  '      }, \r\n'+
  '      "getable": true, \r\n'+
  '      "setable": '+(val=='_disabled'?'false':'true')+', \r\n'+
  '      "uiComponent": "toggle", \r\n' +
  '      "insights": true \r\n'+
          icon+
  '    }, \r\n';
}

}

console.log(str);

return null;