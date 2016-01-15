function runResource($q, $http, umbDataFormatter, umbRequestHelper) {
    var unitsItems = _.map(_.range(1, 33), function (value) {
        return { id: value, sortOrder: value, value: String(value) };
    });
    return {
        saveDeployContent: function (content) {
            var props = _.filter(content.tabs[0].properties, function (prop) {
                return prop.view !== 'readonlyvalue';
            });
            var data = {};
            _.each(props, function (prop) {
                var value = prop.value;
                var alias = prop.alias;
                data[alias] = value;
            });
            return umbRequestHelper.resourcePromise(
                $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Run/Params"), data),
                'Failed to save run params');
        },
        getDeployContent: function () {
            var content = {
                name: "Deployment",
                tabs: [
                    {
                        label: "Production Configuration",
                        alias: "configuration",
                        id: 0,
                        properties: [
                            {
                                hideLabel: true,
                                value: "<span class='description'>Drools Stream Analytics job can be scaled through Processing Units, which define the amount of processing power a job receives. Each Processing Unit corresponds to roughly 1 compute core.<br/>The job might be scaled up to the number of partitions in the input Event/IoT Hubs.</span>",
                                view: "readonlyvalue"
                            },
                            {
                                label: 'Processing Units',
                                value: 1,
                                view: "dropdown",
                                alias: "ProcessingUnits",
                                config: {
                                    items: unitsItems
                                },
                                validation: {
                                    mandatory: true
                                }
                            },
                            {
                                hideLabel: true,
                                value: "<span class='description'>Drools Stream Analytics jobs monitoring is based on <a target='_blank' href='https://azure.microsoft.com/en-us/services/application-insights/'>Application Insights</a>. Create a dedicated Application Insights resource for each job.</span>",
                                view: "readonlyvalue"
                            },
                            {
                                label: 'Application Insights Instrumentation Key',
                                value: null,
                                view: "textbox",
                                alias: "AIKey",
                                validation: {
                                    mandatory: true
                                }
                            }
                        ]
                    }
                ]
            };

            return umbRequestHelper.resourcePromise(
                $http.get(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Run/Params",
                        [])),
                'Failed to get run params').then(function (props) {
                    _.each(content.tabs[0].properties, function (prop) {
                        if ('alias' in prop)
                            prop.value = props[prop.alias] || prop.value;
                    });

                    return content;
                });
        },
        deploy: function (properties) {
            return $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Run/Deploy",
                        []));
        },
        start: function (properties) {
            return $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Run/Start",
                        []));
        },
        getDevContent: function () {
            var content = {
                name: "Review & Validate",
                tabs: [
                    {
                        label: "Summary",
                        alias: "summary",
                        id: 0,
                        properties: [
                            {
                                label: 'Rules',
                                value: "rules",
                                view: "readonlylistview",
                                alias: "rules",
                                config: {
                                    resource: "contentResource",
                                    entityType: "content"
                                }
                            },
                            {
                                label: 'Inputs',
                                value: "inputs",
                                view: "readonlylistview",
                                alias: "inputs",
                                config: {
                                    resource: "mediaResource",
                                    section: "inputs",
                                    entityType: "media"
                                }
                            },
                            {
                                label: 'Outputs',
                                value: "outputs",
                                view: "readonlylistview",
                                alias: "outputs",
                                config: {
                                    resource: "mediaResource",
                                    section: "outputs",
                                    entityType: "media"
                                }
                            }
                        ]
                    },
                    {
                        label: "Test",
                        alias: "test",
                        id: 1,
                        properties: [
                            {
                                label: 'Outputs',
                                value: "outputs",
                                view: "tabview",
                                alias: "outputs",
                                config: {
                                    resource: "mediaResource"
                                },
                                properties: [
                                    {
                                        hideLabel: true,
                                        value: false,
                                        view: "readonlylistview",
                                        alias: "results",
                                        config: {
                                            resource: "mediaResultsResource",
                                            poll: true
                                        }
                                    }
                                ]
                            },
                            {
                                label: 'Log',
                                value: false,
                                view: "log",
                                alias: "log",
                                config: {
                                }
                            }
                        ]
                    }
                ]
            };

            return $q.when(content);
        },
        test: function (seconds) {

            return $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Test",
                        [
                            { seconds: seconds }
                        ]));
        }
    };
}

angular.module('umbraco.resources').factory('deployResource', runResource);