var fields = 10;
var icons = '              "values": [ \r\n' +
'                {"id": "","label": {"en": " "}}, \r\n' + 
'                {"id": " ","label": {"en": "-----   Devices           -----"}}, \r\n' + 
'                {"id": "custom_1","label": {"en": "device_1"}}, \r\n' + 
'                {"id": "custom_2","label": {"en": "device_2"}}, \r\n' + 
'                {"id": "custom_3","label": {"en": "device_3"}}, \r\n' + 
'                {"id": "custom_4","label": {"en": "device_4"}}, \r\n' + 
'                {"id": "custom_5","label": {"en": "device_5"}}, \r\n' + 
'                {"id": "custom_6","label": {"en": "device_6"}}, \r\n' + 
'                {"id": "custom_7","label": {"en": "device_7"}}, \r\n' + 
'                {"id": "custom_8","label": {"en": "device_8"}}, \r\n' + 
'                {"id": "custom_9","label": {"en": "device_9"}}, \r\n' + 
'                {"id": "custom_10","label": {"en": "device_10"}}, \r\n' + 
'                {"id": "custom_11","label": {"en": "device_11"}}, \r\n' + 
'                {"id": "custom_12","label": {"en": "device_12"}}, \r\n' + 
'                {"id": "custom_13","label": {"en": "device_13"}}, \r\n' + 
'                {"id": "custom_14","label": {"en": "device_14"}}, \r\n' + 
'                {"id": "custom_15","label": {"en": "device_15"}}, \r\n' + 
'                {"id": "custom_16","label": {"en": "device_16"}}, \r\n' + 
'                {"id": "custom_17","label": {"en": "device_17"}}, \r\n' + 
'                {"id": "custom_18","label": {"en": "device_18"}}, \r\n' + 
'                {"id": "custom_19","label": {"en": "device_19"}}, \r\n' + 
'                {"id": "custom_20","label": {"en": "device_20"}}, \r\n' + 
'                {"id": "custom_61","label": {"en": "device_21"}}, \r\n' + 
'                {"id": "custom_62","label": {"en": "device_22"}}, \r\n' + 
'                {"id": "custom_63","label": {"en": "device_23"}}, \r\n' + 
'                {"id": "custom_64","label": {"en": "device_24"}}, \r\n' + 
'                {"id": "custom_65","label": {"en": "device_25"}}, \r\n' + 
'                {"id": "custom_66","label": {"en": "device_26"}}, \r\n' + 
'                {"id": "custom_67","label": {"en": "device_27"}}, \r\n' + 
'                {"id": "custom_68","label": {"en": "device_28"}}, \r\n' + 
'                {"id": "custom_69","label": {"en": "device_29"}}, \r\n' + 
'                {"id": "custom_70","label": {"en": "device_30"}}, \r\n' + 
'                {"id": "custom_71","label": {"en": "device_31"}}, \r\n' + 
'                {"id": "custom_72","label": {"en": "device_32"}}, \r\n' + 
'                {"id": "custom_73","label": {"en": "device_33"}}, \r\n' + 
'                {"id": "custom_74","label": {"en": "device_34"}}, \r\n' + 
'                {"id": "custom_75","label": {"en": "device_35"}}, \r\n' + 
'                {"id": "custom_76","label": {"en": "device_36"}}, \r\n' + 
'                {"id": "custom_77","label": {"en": "device_37"}}, \r\n' + 
'                {"id": "custom_78","label": {"en": "device_38"}}, \r\n' + 
'                {"id": "custom_79","label": {"en": "device_39"}}, \r\n' + 
'                {"id": "custom_80","label": {"en": "device_40"}}, \r\n' + 
'                {"id": "  ","label": {"en": "-----   Capabilities      -----"}}, \r\n' + 
'                {"id": "custom_21","label": {"en": "capabilities_1"}}, \r\n' + 
'                {"id": "custom_22","label": {"en": "capabilities_2"}}, \r\n' + 
'                {"id": "custom_23","label": {"en": "capabilities_3"}}, \r\n' + 
'                {"id": "custom_24","label": {"en": "capabilities_4"}}, \r\n' + 
'                {"id": "custom_25","label": {"en": "capabilities_5"}}, \r\n' + 
'                {"id": "custom_26","label": {"en": "capabilities_6"}}, \r\n' + 
'                {"id": "custom_27","label": {"en": "capabilities_7"}}, \r\n' + 
'                {"id": "custom_28","label": {"en": "capabilities_8"}}, \r\n' + 
'                {"id": "custom_29","label": {"en": "capabilities_9"}}, \r\n' + 
'                {"id": "custom_30","label": {"en": "capabilities_10"}}, \r\n' + 
'                {"id": "custom_31","label": {"en": "capabilities_11"}}, \r\n' + 
'                {"id": "custom_32","label": {"en": "capabilities_12"}}, \r\n' + 
'                {"id": "custom_33","label": {"en": "capabilities_13"}}, \r\n' + 
'                {"id": "custom_34","label": {"en": "capabilities_14"}}, \r\n' + 
'                {"id": "custom_35","label": {"en": "capabilities_15"}}, \r\n' + 
'                {"id": "custom_36","label": {"en": "capabilities_16"}}, \r\n' + 
'                {"id": "custom_37","label": {"en": "capabilities_17"}}, \r\n' + 
'                {"id": "custom_38","label": {"en": "capabilities_18"}}, \r\n' + 
'                {"id": "custom_39","label": {"en": "capabilities_19"}}, \r\n' + 
'                {"id": "custom_40","label": {"en": "capabilities_20"}}, \r\n' + 
'                {"id": "   ","label": {"en": "-----   Other             -----"}}, \r\n' + 
'                {"id": "custom_41","label": {"en": "other_1"}}, \r\n' + 
'                {"id": "custom_42","label": {"en": "other_2"}}, \r\n' + 
'                {"id": "custom_43","label": {"en": "other_3"}}, \r\n' + 
'                {"id": "custom_44","label": {"en": "other_4"}}, \r\n' + 
'                {"id": "custom_45","label": {"en": "other_5"}}, \r\n' + 
'                {"id": "custom_46","label": {"en": "other_6"}}, \r\n' + 
'                {"id": "custom_47","label": {"en": "other_7"}}, \r\n' + 
'                {"id": "custom_48","label": {"en": "other_8"}}, \r\n' + 
'                {"id": "custom_49","label": {"en": "other_9"}}, \r\n' + 
'                {"id": "custom_50","label": {"en": "other_10"}}, \r\n' + 
'                {"id": "custom_51","label": {"en": "other_11"}}, \r\n' + 
'                {"id": "custom_52","label": {"en": "other_12"}}, \r\n' + 
'                {"id": "custom_53","label": {"en": "other_13"}}, \r\n' + 
'                {"id": "custom_54","label": {"en": "other_14"}}, \r\n' + 
'                {"id": "custom_55","label": {"en": "other_15"}}, \r\n' + 
'                {"id": "custom_56","label": {"en": "other_16"}}, \r\n' + 
'                {"id": "custom_57","label": {"en": "other_17"}}, \r\n' + 
'                {"id": "custom_58","label": {"en": "other_18"}}, \r\n' + 
'                {"id": "custom_59","label": {"en": "other_19"}}, \r\n' + 
'                {"id": "custom_60","label": {"en": "other_20"}}\r\n' + 
'              ], \r\n' ;




