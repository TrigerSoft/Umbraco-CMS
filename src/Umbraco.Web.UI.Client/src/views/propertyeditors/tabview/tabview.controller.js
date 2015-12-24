function tabViewController($scope, $element, $timeout, $injector) {
    var config = $scope.model.config;
    var contentResource = $injector.get(config.resource);
    var getListResultsCallback = contentResource.getChildren;

    getListResultsCallback($scope.model.value, $scope.options).then(function (data) {
        var tabs = data.items;
        $scope.tabs = _.map(tabs, function (tab, index) {
            var properties = _.map($scope.model.properties, function (prop) {
                prop = _.clone(prop);
                prop.config.contentId = tab.id;
                return prop;
            });
            return {
                label: tab.name,
                alias: "tab" + tab.id,
                id: tab.id,
                properties: properties
            };
        });

        $scope.$on("set-value", function (e, value) {
            _.each($scope.tabs, function (tab) {
                _.each(tab.properties, function (p) {
                    p.value = value;
                });
            });
        });
        
        //we need to do a timeout here so that the current sync operation can complete
        // and update the UI, then this will fire and the UI elements will be available.
        $timeout(function () {

            //use bootstrap tabs API to show the first one
            $element.find(".nav-tabs a:first").tab('show');

            //enable the tab drop
           // $element.find('.nav-pills, .nav-tabs').tabdrop();

            //ensure to destroy tabdrop (unbinds window resize listeners)
            //$scope.$on('$destroy', function () {
            //    $element.find('.nav-pills, .nav-tabs').tabdrop("destroy");
            //});

        }, 200, false);
    });
}


angular.module("umbraco").controller("Umbraco.PropertyEditors.TabViewController", tabViewController);