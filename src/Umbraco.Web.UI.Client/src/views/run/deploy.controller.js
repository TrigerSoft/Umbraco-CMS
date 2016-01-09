/**
 * @ngdoc controller
 * @name Umbraco.Editors.Content.EditController
 * @function
 */
function RunDeployController($scope, $element, $routeParams, deployResource, notificationsService, serverValidationManager, contentEditingHelper, editorState) {

    function init(content) {
        editorState.set($scope.content);

    }

    deployResource.getDeployContent($routeParams.id)
        .then(function (data) {
            $scope.loaded = true;
            $scope.content = data;

            init($scope.content);

            //in one particular special case, after we've created a new item we redirect back to the edit
            // route but there might be server validation errors in the collection which we need to display
            // after the redirect, so we will bind all subscriptions which will show the server validation errors
            // if there are any and then clear them so the collection no longer persists them.
            serverValidationManager.executeAndClearAllSubscriptions();

        });

    $scope.deploy = function () {

        if ($scope.busy)
            return;

        $scope.busy = true;

        deployResource.deploy().then(function (runId) {
 
        }).always(function () {
            $scope.busy = false;
        });
    };
}

angular.module("umbraco").controller("Umbraco.Editors.Run.DeployController", RunDeployController);