var str = '"settings": [ \r\n' +
'         { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "General", "nl":"Algemeen", "de":"Allgemein" }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelGeneral", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Be aware", "nl":"Let op", "de":"Achtung" }, \r\n' +
'              "value":"By Default, when using Insights or Tags, separate hidden Capabilities will be created. This means you cannot see in the log who changed it. For buttons, you might not want this. But when disabled, changing the properties Icon, \'Show as\' or \'Create Flow Cards\' will causes Tag IDs to be changed and thus may break flows, and new Insights will be created." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "labelAlso", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Also", "nl":"En verder", "de":"Außerdem" }, \r\n' +
'              "value":"Enabling all fields at once and pressing save, might be hard for your Homey and could take a while." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "labelCustomIcons", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Custom icons", "nl":"Aangepaste pictogrammen", "de":"Eigene Symbole" }, \r\n' +
'              "value":"The 10 custom icons can be set through the App Settings." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "cls", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": {"en": "Device Class", "nl":"Apparaatklasse", "de":"Geräteklasse" }, \r\n' +
'              "hint": {"en": "Changing the Device Class may break flows that depend on automaticly created flowcards of the previously specified class.", "nl":"Het wijzigen van de apparaatklasse kan flows breken die afhankelijk zijn van automatisch gemaakte flowkaarten van de eerder gespecificeerde klasse.", "de":"Das Ändern der Geräteklasse kann dazu führen, dass Flows unterbrochen werden die sich auf die zuvor automatisch erstellten Flowkarten in Abhängigkeit der angegebene Klasse beziehen." }, \r\n' +
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
'                {"id":"socket", "label":"Wall Plug"}, '+

