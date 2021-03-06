angular.module('umbraco.mocks').
    factory('treeMocks', ['$httpBackend', 'mocksUtils', function ($httpBackend, mocksUtils) {
        'use strict';

        function getDeleteMenuItems() {

            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var menu = [
                // { name: "Create", cssclass: "plus", alias: "create", metaData: {} },

                { /*seperator: true,*/ name: "Delete", cssclass: "remove", alias: "delete", metaData: {} }//,
                // { name: "Move", cssclass: "move", alias: "move", metaData: {} },
                // { name: "Copy", cssclass: "copy", alias: "copy", metaData: {} },
                // { name: "Sort", cssclass: "sort", alias: "sort", metaData: {} },

                // { seperator: true, name: "Publish", cssclass: "globe", alias: "publish", metaData: {} },
                // { name: "Rollback", cssclass: "undo", alias: "rollback", metaData: {} },

                // { seperator: true, name: "Permissions", cssclass: "lock", alias: "permissions", metaData: {} },
                // { name: "Audit Trail", cssclass: "time", alias: "audittrail", metaData: {} },
                // { name: "Notifications", cssclass: "envelope", alias: "notifications", metaData: {} },

                // { seperator: true, name: "Hostnames", cssclass: "home", alias: "hostnames", metaData: {} },
                // { name: "Public Access", cssclass: "group", alias: "publicaccess", metaData: {} },

                // { seperator: true, name: "Reload", cssclass: "refresh", alias: "users", metaData: {} },
          
                //   { seperator: true, name: "Empty Recycle Bin", cssclass: "trash", alias: "emptyrecyclebin", metaData: {} }
            ];

            var result = {
                menuItems: menu,
                defaultAlias: "delete"
            };

            return [200, result, null];
        }

        function getCreateMenuItems() {

            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var menu = [
                { name: "Create", cssclass: "plus", alias: "create", metaData: {} }
            ];

            var result = {
                menuItems: menu,
                defaultAlias: "create"
            };

            return [200, result, null];
        }

        function getIO(dir) {

            var menuUrl = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetLeafMenu";

            return $.ajax({
                url: mocksUtils.remoteBaseUrl + dir,
                dataType: 'json',
                type: 'GET'
            }).then(function (items) {
                var children = _.map(items, function (item) {
                    return {
                        id: item.type + '_' + item.id,
                        name: item.name,
                        icon: dir === "inputs" ? "icon-window-popin" : "icon-out",
                        detail: item.type.replace(/[A-Z]/g, function (capital) {
                            return " " + capital;
                        }),
                        children: [],
                        expanded: false,
                        hasChildren: false,
                        level: 1,
                        menuUrl: menuUrl
                    };
                });

                children.sort(function (a, b) {
                    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                });

                return children;
            });
        }

        function returnChildren(status, data, headers) {

            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var id = mocksUtils.getParameterByName(data, "id");
            var section = mocksUtils.getParameterByName(data, "treeType");
            var level = mocksUtils.getParameterByName(data, "level") + 1;

            var url = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetChildren?treeType=" + section + "&id=1234&level=" + level;
            var menuUrl = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetMenu?treeType=" + section + "&id=1234&parentId=456";
          
            //hack to have create as default content action
            var action;
            if (section === "content") {
                action = "create";
            }

            var children = [
                { name: "child-of-" + section, childNodesUrl: url, id: level + "" + 1234, icon: "icon-document", children: [], expanded: false, hasChildren: true, level: level, menuUrl: menuUrl },
                { name: "random-name-" + section, childNodesUrl: url, id: level + "" + 1235, icon: "icon-document", children: [], expanded: false, hasChildren: true, level: level, menuUrl: menuUrl },
                { name: "random-name-" + section, childNodesUrl: url, id: level + "" + 1236, icon: "icon-document", children: [], expanded: false, hasChildren: true, level: level, menuUrl: menuUrl },
                { name: "random-name-" + section, childNodesUrl: url, id: level + "" + 1237, icon: "icon-document", routePath: "common/legacy/1237?p=" + encodeURI("developer/contentType.aspx?idequal1234"), children: [], expanded: false, hasChildren: true, level: level, menuUrl: menuUrl }
            ];

            return [200, children, null];
        }

        function returnDataTypes(status, data, headers) {
            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var children = [
                { name: "Textstring", childNodesUrl: null, id: 10, icon: "icon-document", children: [], expanded: false, hasChildren: false, level: 1, menuUrl: null, metaData: { treeAlias: "datatype" } },
                { name: "Multiple textstring", childNodesUrl: null, id: 11, icon: "icon-document", children: [], expanded: false, hasChildren: false, level: 1, menuUrl: null, metaData: { treeAlias: "datatype" } },
                { name: "Yes/No", childNodesUrl: null, id: 12, icon: "icon-document", children: [], expanded: false, hasChildren: false, level: 1, menuUrl: null, metaData: { treeAlias: "datatype" } },
                { name: "Rich Text Editor", childNodesUrl: null, id: 13, icon: "icon-document", children: [], expanded: false, hasChildren: false, level: 1, menuUrl: null, metaData: { treeAlias: "datatype" } }
            ];

            return [200, children, null];
        }

        function returnDataTypeMenu(status, data, headers) {
            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var menu = [
                {
                    name: "Create", cssclass: "plus", alias: "create", metaData: {
                        jsAction: "umbracoMenuActions.CreateChildEntity"
                    }
                },
                { seperator: true, name: "Reload", cssclass: "refresh", alias: "users", metaData: {} }
            ];

            return [200, menu, null];
        }

        function returnApplicationTrees(status, data, headers) {

            if (!mocksUtils.checkAuth()) {
                return $.when([401, null, null]);
            }

            var section = mocksUtils.getParameterByName(data, "application");
            var url = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetChildren?treeType=" + section + "&id=1234&level=1";
            var menuUrl = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetContainerMenu?treeType=" + section + "&id=1234&parentId=456";
            var t;
            switch (section) {

                case "content":
                    t = {
                        name: "logics",
                        id: -1,
                        children: [
                            { name: "Fact Types", childNodesUrl: "/debug/logic/models", id: "models", parentId: -1, icon: "icon-folder-close1", isContainer: true, children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl },
                            { name: "Rules", childNodesUrl: "/debug/logic/rules", id: "rules", parentId: -1, icon: "icon-folder-close1", isContainer: true, children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl }
                        ],
                        expanded: true,
                        hasChildren: true,
                        level: 0,
                        menuUrl: menuUrl,
                        metaData: { treeAlias: "content" }
                    };

                    break;
                case "inputs":
                    t = getIO("inputs").then(function (children) {

                        return {
                            name: "inputs",
                            childNodesUrl: "/debug/inputs",
                            id: -1,
                            children: children,
                            expanded: true,
                            hasChildren: true,
                            level: 0,
                            menuUrl: menuUrl,
                            metaData: { treeAlias: "media" }
                        };
                    });

                    break;
                case "outputs":
                    t = getIO("outputs").then(function (children) {

                        return {
                            name: "outputs",
                            childNodesUrl: "/debug/outputs",
                            id: -1,
                            children: children,
                            expanded: true,
                            hasChildren: true,
                            level: 0,
                            menuUrl: menuUrl,
                            metaData: { treeAlias: "media" }
                        };
                    });

                    break;
                case "run":
                    t = {
                        name: "run",
                        id: -1,
                        children: [
                            { name: "Test", id: "test", icon: "icon-check", class: "color-green", children: [], expanded: false, hasChildren: false, level: 1 },
                            { name: "Deploy", id: "deploy", icon: "icon-rocket", class: "color-yellow", children: [], expanded: false, hasChildren: false, level: 1, routePath: "run/run/deploy/deploy" },
                            { name: "Production", id: "production", icon: "icon-light-up", class: "color-orange", children: [], expanded: false, hasChildren: false, level: 1, routePath: "run/run/production/production" }
                        ],
                        expanded: true,
                        hasChildren: true,
                        level: 0,
                        metaData: { treeAlias: "run" }
                    };

                    break;
                case "developer":

                    var dataTypeChildrenUrl = "/umbraco/UmbracoTrees/DataTypeTree/GetNodes?id=-1&application=developer";
                    var dataTypeMenuUrl = "/umbraco/UmbracoTrees/DataTypeTree/GetMenu?id=-1&application=developer";

                    t = {
                        name: "developer",
                        id: -1,
                        children: [
                            { name: "Data types", childNodesUrl: dataTypeChildrenUrl, id: -1, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: dataTypeMenuUrl, metaData: { treeAlias: "datatype" } },
                            { name: "Macros", childNodesUrl: url, id: -1, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl, metaData: { treeAlias: "macros" } },
                            { name: "Packages", childNodesUrl: url, id: -1, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl, metaData: { treeAlias: "packager" } },
                            { name: "XSLT Files", childNodesUrl: url, id: -1, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl, metaData: { treeAlias: "xslt" } },
                            { name: "Partial View Macros", childNodesUrl: url, id: -1, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl, metaData: { treeAlias: "partialViewMacros" } }
                        ],
                        expanded: true,
                        hasChildren: true,
                        level: 0,
                        isContainer: true
                    };

                    break;
                default:

                    t = {
                        name: "randomTree",
                        id: -1,
                        children: [
                            { name: "random-name-" + section, childNodesUrl: url, id: 1234, icon: "icon-home", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl },
                            { name: "random-name-" + section, childNodesUrl: url, id: 1235, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl },
                            { name: "random-name-" + section, childNodesUrl: url, id: 1236, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl },
                            { name: "random-name-" + section, childNodesUrl: url, id: 1237, icon: "icon-folder-close", children: [], expanded: false, hasChildren: true, level: 1, menuUrl: menuUrl }
                        ],
                        expanded: true,
                        hasChildren: true,
                        level: 0,
                        menuUrl: menuUrl,
                        metaData: { treeAlias: "randomTree" }
                    };

                    break;
            }

            return $.when(t).then(function (x) { return [200, x, null] });
        }


        return {
            register: function () {

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/ApplicationTreeApi/GetApplicationTrees'))
                    .respond(returnApplicationTrees);

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/ApplicationTreeApi/GetChildren'))
                    .respond(returnChildren);

                _.each(["models", "rules"], function (logicType) {

                    $httpBackend
                        .whenGET(mocksUtils.urlRegex('/debug/logic/' + logicType))
                        .respond(function () {

                            var menuUrl = "/umbraco/UmbracoTrees/ApplicationTreeApi/GetLeafMenu";

                            return $.ajax({
                                url: mocksUtils.remoteBaseUrl + "logic/" + logicType,
                                dataType: 'json',
                                type: 'GET'
                            }).then(function (items) {
                                var children = _.map(items, function (item) {
                                    return {
                                        id: logicType + '_' + item.id,
                                        name: item.name,
                                        icon: "icon-document",
                                        children: [],
                                        expanded: false,
                                        hasChildren: false,
                                        level: 2,
                                        menuUrl: menuUrl
                                    };
                                });

                                children.sort(function (a, b) {
                                    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                                });

                                return [200, children, null];
                            });
                        });
                });

                _.each(["inputs", "outputs"], function (dir) {

                    $httpBackend
                        .whenGET(mocksUtils.urlRegex('/debug/' + dir))
                        .respond(function () {

                            return getIO(dir).then(function (children) {
                                return [200, children, null];
                            });
                        });
                });

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/DataTypeTree/GetNodes'))
                    .respond(returnDataTypes);

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/DataTypeTree/GetMenu'))
                    .respond(returnDataTypeMenu);

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/ApplicationTreeApi/GetLeafMenu'))
                    .respond(getDeleteMenuItems);

                $httpBackend
                    .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoTrees/ApplicationTreeApi/GetContainerMenu'))
                    .respond(getCreateMenuItems);

            }
        };
    }]);