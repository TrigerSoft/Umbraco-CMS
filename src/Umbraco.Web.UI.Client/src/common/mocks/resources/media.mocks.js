angular.module('umbraco.mocks').
  factory('mediaMocks', ['$httpBackend', 'mocksUtils', 'inputNodes', 'outputNodes', '$injector', function ($httpBackend, mocksUtils, inputNodes, outputNodes, $injector) {
    'use strict';

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

      return properties.then(function (entity) {
        if (entity)
          inputType = entity.type;

        var section = $injector.get('$routeParams').section;
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
      register: function () {
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

              var section = $injector.get('$routeParams').section;
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
