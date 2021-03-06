angular.module('umbraco.mocks').
  factory('contentMocks', ['$httpBackend', 'mocksUtils', '$rootScope', function ($httpBackend, mocksUtils, $rootScope) {
    'use strict';

    // function returnChildren(status, data, headers) {
    //   if (!mocksUtils.checkAuth()) {
    //     return [401, null, null];
    //   }

    //   var pageNumber = Number(mocksUtils.getParameterByName(data, "pageNumber"));
    //   var filter = mocksUtils.getParameterByName(data, "filter");
    //   var pageSize = Number(mocksUtils.getParameterByName(data, "pageSize"));
    //   var parentId = Number(mocksUtils.getParameterByName(data, "id"));

    //   if (pageNumber === 0) {
    //     pageNumber = 1;
    //   }
    //   var collection = { pageSize: pageSize, totalItems: 68, totalPages: 7, pageNumber: pageNumber, filter: filter };
    //   collection.totalItems = 56 - (filter.length);
    //   if (pageSize > 0) {
    //     collection.totalPages = Math.round(collection.totalItems / collection.pageSize);
    //   }
    //   else {
    //     collection.totalPages = 1;
    //   }
    //   collection.items = [];

    //   if (collection.totalItems < pageSize || pageSize < 1) {
    //     collection.pageSize = collection.totalItems;
    //   } else {
    //     collection.pageSize = pageSize;
    //   }

    //   var id = 0;
    //   for (var i = 0; i < collection.pageSize; i++) {
    //     id = (parentId + i) * pageNumber;
    //     var cnt = mocksUtils.getMockContent(id);

    //     //here we fake filtering
    //     if (filter !== '') {
    //       cnt.name = filter + cnt.name;
    //     }

    //     //set a fake sortOrder
    //     cnt.sortOrder = i + 1;

    //     collection.items.push(cnt);
    //   }

    //   return [200, collection, null];
    // }
    
    function returnSummary(status, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + "run/summary/rules",
        type: 'GET'
      }).then(function (messages) {
        if (!messages || !messages.length)
          return [200, { pageSize: 10, totalItems: 0, totalPages: 0, includeProperties: [] }, null];
        var collection = { pageSize: 10, items: messages, totalItems: messages.length, totalPages: 1, pageNumber: 1 };
        
        collection.includeProperties = [
          {
            alias: "level",
            header: "Severity",
            allowSorting: true,
            isEditLink: true
          },
          {
            alias: "text",
            header: "Message"
          }
        ];
        
        _.each(messages, function(m) {
          m.id = mocksUtils.pathToId(m.path);
        });

        return [200, collection, null];
      });
    }

    function returnDeletedNode(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
      }

      var id = mocksUtils.getParameterByName(url, "id");

      return $.ajax({
        url: mocksUtils.remoteBaseUrl + "logic/" + mocksUtils.idToPath(id),
        type: 'DELETE'
      }).then(function () {
        return [200, null, null];
      }, function (xhr) {
        return [xhr.status, null, null];
      });
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
          url: mocksUtils.remoteBaseUrl + "logic/" + mocksUtils.idToPath(id),
          dataType: 'json',
          type: 'GET'
        }).then(_.identity);
      }
      else {
        request = $.when(null);
      }

      return request.then(function (logic) {
        var node = mocksUtils.getMockContent(id, fileType);

        if (logic) {
          node.name = logic.name;
          node.tabs[0].properties[0].value = logic.content;
        }

        return [200, node, null];
      });
    }

    // function returnNodebyIds(status, data, headers) {

    //   if (!mocksUtils.checkAuth()) {
    //     return [401, null, null];
    //   }

    //   var ids = mocksUtils.getParameterByName(data, "ids") || [1234, 23324, 2323, 23424];
    //   var nodes = [];

    //   $(ids).each(function (i, id) {
    //     var _id = parseInt(id, 10);
    //     nodes.push(mocksUtils.getMockContent(_id));
    //   });

    //   return [200, nodes, null];
    // }

    // function returnSort(status, data, headers) {
    //   if (!mocksUtils.checkAuth()) {
    //     return [401, null, null];
    //   }

    //   return [200, null, null];
    // }

    function returnSave(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return $.when([401, null, null]);
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
      remoteUrl += create ? inputType : mocksUtils.idToPath(payLoad.value.id);

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

        var node = mocksUtils.getMockContent(id, inputType);

        node.name = logic.name;
        node.tabs[0].properties[0].value = logic.content;

        validate(node, true).then(function () {
          $rootScope.$apply();
        });

        return [200, node, null];
      });
    }

    function returnValidate(method, url, data, headers) {
      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var node = angular.fromJson(data).node;

      return validate(node).then(function () { return [200, node, null]; });
    }

    function validate(node, saved) {
      var type = saved ? "GET" : "POST";
      var path = mocksUtils.idToPath(node.id || "NEW");
      var remoteUrl = mocksUtils.remoteBaseUrl + 'run/compile?path=' + path;

      var ajax = {
        url: remoteUrl,
        contentType: 'application/json',
        type: type
      };

      var tab = node.tabs[0];
      var property = tab.properties[0];

      if (!saved) {
        ajax.data = angular.toJson(property.value);
        ajax.dataType = 'json';
      }

      tab.validationMessages = {};
      property.validationMessages = [];

      var handleMessages = function (messages) {
        messages = messages || [];

        tab.validationMessages.all = _.groupBy(messages, "level");

        messages = _.filter(messages, function (message) {
          return message.path === path;
        });

        tab.validationMessages.current = _.groupBy(messages, "level");
        Array.prototype.push.apply(property.validationMessages, messages);
      };

      return $.ajax(ajax).then(saved ? function (compilation) {
        handleMessages(compilation.messages);
        mocksUtils.reportCompilation(compilation);
      } : handleMessages);
    }

    return {
      register: function () {

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/PostSave'))
          .respond(returnSave);

        $httpBackend
          .whenPOST(mocksUtils.urlRegex("/umbraco/UmbracoApi/Content/PostValidate"))
          .respond(returnValidate);

        // $httpBackend
        //   .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/PostSort'))
        //   .respond(returnSort);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetChildren'))
          .respond(returnSummary);

        // $httpBackend
        //   .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetByIds'))
        //   .respond(returnNodebyIds);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetById?'))
          .respond(returnNodebyId);

        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetEmpty'))
          .respond(returnEmptyNode);

        $httpBackend
          .whenPOST(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/DeleteById'))
          .respond(returnDeletedNode);

        // $httpBackend
        //   .whenDELETE(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/EmptyRecycleBin'))
        //   .respond(returnDeletedNode);
      },

      expectGetById: function () {
        $httpBackend
          .expectGET(mocksUtils.urlRegex('/umbraco/UmbracoApi/Content/GetById'));
      }
    };
  }]);