'                {"id":"speaker", "label":"Speaker"}, '+
'                {"id":"solarpanel", "label":"Solar Panel"}, '+
'                {"id":"sunshade", "label":"Sunshade"}, '+
'                {"id":"thermostat", "label":"Thermostat"}, '+
'                {"id":"tv", "label":"TV"}, '+
'                {"id":"vacuumcleaner", "label":"Vacuum Cleaner"}, '+
'                {"id":"windowcoverings", "label":"Window Coverings"} '+
'              ], '+
'              "value":"other" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n' +
'        { \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Status Indicator Field", "nl":"Statusindicatorveld", "de":"Statusanzeigefeld"  \r\n' +
'          }, \r\n' +
'          "children": [ \r\n';
// '            { \r\n' +
// '              "id": "labelStatusIndicator", \r\n' +
// '              "type": "label", \r\n' +
// '              "label": { \r\n' +
// '                "en": " ", "nl":" " \r\n' +
// '              }, \r\n' +
// '              "hint": { \r\n' +
// '                "en": "After changing the icon, you need to reset the Status Indicator in the Mobile App.", "nl":"Nadat u het pictogram hebt gewijzigd, dient u de Status Indicator opnieuw instellen in de Mobiele App." \r\n' +
// '              }, \r\n' +
// '              "value": "Remember to set the status field as Status Indicator in the Mobile App. Reset" \r\n' +
// '            }, \r\n' +
str+='        { \r\n' +
'              "id": "status1Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for the Status Field", "nl":"De naam voor het statusveld", "de":"Die Bezeichnung des Statusanzeigefeldes"  \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram", "de":"Symbol" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select an Icon for this capability.", "nl":"Selecteer een pictogram voor deze capability.", "de":"Wählen Sie ein Symbol für diese Fähigkeit aus."  \r\n' +
'              }, \r\n' +
icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals", "nl":"Decimalen", "de":"Dezimalstellen"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show.", "nl":"Het aantal decimalen dat moet worden weergegeven.", "de":"Anzahl der anzuzeigenden Dezimalstellen."  \r\n' +
'              }, \r\n' +
'              "value": 0, \r\n' +
'              "min": 0, \r\n' +
'              "max": 10, \r\n' +
'              "step": 1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status'+i+'SeparateCapabilities", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Separate Capabilities", "nl":"Creëer apparte capabilities", "de": "Separate Fähigkeiten erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected will create hidden capabilities for the Insights and Tag (if used). This makes it cleaner. But you cannot know Who changed the value.", "nl":"Indien geselecteerd, worden verborgen Capabilities gecreëerd voor de Insights en Tag. Dit maakt het schoner. Maar u kunt niet weten Wie de waarde heeft gewijzigd.", "de": "Wenn diese Option ausgewählt ist, werden versteckte Fähigkeiten für Einblicke und Tags (falls verwendet) erstellt. Das macht es deutlicher. Aber Sie können nicht wissen, was den Wert geändert hat." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1CreateInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Insights", "nl":"Creëer inzichten", "de": "Einblicke erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected Insights will be created.", "nl":"Indien geselecteerd, wordt het inzichten-logboek automatisch gegenereerd en gevuld.", "de": "Wenn diese Option ausgewählt ist, werden Einblicke erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "status1CreateTag", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Tag", "nl":"Creëer tag", "de": "Tag erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected a Tag will be created.", "nl":"Indien geselecteerd, wordt een tag aangemaakt.", "de": "Wenn diese Option ausgewählt ist, werden Tags erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        },';



