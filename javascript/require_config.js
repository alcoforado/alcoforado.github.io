/*
Set the require js configuration in global
environment
*/
new function() {
    var Require_Config = {
        baseUrl: 'javascript',
        paths: {
            jquery: 'jquery-1.11.1'
        },
        shim: {
            'ember': {
                deps: ['handlebars', 'jquery', 'ember-template-compiler'],
                exports: 'Ember'
            },
            'angular': {
                exports: 'angular',
                deps: ['jquery']
            }

        }
    };

    require.config(Require_Config);

    

    var tmp = window.location.href.split("/");
    var fileName=tmp[tmp.length - 1];
    fileName=fileName.split(".")[0];
    require([fileName], function (App) {
    });



}();