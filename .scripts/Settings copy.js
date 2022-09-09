
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
  '                "en": "", "nl":"", "de":""  \r\n' +
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