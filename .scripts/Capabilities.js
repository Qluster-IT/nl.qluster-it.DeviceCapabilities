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
  '      "icon": "/drivers/virtualdevice/assets/icon.svg", \r\n' +
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
          "ru": "Текст",
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
          "ko": "번호",
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
            "ko": "번호",
            "ar": "رقم"
  ` +
  '      }, \r\n' +
  '      "getable": true, \r\n' +
  '      "setable": true, \r\n' +
  '      "uiComponent": "slider", \r\n' +
  '      "insights": true \r\n' +
  '    }, \r\n';

str += '"measure_devicecapabilities_slider_number": { \r\n' +
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
            "ko": "번호",
            "ar": "رقم"
  ` +
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
    `       "en": "Text",
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
    '      "setable": true, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    }, \r\n';

  str += '"devicecapabilities_number' + header + '": { \r\n' +
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
              "ko": "번호",
              "ar": "رقم"
    ` +
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
              "ko": "번호",
              "ar": "رقم"
    ` +
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
    `       "en": "Yes/No",
            "nl": "Ja/Nee",
            "da": "Ja/Nej",
            "de": "Ja/Nein",
            "es": "Sí/No",
            "fr": "Oui/Non",
            "it": "Sì/No",
            "no": "Ja/Nei",
            "sv": "Ja/Nej",
            "pl": "Tak/Nie",
            "ru": "Да/Нет",
            "ko": "예/아니요",
            "ar": "نعم/لا"
    ` +
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
    `       "en": "Yes/No",
            "nl": "Ja/Nee",
            "da": "Ja/Nej",
            "de": "Ja/Nein",
            "es": "Sí/No",
            "fr": "Oui/Non",
            "it": "Sì/No",
            "no": "Ja/Nei",
            "sv": "Ja/Nej",
            "pl": "Tak/Nie",
            "ru": "Да/Нет",
            "ko": "예/아니요",
            "ar": "نعم/لا"
    ` +
    '      }, \r\n' +
    '      "getable": true, \r\n' +
    '      "setable": false, \r\n' +
    '      "uiComponent": "sensor", \r\n' +
    '      "insights": true \r\n' +
    icon +
    '    },     \r\n';
  
    
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
        `       "en": "Yes/No",
                "nl": "Ja/Nee",
                "da": "Ja/Nej",
                "de": "Ja/Nein",
                "es": "Sí/No",
                "fr": "Oui/Non",
                "it": "Sì/No",
                "no": "Ja/Nei",
                "sv": "Ja/Nej",
                "pl": "Tak/Nie",
                "ru": "Да/Нет",
                "ko": "예/아니요",
                "ar": "نعم/لا"
        ` +
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
      `       "en": "Yes/No",
              "nl": "Ja/Nee",
              "da": "Ja/Nej",
              "de": "Ja/Nein",
              "es": "Sí/No",
              "fr": "Oui/Non",
              "it": "Sì/No",
              "no": "Ja/Nei",
              "sv": "Ja/Nej",
              "pl": "Tak/Nie",
              "ru": "Да/Нет",
              "ko": "예/아니요",
              "ar": "نعم/لا"
      ` +
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
    "en": "Custom list",
    "nl": "Aangepaste lijst",
    "da": "Brugerdefineret liste",
    "de": "Benutzerdefinierte Liste",
    "es": "Lista personalizada",
    "fr": "Liste personnalisée",
    "it": "Elenco personalizzato",
    "no": "Egendefinert liste",
    "sv": "Anpassad lista",
    "pl": "Lista niestandardowa",
    "ru": "Пользовательский список",
    "ko": "사용자 지정 목록",
    "ar": "قائمة مخصصة"
  },
  "type": "enum",
  "values": [],
  "getable": true,
  "setable": true,
  "uiComponent": "picker"
  },`;


str += `"devicecapabilities_custom_list_onlythroughflows": {
  "title": {
    "en": "Custom list",
    "nl": "Aangepaste lijst",
    "da": "Brugerdefineret liste",
    "de": "Benutzerdefinierte Liste",
    "es": "Lista personalizada",
    "fr": "Liste personnalisée",
    "it": "Elenco personalizzato",
    "no": "Egendefinert liste",
    "sv": "Anpassad lista",
    "pl": "Lista niestandardowa",
    "ru": "Пользовательский список",
    "ko": "사용자 지정 목록",
    "ar": "قائمة مخصصة"
  },
  "type": "enum",
  "values": [],
  "getable": true,
  "setable": false,
  "uiComponent": "picker"
  },`;




