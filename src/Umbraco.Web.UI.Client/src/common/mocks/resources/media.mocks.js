angular.module('umbraco.mocks').
  factory('mediaMocks', ['$httpBackend', 'mocksUtils', 'inputNodes', 'outputNodes', '$injector', function ($httpBackend, mocksUtils, inputNodes, outputNodes, $injector) {
    'use strict';

    function returnNodebyId(method, url, data, headers, inputType) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var id = mocksUtils.getParameterByName(url, "id");
      var section = $injector.get('$routeParams').section;

      var properties;
      if (id) {
        properties = $.ajax({
          url: mocksUtils.remoteBaseUrl + section + "/" + mocksUtils.idToPath(id),
          dataType: 'json',
          type: 'GET'
        }).then(_.identity);
      }
      else {
        properties = $.when(null);
      }

      return properties.then(function (entity) {
        if (entity)
          inputType = entity.type;

        if (section === 'inputs') {
          return inputNodes.getNode(id, entity, inputType).then(function (node) {
            return [200, node, null];
          });
        }

        if (section === 'outputs') {
          return outputNodes.getNode(id, entity, inputType).then(function (node) {
            return [200, node, null];
          });
        }
      });
    }

    function returnAllowedChildren(method, url, data, headers) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var parentId = mocksUtils.getParameterByName(url, "contentId");
      var section = $injector.get('$routeParams').section;
      var dir = section === 'inputs' ? 'Input' : 'Output'
      var types;

      if (parentId === "EventHub")
        types = { name: "New Event Hub " + dir, description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
      else if (parentId === "TableStorage")
        types = { name: "New Table Storage " + dir, description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
      else if (parentId === "BlobStorage")
        types = { name: "New Blob Storage " + dir, description: "", alias: parentId, id: 1, icon: "icon-user", thumbnail: "icon-user" };
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

    function returnDeletedNode(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      var id = mocksUtils.getParameterByName(url, "id");

      var section = $injector.get('$routeParams').section;

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + section + "/" + mocksUtils.idToPath(id),
        type: 'DELETE'
      }).then(function () {
        return [200, null, null];
      }, function (xhr) {
        return [xhr.status, null, null];
      });


    }
    
    function runTest(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      var seconds = mocksUtils.getParameterByName(url, "seconds");

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + "test/test?seconds=" + seconds,
        type: 'POST'
      }).then(function (testId) {
        return [200, testId, null];
      });
    }

    function returnResults(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      var id = mocksUtils.getParameterByName(url, "id");
      var runId = mocksUtils.getParameterByName(url, "runId");

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + "test/results/" + mocksUtils.idToPath(id) + "/" + runId,
        type: 'GET'
      }).then(function (messages) {
        return [200, messages, null];
      });
    }

    function returnSummary(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      var section = mocksUtils.getParameterByName(url, "id");

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + "test/summary/" + section,
        type: 'GET'
      }).then(function (messages) {
        if (!messages || !messages.length)
          return [200, { pageSize: 10, totalItems: 0, totalPages: 1, includeProperties: [] }, null];
        var collection = { pageSize: 10, items: messages, totalItems: messages.length, totalPages: 1, pageNumber: 1 };

        _.each(messages, function (m) {
          m.id = m.type + '_' + m.id;
        });

        collection.includeProperties = [
          {
            alias: "name",
            header: "Name",
            allowSorting: true,
            isEditLink: true
          },
          {
            alias: "type",
            header: "Type",
            allowSorting: true
          },
          {
            alias: "validationFailure",
            header: "Status"
          }
        ];

        return [200, collection, null];
      });
    }

    return {
      register: function () {
        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetById?'))
          .respond(returnNodebyId);

        //$httpBackend
        //  .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetByIds?'))
        //  .respond(returnNodebyIds);
                            
        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetChildren'))
          .respond(returnSummary);
          
        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetResults'))
          .respond(returnResults);
          
        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/Test'))
          .respond(runTest);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetEmpty'))
          .respond(returnEmptyNode);

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/DeleteById'))
          .respond(returnDeletedNode);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/Api/MediaType/GetAllowedChildren'))
          .respond(returnAllowedChildren);

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/PostSave'))
          .respond(function (method, url, data, headers) {

            if (!mocksUtils.checkAuth()) {
              return $.when([401, null, null]);
            }

            var payLoad = angular.fromJson(data);

            var inputType = payLoad.value.parentId;
            var section = $injector.get('$routeParams').section;

            var create = payLoad.value.action === "saveNew";

            var entity = { name: payLoad.value.name };
            _.each(payLoad.value.properties, function (prop) {
              var name = prop.alias;
              var value = prop.value;
              switch (prop.alias) {
                case "factType":
                  if (value) {
                    value = mocksUtils.fullNameToFactType(value);
                  }
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
            var url = mocksUtils.remoteBaseUrl + section + '/';
            url += create ? inputType : mocksUtils.idToPath(payLoad.value.id);

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

              if (section === 'inputs') {
                return inputNodes.getNode(id, entity, inputType).then(function (node) {
                  return [200, node, null];
                });
              }

              if (section === 'outputs') {
                return outputNodes.getNode(id, entity, inputType).then(function (node) {
                  return [200, node, null];
                });
              }
            });
          });
      },
      expectGetById: function () {
        $httpBackend
          .expectGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Media/GetById'));
      },
      expectAllowedChildren: function () {
        console.log("expecting get");
        $httpBackend.expectGET(mocksUtils.urlRegex('/umbraco/Api/MediaType/GetAllowedChildren'));
      }
    };
  }]);
