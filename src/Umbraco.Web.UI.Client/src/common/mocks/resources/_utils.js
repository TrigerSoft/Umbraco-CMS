angular.module('umbraco.mocks').
    factory('mocksUtils', ['$cookieStore', function($cookieStore) {
        'use strict';
         
        //by default we will perform authorization
        var doAuth = true;

        return {
            remoteBaseUrl: "http://localhost:39245/configuration/dev/",
            getMockDataType: function(id, selectedId) {
                var dataType = {
                    id: id,
                    name: "Simple editor " + id,
                    selectedEditor: selectedId,
                    availableEditors: [
                        { name: "Simple editor 1", editorId: String.CreateGuid() },
                        { name: "Simple editor 2", editorId: String.CreateGuid() },
                        { name: "Simple editor " + id, editorId: selectedId },
                        { name: "Simple editor 4", editorId: String.CreateGuid() },
                        { name: "Simple editor 5", editorId: String.CreateGuid() },
                        { name: "Simple editor 6", editorId: String.CreateGuid() }
                    ],
                    preValues: [
                          {
                              label: "Custom pre value 1 for editor " + selectedId,
                              description: "Enter a value for this pre-value",
                              key: "myPreVal1",
                              view: "requiredfield"                              
                          },
                            {
                                label: "Custom pre value 2 for editor " + selectedId,
                                description: "Enter a value for this pre-value",
                                key: "myPreVal2",
                                view: "requiredfield"                                
                            }
                    ]

                };
                return dataType;
            },

            /** Creats a mock content object */
            getMockContent: function(id) {
                var node = {
                    name: "My content with id: " + id,
                    updateDate: new Date().toIsoDateTimeString(),
                    publishDate: new Date().toIsoDateTimeString(),
                    createDate: new Date().toIsoDateTimeString(),
                    id: id,
                    parentId: 1234,
                    icon: "icon-umb-content",
                    owner: { name: "Administrator", id: 0 },
                    updater: { name: "Per Ploug Krogslund", id: 1 },
                    path: "-1,1234,2455",
                    allowedActions: ["U", "H", "A"],
                    tabs: [
                    
                    {
                        label: "Sample Editor",
                        id: 3,
                        properties: [
                            { alias: "tags", hideLabel: true, view: "code", value: '' }
                        ]
                    }
                   
                    ]
                };

                return node;
            },

            getMockEntity : function(id){
                return {name: "hello", id: id, icon: "icon-file"};
            },

            /** generally used for unit tests, calling this will disable the auth check and always return true */
            disableAuth: function() {
                doAuth = false;
            },

            /** generally used for unit tests, calling this will enabled the auth check */
            enabledAuth: function() {
                doAuth = true;
            }, 

            /** Checks for our mock auth cookie, if it's not there, returns false */
            checkAuth: function () {
                if (doAuth) {
                    // var mockAuthCookie = $cookieStore.get("mockAuthCookie");
                    // if (!mockAuthCookie) {
                    //     return false;
                    // }
                    return true;
                }
                else {
                    return true;
                }
            },
            
            /** Creates/sets the auth cookie with a value indicating the user is now authenticated */
            setAuth: function() {
                //set the cookie for loging
                $cookieStore.put("mockAuthCookie", "Logged in!");
            },
            
            /** removes the auth cookie  */
            clearAuth: function() {
                $cookieStore.remove("mockAuthCookie");
            },

            urlRegex: function(url) {
                url = url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                return new RegExp("^" + url);
            },

            getParameterByName: function(url, name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(url);

                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            },

            getParametersByName: function(url, name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

                var regex = new RegExp(name + "=([^&#]*)", "mg"), results = [];
                var match;

                while ( ( match = regex.exec(url) ) !== null )
                {
                    results.push(decodeURIComponent(match[1].replace(/\+/g, " ")));
                }

                return results;
            }
        };
    }]);
