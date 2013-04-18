Ext.application({
    name: 'Sencha',

    launch: function() {
    
    
    /*
Ext.define('Contact', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['firstName', 'lastName']
    }
});

var store = Ext.create('Ext.data.Store', {
   model: 'Contact',
   sorters: 'lastName',

   grouper: {
       groupFn: function(record) {
           return record.get('lastName')[0];
       }
   },

   data: [
       { firstName: 'Tommy',   lastName: 'Maintz'  },
       { firstName: 'Rob',     lastName: 'Dougan'  },
       { firstName: 'Ed',      lastName: 'Spencer' },
       { firstName: 'Jamie',   lastName: 'Avins'   },
       { firstName: 'Aaron',   lastName: 'Conran'  },
       { firstName: 'Dave',    lastName: 'Kaneda'  },
       { firstName: 'Jacky',   lastName: 'Nguyen'  },
       { firstName: 'Abraham', lastName: 'Elias'   },
       { firstName: 'Jay',     lastName: 'Robinson'},
       { firstName: 'Nigel',   lastName: 'White'   },
       { firstName: 'Don',     lastName: 'Griffin' },
       { firstName: 'Nico',    lastName: 'Ferrero' },
       { firstName: 'Nicolas', lastName: 'Belmonte'},
       { firstName: 'Mohmmad',   lastName: 'Manzoor'},
       { firstName: 'Manzoor',   lastName: 'Alam'},
       { firstName: 'Shahrukh',   lastName: 'Khan'},
       { firstName: 'Sunny',   lastName: 'Deol'},
   ]
});

var xs = Ext.create('Ext.List', {
    fullscreen: true,
    itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
    store: store,
    grouped: true
});
*/
        //The whole app UI lives in this tab panel
        Ext.Viewport.add({
            xtype: 'tabpanel',
            fullscreen: true,
            tabBarPosition: 'bottom',
            autoMaximize: true,

            items: [
            // This is the home page, just some simple html
                {
                title: 'Home',
                iconCls: 'home',
                cls: 'home',
                html: [
                        '<img height=260 src="http://staging.sencha.com/img/sencha.png" />',
                        '<h1>Welcome to Sencha Touch</h1>',
                        "<p>Building the Getting Started app</p>",
                        '<h2>Sencha Touch (2.0.0)</h2>'
                    ].join("")
            },

            // This is the recent blogs page. It uses a tree store to load its data from blog.json
                {
                xtype: 'nestedlist',
                title: 'Blog',
                iconCls: 'star',
                cls: 'blog',
                displayField: 'title',

                store: {
                    type: 'tree',
                    fields: ['title', 'link', 'author', 'contentSnippet', 'content', {
                        name: 'leaf',
                        defaultValue: true}],
                        root: {
                            leaf: false
                        },
                        proxy: {
                            type: 'jsonp',
                            url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                            reader: {
                                type: 'json',
                                rootProperty: 'responseData.feed.entries'
                            }
                        }
                    },
                    detailCard: {
                        xtype: 'panel',
                        scrollable: true,
                        styleHtmlContent: true
                    },

                    listeners: {
                        itemtap: function(nestedList, list, index, element, post) {
                            this.getDetailCard().setHtml(post.get('content'));
                        }
                    }
                },

            // This is the contact page, which features a form and a button. The button submits the form
                {
                xtype: 'formpanel',
                title: 'Contact Us',
                iconCls: 'user',
                url: 'contact.php',
                layout: 'vbox',
                

                items: [
                        {
                            xtype: 'fieldset',
                            title: 'Contact Us',
                            instructions: 'Email address is optional',

                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Name',
                                    name: 'name'
                                },
                                {
                                    xtype: 'emailfield',
                                    label: 'Email',
                                    name: 'email'
                                },
                                {
                                    xtype: 'textareafield',
                                    label: 'Message',
                                    name: 'message',
                                    height: 90
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Send',
                            ui: 'confirm',

                            // The handler is called when the button is tapped
                            handler: function() {

                                // This looks up the items stack above, getting a reference to the first form it see
                                var form = this.up('formpanel');
                                Ext.Msg.alert('Your form has been submited');
                                // Sends an AJAX request with the form data to the url specified above (contact.php).
                                // The success callback is called if we get a non-error response from the server
                                //                                form.submit({
                                //                                    success: function() {
                                //                                        // The callback function is run when the user taps the 'ok' button
                                //                                        Ext.Msg.alert('Thank You', 'Your message has been received', function() {
                                //                                            form.reset();
                                //                                        });
                                //                                    }
                                //                                });
                            }
                        }
                    ]
            },
            {
                xtype: 'formpanel',
                title: 'Application',
                iconCls: 'organize',
                items:
            [
            {
                xtype: 'button',
                text: 'Hello India',
                html: '<marquee>India is best</marquee>',
                handler: function() {
                    Ext.Msg.alert("Alerts!", "Welcome to India", function() { Ext.Msg.alert("Nested Click") });
                }

            },
           {
               xtype: 'fieldset',
               title: 'Contact Us',
               instructions: 'Email address is optional',
               items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Name',
                                    name: 'name'
                                },
                                {
                                    xtype: 'emailfield',
                                    label: 'Email',
                                    name: 'email'
                                },
                                {
                                    xtype: 'textareafield',
                                    label: 'Message',
                                    name: 'message',
                                    height: 90
                                }
                            ]
           },
           {
               xtype: 'button',
               text: 'Submit',
               ui: 'confirm',
               handler: function() {

                   // This looks up the items stack above, getting a reference to the first form it see
                   //var form = this.up('formpanel');
                   Ext.Msg.alert('Your form has been submited');
                   Ext.Ajax.request({
                       url: 'Default.aspx',
                       success: function(response) {
                           var text = response.responseText;
                           Ext.Msg.alert(text);
                       }
                   });
               }
           }
            ]
            },
       {
           xtype: 'nestedlist',
           text: 'Store',
           iconCls: 'locate',
           title: 'Stores',
           items: [
           {
           type: 'tree',
                    fields: ['firstName', 'lastName', {
                        name: 'leaf',
                        defaultValue: true}],
                        root: {
                            leaf: false
                        },
                        proxy: {
                            type: 'ajax',
                            url: 'Default.aspx',
                            reader: {
                                type: 'ajax',
                                rootProperty: 'responseData.feed.entries'
                            }
                        }
                    }
           
           ],
           detailCard: {
               xtype: 'panel',
               scrollable: true,
               styleHtmlContent: true
           },

//           listeners: {
//               itemtap: function(nestedList, list, index, element, post) {
//                   this.getDetailCard().setHtml(post.get('content'));
//               }
//           }
           
       }

            ]
        });
    }


});



