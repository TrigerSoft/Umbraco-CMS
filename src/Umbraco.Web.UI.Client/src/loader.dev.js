var API_BASE_URL = '<%=  apibaseurl%>';

(function() {

var deps = [
        'lib/jquery/jquery.min.js',
        'lib/angular/1.1.5/angular.min.js',
        'lib/underscore/underscore-min.js',

        'lib/jquery-ui/jquery-ui.min.js',

        'lib/angular/1.1.5/angular-cookies.min.js',
        'lib/angular/1.1.5/angular-mobile.min.js',
        'lib/angular/1.1.5/angular-sanitize.min.js',
        'lib/angular/1.1.5/angular-mocks.js',

        'lib/angular/angular-ui-sortable.js',

        'lib/angular-dynamic-locale/tmhDynamicLocale.min.js',

        'lib/blueimp-load-image/load-image.all.min.js',
        'lib/jquery-file-upload/jquery.fileupload.js',
        'lib/jquery-file-upload/jquery.fileupload-process.js',
        'lib/jquery-file-upload/jquery.fileupload-image.js',
        'lib/jquery-file-upload/jquery.fileupload-angular.js',

        'lib/bootstrap/js/bootstrap.2.3.2.min.js',
        'lib/bootstrap-tabdrop/bootstrap-tabdrop.js',
        'lib/umbraco/Extensions.js',

        'lib/umbraco/NamespaceManager.js',
        'lib/umbraco/LegacyUmbClientMgr.js',
        'lib/umbraco/LegacySpeechBubble.js',
        
        'js/app.dev.js',
        'js/routes.js',
        'js/init.js'
  ];
  
  var umbFullDeps = [
        'js/umbraco.servervariables.js',
        'js/umbraco.httpbackend.js',
        'js/umbraco.testing.js',

        'js/umbraco.directives.js',
        'js/umbraco.filters.js',
        'js/umbraco.resources.js',
        'js/umbraco.services.js',
        'js/umbraco.security.js',
        'js/umbraco.controllers.js'
  ];
  
  var umbMinDeps = [
      'js/umbraco.min.js'
  ];
  
  var min = '<%=  minify%>';
  
  deps.push.apply(deps, (min ? umbMinDeps : umbFullDeps));

LazyLoad.js(
    deps,

  function () {
    jQuery(document).ready(function () {
        angular.bootstrap(document, ['umbraco']);
    });
  }
);
})();