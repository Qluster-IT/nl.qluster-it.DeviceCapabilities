//Arguments that are pasted
// argName, cardId

module.exports = {
    AppsInfo: {
        "nl.qluster-it.AdvancedTriggers" :{
            canCreateByName: function({argName}={}) {return argName==="name" || argName===undefined; },
            getType: function() {return "event"; }
        },
        "nl.fellownet.chronograph" :{
            canCreateByName: function({argName}={}) {return argName==="name" || argName===undefined; },
            getType: function({cardId}={}) {
                return cardId.indexOf('timer')>-1 ? "timer" :
                    cardId.indexOf('stopwatch')>-1 ? "stopwatch" : 
                    cardId.indexOf('transition')>-1 ? "transition" : undefined;
            }
        },
        "nl.bevlogenheid.countdown" :{
            canCreateByName: function({argName}={}) {return argName==="variable" || argName===undefined; },
            getType: function() {return "countdown"; },
            byToken: function() {return true; }
        },
        "net.i-dev.betterlogic" :{
            canCreateByName: function({argName}={}) {return argName==="variable" || argName===undefined; },
            getType: function({cardId}={}) {
                return cardId.indexOf('trigger')>-1 ? "trigger" :
                cardId.indexOf('expression')>-1  || cardId.indexOf('if_variable_changed')>-1  || cardId.indexOf('if_variable_set')>-1 ? "any" : 
                cardId.indexOf('boolean')>-1 ? "boolean" : 
                cardId.indexOf('number')>-1 || cardId.indexOf('_than')>-1 ? "number" : 
                cardId.indexOf('string')>-1  || cardId.indexOf('starts_with')  || cardId.indexOf('contains')>-1 ? "string" : undefined;
            },
            byToken: function() {return true; }
        }

}};
