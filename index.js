var moment = require('moment');
var remind = function(){
    this.name = 'remind';
    this.displayname = 'Remind';
    this.description = 'Set reminders for yourself';
}

remind.prototype.init = function() {
    var self = this;
    this.listen('(set reminder|remind me) to (:<reminder>.+) in (:<interval>.+?) (:<seconds, minutes, hours or days>(second|minute|hour|day)[s]*)', 'standard', function(from, interface, params){
        self.addReminder(params[2], params[3], params[1], interface, from);
    });

    this.listen('remind me in (:<interval>.+) (:<seconds, minutes, hours or days>(second|minute|hour|day)[s]*) to (:<reminder>.+?)', 'standard', function(from, interface, params){
        self.addReminder(params[0], params[1], params[3], interface, from);
    });

    this.listen('cancel reminder (:<reminder id>[0-9]+)', 'standard', function(from, interface, params){
        self.api.stopCronJob(params[0]);

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
