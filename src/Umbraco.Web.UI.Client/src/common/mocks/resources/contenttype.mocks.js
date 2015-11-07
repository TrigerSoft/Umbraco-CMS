angular.module('umbraco.mocks').
  factory('contentTypeMocks', ['$httpBackend', 'mocksUtils', function ($httpBackend, mocksUtils) {
    'use strict';

    function returnAllowedChildren(method, url, data, headers) {

      if (!mocksUtils.checkAuth()) {
        return [401, null, null];
      }

      var parentId = mocksUtils.getParameterByName(url, "contentId");

      var types;
      if (parentId === "models") {
        types = [
          { name: "New Empty Fact Type", description: "", alias: parentId, id: 1234, icon: "icon-user", thumbnail: "icon-user" }
        ];
      }
      else if (parentId === "rules") {
        types = [
          { name: "New Empty Rule", description: "", alias: parentId, id: 1234, icon: "icon-user", thumbnail: "icon-user" }
        ];
      }
      return [200, types, null];
    }

    return {
      register: function () {
        $httpBackend
          .whenGET(mocksUtils.urlRegex('/umbraco/Api/ContentType/GetAllowedChildren'))
          .respond(returnAllowedChildren);

      },
      expectAllowedChildren: function () {
        console.log("expecting get");
        $httpBackend.expectGET(mocksUtils.urlRegex('/umbraco/Api/ContentType/GetAllowedChildren'));
      }
    };
  }]);