Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

        launch: function() {
            var c = Ext.create('Ext.Container', {
                items: [
                    {
                    xtype: 'rallyprojectpicker',
                    fieldLabel: 'select project',
                        listeners:{
                            change: function(combobox){
                                if (!this.down('#u')) {
                                    this._onProjectSelected(combobox.getSelectedRecord());
                                }
                                else{
                                    if ( this.down('#g')) {
                                        console.log('grid exists');
                                        Ext.getCmp('g').destroy();
                                         console.log('grid deleted');
                                    }
                                    Ext.getCmp('u').destroy();
                                    console.log('user picker deleted');
                                    this._onProjectSelected(combobox.getSelectedRecord());
                                }
                            },
                            scope: this
                        }
                    },
                ],
            });
            this.add(c);
        },
        
        _onProjectSelected:function(record){
            var project = record.data['_ref'];
            console.log('project', project);
            
            
            var u = Ext.create('Rally.ui.combobox.UserSearchComboBox',{ //'Rally.ui.combobox.UserComboBox'
                id: 'u',
                project: project,
                fieldLabel: 'select user',
                listeners:{
                           ready: function(combobox){
                                this._onUserSelected(combobox.getRecord());
                           },
                           select: function(combobox){
                                this._onUserSelected(combobox.getRecord());
                           },
                           scope: this
                   }
            });
            this.add(u);
        },
        
        _onUserSelected:function(record){
            var user = record.data['_ref'];
            console.log('user', user);
            if(user){
		this._filters = [
   			{
   			    property: 'Owner',
			    operator: '=',
			    value: user
   			}
		];
		
		var storeConfig = 
		{
		    models: ['UserStory', 'Defect', 'TestCase', 'Task'],
		    pageSize: 200,
		    remoteSort: false,
		    limit: Infinity,
		    fetch: ['Name','FormattedID','LastUpdateDate', 'ScheduleState', 'State'],
		    filters: this._filters,
		    sorters: [
			{
			    property: 'FormattedID',
			    direction: 'ASC'
			}
			
			
		    ]
		};
		
		this._updateGrid(storeConfig);
           }
            
        },
        
        _updateGrid: function(storeConfig){
	    
	if(this._myGrid === undefined){
   		this._createGrid(storeConfig);
   	}
   	else{
		this._myGrid.store.clearFilter(true);
		this._myGrid.store.filter(this._filters)
   	}
   },
        _createGrid: function(storeConfig){
	this._myGrid = Ext.create('Rally.ui.grid.Grid', {
		storeConfig: storeConfig,
   		columnCfgs: [
   		        {text: 'ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                            tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')},
   			{text: 'Name', dataIndex: 'Name'},
			{text: 'ScheduleState', dataIndex: 'ScheduleState'},
			{text: 'State', dataIndex: 'State'},
			{text: 'LastUpdateDate', dataIndex: 'LastUpdateDate'}
   		]
   	});
   	this.add(this._myGrid);
	
   },
});