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
    var getListResultsCallback = contentResource.getChildren;

    $scope.pagination = [];
    $scope.actionInProgress = false;
    $scope.listViewResultSet = {
        totalPages: 0,
        items: []
    };

    $scope.options = {
        pageSize: $scope.model.config.pageSize || 10,
        pageNumber: 1,
        filter: '',
        orderBy: ($scope.model.config.orderBy || 'VersionDate').trim(),
        orderDirection: ($scope.model.config.orderDirection || "desc").trim()
    };

    $scope.isSortDirection = function (col, direction) {
        return $scope.options.orderBy.toUpperCase() == col.toUpperCase() && $scope.options.orderDirection == direction;
    }

    $scope.next = function () {
        if ($scope.options.pageNumber < $scope.listViewResultSet.totalPages) {
            $scope.options.pageNumber++;
            $scope.reloadView($scope.contentId);
        }
    };

    $scope.goToPage = function (pageNumber) {
        $scope.options.pageNumber = pageNumber + 1;
        $scope.reloadView($scope.contentId);
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

            //$scope.reloadView($scope.contentId);
        }
    };

    $scope.prev = function () {
        if ($scope.options.pageNumber > 1) {
            $scope.options.pageNumber--;
            $scope.reloadView($scope.contentId);
            //TODO: this would be nice but causes the whole view to reload
            //$location.search("page", $scope.options.pageNumber);
        }
    };
    

    /*Loads the search results, based on parameters set in prev,next,sort and so on*/
    /*Pagination is done by an array of objects, due angularJS's funky way of monitoring state
    with simple values */

    $scope.reloadView = function (id) {
        $scope.actionInProgress = true;
        getListResultsCallback(id, $scope.options).then(function (data) {

            $scope.actionInProgress = false;

            $scope.listViewResultSet = data;
            $scope.options.includeProperties = data.includeProperties;
            $scope.options.editParam = data.editParam;

            //update all values for display
            if ($scope.listViewResultSet.items) {
                _.each($scope.listViewResultSet.items, function (e, index) {
                    setPropertyValues(e);
                });
            }

            //NOTE: This might occur if we are requesting a higher page number than what is actually available, for example
            // if you have more than one page and you delete all items on the last page. In this case, we need to reset to the last
            // available page and then re-load again
            if ($scope.options.pageNumber > $scope.listViewResultSet.totalPages) {
                $scope.options.pageNumber = $scope.listViewResultSet.totalPages;

                //reload!
                $scope.reloadView(id);
            }

            $scope.pagination = [];

            //list 10 pages as per normal
            if ($scope.listViewResultSet.totalPages <= 10) {
                for (var i = 0; i < $scope.listViewResultSet.totalPages; i++) {
                    $scope.pagination.push({
                        val: (i + 1),
                        isActive: $scope.options.pageNumber == (i + 1)
                    });
                }
            }
            else {
                //if there is more than 10 pages, we need to do some fancy bits

                //get the max index to start
                var maxIndex = $scope.listViewResultSet.totalPages - 10;
                //set the start, but it can't be below zero
                var start = Math.max($scope.options.pageNumber - 5, 0);
                //ensure that it's not too far either
                start = Math.min(maxIndex, start);

                for (var i = start; i < (10 + start); i++) {
                    $scope.pagination.push({
                        val: (i + 1),
                        isActive: $scope.options.pageNumber == (i + 1)
                    });
                }

                //now, if the start is greater than 0 then '1' will not be displayed, so do the elipses thing
                if (start > 0) {
                    $scope.pagination.unshift({ name: "First", val: 1, isActive: false }, { val: "...", isActive: false });
                }

                //same for the end
                if (start < maxIndex) {
                    $scope.pagination.push({ val: "...", isActive: false }, { name: "Last", val: $scope.listViewResultSet.totalPages, isActive: false });
                }
            }

        });
    };

    $scope.$watch(function () {
        return $scope.options.filter;
    }, _.debounce(function (newVal, oldVal) {
        $scope.$apply(function () {
            if (newVal !== null && newVal !== undefined && newVal !== oldVal) {
                $scope.options.pageNumber = 1;
                $scope.reloadView($scope.contentId);
            }
        });
    }, 200));

   

    // function getCustomPropertyValue(alias, properties) {
    //     var value = '';
    //     var index = 0;
    //     var foundAlias = false;
    //     for (var i = 0; i < properties.length; i++) {
    //         if (properties[i].alias == alias) {
    //             foundAlias = true;
    //             break;
    //         }
    //         index++;
    //     }

    //     if (foundAlias) {
    //         value = properties[index].value;
    //     }

    //     return value;
    // };

    /** This ensures that the correct value is set for each item in a row, we don't want to call a function during interpolation or ng-bind as performance is really bad that way */
    function setPropertyValues(result) {

        //set the edit url
        result.editPath = createEditUrlCallback(result);

        // _.each($scope.options.includeProperties, function (e, i) {

        //     var alias = e.alias;

        //     // First try to pull the value directly from the alias (e.g. updatedBy)        
        //     var value = result[alias];
            
        //     // If this returns an object, look for the name property of that (e.g. owner.name)
        //     if (value === Object(value)) {
        //         value = value['name'];
        //     }

        //     // If we've got nothing yet, look at a user defined property
        //     if (typeof value === 'undefined') {
        //         value = getCustomPropertyValue(alias, result.properties);
        //     }

        //     // If we have a date, format it
        //     if (isDate(value)) {
        //         value = value.substring(0, value.length - 3);
        //     }

        //     // set what we've got on the result
        //     result[alias] = value;
        // });


    };

    function isDate(val) {
        if (angular.isString(val)) {
            return val.match(/^(\d{4})\-(\d{2})\-(\d{2})\ (\d{2})\:(\d{2})\:(\d{2})$/);
        }
        return false;
    };

    function initView(id) {
        $scope.contentId = id;
        $scope.reloadView($scope.contentId);
    };

    //GO!
    initView($scope.model.value);
}


angular.module("umbraco").controller("Umbraco.PropertyEditors.ReadOnlyListViewController", readOnlyListViewController);