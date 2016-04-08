/// <reference path="./defines/jquery.d.ts" />
/// <reference path="./defines/angular.d.ts" />
/// <reference path="./defines/custom.d.ts" />
/// <reference path="./linearalgebra.ts" />
define(["require", "exports", "linearalgebra"], function (require, exports, la) {
    var App;
    (function (App) {
        var Data = (function () {
            function Data(NumElements, XDims, YDims) {
                this.NumElements = NumElements;
                this.XDims = XDims;
                this.YDims = YDims;
            }
            return Data;
        })();
        var AppCtrl = (function () {
            function AppCtrl($scope) {
                this.$scope = $scope;
                $scope.Data = new Data(20, new la.Interval(10, 100), new la.Interval(10, 100));
            }
            return AppCtrl;
        })();
        function Initialize() {
            alert("hello");
        }
        App.Initialize = Initialize;
        var app = angular.module('app', []);
        app.controller('Ctrl', AppCtrl);
    })(App || (App = {}));
});
//# sourceMappingURL=bin_pack.js.map