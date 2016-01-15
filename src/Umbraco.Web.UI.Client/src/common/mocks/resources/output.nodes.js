angular.module('umbraco.mocks').
	factory('outputNodes', ['mocksUtils', function (mocksUtils) {
		'use strict';

		function factTypes(input) {
			return mocksUtils.getFactTypes().then(function (factTypes) {
				var items = {};
				_.each(factTypes, function (factType) {
					
					var tableEntity = factType.annotations && factType.annotations.tableEntity;
					
					switch (input) {
								
						case "TableStorage":
							if (!tableEntity)
								return;
								
							break;
								
						case "EventHub":
						case "BlobStorage":
                        case "ServiceBus":
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

		function _getNode(id, properties, factTypes) {

			return $.when(properties, factTypes).then(function (properties, factTypes) {
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
							label: "Event Hub Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
								{
                                    label: 'Connection String',
                                    info: "Click 'Connection Information' or 'View Connection String' in the Event Hub dashboard. 'Send' permission is required.",
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
                                    label: 'Fact Type',
                                    description: 'type of objects to send to this Event Hub',
                                    info: "<strong>insertLogical</strong> or <strong>insert</strong> an object of this type will send it to the Event Hub",
                                    value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
                                    view: "dropdown",
                                    alias: "factType",
                                    config: {
                                        items: factTypes
                                    }
                                },
                                {
                                    label: 'Fact Type Serialization Format',
                                    description: "which serialization format (JSON, CSV) to use",
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
        
        function _getServiceBusNode(id, properties, factTypes) {

			return $.when(properties, factTypes).then(function (properties, factTypes) {
				if (!properties)
					properties = {};
				var node = {
					name: properties.name,
					updateDate: new Date(),
					publishDate: new Date(),
					id: id,
					parentId: "ServiceBus",
					icon: "icon-file-alt",
					owner: { name: "Administrator", id: 0 },
					updater: { name: "Per Ploug Krogslund", id: 1 },
					path: "-1," + id,
					tabs: [
						{
							label: "Service Bus Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
								{
                                    label: 'Connection String',
                                    info: "Click 'Connection Information' or 'View Connection String' in the Service Bus dashboard. 'Send' permission is required.",
                                    value: properties.connectionString,
                                    view: "textbox",
                                    alias: "connectionString",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Path',
                                    description: "Name of the Queue or Topic",
                                    value: properties.path,
                                    view: "textbox",
                                    alias: "path",
                                    validation: {
                                        mandatory: true
                                    }
                                },
                                {
                                    label: 'Fact Type',
                                    description: 'type of objects to send to this Service Bus',
                                    info: "<strong>insertLogical</strong> or <strong>insert</strong> an object of this type will send it to the Service Bus",
                                    value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
                                    view: "dropdown",
                                    alias: "factType",
                                    config: {
                                        items: factTypes
                                    }
                                },
                                {
                                    label: 'Fact Type Serialization Format',
                                    description: "which serialization format (JSON, CSV) to use",
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

		function _getTableStorageNode(id, properties, factTypes) {

			return $.when(properties, factTypes).then(function (properties, factTypes) {
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
							label: "Table Storage Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
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
									label: 'Fact Type',
									description: 'type of objects to upsert to this Table',
                                    info: "<strong>insertLogical</strong> or <strong>insert</strong> an object of this type will <em>upsert</em> it to the Table",
									value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
									view: "dropdown",
									alias: "factType",
									config: {
										items: factTypes
									}
								}
							]
						}
					]
				};

				return node;
			});
		}

		function _getBlobStorageNode(id, properties, factTypes) {

			return $.when(properties, factTypes).then(function (properties, factTypes) {
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
							label: "Blob Storage Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
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
                                    label: 'Fact Type',
                                    description: 'type of objects to append to this Blob',
                                    info: "<strong>insertLogical</strong> or <strong>insert</strong> of this type of object in the rule will append it to the Blob. Objects are line separated",
                                    value: properties.factType && mocksUtils.fullNameFromFactType(properties.factType),
                                    view: "dropdown",
                                    alias: "factType",
                                    config: {
                                        items: factTypes
                                    }
                                },
                                {
                                    label: 'Fact Type Serialization Format',
                                    description: "which serialization format (JSON, CSV) to use",
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
                        
                    case "ServiceBus":
						getNode = _getServiceBusNode;
						break;
				}

				return getNode(id, $.when(entity), factTypes(inputType));
			}
		};

	}]);