var str = '';
let icons = [
  '', 'custom_1', 'custom_2', 'custom_3',
  'custom_4', 'custom_5', 'custom_6', 'custom_7',
  'custom_8', 'custom_9', 'custom_10', 'custom_11',
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

str += '"devicecapabilities_starttext": { \r\n' +
  '      "type": "string", \r\n' +
  '      "title": { \r\n' +
  '        "en": "goto Device Maintainance/Repair", "nl":"door naar apparaat Onderhoud/Repareren te gaan", "de":"mit den Gerätewartung/reparatur" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": "sensor", \r\n' +
  '      "insights": false, \r\n' +
  '      "icon": "/assets/virtual_device.svg", \r\n' +
  '      "value": "Goto Device Settings" \r\n' +
  '    }, \r\n';



str += '"Text": { \r\n' +
  '      "type": "string", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Text", "nl":"Tekst", "de":"Text" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": null, \r\n' +
  '      "uiQuickAction": false, \r\n' +
  '      "insights": true, \r\n' +
  '      "value": "" \r\n' +
  '    }, \r\n';

str += '"Number": { \r\n' +
  '      "type": "number", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Number", "nl":"Nummer", "de":"Nummer" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": null, \r\n' +
  '      "uiQuickAction": false, \r\n' +
  '      "insights": true, \r\n' +
  '      "value": "" \r\n' +
  '    }, \r\n';

str += '"Boolean": { \r\n' +
  '      "type": "boolean", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Boolean" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": null, \r\n' +
  '      "uiQuickAction": false, \r\n' +
  '      "insights": true, \r\n' +
  '      "value": "" \r\n' +
  '    }, \r\n';

str += '"Button": { \r\n' +
  '      "type": "boolean", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Button", "nl":"Knop", "de":"Taste" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": null, \r\n' +
  '      "uiQuickAction": false, \r\n' +
  '      "insights": true, \r\n' +
  '      "value": "" \r\n' +
  '    }, \r\n';

str += '"measure_Status": { \r\n' +
  '      "type": "number", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Status" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": false, \r\n' +
  '      "uiComponent": null, \r\n' +
  '      "uiQuickAction": false, \r\n' +
  '      "insights": true, \r\n' +
  '      "value": "" \r\n' +
  '    }, \r\n';



var sets1 = ['_hide', '_onoff_hide'];
for (var j = 0; j < sets1.length; j++) {
  var val = sets1[j];
  str += '"devicecapabilities' + val + '_button": { \r\n' +
    '      "type": "boolean", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Button", "nl":"Knop", "de":"Taste" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": ' + (val == '_hide' ? 'false' : 'true') + ', \r\n' +
    (val == '_hide' || val == '_onoff_hide' ? '"uiComponent": null, \r\n' : (val == '' ? '' : '"uiComponent": "toggle", \r\n')) +
    '      "insights": true, \r\n' +
    '      "uiQuickAction": true \r\n' +
    '    },     \r\n';
}



str += '"devicecapabilities_slider_number": { \r\n' +
  '      "type": "number", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Number", "nl":"Nummer", "de":"Nummer" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": true, \r\n' +
  '      "uiComponent": "slider", \r\n' +
  '      "insights": true \r\n' +
  '    }, \r\n';

str += '"measure_devicecapabilities_slider_number": { \r\n' +
  '      "type": "number", \r\n' +
  '      "title": { \r\n' +
  '        "en": "Number", "nl":"Nummer", "de":"Nummer" \r\n' +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": true, \r\n' +
  '      "uiComponent": "slider", \r\n' +
  '      "insights": true \r\n' +
  '    }, \r\n';


/**                      HERE                   */
for (var i = 0; i < icons.length; i++) {
  let header = (icons[i] != '' ? '-' + icons[i] : '');
  let icon = (icons[i] != '' ?
    ', "icon": "' + ((icons[i].startsWith('custom_') ? '/userdata/customicons/' + icons[i] : '/assets/icons/' + icons[i]) + '.svg') + '" \r\n'
    : '');

  str += '"devicecapabilities_text' + header + '": { \r\n' +
    '      "type": "string", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Text", "nl":"Tekst", "de":"Text" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": true, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    }, \r\n';

  str += '"devicecapabilities_number' + header + '": { \r\n' +
    '      "type": "number", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Number", "nl":"Nummer", "de":"Nummer" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": true, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    }, \r\n';

  str += '"measure_devicecapabilities_number' + header + '": { \r\n' +
    '      "type": "number", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Number", "nl":"Nummer", "de":"Nummer" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": true, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    }, \r\n';


  str += '"alarm_devicecapabilities_boolean' + header + '": { \r\n' +
    '      "type": "boolean", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Yes/No", "nl":"Ja/Nee", "de":"Ja/Nein" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": false, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    }, \r\n' +
    '    "devicecapabilities_boolean' + header + '": { \r\n' +
    '      "type": "boolean", \r\n' +
    '      "title": { \r\n' +
    '        "en": "Yes/No", "nl":"Ja/Nee", "de":"Ja/Nein" \r\n' +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": false, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    },     \r\n';
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
  for (var j = 0; j < sets1.length; j++) {
    var val = sets1[j];
    var sets2 = ['', 'onoffbuttontab_'];
    for (var k = 0; k < sets2.length; k++) {
      var val2 = sets2[k];
      str +=
        '    "' + val2 + 'devicecapabilities' + val + '_button' + header + '": { \r\n' +
        '      "type": "boolean", \r\n' +
        '      "title": { \r\n' +
        '        "en": "Yes/No", "nl":"Ja/Nee", "de":"Ja/Nein" \r\n' +
        '      }, \r\n' +
        '      "getable": ' + (val2 == 'onoffbuttontab_' ? 'true' : 'false') + ', \r\n' +
        '      "setable": ' + (val == '_disabled' ? 'false' : 'true') + ', \r\n' +
        '      "uiComponent": "button", \r\n' +
        '      "insights": true, \r\n' +
        '      "uiQuickAction": true \r\n';
      //str+= (val2==='_checked'? ',"value": true \r\n' : ',"value": false \r\n')
      str += icon +
        '    }, \r\n';
    }

    str +=
      '    "onoff_devicecapabilities' + val + '_button' + header + '": { \r\n' +
      '      "type": "boolean", \r\n' +
      '      "title": { \r\n' +
      '        "en": "Yes/No", "nl":"Ja/Nee", "de":"Ja/Nein" \r\n' +
      '      }, \r\n' +
      '      "getable": true, \r\n' +
      '      "setable": ' + (val == '_disabled' ? 'false' : 'true') + ', \r\n' +
      '      "uiComponent": "toggle", \r\n' +
      '      "insights": true \r\n' +
      icon +
      '    }, \r\n';
  }

}







str += `"devicecapabilities_ternary-up-idle-down_list": {
  "title": {
    "en": "Up, Idle, Down"
  },
  "type": "enum",
  "values": [
    {
      "id": "up",
      "title": {
        "en": "Up",
        "nl": "Omhoog",
        "de": "Oben",
        "fr": "Haut",
        "it": "Alzate",
        "sv": "Upp",
        "no": "Opp",
        "es": "Arriba",
        "da": "Oppe",
        "ru": "Наверх",
        "pl": "Rozchylone"
      }
    },
    {
      "id": "idle",
      "title": {
        "en": "Idle",
        "nl": "Stil",
        "de": "Inaktiv",
        "fr": "Inactif",
        "it": "Socchiuse",
        "sv": "Inaktiv",
        "no": "Ikke aktiv",
        "es": "Inactivos",
        "da": "Inaktiv",
        "ru": "В ожидании",
        "pl": "W spoczynku"
      }
    },
    {
      "id": "down",
      "title": {
        "en": "Down",
        "nl": "Omlaag",
        "de": "Unten",
        "fr": "Bas",
        "it": "Abbassate",
        "sv": "Ned",
        "no": "Ned",
        "es": "Abajo",
        "da": "Nede",
        "ru": "Вниз",
        "pl": "Zasunięte"
      }
    }
  ],
  "getable": true,
  "setable": true,
  "uiComponent": "ternary"
  },`;
str += `"devicecapabilities_picker-up-idle-down_list": {
  "title": {
    "en": "Up, Idle, Down"
  },
  "type": "enum",
  "values": [
    {
      "id": "up",
      "title": {
        "en": "Up",
        "nl": "Omhoog",
        "de": "Oben",
        "fr": "Haut",
        "it": "Alzate",
        "sv": "Upp",
        "no": "Opp",
        "es": "Arriba",
        "da": "Oppe",
        "ru": "Наверх",
        "pl": "Rozchylone"
      }
    },
    {
      "id": "idle",
      "title": {
        "en": "Idle",
        "nl": "Stil",
        "de": "Inaktiv",
        "fr": "Inactif",
        "it": "Socchiuse",
        "sv": "Inaktiv",
        "no": "Ikke aktiv",
        "es": "Inactivos",
        "da": "Inaktiv",
        "ru": "В ожидании",
        "pl": "W spoczynku"
      }
    },
    {
      "id": "down",
      "title": {
        "en": "Down",
        "nl": "Omlaag",
        "de": "Unten",
        "fr": "Bas",
        "it": "Abbassate",
        "sv": "Ned",
        "no": "Ned",
        "es": "Abajo",
        "da": "Nede",
        "ru": "Вниз",
        "pl": "Zasunięte"
      }
    }
  ],
  "getable": true,
  "setable": true,
  "uiComponent": "picker"
  },`;



str += `"devicecapabilities_picker-schedule-until-manual-offuntil-off_list": {
    "title": {
      "en": "Schedule, Until, Manual, Off Until, Off"
    },
    "values": [
      {
        "id": "smartschedule",
        "title": {
          "en": "Follow Smart Schedule",
          "nl": "Volg slim schema",
          "de": "Dem intelligenten Zeitplan folgen"
        }
      },
      {
        "id": "untilnextblock",
        "title": {
          "en": "Until next time block",
          "nl": "Tot aan volgend tijdsblok",
          "de": "Bis zum nächsten Zeitblock"
        }
      },
      {
        "id": "manual",
        "title": {
          "en": "Manual",
          "nl": "Handmatig",
          "de": "Manuell"
        }
      },
      {
        "id": "offuntilnextblock",
        "title": {
          "en": "Off until next time block",
          "nl": "Uit tot aan volgend tijdsblok",
          "de": "Aus bis zum nächsten Zeitblock"
        }
      },
      {
        "id": "off",
        "title": {
          "en": "Off",
          "nl": "Uit",
          "de": "Aus"
        }
      }
    ],
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker"
    },`;



str += `"devicecapabilities_picker-EVCC_list": {
      "title": {
        "en": "EVCC.io"
      },
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "values": [
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "de": "Aus"
          },
          "value": "off"
        },
        {
          "id": "pv",
          "title": {
            "en": "Solar",
            "nl": "Zonne",
            "de": "Solar"
          },
          "value": "solar"
        },
        {
          "id": "minpv",
          "title": {
            "en": "Min+Solar",
            "nl": "Min+Zonne",
            "de": "Min+Solar"
          },
          "value": "minpv"
        },
        {
          "id": "now",
          "title": {
            "en": "Fast",
            "nl": "Snel",
            "de": "Schnell"
          },
          "value": "now"
        }
      ]
    },`;



str += `"devicecapabilities_picker-auto-low-medium-high-turbo_list": {
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "title": {
        "en": "Auto, Low, Medium, High, Turbo",        
        "nl": "Auto, Laag, Medium, Hoog, Turbo",        
        "de": "Auto, Niedrig, Mittel, Hoch, Turbo"
      },
      "values": [
        {
          "id": "auto",
          "title": {
            "en": "Auto",
            "nl": "Auto",
            "de": "Auto"
          }
        },
        {
          "id": "low",
          "title": {
            "en": "Low",
            "nl": "Laag",
            "de": "Niedrig"
          }
        },
        {
          "id": "medium",
          "title": {
            "en": "Medium",
            "nl": "Medium",
            "de": "Mittel"
          }
        },
        {
          "id": "high",
          "title": {
            "en": "High",
            "nl": "Hoog",
            "de": "Hoch"
          }
        },
        {
          "id": "turbo",
          "title": {
            "en": "Turbo",
            "nl": "Turbo",
            "de": "Turbo"
          }
        }
      ]
    },`;



str += `"devicecapabilities_picker-automatic-on-off_list": {
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "title": {
        "en": "Auto, On, Off",        
        "nl": "Auto, Aan, Uit",        
        "de": "Auto, Eingeschaltet, Ausgeschaltet"
      },
      "values": [
        {
        "id": "automatic",
        "title": {
        "en": "Automatic",
        "nl": "Automatisch",
        "de": "Automatisch"
        }
        },
        {
        "id": "on",
        "title": {
        "en": "On",
        "nl": "Aan",
        "de": "Eingeschaltet"
        }
        },
        {
        "id": "off",
        "title": {
        "en": "Off",
        "nl": "Uit",
        "de": "Ausgeschaltet"
        }
        }
        ]
    },`;


str += `"devicecapabilities_picker-heating-cooling-off_list": {
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "title": {
        "en": "Heating, Cooling, Off",
        "nl": "Verwarmen, Koelen, Uit",
        "de": "Heizen, Kuehlen, Ausgeschaltet"
      },
      "values": [
        {
          "id": "heating",
          "title": {
            "en": "Heating",
            "nl": "Verwarmen",
            "de": "Heizen"
          }
        },
        {
          "id": "cooling",
          "title": {
            "en": "Cooling",
            "nl": "Koelen",
            "de": "Kuehlen"
          }
        },      
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "de": "Ausgeschaltet"
          }
        }
      ]
    },`;

    str += `"devicecapabilities_picker-automatic-electricity-gas-off_list": {
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "title": {
        "en": "Automatic, Electricity, Gas, Off",
        "nl": "Automatisch, Electrisch, Gas, Uit",
        "de": "Automatisch, Elektrisch, Gas, Ausgeschaltet"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "de": "Automatisch"
          }
        },
        {
          "id": "electricity",
          "title": {
            "en": "Electric",
            "nl": "Electrisch",
            "de": "Elektrisch"
          }
        },      
        {
          "id": "gas",
          "title": {
            "en": "Natural Gas",
            "nl": "Aardgas",
            "de": "Erdgas"
          }
        },        
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "de": "Ausgeschaltet"
          }
        }
      ]
    },`;





console.log(str);

return null;