for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
'          "type": "group", \r\n' +
'          "label": { \r\n' +
'            "en": "Textfield '+i+'", "nl":"Tekstveld '+i+'", "de":"Textfeld"  \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "text'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for textfield '+i+'", "nl":"De naam voor tekstveld '+i+'", "de":"Die Bezeichnung des Textfeldes"  \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als", "de":"Anzeigen als"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the text must be displayed.", "nl":"Selecteer hoe de tekst moet worden weergegeven.", "de":"Wählen Sie aus, wie der Text angezeigt werden soll."  \r\n' +
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
'                "en": "Icon", "nl":"Pictogram", "de":"Symbol"  \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'SeparateCapabilities", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Separate Capabilities", "nl":"Creëer apparte capabilities", "de": "Separate Fähigkeiten erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected will create hidden capabilities for the Insights and Tag (if used). This makes it cleaner. But you cannot know Who changed the value.", "nl":"Indien geselecteerd, worden verborgen Capabilities gecreëerd voor de Insights en Tag. Dit maakt het schoner. Maar u kunt niet weten Wie de waarde heeft gewijzigd.", "de": "Wenn diese Option ausgewählt ist, werden versteckte Fähigkeiten für Einblicke und Tags (falls verwendet) erstellt. Das macht es deutlicher. Aber Sie können nicht wissen, was den Wert geändert hat." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "text'+i+'CreateTag", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Tag", "nl":"Creëer tag", "de": "Tag erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected a Tag will be created.", "nl":"Indien geselecteerd, wordt een tag aangemaakt.", "de": "Wenn diese Option ausgewählt ist, werden Tags erstellt." \r\n' +
'              }, \r\n' +
'              "value": true \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}


str+='   { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Numbers", "nl":"Nummers", "de":"Nummer" }, \r\n' +
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
'            "en": "Numberfield '+i+'", "nl":"Nummerveld '+i+'", "de":"Nummernfeld"  \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for numberfield '+i+'", "nl":"De naam voor nummerveld '+i+'", "de":"Die Bezeichnung des Nummernfeldes"  \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als", "de":"Anzeigen als"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the number must be displayed.", "nl":"Selecteer hoe het nummer moet worden weergegeven.", "de":"Wählen Sie aus, wie die Nummer angezeigt werden soll."  \r\n' +
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
'                {"id":"speaker_position", "label":"Speaker Position"}, ' +
'                {"id":"measure_co", "label":"CO (Sensor)"}, '+
'                {"id":"measure_co2", "label":"CO2 (Sensor)"}, '+
'                {"id":"measure_pm25", "label":"PM2.5 (Sensor)"}, '+
'                {"id":"measure_humidity", "label":"Humidity (Sensor)"}, '+
'                {"id":"measure_pressure", "label":"Pressure (Sensor)"}, '+
'                {"id":"measure_noise", "label":"Noise (Sensor)"}, '+
'                {"id":"measure_rain", "label":"Rain (Sensor)"}, '+
'                {"id":"measure_wind_strength", "label":"Wind strength (Sensor)"}, '+
'                {"id":"measure_wind_angle", "label":"Wind angle (Sensor)"}, '+
'                {"id":"measure_gust_strength", "label":"Gust strength (Sensor)"}, '+
'                {"id":"measure_gust_angle", "label":"Gust angle (Sensor)"}, '+
'                {"id":"measure_power", "label":"Power (Sensor)"}, '+
'                {"id":"measure_voltage", "label":"Voltage (Sensor)"}, '+
'                {"id":"measure_current", "label":"Current (Sensor)"}, '+
'                {"id":"measure_luminance", "label":"Luminance (Sensor)"}, '+
'                {"id":"measure_ultraviolet", "label":"Ultraviolet (Sensor)"}, '+
'                {"id":"measure_water", "label":"Water flow (Sensor)"}, '+
'                {"id":"meter_power", "label":"Energy (Sensor)"}, '+
'                {"id":"meter_water", "label":"Water meter (Sensor)"}, '+
'                {"id":"meter_gas", "label":"Gas meter (Sensor)"}, '+
'                {"id":"meter_rain", "label":"Rain meter (Sensor)"} '+
'              ], '+
'              "value":""  \r\n';
str+='       },' +
  '            { \r\n' +
  '              "id": "number'+i+'CreateFlowCards", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Flow Cards", "nl":"Creëer flowkaarten", "de":"Flow-Karten erstellen"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt.", "de":"Wenn diese Option ausgewählt ist, werden standardisierte Flow-Karten für diese Capability erstellt."  \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  

