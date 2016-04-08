/// <reference path="./defines/jquery.d.ts" />
/// <reference path="./defines/angular.d.ts" />
/// <reference path="./defines/custom.d.ts" />
/// <reference path="./linearalgebra.ts" />
/// <reference path="./effects.ts" />
/// <reference path="./bin_packing_algorithm.ts" />
/// <reference path="./svg_plots.ts" />
define(["require", "exports", "svg_plots", "linearalgebra", "angular", "effects", "bin_packing_algorithm"], function (require, exports, plots, la, angular, Effects, bp) {
    var Data = (function () {
        function Data(NumElements, WidthRange, HeightRange, numberOfRuns, rotate, rectList, areaUsageValues) {
            if (numberOfRuns === void 0) { numberOfRuns = 1; }
            if (rotate === void 0) { rotate = false; }
            if (rectList === void 0) { rectList = []; }
            if (areaUsageValues === void 0) { areaUsageValues = []; }
            this.NumElements = NumElements;
            this.WidthRange = WidthRange;
            this.HeightRange = HeightRange;
            this.numberOfRuns = numberOfRuns;
            this.rotate = rotate;
            this.rectList = rectList;
            this.areaUsageValues = areaUsageValues;
        }
        return Data;
    })();
    var Ctrl = (function () {
        function Ctrl($scope) {
            this.$scope = $scope;
            $scope.Data = new Data(50, new la.Interval(10, 100), new la.Interval(10, 100));
        }
        Ctrl.prototype.plotEfficiencyGraph = function (y) {
            var y = this.$scope.Data.areaUsageValues;
            if (y.length <= 1)
                $(".efficiency-graph-container").html("");
            else {
                var options = {
                    height: 369,
                    width: 545,
                    line_width: 0,
                    points_size: 2,
                    points_type: 'circle',
                    color: 'purple',
                    padding: [5, 5, 5, 5],
                    font_size: 8,
                    yrange: [0, 100]
                };
                var x = [];
                for (var i = 0; i < y.length; i++) {
                    x.push(i);
                }
                var p = new plots.SvgPlot();
                p.plot2d($(".efficiency-graph-container")[0], x, y, options);
            }
        };
        Ctrl.prototype.Run = function () {
            var i = 0;
            var that = this;
            var data = this.$scope.Data;
            if (data.numberOfRuns <= 1) {
                this.RunOnce();
            }
            else {
                var interval = setInterval(function () {
                    that.RunOnce();
                    if (++i >= data.numberOfRuns) {
                        clearInterval(interval);
                    }
                }, 100);
            }
        };
        Ctrl.prototype.RunOnce = function () {
            var rgbInterval = new la.Interval(1, 255);
            this.$scope.Data.rectList = [];
            for (var i = 0; i < this.$scope.Data.NumElements; i++) {
                var sh = new bp.Rect(this.$scope.Data.WidthRange.RandomIntegerSample(), this.$scope.Data.HeightRange.RandomIntegerSample(), new la.Vec3([rgbInterval.RandomIntegerSample(), rgbInterval.RandomIntegerSample(), rgbInterval.RandomIntegerSample()]));
                if (this.$scope.Data.rotate)
                    sh = new bp.Rect(Math.min(sh.height, sh.width), Math.max(sh.height, sh.width), sh.color);
                this.$scope.Data.rectList.push(sh);
            }
            //possible sort it
            //this.$scope.Data.rectList = this.$scope.Data.rectList.sort((r1: bp.Rect, r2: bp.Rect): number => {
            //    return Math.max(r1.height, r1.width) - Math.max(r2.height, r2.width);
            //});
            var binPack = new bp.BinPack(this.$scope.Data.rectList);
            $("#Container").html(""); //clear containter
            binPack.toDom($("#Container")[0]); //populate container
            //Register area usage
            var efficiency = binPack.AreaUsagePercentage();
            this.$scope.Data.areaUsageValues.push(efficiency);
            this.plotEfficiencyGraph(this.$scope.Data.areaUsageValues);
        };
        Ctrl.prototype.RunAgain = function () {
            if (this.$scope.Data.rectList.length != 0) {
                var binPack = new bp.BinPack(this.$scope.Data.rectList);
                $("#Container").html(""); //clear containter
                binPack.toDom($("#Container")[0]); //populate containerreturn;
            }
        };
        return Ctrl;
    })();
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //Angular initialization with require.js
    /////////////////////////////////////////////////////////////////////////////////////////////////
    Effects.Initialize();
    var app = angular.module('app', []);
    app.controller('Ctrl', Ctrl);
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element().ready(function () {
        // bootstrap the app manually
        angular.bootstrap(document, ['app']);
    });
});
//$(function () {
//    var p = new plots.SvgPlot();
//    var options: plots.PlotOptionsBase = {
//        height: 369,
//        width: 545,
//        line_width: 0,
//        points_size: 5,
//        points_type: 'circle',
//        color: 'purple',
//        padding: [5, 5, 5, 5],
//        font_size: 8,
//        yrange:[0,500]
//    };
//    var x = [1, 2, 3, 4 , 5];
//    var y = [100, 200, 300,400,500];
//   // p.plot2d($(".efficiency-graph-container")[0],x,y, options);
//});
//# sourceMappingURL=bin_packing.js.map