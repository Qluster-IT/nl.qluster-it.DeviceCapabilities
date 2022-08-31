var fields = 10;
var icons = '              "values": [ \r\n' +
'                {"id": "","label": {"en": ""}}, \r\n' +
'                {"id": "alarm_smoke", "label": { "en": "alarm_smoke" } }, \r\n' +
'                {"id": "alarm_water", "label": { "en": "alarm_water" } }, \r\n' +
'                {"id": "battery", "label": { "en": "battery" } }, \r\n' +
'                {"id": "circle", "label": { "en": "circle" } }, \r\n' +
'                {"id": "curtain-half", "label": { "en": "curtain-half" } }, \r\n' +
'                {"id": "device_capabilities", "label": { "en": "device_capabilities" } }, \r\n' +
'                {"id": "game", "label": { "en": "game" } }, \r\n' +
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
'                {"id": "tv", "label": { "en": "tv" } }, \r\n' +
'                {"id": "virtual_device", "label": { "en": "virtual_device" } }, \r\n' +
'                {"id": "volume_down", "label": { "en": "volume_down" } }, \r\n' +
'                {"id": "volume_mute", "label": { "en": "volume_mute" } }, \r\n' +
'                {"id": "volume_up", "label": { "en": "volume_up" } }, \r\n' +
'                {"id": "custom_1", "label": { "en": "custom_1" } }, \r\n' +
'                {"id": "custom_2", "label": { "en": "custom_2" } }, \r\n' +
'                {"id": "custom_3", "label": { "en": "custom_3" } }, \r\n' +
'                {"id": "custom_4", "label": { "en": "custom_4" } }, \r\n' +
'                {"id": "custom_5", "label": { "en": "custom_5" } }, \r\n' +
'                {"id": "custom_6", "label": { "en": "custom_6" } }, \r\n' +
'                {"id": "custom_7", "label": { "en": "custom_7" } }, \r\n' +
'                {"id": "custom_8", "label": { "en": "custom_8" } }, \r\n' +
'                {"id": "custom_9", "label": { "en": "custom_9" } }, \r\n' +
'                {"id": "custom_10", "label": { "en": "custom_10" } } \r\n' +
'              ], \r\n' ;




var str = '"settings": [ \r\n' +
'         { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "General", "nl":"Algemeen"}, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelGeneral", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Be aware", "nl":"Let op"}, \r\n' +
'              "value":"Changing the properties Icon, \'Show as\' or \'Create Flow Cards\' will causes Tag IDs to be changed and thus may break flows." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "labelAlso", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Also", "nl":"En verder"}, \r\n' +
'              "value":"Enabling all fields at once and pressing save, might be hard for your Homey and could take a while." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "labelCustomIcons", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Custom icons", "nl":"Aangepaste pictogrammen"}, \r\n' +
'              "value":"The 10 custom icons can be set through the App Settings." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "cls", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": {"en": "Device Class", "nl":"Apparaatklasse"}, \r\n' +
'              "hint": {"en": "Changing the Device Class may break flows that depend on automaticly created flowcards of the previously specified class.", "nl":"Het wijzigen van de apparaatklasse kan flows breken die afhankelijk zijn van automatisch gemaakte flowkaarten van de eerder gespecificeerde klasse."}, \r\n' +
'              "values":['+
'                {"id":"other", "label":"Other (Default)"}, '+
'                {"id":"amplifier", "label":"Amplifier"}, '+
'                {"id":"blinds", "label":"Blinds"}, '+
'                {"id":"button", "label":"Button"}, '+
'                {"id":"camera", "label":"Camera"}, '+
'                {"id":"coffeemachine", "label":"Coffee machine"}, '+
'                {"id":"curtain", "label":"Curtains"}, '+
'                {"id":"doorbell", "label":"Doorbell"}, '+
'                {"id":"fan", "label":"Fan"}, '+
'                {"id":"garagedoor", "label":"Garage door"}, '+
'                {"id":"heater", "label":"Heater"}, '+
'                {"id":"homealarm", "label":"Home Security"}, '+
'                {"id":"kettle", "label":"Kettle"}, '+
'                {"id":"light", "label":"Light"}, '+
'                {"id":"lock", "label":"Lock"}, '+
'                {"id":"remote", "label":"Remote"}, '+
'                {"id":"sensor", "label":"Sensor"}, '+
'                {"id":"socket", "label":"Wall Plug"} '+
'              ], '+
'              "value":"other" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n' +
'        { \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Status Indicator Field", "nl":"Statusindicatorveld" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "status1Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for the Status Field", "nl":"De naam voor het statusveld" \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows.", "nl":"Selecteer een pictogram voor deze capability. Houd er rekening mee dat dit ertoe leidt dat tag-ID\'s worden gewijzigd en dus flows kunnen onderbreken." \r\n' +
'              }, \r\n' +
icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals", "nl":"Decimalen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show.", "nl":"Het aantal decimalen dat moet worden weergegeven." \r\n' +
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
'                "en": "Prevent Insights", "nl":"Voorkom inzichten" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, niet gevuld." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        },';



