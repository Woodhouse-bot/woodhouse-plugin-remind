var moment = require('moment');
var remind = function(){
    this.name = 'remind';
    this.displayname = 'Remind';
    this.description = 'Set reminders for yourself';
}

remind.prototype.init = function() {
    var self = this;
    this.listen('(set reminder|remind me) to (.+) in (.+?) (seconds|minutes|hours|days)', 'standard', function(from, interface, params){
        var crontime = moment().add(params[2], params[3]).toDate();

        var id = self.api.addCronJob(crontime, function(){
            self.sendMessage(params[1], interface, from);
        });

        self.sendMessage('Reminder added with ID ' + id, interface, from);
    });

    this.listen('cancel reminder ([0-9]+)', 'standard', function(from, interface, params){
        self.api.stopCronJob(params[1]);

        self.sendMessage('Reminder with ID ' + params[1] + ' removed', interface, from);
    });
}

module.exports = remind;
