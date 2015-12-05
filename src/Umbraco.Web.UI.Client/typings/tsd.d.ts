/// <reference path="jquery/jquery.d.ts" />
/// <reference path="underscore/underscore.d.ts" />
/// <reference path="angularjs/angular.d.ts" />
/// <reference path="ace/ace.d.ts" />

declare module angular {
	interface IScopeService extends IScope {
	}
	
	interface IElementService extends IAugmentedJQuery {
	}
}