str += `"devicecapabilities_ternary-up-idle-down_list": {
  "title": {
    "en": "Up, Idle, Down",
    "nl": "Omhoog, Inactief, Omlaag",
    "da": "Op, Inaktiv, Ned",
    "de": "Hoch, Leerlauf, Runter",
    "es": "Arriba, Inactivo, Abajo",
    "fr": "Haut, Inactif, Bas",
    "it": "Su, Inattivo, Giù",
    "no": "Opp, Inaktiv, Ned",
    "sv": "Upp, Inaktiv, Ner",
    "pl": "Góra, Bezczynny, Dół",
    "ru": "Вверх, Ожидание, Вниз",
    "ko": "위로, 대기, 아래로",
    "ar": "أعلى، خامل، أسفل"
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
    "en": "Up, Idle, Down",
    "nl": "Omhoog, Inactief, Omlaag",
    "da": "Op, Inaktiv, Ned",
    "de": "Hoch, Leerlauf, Runter",
    "es": "Arriba, Inactivo, Abajo",
    "fr": "Haut, Inactif, Bas",
    "it": "Su, Inattivo, Giù",
    "no": "Opp, Inaktiv, Ned",
    "sv": "Upp, Inaktiv, Ner",
    "pl": "Góra, Bezczynny, Dół",
    "ru": "Вверх, Ожидание, Вниз",
    "ko": "위로, 대기, 아래로",
    "ar": "أعلى، خامل، أسفل"
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
    "en": "Up, Idle, Down",
    "nl": "Omhoog, Inactief, Omlaag",
    "da": "Op, Inaktiv, Ned",
    "de": "Hoch, Leerlauf, Runter",
    "es": "Arriba, Inactivo, Abajo",
    "fr": "Haut, Inactif, Bas",
    "it": "Su, Inattivo, Giù",
    "no": "Opp, Inaktiv, Ned",
    "sv": "Upp, Inaktiv, Ner",
    "pl": "Góra, Bezczynny, Dół",
    "ru": "Вверх, Ожидание, Вниз",
    "ko": "위로, 대기, 아래로",
    "ar": "أعلى، خامل، أسفل"
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
        "en": "Schedule, Until, Manual, Off Until, Off",
        "nl": "Schema, Tot, Handmatig, Uit Tot, Uit",
        "da": "Tidsplan, Indtil, Manuel, Sluk Indtil, Sluk",
        "de": "Zeitplan, Bis, Manuell, Aus bis, Aus",
        "es": "Horario, Hasta, Manual, Apagado Hasta, Apagado",
        "fr": "Programme, Jusqu'à, Manuel, Éteint jusqu'à, Éteint",
        "it": "Programma, Fino a, Manuale, Spento fino a, Spento",
        "no": "Tidsplan, Til, Manuell, Av til, Av",
        "sv": "Schema, Tills, Manuell, Av tills, Av",
        "pl": "Harmonogram, Do, Ręczny, Wyłącz do, Wyłącz",
        "ru": "Расписание, До, Вручную, Выключено до, Выключено",
        "ko": "일정, 까지, 수동, 까지 꺼짐, 꺼짐",
        "ar": "جدول، حتى، يدوي، إيقاف حتى، إيقاف"
      },
      "values": [
        {
          "id": "smartschedule",
          "title": {
            "en": "Follow Smart Schedule",
            "nl": "Volg slim schema",
            "da": "Følg Smart Skema",
            "de": "Dem intelligenten Zeitplan folgen",
            "es": "Seguir el horario inteligente",
            "fr": "Suivre le programme intelligent",
            "it": "Segui il Programma Intelligente",
            "no": "Følg Smartplan",
            "sv": "Följ Smart Schema",
            "pl": "Śledź inteligentny harmonogram",
            "ru": "Следовать умному расписанию",
            "ko": "스마트 일정 따르기",
            "ar": "اتبع الجدول الذكي"
          }
        },
        {
          "id": "untilnextblock",
          "title": {
            "en": "Until next time block",
            "nl": "Tot aan volgend tijdsblok",
            "da": "Indtil næste tidsblok",
            "de": "Bis zum nächsten Zeitblock",
            "es": "Hasta el próximo bloque de tiempo",
            "fr": "Jusqu'au prochain bloc",
            "it": "Fino al prossimo blocco di tempo",
            "no": "Til neste gang blokkering",
            "sv": "Till nästa tidsblock",
            "pl": "Do następnego bloku czasowego",
            "ru": "До следующего блока времени",
            "ko": "다음 시간 블록까지",
            "ar": "حتى كتلة المرة القادمة"
          }
        },
        {
          "id": "manual",
          "title": {
            "en": "Manual",
            "nl": "Handmatig",
            "da": "Manuel",
            "de": "Manuell",
            "es": "Manual",
            "fr": "Manuel",
            "it": "Manuale",
            "no": "Manuell",
            "sv": "Manuell",
            "pl": "Instrukcja obsługi",
            "ru": "Руководство",
            "ko": "매뉴얼",
            "ar": "يدوي"
          }
        },
        {
          "id": "offuntilnextblock",
          "title": {
            "en": "Off until next time block",
            "nl": "Uit tot aan volgend tijdsblok",
            "da": "Slukket indtil næste tidsblok",
            "de": "Aus bis zum nächsten Zeitblock",
            "es": "Apagado hasta el próximo bloque de tiempo",
            "fr": "Éteint jusqu'au prochain créneau horaire",
            "it": "Spento fino al prossimo blocco di tempo",
            "no": "Av til neste tidsblokk",
            "sv": "Avstängd tills nästa tidsblock",
            "pl": "Wyłączone do następnego bloku czasowego",
            "ru": "Выключено до следующего временного блока",
            "ko": "다음 시간 블록까지 꺼짐",
            "ar": "مطفأ حتى وقت الكتلة التالية"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "en": "Schedule, Until, Manual, Off Until, Off",
        "nl": "Schema, Tot, Handmatig, Uit Tot, Uit",
        "da": "Tidsplan, Indtil, Manuel, Slukket indtil, Slukket",
        "de": "Zeitplan, Bis, Manuell, Aus bis, Aus",
        "es": "Horario, Hasta, Manual, Apagado Hasta, Apagado",
        "fr": "Programme, Jusqu'à, Manuel, Éteint jusqu'à, Éteint",
        "it": "Programma, Fino a, Manuale, Spento fino a, Spento",
        "no": "Tidsplan, Til, Manuell, Av til, Av",
        "sv": "Schema, Tills, Manuell, Av Tills, Av",
        "pl": "Harmonogram, Do, Ręczny, Wyłącz do, Wyłączone",
        "ru": "Расписание, До, Вручную, Выключено до, Выключено",
        "ko": "일정, 까지, 수동, 까지 꺼짐, 꺼짐",
        "ar": "جدول، حتى، يدوي، إيقاف حتى، إيقاف"
      },
      "values": [
        {
          "id": "smartschedule",
          "title": {
            "en": "Follow Smart Schedule",
            "nl": "Volg slim schema",
            "da": "Følg Smart Skema",
            "de": "Dem intelligenten Zeitplan folgen",
            "es": "Seguir el horario inteligente",
            "fr": "Suivre le programme intelligent",
            "it": "Segui Programma Intelligente",
            "no": "Følg Smartplan",
            "sv": "Följ Smart Schema",
            "pl": "Śledź inteligentny harmonogram",
            "ru": "Следовать умному расписанию",
            "ko": "스마트 일정 따르기",
            "ar": "اتبع الجدول الذكي"
          }
        },
        {
          "id": "untilnextblock",
          "title": {
            "en": "Until next time block",
            "nl": "Tot aan volgend tijdsblok",
            "da": "Indtil næste tidsblok",
            "de": "Bis zum nächsten Zeitblock",
            "es": "Hasta el próximo bloque de tiempo",
            "fr": "Jusqu'au prochain bloc",
            "it": "Fino al prossimo blocco",
            "no": "Til neste gang blokkering",
            "sv": "Till nästa tidsblock",
            "pl": "Do następnego zablokowania czasu",
            "ru": "До следующего блока времени",
            "ko": "다음 시간 블록까지",
            "ar": "حتى كتلة المرة القادمة"
          }
        },
        {
          "id": "manual",
          "title": {
            "en": "Manual",
            "nl": "Handmatig",
            "da": "Manuel",
            "de": "Manuell",
            "es": "Manual",
            "fr": "Manuel",
            "it": "Manuale",
            "no": "Brukermanual",
            "sv": "Manuell",
            "pl": "Instrukcja obsługi",
            "ru": "Руководство",
            "ko": "매뉴얼",
            "ar": "يدوي"
          }
        },
        {
          "id": "offuntilnextblock",
          "title": {
            "en": "Off until next time block",
            "nl": "Uit tot aan volgend tijdsblok",
            "da": "Slukket indtil næste tidsblok",
            "de": "Aus bis zum nächsten Zeitblock",
            "es": "Apagado hasta el próximo bloque de tiempo",
            "fr": "Éteint jusqu'au prochain créneau horaire",
            "it": "Spento fino al prossimo blocco di tempo",
            "no": "Av til neste tidsblokk",
            "sv": "Avstängd tills nästa tidsblock",
            "pl": "Wyłączone do następnego bloku czasowego",
            "ru": "Выключено до следующего временного блока",
            "ko": "다음 시간 블록까지 꺼짐",
            "ar": "مطفأ حتى وقت الكتلة التالية"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Auto, Tændt, Slukket",
        "de": "Auto, Eingeschaltet, Ausgeschaltet",
        "es": "Auto, Encendido, Apagado",
        "fr": "Auto, Activé, Désactivé",
        "it": "Auto, Acceso, Spento",
        "no": "Auto, På, Av",
        "sv": "Auto, På, Av",
        "pl": "Auto, Włączone, Wyłączone",
        "ru": "Авто, Вкл, Выкл",
        "ko": "자동, 켬, 끔",
        "ar": "تلقائي، تشغيل، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "on",
          "title": {
            "en": "On",
            "nl": "Aan",
            "da": "Til",
            "de": "Eingeschaltet",
            "es": "Encendido",
            "fr": "Activé",
            "it": "Acceso",
            "no": "På",
            "sv": "På",
            "pl": "Włączone",
            "ru": "Включено",
            "ko": "켜짐",
            "ar": "تشغيل"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Auto, Tændt, Slukket",
        "de": "Auto, Eingeschaltet, Ausgeschaltet",
        "es": "Auto, Encendido, Apagado",
        "fr": "Auto, Activé, Désactivé",
        "it": "Auto, Acceso, Spento",
        "no": "Auto, På, Av",
        "sv": "Auto, På, Av",
        "pl": "Auto, Włączone, Wyłączone",
        "ru": "Авто, Вкл, Выкл",
        "ko": "자동, 켜짐, 꺼짐",
        "ar": "تلقائي، تشغيل، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "on",
          "title": {
            "en": "On",
            "nl": "Aan",
            "da": "Til",
            "de": "Eingeschaltet",
            "es": "Encendido",
            "fr": "Activé",
            "it": "Acceso",
            "no": "På",
            "sv": "På",
            "pl": "Włączone",
            "ru": "Включено",
            "ko": "켜짐",
            "ar": "تشغيل"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Opvarmning, Køling, Slukket",
        "de": "Heizen, Kuehlen, Ausgeschaltet",
        "es": "Calefacción, Refrigeración, Apagado",
        "fr": "Chauffage, Refroidissement, Éteint",
        "it": "Riscaldamento, Raffreddamento, Spento",
        "no": "Oppvarming, Kjøling, Av",
        "sv": "Uppvärmning, Kylning, Av",
        "pl": "Ogrzewanie, Chłodzenie, Wyłączone",
        "ru": "Отопление, Охлаждение, Выключено",
        "ko": "난방, 냉방, 꺼짐",
        "ar": "تدفئة، تبريد، إيقاف"
      },
      "values": [
        {
          "id": "heating",
          "title": {
            "en": "Heating",
            "nl": "Verwarmen",
            "da": "Opvarmning",
            "de": "Heizen",
            "es": "Calefacción",
            "fr": "Chauffage",
            "it": "Riscaldamento",
            "no": "Oppvarming",
            "sv": "Uppvärmning",
            "pl": "Ogrzewanie",
            "ru": "Отопление",
            "ko": "난방",
            "ar": "التدفئة"
          }
        },
        {
          "id": "cooling",
          "title": {
            "en": "Cooling",
            "nl": "Koelen",
            "da": "Køling",
            "de": "Kuehlen",
            "es": "Refrigeración",
            "fr": "Refroidissement",
            "it": "Raffreddamento",
            "no": "Kjøling",
            "sv": "Kylning",
            "pl": "Chłodzenie",
            "ru": "Охлаждение",
            "ko": "냉각",
            "ar": "تبريد"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Opvarmning, Køling, Slukket",
        "de": "Heizen, Kuehlen, Ausgeschaltet",
        "es": "Calefacción, Refrigeración, Apagado",
        "fr": "Chauffage, Refroidissement, Éteint",
        "it": "Riscaldamento, Raffreddamento, Spento",
        "no": "Oppvarming, Kjøling, Av",
        "sv": "Uppvärmning, Kylning, Av",
        "pl": "Ogrzewanie, Chłodzenie, Wyłączone",
        "ru": "Отопление, Охлаждение, Выключено",
        "ko": "난방, 냉방, 꺼짐",
        "ar": "تدفئة، تبريد، إيقاف"
      },
      "values": [
        {
          "id": "heating",
          "title": {
            "en": "Heating",
            "nl": "Verwarmen",
            "da": "Opvarmning",
            "de": "Heizen",
            "es": "Calefacción",
            "fr": "Chauffage",
            "it": "Riscaldamento",
            "no": "Oppvarming",
            "sv": "Uppvärmning",
            "pl": "Ogrzewanie",
            "ru": "Отопление",
            "ko": "난방",
            "ar": "التدفئة"
          }
        },
        {
          "id": "cooling",
          "title": {
            "en": "Cooling",
            "nl": "Koelen",
            "da": "Køling",
            "de": "Kuehlen",
            "es": "Refrigeración",
            "fr": "Refroidissement",
            "it": "Raffreddamento",
            "no": "Kjøling",
            "sv": "Kylning",
            "pl": "Chłodzenie",
            "ru": "Охлаждение",
            "ko": "냉각",
            "ar": "تبريد"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Automatisk, Elektricitet, Gas, Slukket",
        "de": "Automatisch, Elektrisch, Gas, Ausgeschaltet",
        "es": "Automático, Electricidad, Gas, Apagado",
        "fr": "Automatique, Électricité, Gaz, Éteint",
        "it": "Automatico, Elettricità, Gas, Spento",
        "no": "Automatisk, Elektrisitet, Gass, Av",
        "sv": "Automatisk, El, Gas, Av",
        "pl": "Automatyczny, Elektryczność, Gaz, Wyłączone",
        "ru": "Автоматически, Электричество, Газ, Выключено",
        "ko": "자동, 전기, 가스, 끔",
        "ar": "تلقائي، كهرباء، غاز، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "electricity",
          "title": {
            "en": "Electric",
            "nl": "Electrisch",
            "da": "Elektrisk",
            "de": "Elektrisch",
            "es": "Eléctrico",
            "fr": "Électrique",
            "it": "Elettrico",
            "no": "Elektrisk",
            "sv": "Elektrisk",
            "pl": "Elektryczny",
            "ru": "Электрический",
            "ko": "전기",
            "ar": "كهربائي"
          }
        },
        {
          "id": "gas",
          "title": {
            "en": "Natural Gas",
            "nl": "Aardgas",
            "da": "Naturgas",
            "de": "Erdgas",
            "es": "Gas natural",
            "fr": "Gaz naturel",
            "it": "Gas naturale",
            "no": "Naturgass",
            "sv": "Naturgas",
            "pl": "Gaz ziemny",
            "ru": "Природный газ",
            "ko": "천연가스",
            "ar": "الغاز الطبيعي"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Automatisk, Elektricitet, Gas, Slukket",
        "de": "Automatisch, Elektrisch, Gas, Ausgeschaltet",
        "es": "Automático, Electricidad, Gas, Apagado",
        "fr": "Automatique, Électricité, Gaz, Éteint",
        "it": "Automatico, Elettricità, Gas, Spento",
        "no": "Automatisk, Elektrisitet, Gass, Av",
        "sv": "Automatisk, El, Gas, Av",
        "pl": "Automatyczny, Elektryczność, Gaz, Wyłączone",
        "ru": "Автоматически, Электричество, Газ, Выключено",
        "ko": "자동, 전기, 가스, 끔",
        "ar": "تلقائي، كهرباء، غاز، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "electricity",
          "title": {
            "en": "Electric",
            "nl": "Electrisch",
            "da": "Elektrisk",
            "de": "Elektrisch",
            "es": "Eléctrico",
            "fr": "Électrique",
            "it": "Elettrico",
            "no": "Elektrisk",
            "sv": "Elektrisk",
            "pl": "Elektryczny",
            "ru": "Электрический",
            "ko": "전기",
            "ar": "كهربائي"
          }
        },
        {
          "id": "gas",
          "title": {
            "en": "Natural Gas",
            "nl": "Aardgas",
            "da": "Naturgas",
            "de": "Erdgas",
            "es": "Gas natural",
            "fr": "Gaz naturel",
            "it": "Gas naturale",
            "no": "Naturgass",
            "sv": "Naturgas",
            "pl": "Gaz ziemny",
            "ru": "Природный газ",
            "ko": "천연가스",
            "ar": "الغاز الطبيعي"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Ausgeschaltet",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "da": "Auto, Lav, Medium, Høj, Turbo",
        "de": "Auto, Niedrig, Mittel, Hoch, Turbo",
        "es": "Auto, Bajo, Medio, Alto, Turbo",
        "fr": "Auto, Bas, Moyen, Élevé, Turbo",
        "it": "Auto, Basso, Medio, Alto, Turbo",
        "no": "Auto, Lav, Medium, Høy, Turbo",
        "sv": "Auto, Låg, Medium, Hög, Turbo",
        "pl": "Auto, Niski, Średni, Wysoki, Turbo",
        "ru": "Авто, Низкий, Средний, Высокий, Турбо",
        "ko": "자동, 낮음, 중간, 높음, 터보",
        "ar": "تلقائي، منخفض، متوسط، مرتفع، توربو"
      },
      "values": [
        {
          "id": "auto",
          "title": {
            "en": "Auto",
            "nl": "Auto",
            "da": "Auto",
            "de": "Auto",
            "es": "Automático",
            "fr": "Auto",
            "it": "Auto",
            "no": "Auto",
            "sv": "Auto",
            "pl": "Auto",
            "ru": "Авто",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "low",
          "title": {
            "en": "Low",
            "nl": "Laag",
            "da": "Lav",
            "de": "Niedrig",
            "es": "Bajo",
            "fr": "Faible",
            "it": "Basso",
            "no": "Lav",
            "sv": "Låg",
            "pl": "Niski",
            "ru": "Низкий",
            "ko": "낮음",
            "ar": "منخفض"
          }
        },
        {
          "id": "medium",
          "title": {
            "en": "Medium",
            "nl": "Medium",
            "da": "Mellem",
            "de": "Mittel",
            "es": "Medio",
            "fr": "Moyen",
            "it": "Medio",
            "no": "Middels",
            "sv": "Medium",
            "pl": "Średni",
            "ru": "Средний",
            "ko": "중간",
            "ar": "متوسط"
          }
        },
        {
          "id": "high",
          "title": {
            "en": "High",
            "nl": "Hoog",
            "da": "Høj",
            "de": "Hoch",
            "es": "Alto",
            "fr": "Élevé",
            "it": "Alto",
            "no": "Høy",
            "sv": "Hög",
            "pl": "Wysoki",
            "ru": "Высокий",
            "ko": "높음",
            "ar": "مرتفع"
          }
        },
        {
          "id": "turbo",
          "title": {
            "en": "Turbo",
            "nl": "Turbo",
            "da": "Turbo",
            "de": "Turbo",
            "es": "Turbo",
            "fr": "Turbo",
            "it": "Turbo",
            "no": "Turbo",
            "sv": "Turbo",
            "pl": "Turbo",
            "ru": "Турбо",
            "ko": "터보",
            "ar": "تيربو"
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
        "da": "Auto, Lav, Medium, Høj, Turbo",
        "de": "Auto, Niedrig, Mittel, Hoch, Turbo",
        "es": "Auto, Bajo, Medio, Alto, Turbo",
        "fr": "Auto, Bas, Moyen, Élevé, Turbo",
        "it": "Auto, Basso, Medio, Alto, Turbo",
        "no": "Auto, Lav, Medium, Høy, Turbo",
        "sv": "Auto, Låg, Medium, Hög, Turbo",
        "pl": "Auto, Niski, Średni, Wysoki, Turbo",
        "ru": "Авто, Низкий, Средний, Высокий, Турбо",
        "ko": "자동, 낮음, 중간, 높음, 터보",
        "ar": "تلقائي، منخفض، متوسط، مرتفع، توربو"
      },
      "values": [
        {
          "id": "auto",
          "title": {
            "en": "Auto",
            "nl": "Auto",
            "da": "Auto",
            "de": "Auto",
            "es": "Automático",
            "fr": "Auto",
            "it": "Auto",
            "no": "Auto",
            "sv": "Auto",
            "pl": "Auto",
            "ru": "Авто",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "low",
          "title": {
            "en": "Low",
            "nl": "Laag",
            "da": "Lav",
            "de": "Niedrig",
            "es": "Bajo",
            "fr": "Faible",
            "it": "Basso",
            "no": "Lav",
            "sv": "Låg",
            "pl": "Niski",
            "ru": "Низкий",
            "ko": "낮음",
            "ar": "منخفض"
          }
        },
        {
          "id": "medium",
          "title": {
            "en": "Medium",
            "nl": "Medium",
            "da": "Mellem",
            "de": "Mittel",
            "es": "Medio",
            "fr": "Moyen",
            "it": "Medio",
            "no": "Middels",
            "sv": "Medium",
            "pl": "Średni",
            "ru": "Средний",
            "ko": "중간",
            "ar": "متوسط"
          }
        },
        {
          "id": "high",
          "title": {
            "en": "High",
            "nl": "Hoog",
            "da": "Høj",
            "de": "Hoch",
            "es": "Alto",
            "fr": "Élevé",
            "it": "Alto",
            "no": "Høy",
            "sv": "Hög",
            "pl": "Wysoki",
            "ru": "Высокий",
            "ko": "높음",
            "ar": "مرتفع"
          }
        },
        {
          "id": "turbo",
          "title": {
            "en": "Turbo",
            "nl": "Turbo",
            "da": "Turbo",
            "de": "Turbo",
            "es": "Turbo",
            "fr": "Turbo",
            "it": "Turbo",
            "no": "Turbo",
            "sv": "Turbo",
            "pl": "Turbo",
            "ru": "Турбо",
            "ko": "터보",
            "ar": "تيربو"
          }
        }
      ]
    },`;