for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Textfield '+i+'", "nl":"Tekstveld '+i+'" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "text'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for textfield '+i+'", "nl":"De naam voor tekstveld '+i+'" \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the text must be displayed.", "nl":"Selecteer hoe de tekst moet worden weergegeven." \r\n' +
'              }, \r\n' +
'              "values":['+
'                {"id":"", "label":" "}, '+
'                {"id":"sensor", "label":"Sensor (Default)"}, '+
'                {"id":"speaker_artist", "label":"Artist"}, ' +
'                {"id":"speaker_album", "label":"Album"}, ' +
'                {"id":"speaker_track", "label":"Track"} ' +
'              ], '+
'              "value":""  \r\n'+
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}


str+='   { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Numbers", "nl":"Nummers"}, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelNumber1", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " "}, \r\n' +
'              "value":" " \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';


for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Numberfield '+i+'", "nl":"Nummerveld '+i+'" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for numberfield '+i+'", "nl":"De naam voor nummerveld '+i+'" \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the number must be displayed.", "nl":"Selecteer hoe het nummer moet worden weergegeven." \r\n' +
'              }, \r\n' +
'              "values":['+
'                {"id":"", "label":" "}, '+
'                {"id":"sensor", "label":"Sensor (Default)"}, '+
'                {"id":"target_temperature", "label":"Temperature (target)"}, '+
'                {"id":"measure_temperature", "label":"Temperature (measure)"}, '+
'                {"id":"dim", "label":"Dim"}, '+
'                {"id":"light_hue", "label":"Hue"}, '+
'                {"id":"light_saturation", "label":"Color Saturation"}, '+
'                {"id":"light_temperature", "label":"Color Temperature"}, '+
'                {"id":"measure_battery", "label":"Battery"}, '+
'                {"id":"volume_set", "label":"Set Volume"}, '+
'                {"id":"windowcoverings_tilt_set", "label":"Window Coverings tilt set"}, '+
'                {"id":"windowcoverings_set", "label":"Window Coverings Position"}, '+
'                {"id":"speaker_duration", "label":"Speaker Duration"}, '+
'                {"id":"speaker_position", "label":"Speaker Position"} ' +
'              ], '+
'              "value":""  \r\n';
str+='       },' +
  '            { \r\n' +
  '              "id": "number'+i+'CreateFlowCards", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Flow Cards", "nl":"Creëer flowkaarten" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  

str+='       }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Units", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Units", "nl":"Eenheden" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The Units to use for the number. If you need Fahrenheit, enter °C and it will be translated into Fahrenheit.", "nl":"De eenheden die voor het nummer moeten worden gebruikt. Als je Fahrenheit nodig hebt, voer dan °C in en het wordt vertaald in Fahrenheit." \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals", "nl":"Decimalen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show. Enter -1 will be ignored and thus use a default value.", "nl":"Het aantal decimalen dat moet worden weergegeven. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken." \r\n' +
'              }, \r\n' +
'              "value": -1, \r\n' +
'              "min": -1, \r\n' +
'              "max": 10, \r\n' +
'              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Min", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Min", "nl":"Min" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The minimum value for the Number. Enter -1 will be ignored and thus use a default value.", "nl":"De minimale waarde voor het getal. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken." \r\n' +
'              }, \r\n' +
'              "value": -1 \r\n' +
// '              "min": 0, \r\n' +
// '              "max": 10, \r\n' +
// '              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Max", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Max", "nl":"Max" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The maximum value for the Number. Enter -1 will be ignored and thus use a default value.", "nl":"De maximale waarde voor het getal. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken." \r\n' +
'              }, \r\n' +
'              "value": -1 \r\n' +
// '              "min": 0, \r\n' +
// '              "max": 10, \r\n' +
// '              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'PreventInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Prevent Insights", "nl":"Voorkom inzichten" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
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
'            "en": "Yes/No field '+i+'", "nl":"Ja/Nee-veld '+i+'" \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for Yes/No field '+i+'", "nl":"De naam voor Ja/Nee-veld '+i+'" \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the Yes/No must be displayed.", "nl":"Selecteer hoe de Ja/Nee moet worden weergegeven." \r\n' +
'              }, \r\n' +
'              "values":['+
'                {"id":"", "label":" "}, '+
'                {"id":"sensor", "label":"Sensor (Default)"}, '+
'                {"id":"alarm", "label":"Alarm"}, '+
'                {"id":"onoff", "label":"On/Off (Button Tab)"} '+
'              ], '+
'              "value":""  \r\n';

