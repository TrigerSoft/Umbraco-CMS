//inject umbracos assetsServce and dialog service
function LogEditorController($scope, $element, assetsService, mediaResultsResource) {

    //tell the assets service to load the markdown.editor libs from the markdown editors
    //plugin folder

    assetsService
        .load([
            "lib/ace/ace.js"
        ])
        .then(function () {

            var editor = ace.edit($element[0]);
            editor.setValue("");
            editor.setHighlightActiveLine(false);
            editor.setShowPrintMargin(false);
            editor.setReadOnly(true);
            //editor.getSession().setMode("ace/mode/drools");
            editor.setOption("minLines", 5);
            editor.setOption("maxLines", 1000);
            editor.setTheme("ace/theme/crimson_editor");

            var rowToInsert;
            $scope.$on("add-logs", function (e, entries) {
                // console.log("got logs:" + entries);
                if (!entries) {
                    $scope.model.value = false;
                    return;
                }
                var session = editor.getSession();
                var doc = session.getDocument();

                var lines = _.map(entries, function (e) { return e.value; });
                doc.insertLines(rowToInsert, lines);
                rowToInsert += lines.length;
            });

            var unsubscribe;

            function poll(value) {
                if (unsubscribe) {
                    unsubscribe();
                    unsubscribe = null;
                }
                if (value) {
                    rowToInsert = 0;
                    editor.setValue("");
                    unsubscribe = mediaResultsResource.pollLog($scope, "add-logs");
                }
            }

            $scope.$watch("model.value", poll);
            $scope.$on("$destroy", poll.bind(this, false));
            //load the seperat css for the editor to avoid it blocking our js loading TEMP HACK
            //assetsService.loadCss("lib/markdown/markdown.css");
        });
}

angular.module("umbraco").controller("Umbraco.PropertyEditors.LogEditorController", LogEditorController);