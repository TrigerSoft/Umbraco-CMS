function mediaResultsResource($http, umbDataFormatter, umbRequestHelper) {
    return {
        getChildren: function (parentId) {

            return umbRequestHelper.resourcePromise(
                $http.get(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "GetResults",
                        [
                            { id: parentId }
                        ])),
                'Failed to retrieve results for media item ' + parentId);
        }
    };
}

angular.module('umbraco.resources').factory('mediaResultsResource', mediaResultsResource);