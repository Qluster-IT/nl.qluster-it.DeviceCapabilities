/*

EERST VERTALEN!!!!!!!

*/
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
  `        "en": "goto Device Maintainance/Repair",
          "nl": "door naar apparaat Onderhoud/Repareren te gaan",
          "da": "gå til Enhedsvedligeholdelse/Reparation",
          "de": "mit den Gerätewartung/reparatur",
          "es": "ir a Mantenimiento/Reparación del Dispositivo",
          "fr": "aller à Maintenance/Réparation de l'appareil",
          "it": "vai a Manutenzione/Riparazione Dispositivo",
          "no": "gå til Enhetsvedlikehold/Reparasjon",
          "sv": "gå till Enhetsunderhåll/Reparation",
          "pl": "przejdź do Konserwacja/Serwisowanie Urządzenia",
          "ru": "перейти к Обслуживанию/Ремонту устройства",
          "ko": "장치 유지보수/수리로 이동",
          "ar": "اذهب إلى صيانة/إصلاح الجهاز"
  ` +
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
  `        "en": "Text",
          "nl": "Tekst",
          "da": "Tekst",
          "de": "Text",
          "es": "Texto",
          "fr": "Texte",
          "it": "Testo",
          "no": "Tekst",
          "sv": "Text",
          "pl": "Tekst",
          "ru": "текст",
          "ko": "텍스트",
          "ar": "نص"
  ` +
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
  `        "en": "Number",
          "nl": "Nummer",
          "da": "Nummer",
          "de": "Nummer",
          "es": "Número",
          "fr": "Nombre",
          "it": "Numero",
          "no": "Nummer",
          "sv": "Nummer",
          "pl": "Numer",
          "ru": "Число",
          "ko": "숫자",
          "ar": "رقم" 
  ` +
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
  `        "en": "Boolean",
          "nl": "Boolean",
          "da": "Boolesk",
          "de": "Boolesch",
          "es": "Booleano",
          "fr": "Booléen",
          "it": "Booleano",
          "no": "Boolsk",
          "sv": "Boolean",
          "pl": "Boolean",
          "ru": "Булево",
          "ko": "불리언",
          "ar": "منطقي (Boolean)" 
  ` +
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
  `        "en": "Button",
          "nl": "Knop",
          "da": "Knap",
          "de": "Taste",
          "es": "Botón",
          "fr": "Bouton",
          "it": "Pulsante",
          "no": "Knapp",
          "sv": "Knapp",
          "pl": "Przycisk",
          "ru": "Кнопка",
          "ko": "버튼",
          "ar": "زر" 
  ` +
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
    `     "en": "Status",
          "nl": "Status",
          "da": "Status",
          "de": "Status",
          "es": "Estado",
          "fr": "Statut",
          "it": "Stato",
          "no": "Status",
          "sv": "Status",
          "pl": "Status",
          "ru": "Статус",
          "ko": "상태",
          "ar": "الحالة"
  ` +
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
  let val = sets1[j];
  str += '"devicecapabilities' + val + '_button": { \r\n' +
    '      "type": "boolean", \r\n' +
    '      "title": { \r\n' +
    `       "en": "Button",
            "nl": "Knop",
            "da": "Knap",
            "de": "Taste",
            "es": "Botón",
            "fr": "Bouton",
            "it": "Pulsante",
            "no": "Knapp",
            "sv": "Knapp",
            "pl": "Przycisk",
            "ru": "Кнопка",
            "ko": "버튼",
            "ar": "زر"
    ` +
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

  // str += '"measure_sensor' + header + '": { \r\n' +
  //   '      "type": "number", \r\n' +
  //   '      "title": { \r\n' +
  //   '        "en": "Status" \r\n' +
  //   '      }, \r\n' +
  //     '      "getable": true, \r\n' +
  //     '      "setable": true, \r\n' +
  //     '      "uiComponent": "sensor", \r\n' +
  //   '      "uiQuickAction": true, \r\n' +
  //   '      "insights": true, \r\n' +
  //   '      "value": "" \r\n' +
  //     icon +
  //   '    }, \r\n';


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

  let sets1 = ['', '_disabled'];//, , '_hide'];
  for (var j = 0; j < sets1.length; j++) {
    let val = sets1[j];
    let sets2 = ['', 'onoffbuttontab_'];
    for (var k = 0; k < sets2.length; k++) {
      let val2 = sets2[k];
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




str += `"devicecapabilities_custom_list": {
  "title": {
    "en": "Custom list"
  },
  "type": "enum",
  "values": [],
  "getable": true,
  "setable": true,
  "uiComponent": "picker"
  },`;


str += `"devicecapabilities_custom_list_onlythroughflows": {
  "title": {
    "en": "Custom list"
  },
  "type": "enum",
  "values": [],
  "getable": true,
  "setable": false,
  "uiComponent": "picker"
  },`;




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


str += `"devicecapabilities_picker_onlythroughflows-up-idle-down_list": {
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
  "setable": false,
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




str += `"devicecapabilities_picker_onlythroughflows-schedule-until-manual-offuntil-off_list": {
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
    "setable": false,
    "uiComponent": "picker"
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

str += `"devicecapabilities_picker_onlythroughflows-automatic-on-off_list": {
      "type": "enum",
      "getable": true,
      "setable": false,
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

str += `"devicecapabilities_picker_onlythroughflows-heating-cooling-off_list": {
      "type": "enum",
      "getable": true,
      "setable": false,
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


str += `"devicecapabilities_picker_onlythroughflows-automatic-electricity-gas-off_list": {
      "type": "enum",
      "getable": true,
      "setable": false,
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

str += `"devicecapabilities_picker_onlythroughflows-auto-low-medium-high-turbo_list": {
      "type": "enum",
      "getable": true,
      "setable": false,
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

str += `"devicecapabilities_picker_onlythroughflows-EVCC_list": {
      "title": {
        "en": "EVCC.io"
      },
      "type": "enum",
      "getable": true,
      "setable": false,
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

str += `"devicecapabilities_picker-automatic-alwayson": {
      "type": "enum",
      "getable": true,
      "setable": true,
      "uiComponent": "picker",
      "title": {
        "en": "Automatic, Always-on"
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
          "id": "always-on",
          "title": {
            "en": "Always on",
            "nl": "Altijd aan",
            "de": "Dauerhaft aktiviert"
          }
        }
      ]
  },`;

str += `"devicecapabilities_picker_onlythroughflows-automatic-alwayson": {
      "type": "enum",
      "getable": true,
      "setable": false,
      "uiComponent": "picker",
      "title": {
        "en": "Automatic, Always-on"
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
          "id": "always-on",
          "title": {
            "en": "Always on",
            "nl": "Altijd aan",
            "de": "Dauerhaft aktiviert"
          }
        }
      ]
  },`;


str += `"devicecapabilities_picker-open-stop-close": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Open, Stop, Close"
    },
    "values": [
      {
        "id": "open",
        "title": {
          "en": "Open",
          "nl": "Open",
          "de": "Öffnen"
        }
      },
      {
        "id": "stop",
        "title": {
          "en": "Stop",
          "nl": "Stop",
          "de": "Stop"
        }
      },
      {
        "id": "close",
        "title": {
          "en": "Close",
          "nl": "Dicht",
          "de": "Schließen"
        }
      }
    ]
  },`;

str += `"devicecapabilities_picker_onlythroughflows-open-stop-close": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Open, Stop, Close"
    },
    "values": [
      {
        "id": "open",
        "title": {
          "en": "Open",
          "nl": "Open",
          "de": "Öffnen"
        }
      },
      {
        "id": "stop",
        "title": {
          "en": "Stop",
          "nl": "Stop",
          "de": "Stop"
        }
      },
      {
        "id": "close",
        "title": {
          "en": "Close",
          "nl": "Dicht",
          "de": "Schließen"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker-auto-cool-dry-fan": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Auto, Cool, Dry, Fan"
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
        "id": "cool",
        "title": {
          "en": "Cool",
          "nl": "Koel",
          "de": "Cool"
        }
      },
      {
        "id": "dry",
        "title": {
          "en": "Dry",
          "nl": "Droog",
          "de": "Trocken"
        }
      },
      {
        "id": "fan",
        "title": {
          "en": "Fan",
          "nl": "Fan",
          "de": "Fan"
        }
      }
    ]
  },`;

str += `"devicecapabilities_picker_onlythroughflows-auto-cool-dry-fan": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Auto, Cool, Dry, Fan"
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
        "id": "cool",
        "title": {
          "en": "Cool",
          "nl": "Koel",
          "de": "Cool"
        }
      },
      {
        "id": "dry",
        "title": {
          "en": "Dry",
          "nl": "Droog",
          "de": "Trocken"
        }
      },
      {
        "id": "fan",
        "title": {
          "en": "Fan",
          "nl": "Fan",
          "de": "Fan"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker-off-running-finished_not_emptied-finished": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Off, Running, Finished (Not emptied), Finished"
    },
    "values": [{
        "id": "off",
        "title": {
          "en": "Off",
          "no": "Av",
          "nl": "Uit",
          "de": "Aus"
        }
      }, {
        "id": "running",
        "title": {
          "en": "Running",
          "no": "Kjører",
          "nl": "Rennen",
          "de": "Betrieb"
        }
      }, {
        "id": "finished_not_emptied",
        "title": {
          "en": "Finished (Not emptied)",
          "no": "Fullført (Ikke tømt)",
          "nl": "Afgewerkt (Niet geleegd)",
          "de": "Fertig (Nicht geleert)"
        }
      }, {
        "id": "finished",
        "title": {
          "en": "Finished",
          "no": "Fullført",
          "nl": "Afgewerkt",
          "de": "Fertig"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker_onlythroughflows-off-running-finished_not_emptied-finished": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Off, Running, Finished (Not emptied), Finished"
    },
    "values": [{
        "id": "off",
        "title": {
          "en": "Off",
          "no": "Av",
          "nl": "Uit",
          "de": "Aus"
        }
      }, {
        "id": "running",
        "title": {
          "en": "Running",
          "no": "Kjører",
          "nl": "Rennen",
          "de": "Betrieb"
        }
      }, {
        "id": "finished_not_emptied",
        "title": {
          "en": "Finished (Not emptied)",
          "no": "Fullført (Ikke tømt)",
          "nl": "Afgewerkt (Niet geleegd)",
          "de": "Fertig (Nicht geleert)"
        }
      }, {
        "id": "finished",
        "title": {
          "en": "Finished",
          "no": "Fullført",
          "nl": "Afgewerkt",
          "de": "Fertig"
        }
      }
    ]
  },`;



str += `"devicecapabilities_picker-present-away-comingsoon": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Present, Away, Coming Soon"
    },
    "values": [{
        "id": "present",
        "title": {
          "en": "Present",
          "no": "Tilstede",
          "nl": "Aanwezig",
          "de": "Vorhanden"
        }
      }, {
        "id": "away",
        "title": {
          "en": "Away",
          "no": "Borte",
          "nl": "Weg",
          "de": "Weg"
        }
      }, {
        "id": "comingsoon",
        "title": {
          "en": "Coming Soon",
          "no": "Kommer Snart",
          "nl": "Komt Binnenkort",
          "de": "Kommt Bald"
        }
      }
    ]
  },`;



str += `"devicecapabilities_picker_onlythroughflows-present-away-comingsoon": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Present, Away, Coming Soon"
    },
    "values": [{
        "id": "present",
        "title": {
          "en": "Present",
          "no": "Tilstede",
          "nl": "Aanwezig",
          "de": "Vorhanden"
        }
      }, {
        "id": "away",
        "title": {
          "en": "Away",
          "no": "Borte",
          "nl": "Weg",
          "de": "Weg"
        }
      }, {
        "id": "comingsoon",
        "title": {
          "en": "Coming Soon",
          "no": "Kommer Snart",
          "nl": "Komt Binnenkort",
          "de": "Kommt Bald"
        }
      }
    ]
  },`;



str += `"devicecapabilities_picker-home-away-sleep-vacation": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Home, Away, Sleep, Vacation"
    },
    "values": [{
        "id": "home",
        "title": {
          "en": "Home",
          "nl": "Thuis",
          "de": "Zu Hause"
        }
      }, {
        "id": "away",
        "title": {
          "en": "Away",
          "nl": "Afwezig",
          "de": "Abwesend"
        }
      }, {
        "id": "sleep",
        "title": {
          "en": "Sleep",
          "nl": "Slapen",
          "de": "Schlafen"
        }
      }, {
        "id": "vacation",
        "title": {
          "en": "Vacation",
          "nl": "Vakantie",
          "de": "Feiertage"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker_onlythroughflows-home-away-sleep-vacation": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Home, Away, Sleep, Vacation"
    },
    "values": [{
        "id": "home",
        "title": {
          "en": "Home",
          "nl": "Thuis",
          "de": "Zu Hause"
        }
      }, {
        "id": "away",
        "title": {
          "en": "Away",
          "nl": "Afwezig",
          "de": "Abwesend"
        }
      }, {
        "id": "sleep",
        "title": {
          "en": "Sleep",
          "nl": "Slapen",
          "de": "Schlafen"
        }
      }, {
        "id": "vacation",
        "title": {
          "en": "Vacation",
          "nl": "Vakantie",
          "de": "Feiertage"
        }
      }
    ]
  },`;

str += `"devicecapabilities_picker-bright-regular-mood-colour-tv-cinema": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Bright, Regular, Mood, Colour, TV, Cinema"
    },
    "values": [
      {
        "id": "bright",
        "title": {
          "en": "Bright",
          "nl": "Helder",
          "de": "Hell"
        }
      },
      {
        "id": "regular",
        "title": {
          "en": "Regular",
          "nl": "Normaal",
          "de": "Normal"
        }
      },
      {
        "id": "mood",
        "title": {
          "en": "Mood",
          "nl": "Sfeer",
          "de": "Stimmung"
        }
      },
      {
        "id": "colour",
        "title": {
          "en": "Colour",
          "nl": "Kleur",
          "de": "Bunt"
        }
      },
      {
        "id": "tv",
        "title": {
          "en": "TV",
          "nl": "TV",
          "de": "TV"
        }
      },
      {
        "id": "cinema",
        "title": {
          "en": "Cinema",
          "nl": "Bios",
          "de": "Kino"
        }
      }
    ]
  },`;

str += `"devicecapabilities_picker_onlythroughflows-bright-regular-mood-colour-tv-cinema": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Bright, Regular, Mood, Colour, TV, Cinema"
    },
    "values": [
      {
        "id": "bright",
        "title": {
          "en": "Bright",
          "nl": "Helder",
          "de": "Hell"
        }
      },
      {
        "id": "regular",
        "title": {
          "en": "Regular",
          "nl": "Normaal",
          "de": "Normal"
        }
      },
      {
        "id": "mood",
        "title": {
          "en": "Mood",
          "nl": "Sfeer",
          "de": "Stimmung"
        }
      },
      {
        "id": "colour",
        "title": {
          "en": "Colour",
          "nl": "Kleur",
          "de": "Bunt"
        }
      },
      {
        "id": "tv",
        "title": {
          "en": "TV",
          "nl": "TV",
          "de": "TV"
        }
      },
      {
        "id": "cinema",
        "title": {
          "en": "Cinema",
          "nl": "Bios",
          "de": "Kino"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker-automatic-manual-off": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Automatic, Manual, Off"
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
        "id": "manual",
        "title": {
          "en": "Manual",
          "nl": "Handmatig",
          "de": "Manuell"
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
    ]
  },`;


str += `"devicecapabilities_picker_onlythroughflows-automatic-manual-off": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Automatic, Manual, Off"
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
        "id": "manual",
        "title": {
          "en": "Manual",
          "nl": "Handmatig",
          "de": "Manuell"
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
    ]
  },`;


str += `"devicecapabilities_picker-bright-regular-mood-night": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",
    "title": {
      "en": "Bright, Regular, Mood, Night"
    },
    "values": [
      {
        "id": "bright",
        "title": {
          "en": "Bright",
          "nl": "Helder",
          "de": "Hell"
        }
      },
      {
        "id": "regular",
        "title": {
          "en": "Regular",
          "nl": "Normaal",
          "de": "Normal"
        }
      },
      {
        "id": "mood",
        "title": {
          "en": "Mood",
          "nl": "Sfeer",
          "de": "Stimmung"
        }
      },
      {
        "id": "night",
        "title": {
          "en": "Night",
          "nl": "Nacht",
          "de": "Nacht"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker_onlythroughflows-bright-regular-mood-night": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",
    "title": {
      "en": "Bright, Regular, Mood, Night"
    },
    "values": [
      {
        "id": "bright",
        "title": {
          "en": "Bright",
          "nl": "Helder",
          "de": "Hell"
        }
      },
      {
        "id": "regular",
        "title": {
          "en": "Regular",
          "nl": "Normaal",
          "de": "Normal"
        }
      },
      {
        "id": "mood",
        "title": {
          "en": "Mood",
          "nl": "Sfeer",
          "de": "Stimmung"
        }
      },
      {
        "id": "night",
        "title": {
          "en": "Night",
          "nl": "Nacht",
          "de": "Nacht"
        }
      }
    ]
  },`;


str += `"devicecapabilities_picker-evcharge-compressor-machines-workbench": {
    "type": "enum",
    "getable": true,
    "setable": true,
    "uiComponent": "picker",    
    "title": {
      "en": "EV Charge, Compressor, Machines, Workbench"
    },
    "values": [
      {
        "id": "ev charge",
        "title": {
          "en": "EV charge",
          "nl": "EV laden",
          "de": "BEV laden"
        }
      },
      {
        "id": "compressor",
        "title": {
          "en": "Compressor",
          "nl": "Compressor",
          "de": "Kompressor"
        }
      },
      {
        "id": "machines",
        "title": {
          "en": "Machines",
          "nl": "Machines",
          "de": "Machines"
        }
      },
      {
        "id": "workbench",
        "title": {
          "en": "Workbench",
          "nl": "Werkbank",
          "de": "Werkbank"
         }
      }
    ]
  },`;


str += `"devicecapabilities_picker_onlythroughflows-evcharge-compressor-machines-workbench": {
    "type": "enum",
    "getable": true,
    "setable": false,
    "uiComponent": "picker",    
    "title": {
      "en": "EV Charge, Compressor, Machines, Workbench"
    },
    "values": [
      {
        "id": "ev charge",
        "title": {
          "en": "EV charge",
          "nl": "EV laden",
          "de": "BEV laden"
        }
      },
      {
        "id": "compressor",
        "title": {
          "en": "Compressor",
          "nl": "Compressor",
          "de": "Kompressor"
        }
      },
      {
        "id": "machines",
        "title": {
          "en": "Machines",
          "nl": "Machines",
          "de": "Machines"
        }
      },
      {
        "id": "workbench",
        "title": {
          "en": "Workbench",
          "nl": "Werkbank",
          "de": "Werkbank"
         }
      }
    ]
  },`;


console.log(str);

return null;