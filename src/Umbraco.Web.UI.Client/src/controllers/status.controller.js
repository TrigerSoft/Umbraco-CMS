/**
 * @ngdoc controller
 * @name Umbraco.SearchController
 * @function
 * 
 * @description
 * Controls the search functionality in the site
 *  
 */
function StatusController($scope, mocksUtils) {

    $.ajax({
        url: mocksUtils.remoteBaseUrl + "job/status",
        type: 'GET'
    }).then(function (data) {
        $scope.status = data;
    });

    $scope.status = "...";

}
//register it
angular.module('umbraco').controller("Umbraco.StatusController", StatusController);