
module.exports = {
    AppsInfo: {
        "nl.qluster-it.AdvancedTriggers" :{
            canCreateByName: function({argName}) {return argName==="name"; }
        },
        "nl.fellownet.chronograph" :{
            canCreateByName: function({argName}) {return argName==="name"; }
        }
}};