str+='       },' +
  '            { \r\n' +
  '              "id": "boolean'+i+'CreateFlowCards", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Flow Cards", "nl":"Creëer flowkaarten" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
str+='       }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
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
'                "en": "Prevent Insights", "nl":"Voorkom inzichten" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleTrue", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title True", "nl":"Insights titel Waar" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is True.", "nl":"Insights omschrijving voor wanneer de waarde Waar is." \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleFalse", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title False", "nl":"Insights titel Onwaar" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is False.", "nl":"Insights omschrijving voor wanneer de waarde Onwaar is." \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}




str+='   { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Buttons", "nl":"Knoppen"}, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelButton1", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " ", "nl":" "}, \r\n' +
'              "value":"Button 1 is special and remains the first, and therefore, the main device button and indicator." \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';

for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Button '+i+'", "nl":"Knop '+i+'" \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name", "nl":"Naam" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Button '+i+'", "nl":"De naam voor knop '+i+'" \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'ShowAs", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Show as", "nl":"Toon als" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Select how the button must be displayed.", "nl":"Selecteer hoe de knop moet worden weergegeven." \r\n' +
  '              }, \r\n' +
  '              "values":[';
  if(i===1) str+= '{"id":"indicatoronly", "label":"Indicator Only"}, ';
  if(i===1) str+= '{"id":"pushbutton_indicator", "label":"Pushbutton and separate Indicator"}, ';
  if(i===1) str+= '{"id":"onoff_hide", "label":"On/Off (Hidden)"}, ';
  str+='           {"id":"", "label":" "}, '+
  '                {"id":"button", "label":"Push Button (Default)"}, '+
  '                {"id":"onoff", "label":"On/Off"}, ';
  if(i>1) str+= '{"id":"onoff_buttontab", "label":"On/Off (Button Tab)"}, ';
  str+='           {"id":"locked", "label":"Lock"}, '+
  '                {"id":"garagedoor_closed", "label":"Garagedoor Closed"}, '+
  '                {"id":"windowcoverings_closed", "label":"Windowcoverings Closed"}, '+
  
  '                {"id":"speaker_playing", "label":"Speaker Playing"}, '+
  '                {"id":"speaker_next", "label":"Speaker Next"}, '+
  '                {"id":"speaker_prev", "label":"Speaker Previous"}, '+
  '                {"id":"speaker_shuffle", "label":"Speaker Shuffle"}, '+
  '                {"id":"volume_mute", "label":"Volume muted"}, '+
  '                {"id":"volume_up", "label":"Volume up"}, '+
  '                {"id":"volume_down", "label":"Volume down"}, '+
  '                {"id":"channel_up", "label":"Channel up"}, '+
  '                {"id":"channel_down", "label":"Channel down"}, '+
  '                {"id":"windowcoverings_tilt_up", "label":"Window coverings tilt up"}, '+
  '                {"id":"windowcoverings_tilt_down", "label":"Window coverings tilt down"} ' +
  '              ], '+
  '              "value":""  \r\n';
  
str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'CreateFlowCards", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Flow Cards *", "nl":"Creëer flowkaarten *" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability. Also needed for some buttons, like Play, Previous and Next.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt. Ook nodig voor sommige knoppen, zoals Afspelen, Vorige en Volgende." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
  if(i>1) str+=
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Icon", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Icon (only for Button or On/Off)", "nl":"Pictogram (voor Knop of Aan/Uit)" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
  '              }, \r\n' +
  icons +'       "value": "" \r\n';

