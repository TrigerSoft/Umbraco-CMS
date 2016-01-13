//used for the media picker dialog
angular.module("umbraco").controller("Umbraco.Notifications.DeployErrorController",
	function ($scope, $location, $log, notificationsService) {	

		$scope.close = function(not){
			notificationsService.remove(not);
		};
        
        $scope.link = function(target, not){
			notificationsService.remove(not);
            $location.path(target);
		};

	});