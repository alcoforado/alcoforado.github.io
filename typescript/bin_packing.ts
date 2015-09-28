/// <reference path="./defines/jquery.d.ts" />
/// <reference path="./defines/angular.d.ts" />
/// <reference path="./defines/custom.d.ts" />
/// <reference path="./linearalgebra.ts" />
/// <reference path="./effects.ts" />
/// <reference path="./bin_packing_algorithm.ts" />
/// <reference path="./svg_plots.ts" />



import plots = require("svg_plots");
import la = require("linearalgebra");
import angular = require("angular");
import Effects=require("effects");    
import bp = require("bin_packing_algorithm");
import shapes2D = require("shapes2d");



 class Data {
        constructor(public NumElements: number, public WidthRange: la.Interval,public HeightRange: la.Interval, public numberOfRuns=1,public rotate:boolean=false, public rectList:Array<bp.Rect>=[],public areaUsageValues:Array<number>=[])
        {
            
        }
    }

   interface IScope extends ng.IScope {
       Data: Data;

       Run: any;
    }

   class Ctrl {


        constructor(private $scope: IScope) {
            $scope.Data = new Data(50, new la.Interval(10, 100), new la.Interval(10, 100));
        }

        plotEfficiencyGraph(y:Array<number>) {
            var y = this.$scope.Data.areaUsageValues;

            if (y.length <= 1)
                $(".efficiency-graph-container").html("");
            else {

                var options: plots.PlotOptionsBase = {
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
                var x:Array<number> = [];
                for (var i= 0; i < y.length;i++)
                {
                    x.push(i);
                }
                var p = new plots.SvgPlot();
                p.plot2d($(".efficiency-graph-container")[0], x, y, options);

            }

        }

        Run() {
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

        } 


        RunOnce() {
            var rgbInterval = new la.Interval(1, 255);
            this.$scope.Data.rectList = [];
            for (var i: number = 0; i < this.$scope.Data.NumElements; i++)
            {
                var sh = new bp.Rect(this.$scope.Data.WidthRange.RandomIntegerSample(), this.$scope.Data.HeightRange.RandomIntegerSample(),
                    new la.Vec3([rgbInterval.RandomIntegerSample(),rgbInterval.RandomIntegerSample(),rgbInterval.RandomIntegerSample()])); 
                if (this.$scope.Data.rotate)
                    sh = new bp.Rect(Math.min(sh.height, sh.width), Math.max(sh.height, sh.width),sh.color)

                this.$scope.Data.rectList.push(sh);   
            }


            //possible sort it
            //this.$scope.Data.rectList = this.$scope.Data.rectList.sort((r1: bp.Rect, r2: bp.Rect): number => {
            //    return Math.max(r1.height, r1.width) - Math.max(r2.height, r2.width);
            //});
            var binPack = new bp.BinPack(this.$scope.Data.rectList);


            $("#Container").html(""); //clear containter
            binPack.toDom($("#Container")[0]);//populate container

            //Register area usage
            var efficiency = binPack.AreaUsagePercentage();
            this.$scope.Data.areaUsageValues.push(efficiency);
            
            this.plotEfficiencyGraph(this.$scope.Data.areaUsageValues);
        }

        RunAgain() {
            if (this.$scope.Data.rectList.length != 0) {
                var binPack = new bp.BinPack(this.$scope.Data.rectList);
                $("#Container").html(""); //clear containter
                binPack.toDom($("#Container")[0]);//populate containerreturn;
            }
        }

    }
    

   

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
