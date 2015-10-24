angular.module('umbraco.mocks').
	factory('outputNodes', ['mocksUtils', function (mocksUtils) {
		'use strict';

		function factTypes(input) {
			return $.ajax({
				url: mocksUtils.remoteBaseUrl + 'outputs/' + input + "/factTypes",
				dataType: 'json',
				type: 'GET'
			}).then(function (factTypes) {
				var items = {};
				_.each(factTypes, function (factType) {
					var fullName = fullNameFromFactType(factType);
					items[fullName] = fullName;
				});

				return items;
			});
		}

		function fullNameFromFactType(factType) {
			return factType.packageName + '.' + factType.typeName;
		}

		function fullNameToFactType(fullName) {
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
					path: "-1,-2,EventHub," + id,
					tabs: [
						{
							label: "Event Hub Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
								{
									label: 'Connection String',
									description: "Click 'View Connection String' in the Event Hub dashboard. 'Listen' permission is required.",
									value: properties.connectionString,
									view: "textbox",
									alias: "connectionString"
								},
								{
									label: 'Consumer Group',
									description: "Event Hubs limit the number of readers within one consumer group (to 5). We recommend using a separate group for each job. Leaving this field empty will use the '$Default' consumer group.",
									value: properties.consumerGroup,
									view: "textbox",
									alias: "consumerGroup"
								},
								{
									label: 'Type',
									description: "when an instance of this type is inserted, it will be sent to the Event Hub",
									value: properties.factType && fullNameFromFactType(properties.factType),
									view: "dropdown",
									alias: "factType",
									config: {
										items: factTypes
									}
								},
								{
									label: 'Event Type Serialization Format',
									description: "which serialization format (JSON, CSV) you are using",
									value: properties.format && properties.format.format,
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
					path: "-1,-2,TableStorage," + id,
					tabs: [
						{
							label: "Table Storage Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
								{
									label: 'Connection String',
									description: "Click 'View Connection String' in the Event Hub dashboard. 'Listen' permission is required.",
									value: properties.connectionString,
									view: "textbox",
									alias: "connectionString"
								},
								{
									label: 'Table Name',
									description: "Table Name.",
									value: properties.table,
									view: "textbox",
									alias: "table"
								},
								{
									label: 'Type',
									description: "when an instance of this type is inserted, it will be upserted to the Table",
									value: properties.factType && fullNameFromFactType(properties.factType),
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
					path: "-1,-2,BlobStorage," + id,
					tabs: [
						{
							label: "Blob Storage Output Settings",
							alias: "tab0",
							id: 0,
							properties: [
								{
									label: 'Connection String',
									description: "Click 'View Connection String' in the Event Hub dashboard. 'Listen' permission is required.",
									value: properties.connectionString,
									view: "textbox",
									alias: "connectionString"
								},
								{
									label: 'Container Name',
									description: "Blob's Container.",
									value: properties.container,
									view: "textbox",
									alias: "container"
								},
								{
									label: 'Path',
									description: "Path to the Blob within container.",
									value: properties.path,
									view: "textbox",
									alias: "path"
								},
								{
									label: 'Type',
									description: "when an instance of this type is inserted, it will be appended to the Blob",
									value: properties.factType && fullNameFromFactType(properties.factType),
									view: "dropdown",
									alias: "factType",
									config: {
										items: factTypes
									}
								},
								{
									label: 'Event Type Serialization Format',
									description: "which serialization format (JSON, CSV) you are using",
									value: properties.format && properties.format.format,
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

				return getNode(id, entity, factTypes(inputType));
			}
		};

	}]);