str+='       }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram", "de":"Symbol"  \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Units", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Units", "nl":"Eenheden", "de":"Einheit"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The Units to use for the number. If you need Fahrenheit, enter °C and it will be translated into Fahrenheit.", "nl":"De eenheden die voor het nummer moeten worden gebruikt. Als je Fahrenheit nodig hebt, voer dan °C in en het wordt vertaald in Fahrenheit.", "de":"Die für die Zahl zu verwendende Einheit. Wenn Sie Fahrenheit benötigen, geben Sie °C ein und die Zahl wird in Fahrenheit umgerechnet."  \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'Decimals", \r\n' +
'              "type": "number", \r\n' +
'              "label": { \r\n' +
'                "en": "Decimals", "nl":"Decimalen", "de":"Dezimalstellen"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The number of decimals to show. Enter -1 will be ignored and thus use a default value.", "nl":"Het aantal decimalen dat moet worden weergegeven. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken.", "de":"Anzahl der anzuzeigenden Dezimalstellen. Geben Sie -1 ein und es wird ignoriert und der Standardwert wird verwendet."  \r\n' +
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
'                "en": "Min", "nl":"Min", "de":"Min"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The minimum value for the Number. Enter -1 will be ignored and thus use a default value.", "nl":"De minimale waarde voor het getal. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken.", "de":"Der Mindestwert der Zahl. Geben Sie -1 ein und es wird ignoriert und der Standardwert wird verwendet."  \r\n' +
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
'                "en": "Max", "nl":"Max", "de":"Max"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The maximum value for the Number. Enter -1 will be ignored and thus use a default value.", "nl":"De maximale waarde voor het getal. Voer -1 in en het wordt genegeerd en zal de standaardwaarde gebruiken.", "de":"Der Maximalwert der Zahl. Geben Sie -1 ein und es wird ignoriert und der Standardwert wird verwendet."  \r\n' +
'              }, \r\n' +
'              "value": -1 \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'SeparateCapabilities", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Separate Capabilities", "nl":"Creëer apparte capabilities", "de": "Separate Fähigkeiten erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected will create hidden capabilities for the Insights and Tag (if used). This makes it cleaner. But you cannot know Who changed the value.", "nl":"Indien geselecteerd, worden verborgen Capabilities gecreëerd voor de Insights en Tag. Dit maakt het schoner. Maar u kunt niet weten Wie de waarde heeft gewijzigd.", "de": "Wenn diese Option ausgewählt ist, werden versteckte Fähigkeiten für Einblicke und Tags (falls verwendet) erstellt. Das macht es deutlicher. Aber Sie können nicht wissen, was den Wert geändert hat." \r\n' +
'              }, \r\n' +
'              "value": true \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'CreateInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Insights", "nl":"Creëer inzichten", "de": "Einblicke erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected Insights will be created.", "nl":"Indien geselecteerd, wordt het inzichten-logboek automatisch gegenereerd en gevuld.", "de": "Wenn diese Option ausgewählt ist, werden Einblicke erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "number'+i+'CreateTag", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Tag", "nl":"Creëer tag", "de": "Tag erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected a Tag will be created.", "nl":"Indien geselecteerd, wordt een tag aangemaakt.", "de": "Wenn diese Option ausgewählt ist, werden Tags erstellt." \r\n' +
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
'            "en": "Yes/No field '+i+'", "nl":"Ja/Nee-veld '+i+'", "de":"Ja/Nein-Feld"  \r\n' +
'          }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Name", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "The name for Yes/No field '+i+'", "nl":"De naam voor Ja/Nee-veld '+i+'", "de":"Die Bezeichnung des Ja/Nein-Feldes"  \r\n' +
'              }, \r\n' +
'              "value":"" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'ShowAs", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Show as", "nl":"Toon als", "de":"Anzeigen als"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Select how the Yes/No must be displayed.", "nl":"Selecteer hoe de Ja/Nee moet worden weergegeven.", "de":"Wählen Sie aus, wie Ja/Nein angezeigt werden soll."  \r\n' +
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
  '                "en": "Create Flow Cards", "nl":"Creëer flowkaarten", "de":"Flow-Karten erstellen"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt.", "de":"Wenn Sie diese Option auswählen, werden Standard Flow-Karten für diese Fähigkeit erstellt."  \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
