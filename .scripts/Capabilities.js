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
    'custom_10'
];

var sets1 = ['_hide'];//];
for(var j=0;j<sets1.length;j++) {
  var val = sets1[j];
  str+= '"devicecapabilities'+val+'_button": { \r\n'+
  '      "type": "boolean", \r\n'+
  '      "title": { \r\n'+
  '        "en": "Button" \r\n'+
  '      }, \r\n'+
  '      "getable": true, \r\n'+
  '      "setable": '+(val=='_hide'?'false':'true')+', \r\n'+
  (val=='_hide' ? '"uiComponent": null, \r\n' : (val=='' ? '' : '"uiComponent": "toggle", \r\n')) +
  '      "insights": true, \r\n'+
  '      "uiQuickAction": true \r\n'+
  '    },     \r\n';
}

for(var i=0;i<icons.length;i++) {
  let header = (icons[i]!='' ? '-'+icons[i] : '');
  let icon = (icons[i]!='' ? 
    ', "icon": "' + ((icons[i].startsWith('custom_') ? '/userdata/customicons/'+icons[i] : '/assets/icons/' + icons[i] )  + '.svg') + '" \r\n'
    : '');

str+='"devicecapabilities_text'+header+'": { \r\n'+
'      "type": "string", \r\n'+
'      "title": { \r\n'+
'        "en": "Text" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor" \r\n'+
        icon+
'    }, \r\n';

str+='"measure_devicecapabilities_number'+header+'": { \r\n'+
'      "type": "number", \r\n'+
'      "title": { \r\n'+
'        "en": "Number" \r\n'+
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
'        "en": "Yes/No" \r\n'+
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
'        "en": "Yes/No" \r\n'+
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
    '        "en": "Yes/No" \r\n'+
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
  '        "en": "Yes/No" \r\n'+
  '      }, \r\n'+
  '      "getable": true, \r\n'+
  '      "setable": '+(val=='_disabled'?'false':'true')+', \r\n'+
  '      "uiComponent": "toggle", \r\n' +
  '      "insights": true \r\n'+
          icon+
  '    }, \r\n';
}
// var sets1 = ['', '_disabled', '_hide'];
// for(var j=0;j<sets1.length;j++) {
//   var val = sets1[j];
// }

var sets1 = [''];//, '_disabled', '_hide'];
for(var j=0;j<sets1.length;j++) {
  var val = sets1[j];
    
  var sets2 = [''];
  for(var k=0;k<sets2.length;k++) {
    var val2 = sets2[k];
      str+=
      '    "alarm_devicecapabilities_quickaction'+val+val2+'_boolean'+header+'": { \r\n'+
      '      "type": "boolean", \r\n'+
      '      "title": { \r\n'+
      '        "en": "Yes/No" \r\n'+
      '      }, \r\n'+
      '      "getable": true, \r\n'+
      '      "setable": '+(val=='_disabled'?'false':'true')+', \r\n'+
      (val=='_hide' ? '"uiComponent": null, \r\n' : (val=='' ? '' : '"uiComponent": "toggle", \r\n')) +
      '      "insights": true, \r\n'+
      '      "uiQuickAction": true \r\n'+
              icon+
      '    }, \r\n'+
      '    "devicecapabilities_quickaction'+val+val2+'_boolean'+header+'": { \r\n'+
      '      "type": "boolean", \r\n'+
      '      "title": { \r\n'+
      '        "en": "Yes/No" \r\n'+
      '      }, \r\n'+
      '      "getable": true, \r\n'+
      '      "setable": '+(val=='_disabled'?'false':'true')+', \r\n'+
      (val=='_hide' ? '"uiComponent": null, \r\n' : (val=='' ? '' : '"uiComponent": "toggle", \r\n')) +
      '      "insights": true, \r\n'+
      '      "uiQuickAction": true \r\n'+
              icon+
      '    },     \r\n';
  }
}
str+=
'    "measure_devicecapabilities_status'+header+'": { \r\n'+
'      "type": "number", \r\n'+
'      "title": { \r\n'+
'        "en": "Status" \r\n'+
'      }, \r\n'+
'      "getable": true, \r\n'+
'      "setable": true, \r\n'+
'      "uiComponent": "sensor", \r\n'+
'      "insights": true \r\n'+ 
        icon+
'    }, \r\n';
}

console.log(str);

return null;