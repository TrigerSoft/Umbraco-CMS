angular.module('umbraco.mocks').
    factory('mocksUtils', ['$cookieStore', function($cookieStore) {
        'use strict';
         
        //by default we will perform authorization
        var doAuth = true;
        var _compilation = null;
        var remoteBaseUrl = "http://localhost:39245/configuration/dev/";
        
        var compile = function() {
            return $.ajax({
                    url: remoteBaseUrl + 'test/compile',
                    contentType: 'application/json',
                    type: "GET"
                }).then(mocksUtils.reportCompilation);
        }

        var mocksUtils = {
            remoteBaseUrl: remoteBaseUrl,
            idToPath: function(id) { return id.replace(/_/g, '/'); },
            pathToId: function(path) { return path.replace(/\//g, '_'); },
            fullNameFromFactType: function (factType) {
                return factType.packageName + '.' + factType.typeName;
            },

            fullNameToFactType: function (fullName) {
                var lastDot = fullName.lastIndexOf('.');
                var packageName = null;
                var typeName = fullName;
                if (lastDot >= 0) {
                    packageName = fullName.substr(0, lastDot);
                    typeName = fullName.substr(lastDot + 1);
                }
                return {
                    packageName: packageName,
                    typeName: typeName
                };
            },
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
            
            reportCompilation: function(compilation) {
                _compilation = compilation;  
            },
            
            getFactTypes: function() {
              return _compilation ? $.when(_compilation.factTypes) : compile().
                then(function() { return _compilation.factTypes; });  
            },
            
            getEntryPoints: function() {
              return _compilation ? $.when(_compilation.entryPoints) : compile().
                then(function() { return _compilation.entryPoints; });  
            },

            /** Creats a mock content object */
            getMockContent: function(id, fileType) {
                var node = {
                    name: null,
                    // updateDate: new Date(),
                    // publishDate: new Date(),
                    // createDate: new Date(),
                    id: id,
                    parentId: fileType,
                    icon: "icon-umb-content",
                    owner: { name: "Administrator", id: 0 },
                    updater: { name: "Per Ploug Krogslund", id: 1 },
                    path: "-1,-2," + fileType + "," + id,
                    // allowedActions: ["U", "H", "A"],
                    tabs: [
                    
                    {
                        label: "Edit",
                        id: 0,
                        properties: [
                            { alias: "code", hideLabel: true, view: "code" }
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
        
        return mocksUtils;
    }]);