str += `"devicecapabilities_picker-EVCC_list": {
      "title": {
        "en": "EVCC.io",
        "nl": "EVCC.io",
        "da": "EVCC.io",
        "de": "EVCC.io",
        "es": "EVCC.io",
        "fr": "EVCC.io",
        "it": "EVCC.io",
        "no": "EVCC.io",
        "sv": "EVCC.io",
        "pl": "EVCC.io",
        "ru": "EVCC.io",
        "ko": "EVCC.io",
        "ar": "EVCC.io"
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
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
          },
          "value": "off"
        },
        {
          "id": "pv",
          "title": {
            "en": "Solar",
            "nl": "Zonne",
            "da": "Solenergi",
            "de": "Solar",
            "es": "Solar",
            "fr": "Solaire",
            "it": "Solare",
            "no": "Solcelle",
            "sv": "Solpanel",
            "pl": "Słoneczny",
            "ru": "Солнечная энергия",
            "ko": "태양광",
            "ar": "طاقة شمسية"
          },
          "value": "solar"
        },
        {
          "id": "minpv",
          "title": {
            "en": "Min+Solar",
            "nl": "Min+Zonne",
            "da": "Min+Solar",
            "de": "Min+Solar",
            "es": "Min+Solar",
            "fr": "Min+Solaire",
            "it": "Min+Solar",
            "no": "Min+Solar",
            "sv": "Min+Solar",
            "pl": "Min+Solar",
            "ru": "Мин+Солнечная",
            "ko": "최소+태양광",
            "ar": "مين+سولار"
          },
          "value": "minpv"
        },
        {
          "id": "now",
          "title": {
            "en": "Fast",
            "nl": "Snel",
            "da": "Hurtig",
            "de": "Schnell",
            "es": "Rápido",
            "fr": "Rapide",
            "it": "Veloce",
            "no": "Rask",
            "sv": "Snabb",
            "pl": "Szybko",
            "ru": "Быстро",
            "ko": "빠른",
            "ar": "سريع"
          },
          "value": "now"
        }
      ]
    },`;