str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'Disabled", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Non-Clickable", "nl":"Niet-klikbaar" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected this button will not be clickable. Requires a restart of the App after setting to Non-Clickable.", "nl":"Indien geselecteerd is deze knop niet klikbaar. Vereist een herstart van de app na instellen op Niet-klikbaar" \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
  if(i>1) str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'Checked", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Checked (Non-Clickable only)", "nl":"Aangevinkt (alleen niet-klikbaar)" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected this button will be light, else dark.", "nl":"Als deze knop is geselecteerd, is deze licht, anders donker." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
  str+='       }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'PreventInsights", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Prevent Insights", "nl":"Voorkom inzichten" \r\n' +
  '              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected prevents Insights log from being automatically generated, or if it exists allready, or filled.", "nl":"Indien geselecteerd, wordt het inzichten-logboek niet automatisch gegenereerd, of als het al bestaat, of gevuld." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'InsightsTitleTrue", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Insights Title True", "nl":"Insights titel Waar" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Insights Description for when the value is True.", "nl":"Insights omschrijving voor wanneer de waarde Waar is." \r\n' +
  '              }, \r\n' +
  '              "value": "" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'InsightsTitleFalse", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Insights Title False", "nl":"Insights titel Onwaar" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Insights Description for when the value is False.", "nl":"Insights omschrijving voor wanneer de waarde Onwaar is." \r\n' +
  '              }, \r\n' +
  '              "value": "" \r\n' +
  '            } \r\n' +
  '          ] \r\n' +
  '        }, \r\n';
}


// // 
// str+='   { \r\n' +
// '          "type": "group", \r\n' +
// '          "label": {"en": "Select lists"}, \r\n' +
// '          "children": [ \r\n' +
// '            { \r\n' +
// '              "id": "labelDropdown1", \r\n' +
// '              "type": "label", \r\n' +
// '              "label": {"en": " "}, \r\n' +
// '              "value":"Here you can define Select lists." \r\n' +
// '            } \r\n' +
// '          ] \r\n' +
// '        }, \r\n';

// for(var i=1;i<=fields;i++) {  
//   str+='{ \r\n' +
//   '          "type": "group", \r\n' +
//   '          "label": { \r\n' +
//   '            "en": "Select list '+i+'" \r\n' +
//   '          }, \r\n' +
//   '          "children": [ \r\n' +
//   '            { \r\n' +
//   '              "id": "dropdown'+i+'Name", \r\n' +
//   '              "type": "text", \r\n' +
//   '              "label": { \r\n' +
//   '                "en": "Name" \r\n' +
//   '              }, \r\n' +
//   '              "hint": { \r\n' +
//   '                "en": "The name for Select list '+i+'" \r\n' +
//   '              }, \r\n' +
//   '              "value":'+(i===1 ? '"Select list '+i+'"': '""')+' \r\n' +
//   '            }, \r\n' +
//   '            { \r\n' +
//   '              "id": "dropdown'+i+'Icon", \r\n' +
//   '              "type": "dropdown", \r\n' +
//   '              "label": { \r\n' +
//   '                "en": "Icon (only for ...)" \r\n' +
//   '              }, \r\n' +
//   '              "hint": { \r\n' +
//   '                "en": "Select an Icon for this capability. Be aware that this causes Tag IDs to be changed and thus may break flows." \r\n' +
//   '              }, \r\n' +
//   icons +'       "value": "" \r\n';
  
//   str+='       }, \r\n' +
//   '            { \r\n' +
//   '              "id": "dropdown'+i+'Values", \r\n' +
//   '              "type": "text", \r\n' +
//   '              "label": { \r\n' +
//   '                "en": "Values" \r\n' +
//   '              }, \r\n' +
//   '              "hint": { \r\n' +
//   '                "en": "The Possible Values for Button '+i+'" \r\n' +
//   '              }, \r\n' +
//   '              "value":'+(i===1 ? '"[\'first\', \'second\', \'third\']"': '""')+' \r\n' +  
//   '            } \r\n';

//   str+=
//   '          ] \r\n' +
//   '        }, \r\n';
// }



/// Cameras

str+='   { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Cameras", "nl":"Camera\'s"}, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelCamerasRestart", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " ", "nl":" "}, \r\n' +
'              "value":"After removing a camera (by clearing the name or url), the app requires a restart to remove the camera-image from the device." \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';

for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Camera '+i+'", "nl":"Camera '+i+'" \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name", "nl":"Naam" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Camera '+i+'", "nl":"De naam voor camera '+i+'" \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Url", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Url", "nl":"URL" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The Url for Camera '+i+'", "nl":"De URL voor camera '+i+'" \r\n' +
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
  '                "en": "Interval in Seconds", "nl":"Interval in seconden" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The Interval in seconds to refresh the image for Camera '+i+'. Entering 0 will disable automatic refresh.", "nl":"Het interval in seconden om het beeld voor Camera '+i+' te vernieuwen. Wanneer 0 is ingevoert, wordt automatisch vernieuwen uitgeschakeld." \r\n' +
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