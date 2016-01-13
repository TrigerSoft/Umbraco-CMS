/**
 * @ngdoc controller
 * @name Umbraco.Editors.Content.EditController
 * @function
 */
function RunDeployController($scope, $element, $routeParams, deployResource, notificationsService, serverValidationManager, contentEditingHelper, editorState, navigationService, formHelper, $location) {

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

            navigationService.syncTree({ tree: "run", path: ["-1", "deploy"], forceReload: false }).then(function (syncArgs) {
                $scope.currentNode = syncArgs.node;
            });
        });

    $scope.save = function () {
        if ($scope.busy)
            return;

        $scope.busy = true;

        return deployResource.saveDeployContent($scope.content).then(function () {
            formHelper.resetForm({ scope: $scope });
        }).always(function () {
            $scope.busy = false;
        });
    };

    $scope.deploy = function () {

        this.save().then(function () {

            $scope.busy = true;

            deployResource.deploy().success(function () {
                $scope.$root.$emit("JOB-STATUS", "Stopped");
                return deployResource.start().then(function () {
                    $scope.$root.$emit("JOB-STATUS", "Started");
                    $location.path("run/run/production/production");
                });
            }).error(function (failure) {
                if (!notificationsService.hasView()) {
                    var msg = { view: "deployerror", args: { message: failure } };
                    notificationsService.add(msg);
                }
            }).always(function () {
                $scope.busy = false;
            });
        });
    };
}

angular.module("umbraco").controller("Umbraco.Editors.Run.DeployController", RunDeployController);
