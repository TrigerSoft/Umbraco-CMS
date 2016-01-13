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
        $scope.$root.status = data;
    });

    $scope.$root.status = "...";
    
    $scope.$root.$on("JOB-STATUS", function(e, status) {
        $scope.$root.status = status;
    });

}
//register it
angular.module('umbraco').controller("Umbraco.StatusController", StatusController);