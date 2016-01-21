function readOnlyListViewController($scope, $injector) {

    var createEditUrlCallback = function (item) {
        var link = "/" + $scope.section + "/" + $scope.entityType + "/edit/" + item.id + "?page=" + $scope.options.pageNumber;
        if ($scope.options.editParam)
            link += "&" + $scope.options.editParam;

        return link;
    };

    //check the config for the entity type, or the current section name (since the config is only set in c#, not in pre-vals)
    var config = $scope.model.config;
    $scope.entityType = config.entityType;
    $scope.section = config.section || $scope.entityType;
    var contentResource = $injector.get(config.resource);

    $scope.pagination = [];
    $scope.actionInProgress = false;

    $scope.options = {
        pageSize: $scope.model.config.pageSize || 10,
        pageNumber: 0,
        filter: '',
        orderBy: ($scope.model.config.orderBy || 'VersionDate').trim(),
        orderDirection: ($scope.model.config.orderDirection || "desc").trim()
    };

    $scope.isSortDirection = function (col, direction) {
        return $scope.options.orderBy.toUpperCase() == col.toUpperCase() && $scope.options.orderDirection == direction;
    }

    $scope.next = function () {
        if ($scope.options.pageNumber < $scope.listViewResultSet.totalPages - 1) {
            $scope.options.pageNumber++;
            prepareCurrentPage();
        }
    };

    $scope.goToPage = function (pageNumber) {
        $scope.options.pageNumber = pageNumber;
        prepareCurrentPage();
    };

    $scope.sort = function (field, allow) {
        if (allow) {
            $scope.options.orderBy = field;

            var mult = 1;

            if ($scope.options.orderDirection === "desc") {
                $scope.options.orderDirection = "asc";
            }
            else {
                $scope.options.orderDirection = "desc";
                mult = -1;
            }

            $scope.listViewResultSet.items.sort(function (l, r) {

                var lv = l[field];
                var rv = r[field];

                if (lv < rv)
                    return -1 * mult;

                if (lv > rv)
                    return mult;

                return 0;
            });
        }
    };

    $scope.prev = function () {
        if ($scope.options.pageNumber) {
            $scope.options.pageNumber--;
            prepareCurrentPage();
        }
    };

    function prepareCurrentPage() {
        if ($scope.listViewResultSet.totalPages > 1) {
            var start = $scope.listViewResultSet.pageSize * $scope.options.pageNumber;
            $scope.listViewResultSet.items = $scope.listViewResultSet.allItems.slice(start, start + $scope.listViewResultSet.pageSize);
        }
        else {
            $scope.listViewResultSet.items = $scope.listViewResultSet.allItems;
        }
    }
    

    /*Loads the search results, based on parameters set in prev,next,sort and so on*/
    /*Pagination is done by an array of objects, due angularJS's funky way of monitoring state
    with simple values */
    function handleResult(data) {

        $scope.actionInProgress = false;
            
        //update all values for display
        if (data.items) {
            _.each(data.items, function (e, index) {
                setPropertyValues(e);
            });
        }
        else
            data.items = [];

        if ($scope.listViewResultSet) {
            data.items.push.apply($scope.listViewResultSet.allItems, data.items);
        }
        else {
            data.allItems = data.items;
            $scope.listViewResultSet = data;
            $scope.options.includeProperties = data.includeProperties;
            $scope.options.editParam = data.editParam;
        }

        $scope.listViewResultSet.totalItems = $scope.listViewResultSet.allItems.length;
        $scope.listViewResultSet.totalPages = Math.ceil($scope.listViewResultSet.totalItems / $scope.listViewResultSet.pageSize);  

        //NOTE: This might occur if we are requesting a higher page number than what is actually available, for example
        // if you have more than one page and you delete all items on the last page. In this case, we need to reset to the last
        // available page and then re-load again
            
 
        //list 10 pages as per normal
        if ($scope.listViewResultSet.totalPages <= 10) {
            for (var i = $scope.pagination.length; i < $scope.listViewResultSet.totalPages; i++) {
                $scope.pagination.push({
                    val: i
                });
            }
        }
        else {
            //if there is more than 10 pages, we need to do some fancy bits
            $scope.moreResults = true;
 
            //get the max index to start
            // var maxIndex = $scope.listViewResultSet.totalPages - 10;
            // //set the start, but it can't be below zero
            // var start = Math.max($scope.options.pageNumber - 5, 0);
            // //ensure that it's not too far either
            // start = Math.min(maxIndex, start);
 
            // for (var i = start; i < (10 + start); i++) {
            //     $scope.pagination.push({
            //         val: (i + 1),
            //         isActive: $scope.options.pageNumber == (i + 1)
            //     });
            // }
 
            // //now, if the start is greater than 0 then '1' will not be displayed, so do the elipses thing
            // if (start > 0) {
            //     $scope.pagination.unshift({ name: "First", val: 1, isActive: false }, { val: "...", isActive: false });
            // }
 
            // //same for the end
            // if (start < maxIndex) {
            //     $scope.pagination.push({ val: "...", isActive: false }, { name: "Last", val: $scope.listViewResultSet.totalPages, isActive: false });
            // }
        }

        prepareCurrentPage();
    };

    $scope.reloadView = function (id) {

        $scope.actionInProgress = true;
        contentResource.getChildren(id, $scope.options).then(handleResult);
    };

    /** This ensures that the correct value is set for each item in a row, we don't want to call a function during interpolation or ng-bind as performance is really bad that way */
    function setPropertyValues(result) {

        //set the edit url
        result.editPath = createEditUrlCallback(result);
    };

    function isDate(val) {
        if (angular.isString(val)) {
            return val.match(/^(\d{4})\-(\d{2})\-(\d{2})\ (\d{2})\:(\d{2})\:(\d{2})$/);
        }
        return false;
    };

    var unsubscribe;

    function poll(runId) {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
        if (runId) {
            $scope.listViewResultSet = null;
            $scope.pagination = [];
            unsubscribe = contentResource.pollChildren($scope, "add-results", config.contentId, runId)
        }
    }

    function initView(id) {
        $scope.contentId = id;
        if (config.poll) {
            $scope.$on("add-results", function (e, entries) {
                // console.log("got logs:" + entries);
                if (!entries) {
                    return;
                }

                handleResult(entries);
            });

            $scope.$watch("model.value", poll);
            $scope.$on("$destroy", poll.bind(this, false));
        }
        else
            $scope.reloadView($scope.contentId);
    };

    //GO!
    initView($scope.model.value);
}


angular.module("umbraco").controller("Umbraco.PropertyEditors.ReadOnlyListViewController", readOnlyListViewController);