var fields = 10;
var icons = '              "values": [ \r\n' +
'                {"id": "","label": {"en": ""}}, \r\n' +
'                {"id": "alarm_smoke", "label": { "en": "alarm_smoke" } }, \r\n' +
'                {"id": "alarm_water", "label": { "en": "alarm_water" } }, \r\n' +
'                {"id": "battery", "label": { "en": "battery" } }, \r\n' +
'                {"id": "circle", "label": { "en": "circle" } }, \r\n' +
'                {"id": "device_capabilities", "label": { "en": "device_capabilities" } }, \r\n' +
'                {"id": "measure_clouds", "label": { "en": "measure_clouds" } }, \r\n' +
'                {"id": "measure_humidity", "label": { "en": "measure_humidity" } }, \r\n' +
'                {"id": "measure_luminance", "label": { "en": "measure_luminance" } }, \r\n' +
'                {"id": "measure_noise", "label": { "en": "measure_noise" } }, \r\n' +
'                {"id": "measure_power", "label": { "en": "measure_power" } }, \r\n' +
'                {"id": "measure_pressure", "label": { "en": "measure_pressure" } }, \r\n' +
'                {"id": "measure_rain", "label": { "en": "measure_rain" } }, \r\n' +
'                {"id": "measure_temperature", "label": { "en": "measure_temperature" } }, \r\n' +
'                {"id": "measure_wind_angle", "label": { "en": "measure_wind_angle" } }, \r\n' +
'                {"id": "measure_wind_strength", "label": { "en": "measure_wind_strength" } }, \r\n' +
'                {"id": "meter_gas", "label": { "en": "meter_gas" } }, \r\n' +
'                {"id": "meter_power", "label": { "en": "meter_power" } }, \r\n' +
'                {"id": "meter_rain", "label": { "en": "meter_rain" } }, \r\n' +
'                {"id": "meter_water", "label": { "en": "meter_water" } },  \r\n' +       
'                {"id": "music", "label": { "en": "music" } }, \r\n' +
'                {"id": "onoff", "label": { "en": "onoff" } }, \r\n' +
'                {"id": "sensor", "label": { "en": "sensor" } }, \r\n' +
'                {"id": "speaker_next", "label": { "en": "speaker_next" } }, \r\n' +
'                {"id": "speaker_play", "label": { "en": "speaker_play" } }, \r\n' +
'                {"id": "speaker_prev", "label": { "en": "speaker_prev" } }, \r\n' +
'                {"id": "virtual_device", "label": { "en": "virtual_device" } }, \r\n' +
'                {"id": "volume_down", "label": { "en": "volume_down" } }, \r\n' +
'                {"id": "volume_mute", "label": { "en": "volume_mute" } }, \r\n' +
'                {"id": "volume_up", "label": { "en": "volume_up" } } \r\n' +
'              ], \r\n' ;




var str = '"settings": [ \r\n' +
'{ \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "General"}, \r\n' +
'          "hint": { \r\n' +
'            "en": "Enter al settings for the Status Field which can be selected as Status Indicator." \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "label3", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Be aware"}, \r\n' +
'              "value":"Changing the properties Icon, Show as Alarm or Show as On/Off will causes Tag IDs to be changed and thus may break flows." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "label5", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Also"}, \r\n' +
'              "value":"Enabling all fields at once and pressing save, might be hard for your Homey and could take a while." \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n' +
'        { \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Status Indicator Field" \r\n' +
'          }, \r\n' +
'          "hint": { \r\n' +
'            "en": "Enter al settings for the Status Field which can be selected as Status Indicator." \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "status1Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for the Status Field" \r\n' +
'              }, \r\n' +
'              "value": "Status" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
'              }, \r\n' +
icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show." \r\n' +
'              }, \r\n' +
'              "value": 0, \r\n' +
'              "min": 0, \r\n' +
'              "max": 10, \r\n' +
'              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1PreventInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Prevent Insights" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated or filled." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        },';



for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Textfield '+i+'" \r\n' +
'          }, \r\n' +
'          "hint": { \r\n' +
'            "en": "Enter al settings for textfield '+i+'" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "text'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for textfield '+i+'" \r\n' +
'              }, \r\n' +
'              "value":'+(i===1 ? '"Text '+i+'"': '""')+' \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}

