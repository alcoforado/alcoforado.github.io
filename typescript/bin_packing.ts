/// <reference path="./defines/jquery.d.ts" />
/// <reference path="./defines/angular.d.ts" />
/// <reference path="./defines/custom.d.ts" />
/// <reference path="./linearalgebra.ts" />
/// <reference path="./effects.ts" />



import la = require("linearalgebra");
import angular = require("angular");
import Effects=require("effects");    

    class Data {
        constructor(public NumElements: number, public WidthRange: la.Interval,public HeightRange: la.Interval)
        {
            
        }
    }

   interface IScope extends ng.IScope {
        Data: Data;
    }

    class AppCtrl {
        constructor(private $scope: IScope) {
            $scope.Data = new Data(50, new la.Interval(10, 100), new la.Interval(10, 100));
        }
    }
 
   

///////////////////////////////////////////////////////////////////////////////////////////////////
//Angular initialization with require.js
/////////////////////////////////////////////////////////////////////////////////////////////////
    Effects.Initialize();    

    var app = angular.module('app', []);
    app.controller('Ctrl', AppCtrl);

    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function () {
        // bootstrap the app manually
        angular.bootstrap(document, ['app']);
    });


