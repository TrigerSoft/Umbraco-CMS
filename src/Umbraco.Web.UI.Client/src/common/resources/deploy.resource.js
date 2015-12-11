function deployResource($q, $http, umbDataFormatter, umbRequestHelper) {
	return {
		getDevContent: function () {
			var content = {
				name: "Test \u21D2 Deploy",
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