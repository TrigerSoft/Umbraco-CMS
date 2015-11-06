angular.module('umbraco.mocks').
  factory('contentMocks', ['$httpBackend', 'mocksUtils', function ($httpBackend, mocksUtils) {
    'use strict';

    function returnChildren(status, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var pageNumber = Number(mocksUtils.getParameterByName(data, "pageNumber"));
      var filter = mocksUtils.getParameterByName(data, "filter");
      var pageSize = Number(mocksUtils.getParameterByName(data, "pageSize"));
      var parentId = Number(mocksUtils.getParameterByName(data, "id"));

      if (pageNumber === 0) {
        pageNumber = 1;
      }
      var collection = { pageSize: pageSize, totalItems: 68, totalPages: 7, pageNumber: pageNumber, filter: filter };
      collection.totalItems = 56 - (filter.length);
      if (pageSize > 0) {
        collection.totalPages = Math.round(collection.totalItems / collection.pageSize);
      }
      else {
        collection.totalPages = 1;
      }
      collection.items = [];

      if (collection.totalItems < pageSize || pageSize < 1) {
        collection.pageSize = collection.totalItems;
      } else {
        collection.pageSize = pageSize;
      }

      var id = 0;
      for (var i = 0; i < collection.pageSize; i++) {
        id = (parentId + i) * pageNumber;
        var cnt = mocksUtils.getMockContent(id);

        //here we fake filtering
        if (filter !== '') {
          cnt.name = filter + cnt.name;
        }

        //set a fake sortOrder
        cnt.sortOrder = i + 1;

        collection.items.push(cnt);
      }

      return [200, collection, null];
    }

    function returnDeletedNode(status, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      return [200, null, null];
    }

    function returnEmptyNode(method, url, data, headers) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var parentId = mocksUtils.getParameterByName(url, "parentId");
      return returnNodebyId(method, "", null).then(function (response) {
        var node = response[1];

        node.name = "";
        node.id = 0;
        node.parentId = parentId;

        $(node.tabs).each(function (i, tab) {
          $(tab.properties).each(function (i, property) {
            property.value = "";
          });
        });

        return response;
      });
    }

    function returnNodebyId(method, url, data, headers, fileType) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var id = mocksUtils.getParameterByName(url, "id");
      if (id)
        fileType = id.substring(0, id.indexOf('_'));

      var request;
      if (id) {
        request = $.ajax({
          url: mocksUtils.remoteBaseUrl + "logic/" + id.replace(/_/g, '/'),
          dataType: 'json',
          type: 'GET'
        }).then(_.identity);
      }
      else {
        request = $.when(null);
      }

      return request.then(function (file) {
        var node = mocksUtils.getMockContent(id);

        return [200, node, null];
      });
    }

    function returnNodebyIds(status, data, headers) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var ids = mocksUtils.getParameterByName(data, "ids") || [1234, 23324, 2323, 23424];
      var nodes = [];

      $(ids).each(function (i, id) {
        var _id = parseInt(id, 10);
        nodes.push(mocksUtils.getMockContent(_id));
      });

      return [200, nodes, null];
    }

    function returnSort(status, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      return [200, null, null];
    }

    function returnSave(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var payLoad = angular.fromJson(data);

      var inputType = payLoad.value.parentId;
      var create = payLoad.value.action === "saveNew";

      var logic = {
        name: payLoad.value.name || "test",
        content: payLoad.value.properties[0].value || ""
      };

      var type = create ? "POST" : "PUT";
      var remoteUrl = mocksUtils.remoteBaseUrl + 'logic/';
      remoteUrl += create ? inputType : payLoad.value.id.replace(/_/g, '/');

      var ajax = {
        url: remoteUrl,
        contentType: 'application/json',
        type: type,
        data: angular.toJson(logic)
      };

      if (create)
        ajax.dataType = 'json';

      return $.ajax(ajax).then(function (id) {

        id = create ? inputType + '_' + id : payLoad.value.id;

        var node = mocksUtils.getMockContent(id);

        return [200, node, null];
      });
    }

    return {
      register: function () {

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/PostSave'))
          .respond(returnSave);

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/PostSort'))
          .respond(returnSort);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetChildren'))
          .respond(returnChildren);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetByIds'))
          .respond(returnNodebyIds);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetById?'))
          .respond(returnNodebyId);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetEmpty'))
          .respond(returnEmptyNode);

        $httpBackend
          .whenDELETE(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/DeleteById'))
          .respond(returnDeletedNode);

        $httpBackend
          .whenDELETE(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/EmptyRecycleBin'))
          .respond(returnDeletedNode);
      },

      expectGetById: function () {
        $httpBackend
          .expectGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetById'));
      }
    };
  }]);