str+='       }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'Icon", \r\n' +
'              "type": "dropdown", \r\n' +
'              "label": { \r\n' +
'                "en": "Icon", "nl":"Pictogram", "de":"Symbol"  \r\n' +
'              }, \r\n' +
              icons +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'SeparateCapabilities", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Separate Capabilities", "nl":"Creëer apparte capabilities", "de": "Separate Fähigkeiten erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected will create hidden capabilities for the Insights and Tag (if used). This makes it cleaner. But you cannot know Who changed the value.", "nl":"Indien geselecteerd, worden verborgen Capabilities gecreëerd voor de Insights en Tag. Dit maakt het schoner. Maar u kunt niet weten Wie de waarde heeft gewijzigd.", "de": "Wenn diese Option ausgewählt ist, werden versteckte Fähigkeiten für Einblicke und Tags (falls verwendet) erstellt. Das macht es deutlicher. Aber Sie können nicht wissen, was den Wert geändert hat." \r\n' +
'              }, \r\n' +
'              "value": true \r\n' +
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
'              "id": "boolean'+i+'CreateInsights", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Insights", "nl":"Creëer inzichten", "de": "Einblicke erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected Insights will be created.", "nl":"Indien geselecteerd, wordt het inzichten-logboek automatisch gegenereerd en gevuld.", "de": "Wenn diese Option ausgewählt ist, werden Einblicke erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'CreateTag", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Tag", "nl":"Creëer tag", "de": "Tag erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected a Tag will be created.", "nl":"Indien geselecteerd, wordt een tag aangemaakt.", "de": "Wenn diese Option ausgewählt ist, werden Tags erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleTrue", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title True", "nl":"Insights titel Waar", "de":"Einblicke Titel Wahr"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is True.", "nl":"Insights omschrijving voor wanneer de waarde Waar is.", "de":"Benennung von Einblicke, falls der Wert \\"Wahr\\" ist."  \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "boolean'+i+'InsightsTitleFalse", \r\n' +
'              "type": "text", \r\n' +
'              "label": { \r\n' +
'                "en": "Insights Title False", "nl":"Insights titel Onwaar", "de":"Einblicke Titel Unwahr"  \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "Insights Description for when the value is False.", "nl":"Insights omschrijving voor wanneer de waarde Onwaar is.", "de":"Benennung von Einblicke, falls der Wert \\"Unwahr\\" ist."  \r\n' +
'              }, \r\n' +
'              "value": "" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';
}




str+='   { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Buttons", "nl":"Knoppen", "de":"Tasten" }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelButton1", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " ", "nl":" ", "de":" "}, \r\n' +
'              "value":"Button 1 is special and remains the first, and therefore, the main device button and indicator." \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';

for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Button '+i+'", "nl":"Knop '+i+'", "de":"Taste"  \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Button '+i+'", "nl":"De naam voor knop '+i+'", "de":"Die Bezeichnung der Taste '+i+'"  \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'ShowAs", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Show as", "nl":"Toon als", "de":"Anzeigen als"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Select how the button must be displayed.", "nl":"Selecteer hoe de knop moet worden weergegeven.", "de":"Wählen Sie aus, wie die Taste angezeigt werden soll."  \r\n' +
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
  '                "en": "Create Flow Cards *", "nl":"Creëer flowkaarten *", "de":"Flow-Karten erstellen *"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected Default Flow Cards will be created for this capability. Also needed for some buttons, like Play, Previous and Next.", "nl":"Indien geselecteerd, worden er standaard flowkaarten voor deze capability gemaakt. Ook nodig voor sommige knoppen, zoals Afspelen, Vorige en Volgende.", "de":"Wenn Sie diese Option auswählen, werden Standard Flow-Karten für diese Fähigkeit erstellt. Wird auch für Tasten wie Wiedergabe, Zurück und Weiter benötigt."  \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
  if(i>1) str+=
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'Icon", \r\n' +
  '              "type": "dropdown", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Icon (only for Button or On/Off)", "nl":"Pictogram (voor Knop of Aan/Uit)", "de":"Symbol (nur für Taste oder An/Aus)"  \r\n' +
  '              }, \r\n' +
  icons +'       "value": "" \r\n';

