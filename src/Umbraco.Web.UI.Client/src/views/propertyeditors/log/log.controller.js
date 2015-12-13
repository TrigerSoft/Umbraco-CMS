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
            // editor.setOption("minLines", 5);
            editor.setOption("maxLines", 1000);
            editor.setTheme("ace/theme/crimson_editor");
            
            var session = editor.getSession();
            session.setUseWrapMode(true);
            
            var Range = ace.require('ace/range').Range;
            var rowToInsert;
            var annotations;
            var markers = [];
            $scope.$on("add-logs", function (e, entries) {
                // console.log("got logs:" + entries);
                if (!entries) {
                    $scope.model.value = false;
                    return;
                }
                
                var doc = session.getDocument();

                _.each(entries, function (e) {
                    var line = e.value;
                    doc.insertFullLines(rowToInsert, [line]);

                    if (e.description) {
                        var marker = session.addMarker(new Range(rowToInsert, 0, rowToInsert, 1), "ace_active-line", "fullLine");
                        markers.push(marker);
                        annotations.push({
                            row: rowToInsert,
                            text: e.description,
                            column: 0,
                            type: "warning"
                        });
                        session.setAnnotations(annotations);
                    }

                    rowToInsert++;
                });
            });

            var unsubscribe;

            function poll(value) {
                if (unsubscribe) {
                    unsubscribe();
                    unsubscribe = null;
                }
                if (value) {
                    rowToInsert = 0;
                    annotations = [];
                    _.each(markers, function(m) {
                       session.removeMarker(m); 
                    });
                    markers = [];
                    session.clearAnnotations();
                    editor.setValue("");
                    unsubscribe = mediaResultsResource.pollLog($scope, "add-logs");
                }
            }

            $scope.$watch("model.value", poll);
            $scope.$on("$destroy", poll.bind(this, false));

        });
}

angular.module("umbraco").controller("Umbraco.PropertyEditors.LogEditorController", LogEditorController);