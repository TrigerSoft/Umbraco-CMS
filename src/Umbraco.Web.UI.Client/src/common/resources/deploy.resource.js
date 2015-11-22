function deployResource($q, $http, umbDataFormatter, umbRequestHelper) {
	return {
		getDevContent: function () {
			var content = {
				name: "Test \u21D2 Deploy",
				tabs: [
					{
						label: "Summary",
						alias: "tab0",
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
					}
				]
			};
			
			return $q.when(content);
		}
	};
}

angular.module('umbraco.resources').factory('deployResource', deployResource);