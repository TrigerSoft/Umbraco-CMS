//inject umbracos assetsServce and dialog service
function CodeEditorController($scope, $element, assetsService, dialogService, $timeout) {

    //tell the assets service to load the markdown.editor libs from the markdown editors
    //plugin folder

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

            editor.on('blur', function (e) {
                $scope.model.value = editor.getValue();
            });
            
            editor.focus();

            //load the seperat css for the editor to avoid it blocking our js loading TEMP HACK
            //assetsService.loadCss("lib/markdown/markdown.css");
        });
}

angular.module("umbraco").controller("Umbraco.PropertyEditors.CodeEditorController", CodeEditorController);