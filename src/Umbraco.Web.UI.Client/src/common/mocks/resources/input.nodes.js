angular.module('umbraco.mocks').
    factory('inputNodes', ['mocksUtils', function (mocksUtils) {
        'use strict';

        function factTypes(input) {
            return mocksUtils.getFactTypes().then(function (factTypes) {
                var items = {};
                _.each(factTypes, function (factType) {

                    var tableEntity = factType.annotations && factType.annotations.tableEntity;

                    switch (input) {
                        case "EventHub":
                            var role = factType.annotations && factType.annotations.role;
                            if (!role || role.toLowerCase() !== "event")
                                return;

                            break;

                        case "TableStorage":
                            if (!tableEntity)
                                return;

                            break;

                        case "BlobStorage":
                            if (tableEntity)
                                return;

                            break;
                    }

                    var fullName = mocksUtils.fullNameFromFactType(factType);
                    items[fullName] = fullName;
                });

                return items;
            });
        }

        function entryPoints(input) {
            return mocksUtils.getEntryPoints().then(function (entryPoints) {
                var items = {};
                _.each(entryPoints, function (entryPoint) {
                    items[entryPoint] = entryPoint;
                });

                return items;
            });
        }

        function _getNode(id, properties, entryPoints, factTypes) {

            return $.when(properties, entryPoints, factTypes).then(function (properties, entryPoints, factTypes) {
                if (!properties)
                    properties = {};
                var node = {
                    name: properties.name,
                    updateDate: new Date(),
                    publishDate: new Date(),
                    id: id,
                    parentId: "EventHub",
                    icon: "icon-file-alt",
                    owner: { name: "Administrator", id: 0 },
                    updater: { name: "Per Ploug Krogslund", id: 1 },
                    path: "-1," + id,
                    tabs: [
                        {
                            label: "Event Hub Input Settings",
                            alias: "tab0",
                            id: 0,
                            properties: [
                                {
                                    label: 'Connection String',
                                    info: "Click 'Connection Information' or 'View Connection String' in the Event Hub dashboard. 'Listen' permission is required.",
                                    value: properties.connectionString,
                                    view: "textbox",
                                    alias: "connectionString",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Path',
                                    description: "Name of the Event Hub",
                                    value: properties.path,
                                    view: "textbox",
                                    alias: "path",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Consumer Group',
                                    value: properties.consumerGroup,
                                    view: "textbox",
                                    alias: "consumerGroup",
                                    info: "Event Hubs limit the number of readers within one consumer group (to 5). We recommend using a separate group for each job. Leaving this field empty will use the '$Default' consumer group. Consumer groups can be created in the Event Hub settings"
                                },
                                {
                                    label: 'Entry Point',
                                    description: "which <a target='_blank' href='http://docs.jboss.org/drools/release/6.3.0.Final/drools-docs/html/ch09.html#d0e12147'>Entry Point</a> is used for this input",
                                    info: "See more info in the 'Entry Point' tab",
                                    value: properties.entryPoint,
                                    view: "dropdown",
                                    alias: "entryPoint",
                                    config: {
                                        items: entryPoints
                                    }
                                },
                                {
                                    label: 'Event Type',
                                    description: 'type of objects in this Event Hub',
                                    info: "only types annotated with <strong>@role(event)</strong> are listed",
                                    value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
                                    view: "dropdown",
                                    alias: "factType",
                                    config: {
                                        items: factTypes
                                    }
                                },
                                {
                                    label: 'Event Type Serialization Format',
                                    description: "which serialization format (JSON, CSV) you are using",
                                    value: (properties.format && properties.format.format) || "JSON",
                                    view: "dropdown",
                                    alias: "serializationFormat",
                                    config: {
                                        items: {
                                            "JSON": "JSON",
                                            "CSV": "CSV"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };

                return node;
            });
        }

        function _getTableStorageNode(id, properties, entryPoints, factTypes) {

            return $.when(properties, entryPoints, factTypes).then(function (properties, entryPoints, factTypes) {
                if (!properties)
                    properties = {};
                var node = {
                    name: properties.name,
                    updateDate: new Date(),
                    publishDate: new Date(),
                    id: id,
                    parentId: "TableStorage",
                    icon: "icon-file-alt",
                    owner: { name: "Administrator", id: 0 },
                    updater: { name: "Per Ploug Krogslund", id: 1 },
                    path: "-1," + id,
                    tabs: [
                        {
                            label: "Table Storage Input Settings",
                            alias: "tab0",
                            id: 0,
                            properties: [
                                {
                                    hideLabel: true,
                                    value: "<span class='description'>Provides reference data used for correlation and lookups. Reference data is static or slow-changing.</span>",
                                    view: "readonlyvalue"
                                },
                                {
                                    label: 'Connection String',
                                    value: properties.connectionString,
                                    view: "textbox",
                                    alias: "connectionString",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Table Name',
                                    value: properties.table,
                                    view: "textbox",
                                    alias: "table",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Entry Point',
                                    description: "which <a target='_blank' href='http://docs.jboss.org/drools/release/6.3.0.Final/drools-docs/html/ch09.html#d0e12147'>Entry Point</a> is used for this input",
                                    info: "See more info in the 'Entry Point' tab",
                                    value: properties.entryPoint,
                                    view: "dropdown",
                                    alias: "entryPoint",
                                    config: {
                                        items: entryPoints
                                    }
                                }
                            ]
                        }
                    ]
                };

                return node;
            });
        }

        function _getBlobStorageNode(id, properties, entryPoints, factTypes) {

            return $.when(properties, entryPoints, factTypes).then(function (properties, entryPoints, factTypes) {
                if (!properties)
                    properties = {};
                var node = {
                    name: properties.name,
                    updateDate: new Date(),
                    publishDate: new Date(),
                    id: id,
                    parentId: "BlobStorage",
                    icon: "icon-file-alt",
                    owner: { name: "Administrator", id: 0 },
                    updater: { name: "Per Ploug Krogslund", id: 1 },
                    path: "-1," + id,
                    tabs: [
                        {
                            label: "Blob Storage Input Settings",
                            alias: "tab0",
                            id: 0,
                            properties: [
                                {
                                    hideLabel: true,
                                    value: "<span class='description'>Provides reference data used for correlation and lookups. Reference data is static or slow-changing.</span>",
                                    view: "readonlyvalue"
                                },
                                {
                                    label: 'Connection String',
                                    value: properties.connectionString,
                                    view: "textbox",
                                    alias: "connectionString",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Container Name',
                                    description: "Blob's Container",
                                    value: properties.container,
                                    view: "textbox",
                                    alias: "container",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Path',
                                    description: "Path to the Blob within container",
                                    value: properties.path,
                                    view: "textbox",
                                    alias: "path",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Entry Point',
                                    description: "which <a target='_blank' href='http://docs.jboss.org/drools/release/6.3.0.Final/drools-docs/html/ch09.html#d0e12147'>Entry Point</a> is used for this input",
                                    info: "See more info in the 'Entry Point' tab",
                                    value: properties.entryPoint,
                                    view: "dropdown",
                                    alias: "entryPoint",
                                    config: {
                                        items: entryPoints
                                    }
                                },
                                {
                                    label: 'Blob Type',
                                    description: 'type of objects in this Blob',
                                    value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
                                    view: "dropdown",
                                    alias: "factType",
                                    config: {
                                        items: factTypes
                                    }
                                },
                                {
                                    label: 'Blob Type Serialization Format',
                                    description: "which serialization format (JSON, CSV) you are using",
                                    value: (properties.format && properties.format.format) || "JSON",
                                    view: "dropdown",
                                    alias: "serializationFormat",
                                    config: {
                                        items: {
                                            "JSON": "JSON",
                                            "CSV": "CSV"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };

                return node;
            });
        }

        return {
            getNode: function (id, entity, inputType) {
                var getNode;
                switch (inputType) {
                    case "EventHub":
                        getNode = _getNode;
                        break;

                    case "TableStorage":
                        getNode = _getTableStorageNode;
                        break;

                    case "BlobStorage":
                        getNode = _getBlobStorageNode;
                        break;
                }

                return getNode(id, $.when(entity), entryPoints(inputType), factTypes(inputType));
            }
        };

    }]);