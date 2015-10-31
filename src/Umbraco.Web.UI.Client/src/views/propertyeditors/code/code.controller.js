//inject umbracos assetsServce and dialog service
function CodeEditorController($scope, $element, assetsService, dialogService, $timeout) {

    //tell the assets service to load the markdown.editor libs from the markdown editors
    //plugin folder

    if (!$scope.model.value ) {
        $scope.model.value = //$scope.model.config.defaultValue;
        'rule "a rule"\n lock-on-active true\nwhen\n$a : Applicant()\nthen\nmodify($a) {\n    setName("Fred")\n}\nSystem.out.println("Updated");\nend';
    }

    assetsService
        .load([
            "lib/ace/ace.js"
        ])
        .then(function () {

            var editor = ace.edit($element[0]);
            if ($scope.model.value) {
                editor.setValue($scope.model.value);
                editor.clearSelection();
                editor.gotoLine(1);
            }
            
            editor.setHighlightActiveLine(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setMode("ace/mode/drools");
            editor.setOption("minLines", 30);
            editor.setOption("maxLines", 1000);
            editor.setTheme("ace/theme/crimson_editor");

            //load the seperat css for the editor to avoid it blocking our js loading TEMP HACK
            //assetsService.loadCss("lib/markdown/markdown.css");
        });
}

angular.module("umbraco").controller("Umbraco.PropertyEditors.CodeEditorController", CodeEditorController);