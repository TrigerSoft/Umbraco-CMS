angular.module('umbraco.mocks').
  factory('mediaMocks', ['$httpBackend', 'mocksUtils', '$q', function ($httpBackend, mocksUtils, $q) {
      'use strict';
      
      //function returnNodeCollection(status, data, headers){
      //  var nodes = [{"properties":[{"id":348,"value":"/media/1045/windows95.jpg","alias":"umbracoFile"},{"id":349,"value":"640","alias":"umbracoWidth"},{"id":350,"value":"472","alias":"umbracoHeight"},{"id":351,"value":"53472","alias":"umbracoBytes"},{"id":352,"value":"jpg","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:08","createDate":"2013-08-27 15:50:08","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":0,"name":"windows95.jpg","id":1128,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":353,"value":"/media/1046/pete.png","alias":"umbracoFile"},{"id":354,"value":"240","alias":"umbracoWidth"},{"id":355,"value":"240","alias":"umbracoHeight"},{"id":356,"value":"87408","alias":"umbracoBytes"},{"id":357,"value":"png","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:08","createDate":"2013-08-27 15:50:08","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":1,"name":"pete.png","id":1129,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":358,"value":"/media/1047/unicorn.jpg","alias":"umbracoFile"},{"id":359,"value":"640","alias":"umbracoWidth"},{"id":360,"value":"640","alias":"umbracoHeight"},{"id":361,"value":"577380","alias":"umbracoBytes"},{"id":362,"value":"jpg","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:09","createDate":"2013-08-27 15:50:09","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":2,"name":"unicorn.jpg","id":1130,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":363,"value":"/media/1049/exploding-head.gif","alias":"umbracoFile"},{"id":364,"value":"500","alias":"umbracoWidth"},{"id":365,"value":"279","alias":"umbracoHeight"},{"id":366,"value":"451237","alias":"umbracoBytes"},{"id":367,"value":"gif","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:09","createDate":"2013-08-27 15:50:09","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":3,"name":"exploding head.gif","id":1131,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":368,"value":"/media/1048/bighead.jpg","alias":"umbracoFile"},{"id":369,"value":"1240","alias":"umbracoWidth"},{"id":370,"value":"1655","alias":"umbracoHeight"},{"id":371,"value":"836261","alias":"umbracoBytes"},{"id":372,"value":"jpg","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:09","createDate":"2013-08-27 15:50:09","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":4,"name":"bighead.jpg","id":1132,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":373,"value":"/media/1050/powerlines.jpg","alias":"umbracoFile"},{"id":374,"value":"636","alias":"umbracoWidth"},{"id":375,"value":"423","alias":"umbracoHeight"},{"id":376,"value":"79874","alias":"umbracoBytes"},{"id":377,"value":"jpg","alias":"umbracoExtension"}],"updateDate":"2013-08-27 15:50:09","createDate":"2013-08-27 15:50:09","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Image","sortOrder":5,"name":"powerlines.jpg","id":1133,"icon":"mediaPhoto.gif","parentId":1127},{"properties":[{"id":430,"value":"","alias":"contents"}],"updateDate":"2013-08-30 08:53:22","createDate":"2013-08-30 08:53:22","owner":{"id":0,"name":"admin"},"updater":null,"contentTypeAlias":"Folder","sortOrder":6,"name":"new folder","id":1146,"icon":"folder.gif","parentId":1127}];
      //  return [200, nodes, null];
      //}

      //function returnNodebyIds(status, data, headers) {
      //  var ids = mocksUtils.getParameterByName(data, "ids") || "1234,1234,4234";
      //  var items = [];
        
      //  _.each(ids, function(id){
      //    items.push(_getNode( parseInt( id, 10 )) );
      //  });

      //  return [200, items, null];
      //}

      function factTypes(input) {
          return $.ajax({
              url: mocksUtils.remoteBaseUrl + mocksUtils.devInputs + input + "/factTypes",
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

      function entryPoints(input) {
          return $.ajax({
              url: mocksUtils.remoteBaseUrl + mocksUtils.devInputs + input + "/entryPoints",
              dataType: 'json',
              type: 'GET'
          }).then(function (entryPoints) {
              var items = {};
              _.each(entryPoints, function (entryPoint) {
                  items[entryPoint] = entryPoint;
              });

              return items;
          });
      }

      function returnNodebyId(method, url, data, headers, inputType) {

          if (!mocksUtils.checkAuth()) {
              return [401, null, null];
          }

          var id = mocksUtils.getParameterByName(url, "id");

          var properties;
          if (id) {
              properties = $.ajax({
                  url: mocksUtils.remoteBaseUrl + mocksUtils.devInputs + id.replace(/_/g, '/'),
                  dataType: 'json',
                  type: 'GET'
              }).then(_.identity);
          }
          else {
              properties = $.when(null);
          }
          
          return properties.then(function(entity) {
            if (entity)
              inputType = entity.type;
            switch(inputType) {
                case "EventHub":
                return _getNode(id, entity, entryPoints(inputType), factTypes(inputType)).then(function (node) {
                    return [200, node, null];
                });
                case "TableStorage":
                return _getTableStorageNode(id, entity, entryPoints(inputType), factTypes(inputType)).then(function (node) {
                    return [200, node, null];
                });
                case "BlobStorage":
                return _getBlobStorageNode(id, entity, entryPoints(inputType), factTypes(inputType)).then(function (node) {
                    return [200, node, null];
                });
            }
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
                  path: "-1,-2,EventHub," + id,
                  tabs: [
                      {
                          label: "Event Hub Input Settings",
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
                                 label: 'Entry Point',
                                 description: "which <a target='_blank' href='google.com'>Entry Point</a> is used for this input",
                                 value: properties.entryPoint,
                                 view: "dropdown",
                                 alias: "entryPoint",
                                 config: {
                                     items: entryPoints
                                 }
                             },
                             {
                                 label: 'Event Type',
                                 description: "only types annotated with <code>@role(event)</code> are listed",
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
                  path: "-1,-2,TableStorage," + id,
                  tabs: [
                      {
                          label: "Table Storage Input Settings",
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
                                 label: 'Entry Point',
                                 description: "which <a target='_blank' href='google.com'>Entry Point</a> is used for this input",
                                 value: properties.entryPoint,
                                 view: "dropdown",
                                 alias: "entryPoint",
                                 config: {
                                     items: entryPoints
                                 }
                             },
                             {
                                 label: 'Event Type',
                                 description: "only types annotated with <code>@role(event)</code> are listed",
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
                  path: "-1,-2,BlobStorage," + id,
                  tabs: [
                      {
                          label: "Blob Storage Input Settings",
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
                                 label: 'Entry Point',
                                 description: "which <a target='_blank' href='google.com'>Entry Point</a> is used for this input",
                                 value: properties.entryPoint,
                                 view: "dropdown",
                                 alias: "entryPoint",
                                 config: {
                                     items: entryPoints
                                 }
                             },
                             {
                                 label: 'Event Type',
                                 description: "only types annotated with <code>@role(event)</code> are listed",
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
      
      function returnAllowedChildren(status, data, headers) {

          if (!mocksUtils.checkAuth()) {
              return [401, null, null];
          }

          var parentId = mocksUtils.getParameterByName(data, "contentId");

          var types;

          if (parentId === "EventHub")
              types = { name: "New Event Hub Input", description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
          else if (parentId === "TableStorage")
              types = { name: "New Table Storage Input", description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
          else if (parentId === "BlobStorage")
              types = { name: "New Blob Storage Input", description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
          return [200, [types], null];
      }
      
      function returnEmptyNode(status, data, headers) {

          if (!mocksUtils.checkAuth()) {
              return [401, null, null];
          }

          var contentTypeAlias = mocksUtils.getParameterByName(data, "contentTypeAlias");

          var getNodePromise = returnNodebyId("GET", "", null, null, contentTypeAlias);

          return getNodePromise.then(function (response) {

              var node = response[1];
              var parentId = mocksUtils.getParameterByName(data, "parentId");

              node.name = "";
              node.id = null;
              node.parentId = parentId;

              $(node.tabs).each(function (i, tab) {
                  $(tab.properties).each(function (i, property) {
                      property.value = "";
                  });
              });

              return response;
          });
      }

      return {
          register: function() {
            $httpBackend
              .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetById?'))
              .respond(returnNodebyId);

            //$httpBackend
            //  .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetByIds?'))
            //  .respond(returnNodebyIds);
                            
            //$httpBackend
            //  .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetChildren'))
            //  .respond(returnNodeCollection);
              
            $httpBackend
                  .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetEmpty'))
                  .respond(returnEmptyNode);

             $httpBackend
                  .whenGET(mocksUtils.urlRegex('/umbraco/Api/MediaType/GetAllowedChildren'))
                  .respond(returnAllowedChildren);

             $httpBackend
                .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/PostSave'))
                .respond(function (method, url, data, headers) {

                    if (!mocksUtils.checkAuth()) {
                        return [401, null, null];
                    }

                    var payLoad = angular.fromJson(data);
                    
                    var inputType = payLoad.value.parentId;

                    var create = !payLoad.value.id;

                    var entity = { name: payLoad.value.name };
                    _.each(payLoad.value.properties, function (prop) {
                        var name = prop.alias;
                        var value = prop.value;
                        switch (prop.alias) {
                            case "factType":
                                value = "";
                                break;
                            case "serializationFormat":
                                name = "format";
                                value = {
                                    format: value
                                };
                                break;
                        }
                        entity[name] = value;
                    });

                    var type = create ? "POST" : "PUT";
                    var url = mocksUtils.remoteBaseUrl + mocksUtils.devInputs;
                    url += create ? inputType : payLoad.value.id.replace(/_/g, '/');
                    
                    var ajax = {
                        url: url,
                        contentType: 'application/json',
                        type: type,
                        data: angular.toJson(entity)
                    };

                    if (create)
                        ajax.dataType = 'json';

                    return $.ajax(ajax).then(function (id) {

                        id = create ? inputType + '_' + id : payLoad.value.id;

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
                        return getNode(id, entity, entryPoints(inputType), factTypes(inputType)).then(function (node) {
                            return [200, node, null];
                        });
                    });
                });
          },
          expectGetById: function() {
            $httpBackend
              .expectGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetById'));
          },
          expectAllowedChildren: function(){
            console.log("expecting get");
            $httpBackend.expectGET(mocksUtils.urlRegex('/umbraco/Api/MediaType/GetAllowedChildren'));
          }
      };
  }]);
