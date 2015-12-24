function mediaResultsResource($http, $q, umbDataFormatter, umbRequestHelper) {

    function doPoll(id, runId, callback) {
        var canceler = $q.defer();
        var stopped;
        function poll() {
            if (stopped)
                return;
            // console.log("poll:" + id);
            $http.get(
                umbRequestHelper.getApiUrl(
                    "mediaApiBaseUrl",
                    "GetResults",
                    [
                        { id: id }, { runId: runId }
                    ]), { timeout: canceler.promise })
                .then(function (result) {
                    // console.log("poll returned:" + id);
                    var messages = result.data;
                    if (!messages || !messages.length) {
                        poll();
                        return;
                    }

                    var parsed = _.map(messages, function (m) {

                        var removed = m && (m[0] === '-');
                        if (removed)
                            m = m.substr(1);
                        var x = angular.fromJson(m);
                        if (removed)
                            x._removed_ = true;
                        return x;
                    });

                    var ni = parsed.indexOf(null);
                    var end = ni >= 0;
                    if (end) {
                        // console.log("end:" + id);
                        console.log(messages);
                        parsed.splice(ni, 1)
                    }

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
        pollChildren: function ($scope, eventName, parentId, runId) {

            return doPoll(parentId, runId, function (messages) {

                if (!messages || !messages.length) {
                    $scope.$broadcast(eventName, null);
                    return;
                }
                var collection = { pageSize: 10, pageNumber: 1, items: messages };

                collection.includeProperties = _.map(_.keys(messages[0]), function (key) {
                    return {
                        alias: key,
                        header: key
                    };
                });

                $scope.$broadcast(eventName, collection);
            });
        },
        pollLog: function ($scope, eventName, runId) {

            return doPoll("log/log", runId, function (messages) {
                $scope.$broadcast(eventName, messages);
            });
        }
    };
}

angular.module('umbraco.resources').factory('mediaResultsResource', mediaResultsResource);