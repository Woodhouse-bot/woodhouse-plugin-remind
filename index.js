var moment = require('moment');
var remind = function(){
    this.name = 'remind';
    this.displayname = 'Remind';
    this.description = 'Set reminders for yourself';
}

remind.prototype.init = function() {
    var self = this;
    this.listen('(set reminder|remind me) to (.+) in (.+?) (seconds|minutes|hours|days)', 'standard', function(from, interface, params){
        self.addReminder(params[2], params[3], params[1], interface, from);
    });

    this.listen('remind me in (.+) (seconds|minutes|hours|days) to (.+?)', 'standard', function(from, interface, params){
        self.addReminder(params[0], params[1], params[2], interface, from);
    });

    this.listen('cancel reminder ([0-9]+)', 'standard', function(from, interface, params){
        self.api.stopCronJob(params[1]);

        self.sendMessage('Reminder with ID ' + params[1] + ' removed', interface, from);
    })


}

remind.prototype.addReminder = function(timevalue, timeunit, reminditem, interface, from) {
    var self = this;
    var crontime = moment().add(timevalue, timeunit).toDate();

    var id = this.api.addCronJob(crontime, function(){
        self.sendMessage('Reminder to ' + reminditem, interface, from);
    });

    this.sendMessage('Reminder added with ID ' + id, interface, from);
}

module.exports = remind;