for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Numberfield '+i+'" \r\n' +
'          }, \r\n' +
'          "hint": { \r\n' +
'            "en": "Enter al settings for numberfield '+i+'" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for numberfield '+i+'" \r\n' +
'              }, \r\n' +
'              "value":'+(i===1 ? '"Number '+i+'"': '""')+' \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Units", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Units" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The Units to use for the number. If you need Fahrenheit, enter °C and it will be translaten to Fahrenheit." \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show." \r\n' +
'              }, \r\n' +
'              "value": 0, \r\n' +
'              "min": 0, \r\n' +
'              "max": 10, \r\n' +
'              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'PreventInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Prevent Insights" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated or filled." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}


for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Yes/No field '+i+'" \r\n' +
'          }, \r\n' +
'          "hint": { \r\n' +
'            "en": "Enter al settings for Yes/No field '+i+'." \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for Yes/No field '+i+'" \r\n' +
'              }, \r\n' +
'              "value":'+(i===1 ? '"Yes/No '+i+'"': '""')+' \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'AsAlarm", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as alarm" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected you are able to use this field as the Status Indicator and this will flash like an alarm." \r\n' +
'              }, \r\n' +
'              "value": '+(i===1 ? 'true': 'false')+' \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'UiQuickAction", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as Button" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Set this to true when you want to quick-toggle the capability\'s value from the UI." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
// '            { \r\n' +
// '              "id": "boolean'+i+'Disabled", \r\n' +
// '              "type": "checkbox", \r\n' +
// '              "label": { \r\n' +
// '                "en": "Disable Button" \r\n' +
// '              }, \r\n' +
// '              "hint": { \r\n' +
// '                "en": "When selected this button cannot be pushed in the UI. Only functions correctly if all buttons are disabled." \r\n' +
// '              }, \r\n' +
// '              "value": false \r\n' +
// '            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'PreventInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Prevent Insights" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log (timeline) from being automatically generated or filled." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleTrue", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title True" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is True." \r\n' +
'              }, \r\n' +
'              "value": '+(i===1 ? '"True"': '""')+' \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleFalse", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title False" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is False." \r\n' +
'              }, \r\n' +
'              "value": '+(i===1 ? '"False"': '""')+' \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}


for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Button '+i+'" \r\n' +
  '          }, \r\n' +
  '          "hint": { \r\n' +
  '            "en": "Enter al settings for Button '+i+'" \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Button '+i+'" \r\n' +
  '              }, \r\n' +
  '              "value":'+(i===1 ? '"Button '+i+'"': '""')+' \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'ShowAs", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Show as" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Select how the button must be displayed." \r\n' +
  '              }, \r\n' +
  '              "values":[';
  if(i===1) str+= '      {"id":"indicatoronly", "label":"Indicator Only"}, ';
  str+='           {"id":"", "label":" "}, '+
  '                {"id":"button", "label":"Button (Default)"}, '+
  '                {"id":"onoff", "label":"On/Off"}, '+
  '                {"id":"lock", "label":"Lock"}, '+
  '                {"id":"garagedoor_closed", "label":"Garagedoor Closed"}, '+
  '                {"id":"windowcoverings_closed", "label":"Windowcoverings Closed"} '+
  '              ], '+
  '              "value":""  \r\n';
  if(i>1) str+=
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Icon", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Icon (only for Button or OnOff)" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
  '              }, \r\n' +
  icons +'       "value": "" \r\n';

  str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'Disabled", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Disabled" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected this button will not be clickable." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n' +
  '            } \r\n';

  str+=
  '          ] \r\n' +
  '        }, \r\n';
}


for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Camera '+i+'" \r\n' +
  '          }, \r\n' +
  '          "hint": { \r\n' +
  '            "en": "Enter al settings for Camera '+i+'" \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Camera '+i+'" \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Url", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Url" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The URL for Camera '+i+'" \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Interval", \r\n' +
  '              "type": "number", \r\n' +
  '              "min": 0, \r\n' +
  '              "max": 86400, \r\n' +
  '              "step": 1, \r\n' +
  '              "label": { \r\n' +
  '                "en": "Interval in Seconds" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The Interval in seconds to refresh the image for Camera '+i+'. Entering 0 will disable automatic refresh." \r\n' +
  '              }, \r\n' +
  '              "value":0 \r\n' +
  '            }';


  str+=
  '          ] \r\n' +
  '        }';
  if(i<fields) str+= ',';
  str+='\r\n';
}





str+=']';
console.log(str);

return null;