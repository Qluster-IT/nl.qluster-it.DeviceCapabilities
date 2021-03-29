angular.module('DeviceCapabilitiesApp', ['smart-table'])
    .controller('DeviceCapabilitiesAppController', function($scope) {
        this.messages = '';
        this.selected = {};
        //this.homey;

        this.setHomey = function(homey, scope, log) {
            this.homey = homey;
            this.log = function(s) { return log(s);}
            this.scope = scope;            
            try {
            
                this.getUserActionTime();
            } catch (error) {
                this.homey.alert('error: ' + error);
            }
            
        }
        this.getUserActionTime = function() {
            this.homey.get('useractiontime', (err, code)=> {
                try {
                    if(!err) this.scope.$apply(()=> {
                        this.useractiontime = code;                            
                    });
                } catch (error) {                        
                    this.homey.alert('error:' + error);
                }
            });
        }
        // this.saveAthomClient = function() {
        //     this.homey.set('clientid', this.clientid);
        //     this.homey.set('clientsecret', this.clientsecret);
        //     this.setAthomClient();
        // }
                        
    });
