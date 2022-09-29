/*

Create a module for easy support of certain Apps.
Support Zones.
Support Creation of (default) Variables.
“Unsupport” HomeyScript cards and replace them with (hidden) dummy DC App cards.
This to prevent security leaks that only HomeyScript posses.
Create Template structure for AVD - Share Your Device.
Topic is allready there, but whats been made for The Flow Exchanger needs to be also setup for AVD - Share Your Device.
Etc.


*/
// https://emojipedia.org/symbols/





/// status update elke keer met device options?
/**
 * 
 * Maybe ‘To start’ and then ‘goto Device Settings’ fits better?
 * 
 * 
 * 
 * 
 * app.json is nu 695
 * * devicecapabilities_ naar dc_   : nope 
 * 
 *  658

About device reload after status update for mobile app,
Is it possible, to combine the two cards ‘Set Unavailable’ and ‘Set Available’?
So that it makes a device unavailable and available again after 1s or 2s in one go.
I use these for every status card.
 * 
 */





    
// "devicecapabilities_2_dropdown": {
//     "type": "enum",
//     "title": {
//       "en": "DropDown",
//       "nl": "DropDown",
//       "de": "DropDown"
//     },
//     "getable": true,
//     "setable": true,
//     "uiComponent": "picker",
//     "insights": true,
//     "icon": "/assets/virtual_device.svg",
//     "value": "1",
//     "values" : [
//       {
//         "id":"1",
//         "title":"Test 1"
//       },
//       {
//         "id":"2",
//         "title":"Test 2"
//       }
//     ]
//   },










// ,
//       {
//         "id":"set_capability_zone_anders",
//         "title" : {
//           "en":"Set capabilities to a value in a zone  including (or not) subzones",
//           "nl" : "Zet capabilities naar waarde in een ruimte inclusief (of niet) subzones (Percentage)"
//         },
//         "titleFormatted": {
//           "en":"Set [[capability]] to [[value]] in [[zone]] including subzones ([[subzones]])",
//           "nl" : "Zet [[capability]] naar [[value]] in [[zone]] inclusief subzones ([[subzones]])"
//         },
//         "args": [
//           {
//             "type": "autocomplete",
//             "name": "capability",
//             "placeholder": {
//               "en": "Capability",
//               "nl": "Capability"
//             }
//           },          
//           {
//             "type": "range",
//             "name": "value",
//             "placeholder": {
//               "en": "%",
//               "nl": "%"
//             },
//             "min":0,
//             "max":1,
//             "step":0.01,            
//             "labelMultiplier": 100,
//             "labelDecimals": 0
//           },
//           {
//             "type": "autocomplete",
//             "name": "zone",
//             "placeholder": {
//               "en": "Zone",
//               "nl": "Ruimte"
//             }
//           },          
//           {
//             "type": "dropdown",
//             "name": "subzones",
//             "placeholder": {
//               "en": "Set Subzones",
//               "nl": "Stel sub-ruimte's in"
//             },
//             "values": [              
//               {
//                 "id": "yes",
//                 "label": {
//                   "en": "Yes",
//                   "nl": "Ja"
//                 }
//               },
//               {
//                 "id": "no",
//                 "label": {
//                   "en": "No",
//                   "nl":"Nee"
//                 }
//               }     
//             ]
//           }                
//         ]
//       }