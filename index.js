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

        var id = self.api.addCronJob(crontime, function(){
            self.sendMessage(params[0], interface, from);
        });

        self.sendMessage('Reminder added with ID ' + id, interface, from);
    });

    this.listen('cancel reminder ([0-9]+)', 'standard', function(from, interface, params){
        self.api.stopCronJob(params[0]);

        self.sendMessage('Reminder with ID ' + params[0] + ' removed', interface, from);
    });
}

module.exports = remind;
