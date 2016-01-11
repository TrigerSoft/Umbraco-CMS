/**
 * @ngdoc controller
 * @name Umbraco.Editors.Content.EditController
 * @function
 */
function TestEditController($scope, $element, $routeParams, deployResource, notificationsService, serverValidationManager, contentEditingHelper, editorState, navigationService) {

    function init(content) {
        editorState.set($scope.content);

    }

    deployResource.getDevContent($routeParams.id)
        .then(function (data) {
            $scope.loaded = true;
            $scope.content = data;

            init($scope.content);

            //in one particular special case, after we've created a new item we redirect back to the edit
            // route but there might be server validation errors in the collection which we need to display
            // after the redirect, so we will bind all subscriptions which will show the server validation errors
            // if there are any and then clear them so the collection no longer persists them.
            serverValidationManager.executeAndClearAllSubscriptions();

            navigationService.syncTree({ tree: "run", path: ["-1", "test"], forceReload: false }).then(function (syncArgs) {
                $scope.currentNode = syncArgs.node;
            });
        });
    
    $scope.$on("end-logging", function (e) {
        e.stopPropagation();
        startStop(false);
    });

    function startStop(value) {
        $scope.$broadcast("set-value", value);
    }

    $scope.test = function () {

        if ($scope.busy)
            return;

        $scope.busy = true;

        deployResource.test(10).then(function (runId) {
            //use bootstrap tabs API to show the tab
            $element.find(".nav-tabs a[href='#tab1']").tab('show');
            startStop(runId);
        }).always(function () {
            $scope.busy = false;
        });
    };

    $scope.stopTest = function () {
        startStop(false);
    };
}

angular.module("umbraco").controller("Umbraco.Editors.Run.TestController", TestEditController);
