Ext.define('Tasks.controller.Views', {
    extend: 'Ext.app.Controller',

    models: [
        'Task',
        'User',
        'View'
    ],

    stores: [
        'Tasks',
        'Users',
        'Views'
    ],

    views: [
        'views.Grid'
    ],

    refs: [
        {
            ref: 'viewsGrid',
            selector: 'viewsGrid'
        }
    ],

    init: function() {
        this.control(
            {
                'viewsGrid': {
                    select: this.filterTasksGrid
                }
            }
        );
    },

    filterTasksGrid: function(rowModel, record, index, eOpts) {
        var tasksStore = this.getTasksStore(),
            now = Ext.Date.clearTime(new Date());

        tasksStore.clearFilter();

        switch (record.get('view').toLowerCase()) {
            case 'not started':
                tasksStore.filter('state', 'assigned');
                break;
            case 'in progress':
                tasksStore.filter('state', 'in progress');
                break;
            case 'completed':
                tasksStore.filter('state', 'completed');
                break;
            case 'future':
                tasksStore.filter({
                    filterFn: function(item) {
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        if (dueDate != null)
                        {
                            return (Ext.Date.clearTime(dueDate) > now && state != 'completed');
                        }

                        return false;
                    }
                });
                break;
            case 'overdue':
                tasksStore.filter({
                    filterFn: function(item) {
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        if (dueDate != null)
                        {
                            return (Ext.Date.clearTime(dueDate) < now && state != 'completed');
                        }

                        return false;
                    }
                });
                break;
            case 'this week':
                tasksStore.filter({
                    filterFn: function(item) {
                        //TODO: temporary solution +7 days - fix it!
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        if (dueDate != null)
                        {
                            return (Ext.Date.clearTime(dueDate) < Ext.Date.add(now, Ext.Date.DAY, 7)  && state != 'completed');
                        }

                        return false;
                    }
                });
                break;
            case 'today':
                tasksStore.filter({
                    filterFn: function(item) {
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        if (dueDate != null)
                        {
                            return (Ext.Date.clearTime(dueDate).getTime() === now.getTime() && state != 'completed');
                        }

                        return false;
                    }
                });
                break;
            case 'tomorrow':
                tasksStore.filter({
                    filterFn: function(item) {
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        if (dueDate != null)
                        {
                            return (Ext.Date.clearTime(dueDate).getTime() === Ext.Date.add(now, Ext.Date.DAY, 1).getTime() && state != 'completed');
                        }

                        return false;
                    }
                });
                break;
            case 'without': //without due date
                tasksStore.filter({
                    filterFn: function(item) {
                        var dueDate = item.get('dueDate'),
                            state = item.get('state');

                        return (dueDate == null && state != 'completed');
                    }
                });
                break;
        }
    }
});