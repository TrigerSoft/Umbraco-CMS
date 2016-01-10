angular.module('umbraco.mocks').
    factory('contentTypeMocks', ['$httpBackend', 'mocksUtils', function ($httpBackend, mocksUtils) {
        'use strict';

        var allTypes = [
            { name: "New Empty Fact Type", description: "", parentId: "models", alias: "models", id: 1234, icon: "icon-document-dashed-line", thumbnail: "icon-document-dashed-line" },
            { name: "New Empty Rule", description: "", parentId: "rules", alias: "rules", id: 1234, icon: "icon-document-dashed-line", thumbnail: "icon-document-dashed-line" }
        ];

        function returnAllowedChildren(method, url, data, headers) {

            if (!mocksUtils.checkAuth()) {
                return [401, null, null];
            }

            var parentId = mocksUtils.getParameterByName(url, "contentId");

            var types = _.filter(allTypes, function (type) {
                return type.parentId === parentId;
            });
            
            if (!types.length)
                types = allTypes;
            
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