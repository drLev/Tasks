Ext.define('Tasks.view.tasks.Grid', {
    extend: 'Ext.grid.Panel',

    xtype: 'tasksGrid',

    requires: [
        'Tasks.ux.CheckColumn'
    ],

    multiSelect: true,

    enableColumnHide: false,
    enableColumnResize: false,

    model: 'Task',
    store: 'Tasks',

    initComponent: function() {
        this.columns = {
            items: [
                this.buildCheckColumn(),
                this.buildPriorityColumn(),
                this.buildTitleColumn(),
                this.buildDueDateColumn(),
                this.buildEditTaskColumn(),
                this.buildDeleteTaskColumn()
            ]
        };

        this.dockedItems = [
            this.buildCreateTaskForm()
        ],

        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                listeners: {
                    edit: Ext.bind(this.onCellEdit, this)
                }
            })
        ];

        this.callParent();

        this.addEvents(
            'onTaskStateChange',
            'onPriorityIconClick',
            'onEditIconClick',
            'onDeleteIconClick'
        );
    },

    buildCheckColumn: function() {
        return {
            xtype: 'checkcolumn',
            dataIndex: 'done',
            width: 24,
            sortable: false,
            align: 'center',
            cls: 'column-header-icon tasks-done-column-header',
            listeners: {
                'checkchange': Ext.bind(this.onTaskStateChange, this)
            }
        }
    },

    buildTitleColumn: function() {
        return {
            header: 'Title',
            dataIndex: 'title',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        };
    },

    buildDueDateColumn: function() {
        return {
            xtype: 'datecolumn',
            header: 'Due Date',
            dataIndex: 'dueDate',
            format: 'Y-m-d',
            editor: {
                xtype: 'datefield',
                format: 'Y-m-d',
                emptyText: 'Y-m-d',
                allowBlank: false
            }
        };
    },

    buildPriorityColumn: function() {
        return {
            xtype: 'actioncolumn',
            dataIndex: 'priority',
            width: 24,
            sortable: false,
            align: 'center',
            cls: 'column-header-icon priority-icon',
            handler: Ext.bind(this.onPriorityIconClick, this),
            getClass: this.getPriorityColumnClass
        };
    },

    buildEditTaskColumn: function() {
        return {
            xtype: 'actioncolumn',
            width: 24,
            sortable: false,
            align: 'center',
            cls: 'column-header-icon edit-task-icon',
            iconCls: 'x-hidden can-be-hidden edit-task-icon'
        };
    },

    buildDeleteTaskColumn: function() {
        return {
            xtype: 'actioncolumn',
            width: 24,
            sortable: false,
            align: 'center',
            cls: 'column-header-icon delete-icon',
            iconCls: 'x-hidden can-be-hidden delete-icon'
        };
    },

    buildCreateTaskForm: function() {
        return {
            xtype: 'createForm',
            dock: 'top',
            //weight: 101,
            bodyStyle: {
                'background-color': '#E4E5E7'
            }
        };
    },

    onCellEdit: function(editor, e) {
        this.fireEvent('onRecordEdit', e.record);
    },

    onTaskStateChange: function(column, rowIndex, checked) {
        this.fireEvent('onRecordEdit', this.store.getAt(rowIndex));
    },

    onPriorityIconClick: function(gridView, rowIndex, colIndex, column, e) {
        this.fireEvent('onPriorityIconClick', gridView, rowIndex, colIndex, column, e);
    },

    getPriorityColumnClass: function(v, metaData, record) {
        var priority = record.data['priority'].toLowerCase();

        return 'priority-' + priority + '-icon';
    }
});