str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'Disabled", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Non-Clickable", "nl":"Niet-klikbaar", "de":"Nicht ancklickbar"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected this button will not be clickable. Requires a restart of the App after setting to Non-Clickable.", "nl":"Indien geselecteerd is deze knop niet klikbaar. Vereist een herstart van de app na instellen op Niet-klikbaar", "de":"Wenn diese Option ausgewählt ist, hat die Taste keine Funktion. Nach Aktivierung der Option auf \\"Nicht anklickbar\\", ist ein Neustart der App erforderlich."  \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
  if(i>1) str+='       },' +
  '            { \r\n' +
  '              "id": "button'+i+'Checked", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Checked (Non-Clickable only)", "nl":"Aangevinkt (alleen niet-klikbaar)", "de":"Aktiviert (nur nicht ancklickbar)"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "When selected this button will be light, else dark.", "nl":"Als deze knop is geselecteerd, is deze licht, anders donker.", "de":"Wenn diese Option ausgewählt ist, wird die Taste hell, ansonsten dunkel dargestellt."  \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n';
  
str+='         }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'SeparateCapabilities", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Separate Capabilities", "nl":"Creëer apparte capabilities", "de": "Separate Fähigkeiten erstellen" \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
'                "en": "When selected will create hidden capabilities for the Insights and Tag (if used). This makes it cleaner. But you cannot know Who changed the value.", "nl":"Indien geselecteerd, worden verborgen Capabilities gecreëerd voor de Insights en Tag. Dit maakt het schoner. Maar u kunt niet weten Wie de waarde heeft gewijzigd.", "de": "Wenn diese Option ausgewählt ist, werden versteckte Fähigkeiten für Einblicke und Tags (falls verwendet) erstellt. Das macht es deutlicher. Aber Sie können nicht wissen, was den Wert geändert hat." \r\n' +
'              }, \r\n' +
  '              "value": false \r\n'+
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'CreateInsights", \r\n' +
  '              "type": "checkbox", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Create Insights", "nl":"Creëer inzichten", "de": "Einblicke erstellen" \r\n' +
  '              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected Insights will be created.", "nl":"Indien geselecteerd, wordt het inzichten-logboek automatisch gegenereerd en gevuld.", "de": "Wenn diese Option ausgewählt ist, werden Einblicke erstellt." \r\n' +
  '              }, \r\n' +
  '              "value": false \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "button'+i+'CreateTag", \r\n' +
'              "type": "checkbox", \r\n' +
'              "label": { \r\n' +
'                "en": "Create Tag", "nl":"Creëer tag", "de": "Tag erstellen" \r\n' +
'              }, \r\n' +
'              "hint": { \r\n' +
'                "en": "When selected a Tag will be created.", "nl":"Indien geselecteerd, wordt een tag aangemaakt.", "de": "Wenn diese Option ausgewählt ist, werden Tags erstellt." \r\n' +
'              }, \r\n' +
'              "value": false \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'InsightsTitleTrue", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Insights Title True", "nl":"Insights titel Waar", "de":"Einblicke Titel Wahr"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Insights Description for when the value is True.", "nl":"Insights omschrijving voor wanneer de waarde Waar is.", "de":"Benennung von Einblicke, falls der Wert \\"Wahr\\" ist."  \r\n' +
  '              }, \r\n' +
  '              "value": "" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "button'+i+'InsightsTitleFalse", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Insights Title False", "nl":"Insights titel Onwaar", "de":"Einblicke Titel Unwahr"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "Insights Description for when the value is False.", "nl":"Insights omschrijving voor wanneer de waarde Onwaar is.", "de":"Benennung von Einblicke, falls der Wert \\"Unwahr\\" ist."  \r\n' +
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
'          "label": {"en": "Cameras", "nl":"Camera\'s", "de":"Kameras" }, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelCamerasRestart", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " ", "nl":" ", "de":" "}, \r\n' +
'              "value":"After removing a camera (by clearing the name or url), the app requires a restart to remove the camera-image from the device." \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        }, \r\n';

