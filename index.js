var moment = require('moment');
var remind = function(){
    this.name = 'remind';
    this.displayname = 'Remind';
    this.description = 'Set reminders for yourself';
}

remind.prototype.init = function() {
    var self = this;
    this.listen('set reminder to (.+) in (.+?) (seconds|minutes|hours|days)', 'standard', function(from, interface, params){
        var crontime = moment().add(params[1], params[2]).toDate();

        self.api.addCronJob(crontime, function(){
            self.sendMessage(params[0], interface, from);
        });
    });
}

module.exports = remind;
