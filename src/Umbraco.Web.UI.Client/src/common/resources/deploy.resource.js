function deployResource($q, $http, umbDataFormatter, umbRequestHelper) {
    return {
        getDeployContent: function () {
            var unitsRange = _.range(1, 24);
            var unitsItems = {};
            _.each(unitsRange, function (value) {
                unitsItems[value] = String(value);
            });
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
                                value: "<span class='description'>Drools Stream Analytics job can be scaled through Processing Units, which define the amount of processing power a job receives. Each Processing Unit corresponds to roughly 1 core.<br/>The job might be scaled up to the number of partitions in the input Event/IoT Hubs.</span>",
                                view: "readonlyvalue"
                            },
                            {
                                label: 'Processing Units',
                                value: null,//properties.connectionString,
                                view: "dropdown",
                                alias: "processingUnits",
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
                                value: null,//properties.connectionString,
                                view: "textbox",
                                alias: "aiKey",
                                validation: {
                                    mandatory: true
                                }
                            }
                        ]
                    }
                ]
            };

            return $q.when(content);
        },
        deploy: function (properties) {
            return umbRequestHelper.resourcePromise(
                $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Run",
                        [])),
                'Failed to run test');
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

            return umbRequestHelper.resourcePromise(
                $http.post(
                    umbRequestHelper.getApiUrl(
                        "mediaApiBaseUrl",
                        "Test",
                        [
                            { seconds: seconds }
                        ])),
                'Failed to run test');
        }
    };
}

angular.module('umbraco.resources').factory('deployResource', deployResource);