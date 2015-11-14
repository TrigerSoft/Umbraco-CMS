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
                editor.getSession().setValue($scope.model.value);

                $timeout(function () {
                    editor.focus();
                }, 200, false);
            }

            editor.setHighlightActiveLine(false);
            editor.setShowPrintMargin(false);
            editor.getSession().setMode("ace/mode/drools");
            editor.setOption("minLines", 30);
            editor.setOption("maxLines", 1000);
            editor.setTheme("ace/theme/crimson_editor");

            editor.on('blur', function (e) {
                $scope.model.value = editor.getValue();
                if (!$scope.$root.$$phase)
                    $scope.$parent.$digest();
            });

            editor.commands.addCommand({
                name: 'saveFile',
                bindKey: {
                    win: 'Ctrl-S',
                    mac: 'Command-S',
                    sender: 'editor|cli'
                },
                exec: function (env, args, request) {
                    $scope.model.value = editor.getValue();
                    if (!$scope.$root.$$phase)
                        $scope.$parent.$digest();
                },
                passEvent: true
            });


            $scope.$watchCollection(function () { return $scope.model.validationMessages; }, function (nv, ov) {

                var session = editor.getSession();
                session.clearAnnotations();
                
                if (!nv || !nv.length)
                    return;
                
                var annotations = _.map(nv, function(item) {
                    return {
                      row: item.line ? item.line - 1 : 0,
                      column: item.column,
                      text: item.text,
                      type: item.level.toLowerCase()  
                    };
                });
                
                session.setAnnotations(annotations);
            });

            //load the seperat css for the editor to avoid it blocking our js loading TEMP HACK
            //assetsService.loadCss("lib/markdown/markdown.css");
        });
}

angular.module("umbraco").controller("Umbraco.PropertyEditors.CodeEditorController", CodeEditorController);