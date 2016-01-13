angular.module('umbraco.directives').directive('umbBindHtml', function () {
    return function (scope, element, attr) {
        scope.$watch(attr.umbBindHtml, function (value) {
            element.html(value || '');
        });
    };
});