str += `"devicecapabilities_picker_onlythroughflows-EVCC_list": {
      "title": {
        "en": "EVCC.io",
        "nl": "EVCC.io",
        "da": "EVCC.io",
        "de": "EVCC.io",
        "es": "EVCC.io",
        "fr": "EVCC.io",
        "it": "EVCC.io",
        "no": "EVCC.io",
        "sv": "EVCC.io",
        "pl": "EVCC.io",
        "ru": "EVCC.io",
        "ko": "EVCC.io",
        "ar": "EVCC.io"
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
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
          },
          "value": "off"
        },
        {
          "id": "pv",
          "title": {
            "en": "Solar",
            "nl": "Zonne",
            "da": "Solenergi",
            "de": "Solar",
            "es": "Solar",
            "fr": "Solaire",
            "it": "Solare",
            "no": "Solcelle",
            "sv": "Solpanel",
            "pl": "Słoneczny",
            "ru": "Солнечная энергия",
            "ko": "태양광",
            "ar": "طاقة شمسية"
          },
          "value": "solar"
        },
        {
          "id": "minpv",
          "title": {
            "en": "Min+Solar",
            "nl": "Min+Zonne",
            "da": "Min+Solar",
            "de": "Min+Solar",
            "es": "Min+Solar",
            "fr": "Min+Solaire",
            "it": "Min+Solar",
            "no": "Min+Solar",
            "sv": "Min+Solar",
            "pl": "Min+Solar",
            "ru": "Мин+Солнечная",
            "ko": "최소+태양광",
            "ar": "مين+سولار"
          },
          "value": "minpv"
        },
        {
          "id": "now",
          "title": {
            "en": "Fast",
            "nl": "Snel",
            "da": "Hurtig",
            "de": "Schnell",
            "es": "Rápido",
            "fr": "Rapide",
            "it": "Veloce",
            "no": "Rask",
            "sv": "Snabb",
            "pl": "Szybko",
            "ru": "Быстро",
            "ko": "빠른",
            "ar": "سريع"
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
        "en": "Automatic, Always-on",
        "nl": "Automatisch, Altijd aan",
        "da": "Automatisk, Altid tændt",
        "de": "Automatisch, Immer eingeschaltet",
        "es": "Automático, Siempre encendido",
        "fr": "Automatique, Toujours activé",
        "it": "Automatico, Sempre attivo",
        "no": "Automatisk, Alltid på",
        "sv": "Automatisk, Alltid på",
        "pl": "Automatyczne, Zawsze włączone",
        "ru": "Автоматический, всегда включен",
        "ko": "자동, 항상 켜짐",
        "ar": "تلقائي، يعمل دائمًا"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "always-on",
          "title": {
            "en": "Always on",
            "nl": "Altijd aan",
            "da": "Altid tændt",
            "de": "Dauerhaft aktiviert",
            "es": "Siempre encendido",
            "fr": "Toujours activé",
            "it": "Sempre acceso",
            "no": "Alltid på",
            "sv": "Alltid på",
            "pl": "Zawsze włączone",
            "ru": "Всегда включено",
            "ko": "항상 켜짐",
            "ar": "دائمًا قيد التشغيل"
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
        "en": "Automatic, Always-on",
        "nl": "Automatisch, Altijd aan",
        "da": "Automatisk, Altid tændt",
        "de": "Automatisch, Immer eingeschaltet",
        "es": "Automático, Siempre encendido",
        "fr": "Automatique, Toujours activé",
        "it": "Automatico, Sempre attivo",
        "no": "Automatisk, Alltid på",
        "sv": "Automatisk, Alltid på",
        "pl": "Automatyczne, zawsze włączone",
        "ru": "Автоматический, всегда включен",
        "ko": "자동, 항상 켜짐",
        "ar": "تلقائي، يعمل دائمًا"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "always-on",
          "title": {
            "en": "Always on",
            "nl": "Altijd aan",
            "da": "Altid tændt",
            "de": "Dauerhaft aktiviert",
            "es": "Siempre encendido",
            "fr": "Toujours activé",
            "it": "Sempre acceso",
            "no": "Alltid på",
            "sv": "Alltid på",
            "pl": "Zawsze włączone",
            "ru": "Всегда включено",
            "ko": "항상 켜짐",
            "ar": "دائمًا قيد التشغيل"
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
        "en": "Open, Stop, Close",
        "nl": "Openen, Stoppen, Sluiten",
        "da": "Åbn, Stop, Luk",
        "de": "Öffnen, Stoppen, Schließen",
        "es": "Abrir, Detener, Cerrar",
        "fr": "Ouvrir, Arrêter, Fermer",
        "it": "Apri, Ferma, Chiudi",
        "no": "Åpne, Stopp, Lukk",
        "sv": "Öppna, Stoppa, Stäng",
        "pl": "Otwórz, Zatrzymaj, Zamknij",
        "ru": "Открыть, Остановить, Закрыть",
        "ko": "열기, 정지, 닫기",
        "ar": "فتح، توقف، إغلاق"
      },
      "values": [
        {
          "id": "open",
          "title": {
            "en": "Open",
            "nl": "Open",
            "da": "Åben",
            "de": "Öffnen",
            "es": "Abrir",
            "fr": "Ouvrir",
            "it": "Apri",
            "no": "Åpne",
            "sv": "Öppna",
            "pl": "Otwórz",
            "ru": "Открыть",
            "ko": "열기",
            "ar": "افتح"
          }
        },
        {
          "id": "stop",
          "title": {
            "en": "Stop",
            "nl": "Stop",
            "da": "Stop",
            "de": "Stop",
            "es": "Detener",
            "fr": "Arrêter",
            "it": "Ferma",
            "no": "Stopp",
            "sv": "Stopp",
            "pl": "Zatrzymaj",
            "ru": "Стоп",
            "ko": "중지",
            "ar": "توقف"
          }
        },
        {
          "id": "close",
          "title": {
            "en": "Close",
            "nl": "Dicht",
            "da": "Luk",
            "de": "Schließen",
            "es": "Cerrar",
            "fr": "Fermer",
            "it": "Chiudi",
            "no": "Lukk",
            "sv": "Stäng",
            "pl": "Zamknij",
            "ru": "Закрыть",
            "ko": "닫기",
            "ar": "إغلاق"
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
        "en": "Open, Stop, Close",
        "nl": "Openen, Stoppen, Sluiten",
        "da": "Åbn, Stop, Luk",
        "de": "Öffnen, Stoppen, Schließen",
        "es": "Abrir, Detener, Cerrar",
        "fr": "Ouvrir, Arrêter, Fermer",
        "it": "Apri, Ferma, Chiudi",
        "no": "Åpne, Stopp, Lukk",
        "sv": "Öppna, Stoppa, Stäng",
        "pl": "Otwórz, Zatrzymaj, Zamknij",
        "ru": "Открыть, Остановить, Закрыть",
        "ko": "열기, 정지, 닫기",
        "ar": "فتح، توقف، إغلاق"
      },
      "values": [
        {
          "id": "open",
          "title": {
            "en": "Open",
            "nl": "Open",
            "da": "Åben",
            "de": "Öffnen",
            "es": "Abrir",
            "fr": "Ouvrir",
            "it": "Apri",
            "no": "Åpne",
            "sv": "Öppna",
            "pl": "Otwórz",
            "ru": "Открыть",
            "ko": "열기",
            "ar": "افتح"
          }
        },
        {
          "id": "stop",
          "title": {
            "en": "Stop",
            "nl": "Stop",
            "da": "Stop",
            "de": "Stop",
            "es": "Detener",
            "fr": "Arrêter",
            "it": "Ferma",
            "no": "Stopp",
            "sv": "Stopp",
            "pl": "Stop",
            "ru": "Стоп",
            "ko": "중지",
            "ar": "توقف"
          }
        },
        {
          "id": "close",
          "title": {
            "en": "Close",
            "nl": "Dicht",
            "da": "Luk",
            "de": "Schließen",
            "es": "Cerrar",
            "fr": "Fermer",
            "it": "Chiudi",
            "no": "Lukk",
            "sv": "Stäng",
            "pl": "Zamknij",
            "ru": "Закрыть",
            "ko": "닫기",
            "ar": "إغلاق"
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
        "en": "Auto, Cool, Dry, Fan",
        "nl": "Auto, Koelen, Ontvochtigen, Ventilator",
        "da": "Auto, Køl, Tør, Ventilator",
        "de": "Auto, Kühlen, Trocknen, Ventilator",
        "es": "Auto, Frío, Seco, Ventilador",
        "fr": "Auto, Refroidissement, Sec, Ventilateur",
        "it": "Auto, Raffreddamento, Deumidificazione, Ventilatore",
        "no": "Auto, Kjølig, Tørr, Vifte",
        "sv": "Auto, Kyla, Torr, Fläkt",
        "pl": "Auto, Chłodzenie, Osuszanie, Wentylator",
        "ru": "Авто, Охлаждение, Осушение, Вентилятор",
        "ko": "자동, 냉방, 제습, 송풍",
        "ar": "تلقائي، بارد، جاف، مروحة"
      },
      "values": [
        {
          "id": "auto",
          "title": {
            "en": "Auto",
            "nl": "Auto",
            "da": "Auto",
            "de": "Auto",
            "es": "Automático",
            "fr": "Auto",
            "it": "Auto",
            "no": "Auto",
            "sv": "Auto",
            "pl": "Auto",
            "ru": "Авто",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "cool",
          "title": {
            "en": "Cool",
            "nl": "Koel",
            "da": "Sejt",
            "de": "Cool",
            "es": "Genial",
            "fr": "Cool",
            "it": "Fantastico!",
            "no": "Kult",
            "sv": "Cool",
            "pl": "Fajnie",
            "ru": "Круто",
            "ko": "멋져요",
            "ar": "رائع"
          }
        },
        {
          "id": "dry",
          "title": {
            "en": "Dry",
            "nl": "Droog",
            "da": "Tør",
            "de": "Trocken",
            "es": "Seco",
            "fr": "Sec",
            "it": "Asciutto",
            "no": "Tørr",
            "sv": "Torr",
            "pl": "Suchy",
            "ru": "Сухой",
            "ko": "건조",
            "ar": "جاف"
          }
        },
        {
          "id": "fan",
          "title": {
            "en": "Fan",
            "nl": "Fan",
            "da": "Ventilator",
            "de": "Fan",
            "es": "Ventilador",
            "fr": "Ventilateur",
            "it": "Ventilatore",
            "no": "Vifte",
            "sv": "Fläkt",
            "pl": "Wentylator",
            "ru": "Вентилятор",
            "ko": "팬",
            "ar": "مروحة"
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
        "en": "Auto, Cool, Dry, Fan",
        "nl": "Auto, Koelen, Ontvochtigen, Ventilator",
        "da": "Auto, Køl, Tør, Ventilator",
        "de": "Auto, Kühlen, Trocknen, Ventilator",
        "es": "Auto, Frío, Seco, Ventilador",
        "fr": "Auto, Refroidir, Sécher, Ventilateur",
        "it": "Auto, Raffreddamento, Asciutto, Ventilatore",
        "no": "Auto, Kjølig, Tørr, Vifte",
        "sv": "Auto, Kyla, Torr, Fläkt",
        "pl": "Auto, Chłodzenie, Osuszanie, Wentylator",
        "ru": "Авто, Охлаждение, Осушение, Вентилятор",
        "ko": "자동, 냉방, 제습, 송풍",
        "ar": "تلقائي، بارد، جاف، مروحة"
      },
      "values": [
        {
          "id": "auto",
          "title": {
            "en": "Auto",
            "nl": "Auto",
            "da": "Auto",
            "de": "Auto",
            "es": "Auto",
            "fr": "Auto",
            "it": "Auto",
            "no": "Auto",
            "sv": "Auto",
            "pl": "Auto",
            "ru": "Авто",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "cool",
          "title": {
            "en": "Cool",
            "nl": "Koel",
            "da": "Sejt",
            "de": "Cool",
            "es": "Genial",
            "fr": "Cool",
            "it": "Fantastico!",
            "no": "Kult",
            "sv": "Cool",
            "pl": "Fajnie",
            "ru": "Круто",
            "ko": "멋져요",
            "ar": "رائع"
          }
        },
        {
          "id": "dry",
          "title": {
            "en": "Dry",
            "nl": "Droog",
            "da": "Tør",
            "de": "Trocken",
            "es": "Seco",
            "fr": "Sec",
            "it": "Asciutto",
            "no": "Tørr",
            "sv": "Torr",
            "pl": "Suchy",
            "ru": "Сухой",
            "ko": "건조",
            "ar": "جاف"
          }
        },
        {
          "id": "fan",
          "title": {
            "en": "Fan",
            "nl": "Fan",
            "da": "Ventilator",
            "de": "Fan",
            "es": "Ventilador",
            "fr": "Ventilateur",
            "it": "Ventilatore",
            "no": "Vifte",
            "sv": "Fläkt",
            "pl": "Wentylator",
            "ru": "Вентилятор",
            "ko": "팬",
            "ar": "مروحة"
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
        "en": "Off, Running, Finished (Not emptied), Finished",
        "nl": "Uit, Bezig, Klaar (Niet geleegd), Klaar",
        "da": "Slukket, Kører, Færdig (Ikke tømt), Færdig",
        "de": "Aus, Läuft, Fertig (Nicht entleert), Fertig",
        "es": "Apagado, En funcionamiento, Terminado (No vaciado), Terminado",
        "fr": "Éteint, En cours, Terminé (Non vidé), Terminé",
        "it": "Spento, In esecuzione, Terminato (Non svuotato), Terminato",
        "no": "Av, Kjører, Ferdig (Ikke tømt), Ferdig",
        "sv": "Av, Kör, Klar (Inte tömd), Klar",
        "pl": "Wyłączone, W trakcie, Zakończone (Nieopróżnione), Zakończone",
        "ru": "Выключено, Работает, Завершено (Не опустошено), Завершено",
        "ko": "꺼짐, 실행 중, 완료 (비우지 않음), 완료",
        "ar": "إيقاف، قيد التشغيل، انتهى (لم يُفرغ)، انتهى"
      },
      "values": [
        {
          "id": "off",
          "title": {
            "en": "Off",
            "no": "Av",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
          }
        },
        {
          "id": "running",
          "title": {
            "en": "Running",
            "no": "Kjører",
            "nl": "Rennen",
            "da": "Kører",
            "de": "Betrieb",
            "es": "Corriendo",
            "fr": "En cours d'exécution",
            "it": "In esecuzione",
            "sv": "Körs",
            "pl": "Bieganie",
            "ru": "Запуск",
            "ko": "실행 중",
            "ar": "تشغيل"
          }
        },
        {
          "id": "finished_not_emptied",
          "title": {
            "en": "Finished (Not emptied)",
            "no": "Fullført (Ikke tømt)",
            "nl": "Afgewerkt (Niet geleegd)",
            "da": "Færdig (Ikke tømt)",
            "de": "Fertig (Nicht geleert)",
            "es": "Terminado (No vaciado)",
            "fr": "Terminé (Non vidé)",
            "it": "Finito (Non svuotato)",
            "sv": "Klar (Inte tömd)",
            "pl": "Zakończono (Nie opróżniono)",
            "ru": "Завершено (Не опустошено)",
            "ko": "완료됨 (비워지지 않음)",
            "ar": "منتهية (غير مفرغة)"
          }
        },
        {
          "id": "finished",
          "title": {
            "en": "Finished",
            "no": "Fullført",
            "nl": "Afgewerkt",
            "da": "Færdig",
            "de": "Fertig",
            "es": "Terminado",
            "fr": "Terminé",
            "it": "Finito",
            "sv": "Klart",
            "pl": "Zakończono",
            "ru": "Завершено",
            "ko": "완료되었습니다.",
            "ar": "منتهي"
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
        "en": "Off, Running, Finished (Not emptied), Finished",
        "nl": "Uit, Bezig, Klaar (Niet geleegd), Klaar",
        "da": "Slukket, Kører, Færdig (Ikke tømt), Færdig",
        "de": "Aus, Läuft, Fertig (Nicht entleert), Fertig",
        "es": "Apagado, En funcionamiento, Terminado (No vaciado), Terminado",
        "fr": "Éteint, En cours, Terminé (Non vidé), Terminé",
        "it": "Spento, In esecuzione, Completato (Non svuotato), Completato",
        "no": "Av, Kjører, Ferdig (Ikke tømt), Ferdig",
        "sv": "Av, Kör, Klar (Inte tömd), Klar",
        "pl": "Wyłączone, Uruchomione, Zakończone (Nieopróżnione), Zakończone",
        "ru": "Выкл., Работает, Завершено (Не опустошено), Завершено",
        "ko": "꺼짐, 실행 중, 완료 (비워지지 않음), 완료",
        "ar": "إيقاف، قيد التشغيل، انتهى (لم يُفرغ)، انتهى"
      },
      "values": [
        {
          "id": "off",
          "title": {
            "en": "Off",
            "no": "Av",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
          }
        },
        {
          "id": "running",
          "title": {
            "en": "Running",
            "no": "Kjører",
            "nl": "Rennen",
            "da": "Kører",
            "de": "Betrieb",
            "es": "Corriendo",
            "fr": "En cours d'exécution",
            "it": "In esecuzione",
            "sv": "Körs",
            "pl": "Bieganie",
            "ru": "Запуск",
            "ko": "실행 중",
            "ar": "تشغيل"
          }
        },
        {
          "id": "finished_not_emptied",
          "title": {
            "en": "Finished (Not emptied)",
            "no": "Fullført (Ikke tømt)",
            "nl": "Afgewerkt (Niet geleegd)",
            "da": "Færdig (Ikke tømt)",
            "de": "Fertig (Nicht geleert)",
            "es": "Terminado (No vaciado)",
            "fr": "Terminé (Non vidé)",
            "it": "Finito (Non svuotato)",
            "sv": "Klar (Inte tömd)",
            "pl": "Zakończono (Nie opróżniono)",
            "ru": "Завершено (Не опустошено)",
            "ko": "완료됨 (비워지지 않음)",
            "ar": "منتهية (غير مفرغة)"
          }
        },
        {
          "id": "finished",
          "title": {
            "en": "Finished",
            "no": "Fullført",
            "nl": "Afgewerkt",
            "da": "Færdig",
            "de": "Fertig",
            "es": "Terminado",
            "fr": "Terminé",
            "it": "Finito",
            "sv": "Klar",
            "pl": "Zakończono",
            "ru": "Завершено",
            "ko": "완료됨",
            "ar": "تم الانتهاء"
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
        "en": "Present, Away, Coming Soon",
        "nl": "Aanwezig, Afwezig, Binnenkort Beschikbaar",
        "da": "Hjemme, Væk, Kommer Snart",
        "de": "Anwesend, Abwesend, Bald verfügbar",
        "es": "Presente, Ausente, Próximamente",
        "fr": "Présent, Absent, Bientôt Disponible",
        "it": "Presente, Assente, In Arrivo Presto",
        "no": "Hjemme, Borte, Kommer Snart",
        "sv": "Hemma, Borta, Kommer Snart",
        "pl": "Obecny, Poza domem, Wkrótce dostępne",
        "ru": "Дома, Вне дома, Скоро будет",
        "ko": "현재, 부재중, 곧 출시 예정",
        "ar": "حاضر، بعيد، قادم قريبًا"
      },
      "values": [
        {
          "id": "present",
          "title": {
            "en": "Present",
            "no": "Tilstede",
            "nl": "Aanwezig",
            "da": "Nuværende",
            "de": "Vorhanden",
            "es": "Presente",
            "fr": "Présent",
            "it": "Presente",
            "sv": "Nuvarande",
            "pl": "Obecny",
            "ru": "Настоящее время",
            "ko": "현재",
            "ar": "الحاضر"
          }
        },
        {
          "id": "away",
          "title": {
            "en": "Away",
            "no": "Borte",
            "nl": "Weg",
            "da": "Ude",
            "de": "Weg",
            "es": "Ausente",
            "fr": "Absent",
            "it": "Assente",
            "sv": "Borta",
            "pl": "Poza domem",
            "ru": "Вне дома",
            "ko": "외출 중",
            "ar": "بعيدًا"
          }
        },
        {
          "id": "comingsoon",
          "title": {
            "en": "Coming Soon",
            "no": "Kommer Snart",
            "nl": "Komt Binnenkort",
            "da": "Kommer snart",
            "de": "Kommt Bald",
            "es": "Próximamente",
            "fr": "Bientôt disponible",
            "it": "In arrivo presto",
            "sv": "Kommer snart",
            "pl": "Już wkrótce",
            "ru": "Скоро будет доступно",
            "ko": "곧 출시 예정",
            "ar": "قريبًا"
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
        "en": "Present, Away, Coming Soon",
        "nl": "Aanwezig, Afwezig, Binnenkort Beschikbaar",
        "da": "Hjemme, Væk, Kommer Snart",
        "de": "Anwesend, Abwesend, Bald verfügbar",
        "es": "Presente, Ausente, Próximamente",
        "fr": "Présent, Absent, Bientôt Disponible",
        "it": "Presente, Assente, In Arrivo Presto",
        "no": "Hjemme, Borte, Kommer Snart",
        "sv": "Hemma, Borta, Kommer Snart",
        "pl": "Obecny, Poza domem, Wkrótce dostępne",
        "ru": "Дома, Вне дома, Скоро будет",
        "ko": "현재, 부재중, 곧 출시 예정",
        "ar": "حاضر، بعيد، قادم قريبًا"
      },
      "values": [
        {
          "id": "present",
          "title": {
            "en": "Present",
            "no": "Tilstede",
            "nl": "Aanwezig",
            "da": "Nuværende",
            "de": "Vorhanden",
            "es": "Presente",
            "fr": "Présent",
            "it": "Presente",
            "sv": "Närvarande",
            "pl": "Obecny",
            "ru": "Настоящее время",
            "ko": "현재",
            "ar": "الحاضر"
          }
        },
        {
          "id": "away",
          "title": {
            "en": "Away",
            "no": "Borte",
            "nl": "Weg",
            "da": "Væk",
            "de": "Weg",
            "es": "Ausente",
            "fr": "Absent",
            "it": "Assente",
            "sv": "Borta",
            "pl": "Poza domem",
            "ru": "Вне дома",
            "ko": "부재중",
            "ar": "بعيد"
          }
        },
        {
          "id": "comingsoon",
          "title": {
            "en": "Coming Soon",
            "no": "Kommer Snart",
            "nl": "Komt Binnenkort",
            "da": "Kommer snart",
            "de": "Kommt Bald",
            "es": "Próximamente",
            "fr": "Bientôt disponible",
            "it": "In arrivo presto",
            "sv": "Kommer snart",
            "pl": "Już wkrótce",
            "ru": "Скоро будет доступно",
            "ko": "곧 출시 예정",
            "ar": "قريبًا"
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
        "en": "Home, Away, Sleep, Vacation",
        "nl": "Thuis, Weg, Slapen, Vakantie",
        "da": "Hjemme, Ude, Søvn, Ferie",
        "de": "Zuhause, Abwesend, Schlafen, Urlaub",
        "es": "Casa, Fuera, Dormir, Vacaciones",
        "fr": "Maison, Absent, Sommeil, Vacances",
        "it": "Casa, Fuori, Sonno, Vacanza",
        "no": "Hjemme, Borte, Søvn, Ferie",
        "sv": "Hemma, Borta, Sova, Semester",
        "pl": "Dom, Poza domem, Sen, Wakacje",
        "ru": "Дом, Вне дома, Сон, Отпуск",
        "ko": "집, 외출, 수면, 휴가",
        "ar": "المنزل، خارج المنزل، النوم، الإجازة"
      },
      "values": [
        {
          "id": "home",
          "title": {
            "en": "Home",
            "nl": "Thuis",
            "da": "Hjem",
            "de": "Zu Hause",
            "es": "Inicio",
            "fr": "Accueil",
            "it": "Casa",
            "no": "Hjem",
            "sv": "Hem",
            "pl": "Dom",
            "ru": "Дом",
            "ko": "홈",
            "ar": "الصفحة الرئيسية"
          }
        },
        {
          "id": "away",
          "title": {
            "en": "Away",
            "nl": "Afwezig",
            "da": "Ude",
            "de": "Abwesend",
            "es": "Ausente",
            "fr": "Absent",
            "it": "Assente",
            "no": "Borte",
            "sv": "Borta",
            "pl": "Poza domem",
            "ru": "Вне дома",
            "ko": "부재중",
            "ar": "بعيدًا"
          }
        },
        {
          "id": "sleep",
          "title": {
            "en": "Sleep",
            "nl": "Slapen",
            "da": "Søvn",
            "de": "Schlafen",
            "es": "Dormir",
            "fr": "Sommeil",
            "it": "Sonno",
            "no": "Søvn",
            "sv": "Sömn",
            "pl": "Sen",
            "ru": "Сон",
            "ko": "수면",
            "ar": "نوم"
          }
        },
        {
          "id": "vacation",
          "title": {
            "en": "Vacation",
            "nl": "Vakantie",
            "da": "Ferie",
            "de": "Feiertage",
            "es": "Vacaciones",
            "fr": "Vacances",
            "it": "Vacanza",
            "no": "Ferie",
            "sv": "Semester",
            "pl": "Wakacje",
            "ru": "Отпуск",
            "ko": "휴가",
            "ar": "إجازة"
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
        "en": "Home, Away, Sleep, Vacation",
        "nl": "Thuis, Weg, Slapen, Vakantie",
        "da": "Hjemme, Ude, Søvn, Ferie",
        "de": "Zuhause, Abwesend, Schlafen, Urlaub",
        "es": "Casa, Fuera, Dormir, Vacaciones",
        "fr": "Maison, Absent, Sommeil, Vacances",
        "it": "Casa, Fuori, Sonno, Vacanza",
        "no": "Hjemme, Borte, Søvn, Ferie",
        "sv": "Hemma, Borta, Sova, Semester",
        "pl": "Dom, Poza domem, Sen, Wakacje",
        "ru": "Дом, Вне дома, Сон, Отпуск",
        "ko": "집, 외출, 수면, 휴가",
        "ar": "المنزل، خارج المنزل، النوم، الإجازة"
      },
      "values": [
        {
          "id": "home",
          "title": {
            "en": "Home",
            "nl": "Thuis",
            "da": "Hjem",
            "de": "Zu Hause",
            "es": "Inicio",
            "fr": "Accueil",
            "it": "Casa",
            "no": "Hjem",
            "sv": "Hem",
            "pl": "Dom",
            "ru": "Дом",
            "ko": "홈",
            "ar": "الصفحة الرئيسية"
          }
        },
        {
          "id": "away",
          "title": {
            "en": "Away",
            "nl": "Afwezig",
            "da": "Væk",
            "de": "Abwesend",
            "es": "Ausente",
            "fr": "Absent",
            "it": "Assente",
            "no": "Borte",
            "sv": "Borta",
            "pl": "Poza domem",
            "ru": "Вне дома",
            "ko": "외출 중",
            "ar": "بعيد"
          }
        },
        {
          "id": "sleep",
          "title": {
            "en": "Sleep",
            "nl": "Slapen",
            "da": "Søvn",
            "de": "Schlafen",
            "es": "Dormir",
            "fr": "Sommeil",
            "it": "Sonno",
            "no": "Søvn",
            "sv": "Sömn",
            "pl": "Sen",
            "ru": "Сон",
            "ko": "수면",
            "ar": "نوم"
          }
        },
        {
          "id": "vacation",
          "title": {
            "en": "Vacation",
            "nl": "Vakantie",
            "da": "Ferie",
            "de": "Feiertage",
            "es": "Vacaciones",
            "fr": "Vacances",
            "it": "Vacanza",
            "no": "Ferie",
            "sv": "Semester",
            "pl": "Wakacje",
            "ru": "Отпуск",
            "ko": "휴가",
            "ar": "إجازة"
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
        "en": "Bright, Regular, Mood, Colour, TV, Cinema",
        "nl": "Helder, Normaal, Sfeer, Kleur, TV, Bioscoop",
        "da": "Lys, Almindelig, Stemning, Farve, TV, Biograf",
        "de": "Hell, Normal, Stimmung, Farbe, TV, Kino",
        "es": "Brillante, Regular, Ambiente, Color, TV, Cine",
        "fr": "Lumineux, Régulier, Ambiance, Couleur, TV, Cinéma",
        "it": "Luminoso, Normale, Atmosfera, Colore, TV, Cinema",
        "no": "Lys, Vanlig, Stemning, Farge, TV, Kino",
        "sv": "Ljusstark, Vanlig, Stämning, Färg, TV, Bio",
        "pl": "Jasny, Zwykły, Nastrój, Kolor, TV, Kino",
        "ru": "Яркий, Обычный, Настроение, Цвет, ТВ, Кинотеатр",
        "ko": "밝기, 일반, 분위기, 색상, TV, 영화관",
        "ar": "ساطع، عادي، مزاج، لون، تلفاز، سينما"
      },
      "values": [
        {
          "id": "bright",
          "title": {
            "en": "Bright",
            "nl": "Helder",
            "da": "Lys",
            "de": "Hell",
            "es": "Brillante",
            "fr": "Luminosité",
            "it": "Luminoso",
            "no": "Lys",
            "sv": "Ljusstark",
            "pl": "Jasny",
            "ru": "Яркий",
            "ko": "밝기",
            "ar": "ساطع"
          }
        },
        {
          "id": "regular",
          "title": {
            "en": "Regular",
            "nl": "Normaal",
            "da": "Regelmæssig",
            "de": "Normal",
            "es": "Regular",
            "fr": "Régulier",
            "it": "Regolare",
            "no": "Vanlig",
            "sv": "Vanlig",
            "pl": "Regularny",
            "ru": "Обычный",
            "ko": "일반적인",
            "ar": "عادي"
          }
        },
        {
          "id": "mood",
          "title": {
            "en": "Mood",
            "nl": "Sfeer",
            "da": "Humør",
            "de": "Stimmung",
            "es": "Estado de ánimo",
            "fr": "Humeur",
            "it": "Umore",
            "no": "Humør",
            "sv": "Humör",
            "pl": "Nastrój",
            "ru": "Настроение",
            "ko": "기분",
            "ar": "المزاج"
          }
        },
        {
          "id": "colour",
          "title": {
            "en": "Colour",
            "nl": "Kleur",
            "da": "Farve",
            "de": "Bunt",
            "es": "Color",
            "fr": "Couleur",
            "it": "Colore",
            "no": "Farge",
            "sv": "Färg",
            "pl": "Kolor",
            "ru": "Цвет",
            "ko": "색상",
            "ar": "لون"
          }
        },
        {
          "id": "tv",
          "title": {
            "en": "TV",
            "nl": "TV",
            "da": "TV",
            "de": "TV",
            "es": "Televisión",
            "fr": "Télévision",
            "it": "TV",
            "no": "TV",
            "sv": "TV",
            "pl": "Telewizor",
            "ru": "Телевизор",
            "ko": "TV",
            "ar": "تلفاز"
          }
        },
        {
          "id": "cinema",
          "title": {
            "en": "Cinema",
            "nl": "Bios",
            "da": "Biograf",
            "de": "Kino",
            "es": "Cine",
            "fr": "Cinéma",
            "it": "Cinema",
            "no": "Kino",
            "sv": "Bio",
            "pl": "Kino",
            "ru": "Кинотеатр",
            "ko": "영화관",
            "ar": "سينما"
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
        "en": "Bright, Regular, Mood, Colour, TV, Cinema",
        "nl": "Helder, Normaal, Sfeer, Kleur, TV, Bioscoop",
        "da": "Lys, Almindelig, Stemning, Farve, TV, Biograf",
        "de": "Hell, Normal, Stimmung, Farbe, TV, Kino",
        "es": "Brillante, Regular, Ambiente, Color, TV, Cine",
        "fr": "Lumineux, Régulier, Ambiance, Couleur, TV, Cinéma",
        "it": "Luminoso, Normale, Atmosfera, Colore, TV, Cinema",
        "no": "Lys, Vanlig, Stemning, Farge, TV, Kino",
        "sv": "Ljusstark, Vanlig, Stämning, Färg, TV, Bio",
        "pl": "Jasny, Zwykły, Nastrój, Kolor, TV, Kino",
        "ru": "Яркий, Обычный, Настроение, Цвет, ТВ, Кино",
        "ko": "밝기, 일반, 분위기, 색상, TV, 영화관",
        "ar": "ساطع، عادي، مزاج، لون، تلفاز، سينما"
      },
      "values": [
        {
          "id": "bright",
          "title": {
            "en": "Bright",
            "nl": "Helder",
            "da": "Lys",
            "de": "Hell",
            "es": "Brillante",
            "fr": "Luminosité",
            "it": "Luminoso",
            "no": "Lys",
            "sv": "Ljusstark",
            "pl": "Jasny",
            "ru": "Яркий",
            "ko": "밝기",
            "ar": "ساطع"
          }
        },
        {
          "id": "regular",
          "title": {
            "en": "Regular",
            "nl": "Normaal",
            "da": "Regelmæssig",
            "de": "Normal",
            "es": "Regular",
            "fr": "Régulier",
            "it": "Regolare",
            "no": "Vanlig",
            "sv": "Vanlig",
            "pl": "Regularny",
            "ru": "Обычный",
            "ko": "일반",
            "ar": "عادي"
          }
        },
        {
          "id": "mood",
          "title": {
            "en": "Mood",
            "nl": "Sfeer",
            "da": "Humør",
            "de": "Stimmung",
            "es": "Estado de ánimo",
            "fr": "Humeur",
            "it": "Umore",
            "no": "Humør",
            "sv": "Humör",
            "pl": "Nastrój",
            "ru": "Настроение",
            "ko": "기분",
            "ar": "المزاج"
          }
        },
        {
          "id": "colour",
          "title": {
            "en": "Colour",
            "nl": "Kleur",
            "da": "Farve",
            "de": "Bunt",
            "es": "Color",
            "fr": "Couleur",
            "it": "Colore",
            "no": "Farge",
            "sv": "Färg",
            "pl": "Kolor",
            "ru": "Цвет",
            "ko": "색상",
            "ar": "لون"
          }
        },
        {
          "id": "tv",
          "title": {
            "en": "TV",
            "nl": "TV",
            "da": "TV",
            "de": "TV",
            "es": "Televisor",
            "fr": "Télévision",
            "it": "TV",
            "no": "TV",
            "sv": "TV",
            "pl": "Telewizor",
            "ru": "Телевизор",
            "ko": "TV",
            "ar": "تلفاز"
          }
        },
        {
          "id": "cinema",
          "title": {
            "en": "Cinema",
            "nl": "Bios",
            "da": "Biograf",
            "de": "Kino",
            "es": "Cine",
            "fr": "Cinéma",
            "it": "Cinema",
            "no": "Kino",
            "sv": "Bio",
            "pl": "Kino",
            "ru": "Кинотеатр",
            "ko": "영화관",
            "ar": "سينما"
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
        "en": "Automatic, Manual, Off",
        "nl": "Automatisch, Handmatig, Uit",
        "da": "Automatisk, Manuel, Fra",
        "de": "Automatisch, Manuell, Aus",
        "es": "Automático, Manual, Apagado",
        "fr": "Automatique, Manuel, Éteint",
        "it": "Automatico, Manuale, Spento",
        "no": "Automatisk, Manuell, Av",
        "sv": "Automatisk, Manuell, Av",
        "pl": "Automatyczny, Ręczny, Wyłączony",
        "ru": "Автоматический, Ручной, Выключено",
        "ko": "자동, 수동, 끔",
        "ar": "تلقائي، يدوي، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "manual",
          "title": {
            "en": "Manual",
            "nl": "Handmatig",
            "da": "Manuel",
            "de": "Manuell",
            "es": "Manual",
            "fr": "Manuel",
            "it": "Manuale",
            "no": "Manuell",
            "sv": "Manuell",
            "pl": "Instrukcja obsługi",
            "ru": "Руководство",
            "ko": "매뉴얼",
            "ar": "يدوي"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "en": "Automatic, Manual, Off",
        "nl": "Automatisch, Handmatig, Uit",
        "da": "Automatisk, Manuel, Fra",
        "de": "Automatisch, Manuell, Aus",
        "es": "Automático, Manual, Apagado",
        "fr": "Automatique, Manuel, Éteint",
        "it": "Automatico, Manuale, Spento",
        "no": "Automatisk, Manuell, Av",
        "sv": "Automatisk, Manuell, Av",
        "pl": "Automatyczny, Ręczny, Wyłączony",
        "ru": "Автоматический, Ручной, Выключено",
        "ko": "자동, 수동, 끔",
        "ar": "تلقائي، يدوي، إيقاف"
      },
      "values": [
        {
          "id": "automatic",
          "title": {
            "en": "Automatic",
            "nl": "Automatisch",
            "da": "Automatisk",
            "de": "Automatisch",
            "es": "Automático",
            "fr": "Automatique",
            "it": "Automatico",
            "no": "Automatisk",
            "sv": "Automatisk",
            "pl": "Automatyczny",
            "ru": "Автоматический",
            "ko": "자동",
            "ar": "تلقائي"
          }
        },
        {
          "id": "manual",
          "title": {
            "en": "Manual",
            "nl": "Handmatig",
            "da": "Manuel",
            "de": "Manuell",
            "es": "Manual",
            "fr": "Manuel",
            "it": "Manuale",
            "no": "Brukermanual",
            "sv": "Manuell",
            "pl": "Instrukcja obsługi",
            "ru": "Руководство",
            "ko": "매뉴얼",
            "ar": "يدوي"
          }
        },
        {
          "id": "off",
          "title": {
            "en": "Off",
            "nl": "Uit",
            "da": "Fra",
            "de": "Aus",
            "es": "Apagado",
            "fr": "Éteint",
            "it": "Spento",
            "no": "Av",
            "sv": "Av",
            "pl": "Wyłączone",
            "ru": "Выкл.",
            "ko": "꺼짐",
            "ar": "إيقاف"
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
        "en": "Bright, Regular, Mood, Night",
        "nl": "Helder, Normaal, Sfeer, Nacht",
        "da": "Lys, Almindelig, Stemning, Nat",
        "de": "Hell, Normal, Stimmung, Nacht",
        "es": "Brillante, Regular, Ambiente, Noche",
        "fr": "Lumineux, Régulier, Ambiance, Nuit",
        "it": "Luminoso, Normale, Atmosfera, Notte",
        "no": "Lys, Vanlig, Stemning, Natt",
        "sv": "Ljusstark, Vanlig, Stämning, Natt",
        "pl": "Jasny, Zwykły, Nastrój, Nocny",
        "ru": "Яркий, Обычный, Настроение, Ночной",
        "ko": "밝기, 일반, 분위기, 야간",
        "ar": "ساطع، عادي، مزاج، ليل"
      },
      "values": [
        {
          "id": "bright",
          "title": {
            "en": "Bright",
            "nl": "Helder",
            "da": "Lys",
            "de": "Hell",
            "es": "Brillante",
            "fr": "Luminosité",
            "it": "Luminoso",
            "no": "Lys",
            "sv": "Ljusstark",
            "pl": "Jasny",
            "ru": "Яркий",
            "ko": "밝기",
            "ar": "ساطع"
          }
        },
        {
          "id": "regular",
          "title": {
            "en": "Regular",
            "nl": "Normaal",
            "da": "Regelmæssig",
            "de": "Normal",
            "es": "Regular",
            "fr": "Régulier",
            "it": "Regolare",
            "no": "Vanlig",
            "sv": "Vanlig",
            "pl": "Zwykły",
            "ru": "Обычный",
            "ko": "일반적인",
            "ar": "عادي"
          }
        },
        {
          "id": "mood",
          "title": {
            "en": "Mood",
            "nl": "Sfeer",
            "da": "Humør",
            "de": "Stimmung",
            "es": "Estado de ánimo",
            "fr": "Humeur",
            "it": "Umore",
            "no": "Humør",
            "sv": "Humör",
            "pl": "Nastrój",
            "ru": "Настроение",
            "ko": "기분",
            "ar": "المزاج"
          }
        },
        {
          "id": "night",
          "title": {
            "en": "Night",
            "nl": "Nacht",
            "da": "Nat",
            "de": "Nacht",
            "es": "Noche",
            "fr": "Nuit",
            "it": "Notte",
            "no": "Natt",
            "sv": "Natt",
            "pl": "Noc",
            "ru": "Ночь",
            "ko": "밤",
            "ar": "ليل"
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
        "en": "Bright, Regular, Mood, Night",
        "nl": "Helder, Normaal, Sfeer, Nacht",
        "da": "Lys, Almindelig, Stemning, Nat",
        "de": "Hell, Normal, Stimmung, Nacht",
        "es": "Brillante, Regular, Ambiente, Noche",
        "fr": "Lumineux, Régulier, Ambiance, Nuit",
        "it": "Luminoso, Normale, Atmosfera, Notte",
        "no": "Lys, Vanlig, Stemning, Natt",
        "sv": "Ljusstark, Vanlig, Stämning, Natt",
        "pl": "Jasny, Zwykły, Nastrój, Nocny",
        "ru": "Яркий, Обычный, Настроение, Ночной",
        "ko": "밝기, 일반, 분위기, 야간",
        "ar": "ساطع، عادي، مزاج، ليل"
      },
      "values": [
        {
          "id": "bright",
          "title": {
            "en": "Bright",
            "nl": "Helder",
            "da": "Lys",
            "de": "Hell",
            "es": "Brillante",
            "fr": "Luminosité",
            "it": "Luminoso",
            "no": "Lys",
            "sv": "Ljusstark",
            "pl": "Jasny",
            "ru": "Яркий",
            "ko": "밝기",
            "ar": "ساطع"
          }
        },
        {
          "id": "regular",
          "title": {
            "en": "Regular",
            "nl": "Normaal",
            "da": "Regelmæssig",
            "de": "Normal",
            "es": "Regular",
            "fr": "Régulier",
            "it": "Regolare",
            "no": "Vanlig",
            "sv": "Vanlig",
            "pl": "Regularny",
            "ru": "Обычный",
            "ko": "일반",
            "ar": "عادي"
          }
        },
        {
          "id": "mood",
          "title": {
            "en": "Mood",
            "nl": "Sfeer",
            "da": "Humør",
            "de": "Stimmung",
            "es": "Estado de ánimo",
            "fr": "Humeur",
            "it": "Umore",
            "no": "Humør",
            "sv": "Humör",
            "pl": "Nastrój",
            "ru": "Настроение",
            "ko": "기분",
            "ar": "المزاج"
          }
        },
        {
          "id": "night",
          "title": {
            "en": "Night",
            "nl": "Nacht",
            "da": "Nat",
            "de": "Nacht",
            "es": "Noche",
            "fr": "Nuit",
            "it": "Notte",
            "no": "Natt",
            "sv": "Natt",
            "pl": "Noc",
            "ru": "Ночь",
            "ko": "밤",
            "ar": "ليل"
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
        "en": "EV Charge, Compressor, Machines, Workbench",
        "nl": "EV Opladen, Compressor, Machines, Werkbank",
        "da": "EV-opladning, Kompressor, Maskiner, Arbejdsbord",
        "de": "EV-Ladestation, Kompressor, Maschinen, Werkbank",
        "es": "Carga de EV, Compresor, Máquinas, Banco de trabajo",
        "fr": "Chargeur de VE, Compresseur, Machines, Établi",
        "it": "Ricarica EV, Compressore, Macchine, Banco da lavoro",
        "no": "EV-lading, Kompressor, Maskiner, Arbeidsbenk",
        "sv": "EV-laddning, Kompressor, Maskiner, Arbetsbänk",
        "pl": "Ładowanie EV, Kompresor, Maszyny, Warsztat",
        "ru": "Зарядка электромобиля, Компрессор, Машины, Верстак",
        "ko": "EV 충전, 압축기, 기계, 작업대",
        "ar": "شحن السيارة الكهربائية، ضاغط، آلات، طاولة عمل"
      },
      "values": [
        {
          "id": "ev charge",
          "title": {
            "en": "EV charge",
            "nl": "EV laden",
            "da": "EV opladning",
            "de": "BEV laden",
            "es": "Carga de vehículo eléctrico",
            "fr": "Charge de véhicule électrique",
            "it": "Carica EV",
            "no": "EV-lading",
            "sv": "EV-laddning",
            "pl": "Ładowanie EV",
            "ru": "Зарядка электромобиля",
            "ko": "EV 충전",
            "ar": "شحن السيارة الكهربائية"
          }
        },
        {
          "id": "compressor",
          "title": {
            "en": "Compressor",
            "nl": "Compressor",
            "da": "Kompressor",
            "de": "Kompressor",
            "es": "Compresor",
            "fr": "Compresseur",
            "it": "Compressore",
            "no": "Kompressor",
            "sv": "Kompressor",
            "pl": "Kompresor",
            "ru": "Компрессор",
            "ko": "압축기",
            "ar": "ضاغط"
          }
        },
        {
          "id": "machines",
          "title": {
            "en": "Machines",
            "nl": "Machines",
            "da": "Maskiner",
            "de": "Machines",
            "es": "Máquinas",
            "fr": "Machines",
            "it": "Macchine",
            "no": "Maskiner",
            "sv": "Maskiner",
            "pl": "Maszyny",
            "ru": "Машины",
            "ko": "기기",
            "ar": "آلات"
          }
        },
        {
          "id": "workbench",
          "title": {
            "en": "Workbench",
            "nl": "Werkbank",
            "da": "Værksted",
            "de": "Werkbank",
            "es": "Banco de trabajo",
            "fr": "Établi",
            "it": "Banco di lavoro",
            "no": "Arbeidsbenk",
            "sv": "Arbetsbänk",
            "pl": "Warsztat",
            "ru": "Верстак",
            "ko": "작업대",
            "ar": "منضدة العمل"
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
        "en": "EV Charge, Compressor, Machines, Workbench",
        "nl": "EV Opladen, Compressor, Machines, Werkbank",
        "da": "EV Opladning, Kompressor, Maskiner, Arbejdsbord",
        "de": "EV-Ladestation, Kompressor, Maschinen, Werkbank",
        "es": "Carga EV, Compresor, Máquinas, Banco de trabajo",
        "fr": "Chargeur VE, Compresseur, Machines, Établi",
        "it": "Ricarica EV, Compressore, Macchine, Banco da lavoro",
        "no": "EV-lading, Kompressor, Maskiner, Arbeidsbenk",
        "sv": "EV-laddning, Kompressor, Maskiner, Arbetsbänk",
        "pl": "Ładowanie EV, Kompresor, Maszyny, Warsztat",
        "ru": "Зарядка электромобиля, Компрессор, Машины, Верстак",
        "ko": "EV 충전, 압축기, 기계, 작업대",
        "ar": "شحن السيارة الكهربائية، ضاغط، آلات، طاولة عمل"
      },
      "values": [
        {
          "id": "ev charge",
          "title": {
            "en": "EV charge",
            "nl": "EV laden",
            "da": "EV opladning",
            "de": "BEV laden",
            "es": "Carga de vehículo eléctrico",
            "fr": "Charge VE",
            "it": "Ricarica EV",
            "no": "EV-lading",
            "sv": "EV-laddning",
            "pl": "Ładowanie EV",
            "ru": "Зарядка электромобиля",
            "ko": "EV 충전",
            "ar": "شحن السيارة الكهربائية"
          }
        },
        {
          "id": "compressor",
          "title": {
            "en": "Compressor",
            "nl": "Compressor",
            "da": "Kompressor",
            "de": "Kompressor",
            "es": "Compresor",
            "fr": "Compresseur",
            "it": "Compressore",
            "no": "Kompressor",
            "sv": "Kompressor",
            "pl": "Kompresor",
            "ru": "Компрессор",
            "ko": "압축기",
            "ar": "ضاغط"
          }
        },
        {
          "id": "machines",
          "title": {
            "en": "Machines",
            "nl": "Machines",
            "da": "Maskiner",
            "de": "Machines",
            "es": "Máquinas",
            "fr": "Machines",
            "it": "Macchine",
            "no": "Maskiner",
            "sv": "Maskiner",
            "pl": "Maszyny",
            "ru": "Машины",
            "ko": "기기",
            "ar": "آلات"
          }
        },
        {
          "id": "workbench",
          "title": {
            "en": "Workbench",
            "nl": "Werkbank",
            "da": "Værksted",
            "de": "Werkbank",
            "es": "Banco de trabajo",
            "fr": "Établi",
            "it": "Banco di lavoro",
            "no": "Arbeidsbenk",
            "sv": "Arbetsbänk",
            "pl": "Warsztat",
            "ru": "Верстак",
            "ko": "작업대",
            "ar": "ورشة العمل"
          }
        }
      ]
    },`;


console.log(str.substring(0,str.length-1));

return null;