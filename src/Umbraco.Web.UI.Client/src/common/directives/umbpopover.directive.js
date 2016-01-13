/**
 * @ngdoc directive
 * @name umbraco.directives.directive:umbConfirm
 * @function
 * @description
 * A confirmation dialog
 * 
 * @restrict E
 */
function popoverDirective() {
    return {
        restrict: "A",
        link: function (scope, element, attributes) {
            element.popover({ content: attributes.content });
            scope.$on("$destroy", function () {
                element.popover('destroy');
            });
        }
    };
}
angular.module('umbraco.directives').directive("umbPopover", popoverDirective);