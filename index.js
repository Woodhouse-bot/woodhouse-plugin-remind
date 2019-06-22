'use strict';

const moment = require(`moment`);
class remind {
    constructor() {
        this.name = `remind`;
        this.displayname = `Remind`;
        this.description = `Set reminders for yourself`;
    }

    init() {
        this.registerCronHandler(`sendMessage`, (params) => {
            this.sendMessage(params.user, params.interfaceName, `Reminder to ${params.reminditem}`);
        });

        this.listen(
            `(set reminder|remind me) to (:<reminder>.+) in (:<interval>.+?) (:<time_unit>(second|minute|hour|day)[s]*)`,
            `standard`,
            (from, interfaceName, params) => {
                return this.addReminder(params.interval, params.time_unit, params.reminder, interfaceName, from);
            }
        );

        this.listen(
            `remind me in (:<interval>.+?) (:<time_unit>(second|minute|hour|day)[s]*) to (:<reminder>.+)`,
            `standard`,
            (from, interfaceName, params) => {
                return this.addReminder(params.interval, params.time_unit, params.reminder, interfaceName, from);
            }
        );

        this.listen(
            `cancel reminder (:<reminder_id>[0-9]+)`,
            `standard`,
            (from, interfaceName, params) => {
                this.removeCronJob(params.reminder_id);

                return `Reminder with ID ${params.reminder_id} removed`;
            }
        );
    }

    addReminder(timevalue, timeunit, reminditem, interfaceName, user) {
        const crontime = moment().add(timevalue, timeunit).toDate();

        return this.addCronJob(crontime, `sendMessage`, {
            reminditem,
            interfaceName,
            user
        }).then((id) => {
            return `Reminder added with ID ${id}`;
        });
    }
}

module.exports = remind;
