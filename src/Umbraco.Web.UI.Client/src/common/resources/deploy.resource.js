function deployResource($q, $http, umbDataFormatter, umbRequestHelper) {
	return {
		getDevContent: function () {
			var content = {
				name: "Summary &rarr;\u00BB Test \u21D2 Deploy",
				tabs: [
					{
						label: "Summary",
						alias: "tab0",
						id: 0,
						properties: [
							{
								label: 'Rules',
								value: "",
								view: "readonlylistview",
								alias: "rules",
								config: {
									entityType: "content"
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