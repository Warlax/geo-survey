var alertText =function text(age,zip,gender)
{
	alert(age+" "+zip+" "+gender);
}

function openDialog(callback)
{
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {
   
        Ext.regModel('User', {
            fields: [
                {name: 'age',       type: 'numeric'},
                {name: 'zip',       type: 'numeric'},
                {name: 'gender',    type: 'string'}
		]
                       
        });
        
       Ext.regModel('Gender', {
            fields: [
                {name: 'gender',     type: 'string'},
                {name: 'title',    type: 'string'}
            ]
         });
        
        var age = new Ext.form.TextField({
				name : 'age',
                        label: 'Age',
                        showClear: true
		});

	  var zip = new Ext.form.NumberField({
				name : 'zip',
				maxLength:5,
                        label: 'Zip Code'
				});
        var gender = new Ext.form.FieldSet({
				title: 'Gender',
                 	   	defaults: { xtype: 'radio' },
                 	  	 items: [
                        	{ name : 'gender', label: 'Male', inputValue : 'male' },
	                        { name : 'gender', label: 'Female' , inputValue : 'female'},	           
            	            { name : 'gender', label: 'SheMale' , inputValue : 'shemale'}
					]
			});
			
        var formBase = {
            scroll: 'vertical',
            url   : 'postUser.php',
            standardSubmit : false,
 		items: [
                {
                    xtype: 'fieldset',
                    title: 'Personal Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        required: true,
                        labelAlign: 'left'
                    },
                    items: [
				age,zip,gender
			]
		 }],
		 dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {xtype: 'spacer'},{
                            text: 'Cancel',
                            handler: function() {
                                form.hide();
                            }
                        },
                        {
                            text: 'Save',
                            ui: 'confirm',
                            handler: function() {
                                callback(age.getValue(),zip.getValue(), gender.items.get(0).getGroupValue());
								form.hide();
                            }
                        }
                    ]
                }
            ]
        };                          
                           
                 
        if (Ext.is.AndroidOS) {
            formBase.items.unshift({
                xtype: 'component',
                styleHtmlContent: true,
                html: '<span style="color: red"></span>'
            });
        }
        
        if (Ext.is.Phone) {
            formBase.fullscreen = true;
        } else {
            Ext.apply(formBase, {
                autoRender: true,
                floating: true,
                modal: true,
		    centered: true,
                hideOnMaskTap: false,
                height: 385,
                width: 480
            });
        }
        
        form = new Ext.form.FormPanel(formBase);
	  form.show();
  }
});
}