for(var i=1;i<=fields;i++) {  
  str+='{ \r\n' +
  '          "type": "group", \r\n' +
  '          "label": { \r\n' +
  '            "en": "Camera '+i+'", "nl":"Camera '+i+'", "de":"Kamera '+i+'"  \r\n' +
  '          }, \r\n' +
  '          "children": [ \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Name", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Name", "nl":"Naam", "de":"Bezeichnung"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The name for Camera '+i+'", "nl":"De naam voor camera '+i+'", "de":"Die Bezeichnung der Kamera '+i+'"  \r\n' +
  '              }, \r\n' +
  '              "value":"" \r\n' +
  '            }, \r\n' +
  '            { \r\n' +
  '              "id": "camera'+i+'Url", \r\n' +
  '              "type": "text", \r\n' +
  '              "label": { \r\n' +
  '                "en": "Url", "nl":"URL", "de":"URL"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The Url for Camera '+i+'", "nl":"De URL voor camera '+i+'", "de":"Die URL der Kamera"  \r\n' +
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
  '                "en": "Interval in Seconds", "nl":"Interval in seconden", "de":"Intervall in Sekunden"  \r\n' +
  '              }, \r\n' +
  '              "hint": { \r\n' +
  '                "en": "The Interval in seconds to refresh the image for Camera '+i+'. Entering 0 will disable automatic refresh.", "nl":"Het interval in seconden om het beeld voor Camera '+i+' te vernieuwen. Wanneer 0 is ingevoert, wordt automatisch vernieuwen uitgeschakeld.", "de":"Das Intervall in Sekunden zur Aktualisierung des Bildes der Kamera '+i+'. Durch Eingabe von 0 wird die automatische Aktualisierung deaktiviert."  \r\n' +
  '              }, \r\n' +
  '              "value":0 \r\n' +
  '            }';


  str+=
  '          ] \r\n' +
  '        },';
  //if(i<fields) str+= ',';
  str+='\r\n';
}


// str+='    { \r\n' +
// '          "type": "group", \r\n' +
// '          "label": {"en": "Batteries", "nl":"Batterijen", "de":"Batterien"}, \r\n' +
// '          "children": [ \r\n' +
// '            { \r\n' +
// '              "id": "labelBatteries", \r\n' +
// '              "type": "label", \r\n' +
// '              "label": {"en": "You can set the batteries for this device", "nl":"U kunt de batterijen voor dit apparaat instellen", "de":"Sie können die Batterien für dieses Gerät einstellen"}, \r\n' +
// '              "hint": { \r\n' +
// '                "en": "Comma separated list (example: AAA,AAA,AAA). Options are LS14250, C, AA, AAA, AAAA, A23, A27, PP3, CR123A, CR2, CR1632, CR2032, CR2430, CR2450, CR2477, CR3032, CR14250, INTERNAL, OTHER.", "nl":"Door komma\'s gescheiden lijst (voorbeeld: AAA,AAA,AAA). Opties zijn LS14250, C, AA, AAA, AAAA, A23, A27, PP3, CR123A, CR2, CR1632, CR2032, CR2430, CR2450, CR2477, CR3032, CR14250, INTERNAL, OTHER.", "de":"Kommagetrennte Liste (Beispiel: AAA,AAA,AAA). Optionen sind LS14250, C, AA, AAA, AAAA, A23, A27, PP3, CR123A, CR2, CR1632, CR2032, CR2430, CR2450, CR2477, CR3032, CR14250, INTERNAL, OTHER."  \r\n' +
// '              }, \r\n' +
// '              "value":"" \r\n' +
// '            }, \r\n' +
// '            { \r\n' +
// '              "id": "batteries", \r\n' +
// '              "type": "text", \r\n' +
// '              "label": {"en": "Type", "nl":"Type", "de":"Typ"}, \r\n' +
// '              "value":"" \r\n' +
// '            } \r\n' +
// '          ] \r\n' +
// '        }, \r\n';

str+='    { \r\n' +
'          "type": "group", \r\n' +
'          "label": {"en": "Icons", "nl":"Pictogrammen", "de":"Symbole"}, \r\n' +
'          "children": [ \r\n' +
'            { \r\n' +
'              "id": "labelIcons", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": "Customized Icon Names", "nl":"Aangepaste pictogram namen", "de":"Eigene Symbole"}, \r\n' +
'              "value":"Here you will get a list with the names you have customized, once you have changed names in the App Settings." \r\n' +
'            }, \r\n' +
'            { \r\n' +
'              "id": "iconNames", \r\n' +
'              "type": "label", \r\n' +
'              "label": {"en": " ", "nl":" ", "de":" "}, \r\n' +
'              "value":"" \r\n' +
'            } \r\n' +
'          ] \r\n' +
'        } \r\n';




str+=']';
console.log(str);

return null;