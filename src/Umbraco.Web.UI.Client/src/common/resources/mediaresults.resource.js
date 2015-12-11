function mediaResultsResource($http, $q, umbDataFormatter, umbRequestHelper) {

    function doPoll(id, callback) {
        var canceler = $q.defer();
        var stopped;
        function poll() {
            if (stopped)
                return;
            $http.get(
                umbRequestHelper.getApiUrl(
                    "mediaApiBaseUrl",
                    "GetResults",
                    [
                        { id: id }
                    ]), { timeout: canceler.promise })
                .then(function (result) {
                    var messages = result.data;
                    if (!messages || !messages.length) {
                        poll();
                        return;
                    }

                    var parsed = _.map(messages, function (m) {
                        return angular.fromJson(m);
                    });

                    var ni = parsed.indexOf(null);
                    var end = ni >= 0;
                    if (end)
                        parsed.splice(ni, 1)

                    callback(parsed);

                    if (end)
                        callback(null);
                    else
                        poll();
                });
        }

        poll();

        return function () {
            stopped = true;
            canceler.resolve();
        };
    }

    return {
        getChildren: function ($scope, eventName, parentId) {

            return doPoll(parentId, function (messages) {

                if (!messages || !messages.length) {
                    $scope.$broadcast(eventName, { pageSize: 10, totalItems: 0, totalPages: 1, includeProperties: [] });
                    return;
                }
                var collection = { pageSize: 10, items: messages, totalItems: messages.length, totalPages: 1, pageNumber: 1 };

                collection.includeProperties = _.map(_.keys(messages[0]), function (key) {
                    return {
                        alias: key,
                        header: key
                    };
                });
                $scope.$broadcast(eventName, collection);
            });
        },
        pollLog: function ($scope, eventName) {

            return doPoll("log/log", function (messages) {
                $scope.$broadcast(eventName, messages);
            });
        }
    };
}

angular.module('umbraco.resources').factory('mediaResultsResource', mediaResultsResource);