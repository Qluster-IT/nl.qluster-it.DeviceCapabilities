let arr = ['booleanShowAs', 'buttonShowAs1', 'buttonShowAsRest', 'numberShowAs', 'textShowAs', 'listShowAs', 'deviceClasses', 'listPrefixedLists'];
for (let i = 0; i < arr.length; i++)
  avd_settings[arr[i]] = _.sortBy(avd_settings[arr[i]], function (x) { return x.order + '.' + x.uiComponent + x.label; });


