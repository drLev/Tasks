Ext.define('Tasks.view.tasks.Details', {
    extend: 'Ext.Panel',

    xtype: 'detailsPanel',

    bodyPadding: 10,

    taskTplMarkup: [
        '<b>{title}</b><br/><br/>',
        '<b>Due date:</b> {dueDate}<br/>',
        '<b>Priority:</b> <span class="{priorityClass}">{priority}</span><br/><br/>',
        '<b>Assigned by:</b> {assignedBy}<br/>',
        '<b>Assigned to:</b> {assignedTo}<br/><br/>',
        '<b>State:</b> <span class="{stateClass}">{state}</span><br/>',
        '{completedAt}',
        '<b>Note:</b><br/> {note}<br/>'
    ],

    startingMarkup: 'Select a task to see details.',

    initComponent: function() {
        this.tpl = Ext.create('Ext.Template', this.taskTplMarkup);
        this.html = this.startingMarkup;

        this.callParent();
    },

    updateDetails: function(task, usersStore) { //FIXIT: is usersStore parameter neccessary?
        var tplData = Ext.clone(task.data),
            assignedBy = usersStore.getById(task.get('assignedById')),
            assignedTo = usersStore.getById(task.get('assignedToId'));

        tplData['dueDate'] = Ext.Date.format(task.get('dueDate'), 'Y-m-d');
        tplData['priorityClass'] = 'priority-'+task.get('priority');
        tplData['assignedBy'] = assignedBy ? assignedBy.get('name') : 'Unknown';
        tplData['assignedTo'] = assignedTo ? assignedTo.get('name') : 'Unknown';
        tplData['state'] = task.get('state');
        tplData['stateClass'] = 'state-'+task.get('state').replace(' ','-');
        tplData['completedAt'] = (task.get('completedAt') != null) ? '<b>Completed at:</b> '+Ext.Date.format(task.get('completedAt'), 'Y-m-d')+'<br/><br/>' : '<br/>';

        this.tpl.overwrite(this.body, tplData);
    },

    resetDetails: function() {
        this.update(this.startingMarkup);
    }
});