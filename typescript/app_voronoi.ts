/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="defines/handlebars.d.ts" />
/// <reference path="defines/ember.d.ts" />
/// <reference path="shaders.ts" />
/// <reference path="voronoi.ts" />


import $ = require("jquery");
import Shapes = require("shapes2d");
import Shaders = require("shaders");
import glut = require("glutils");
import Voronoi = require("voronoi");
//import Handlebars = require("handlebars");
import Ember = require("ember");


class PointsInput {
    private screenPoints: Array<Shapes.Vector2>;
    detach: boolean;
    canvas: HTMLCanvasElement;
    onAddPoint: (pt: Shapes.Vector2) => void;


    constructor(canvas: HTMLCanvasElement) {
        this.detach = false;
        this.canvas = canvas;
        var that = this;
        canvas.addEventListener('click', function (event) {
            if (that.detach)
                return;
            var point = new Shapes.Vector2(event.offsetX, event.offsetY);
            that.screenPoints.push(point);
            that.onAddPoint(point);
        })
    }




    getNormalizedPointsAsRectangles(w:number,l:number):Shapes.Rect2D[] {
        var result:Shapes.Rect2D[] = [];
        for (var i = 0; i < this.screenPoints.length; i++) {
            var p = new Shapes.Vector2(2.0 * this.screenPoints[i].x / this.canvas.width - 1.0, 2.0 * (this.canvas.height - this.screenPoints[i].y) / this.canvas.height - 1.0);
            result.push(Shapes.Rect2D.CreateRectFromPoint(p, w, l));
        }
        return result;
    }

    getNormalizedPoints(): Shapes.Vector2[] {
        var result: Shapes.Vector2[] = [];
        for (var i = 0; i < this.screenPoints.length; i++) {
            var p = [2.0 * this.screenPoints[i].x / this.canvas.width - 1.0, 2.0 * (this.canvas.height - this.screenPoints[i].y) / this.canvas.height - 1.0]
                result.push(new Shapes.Vector2(p[0], p[1]))
            }
        return result;
    }
}


class OpenGLContext {
    
}


export class Main {
    T: any; 
    App: any;
    gl: WebGLRenderingContext;
    shader: Shaders.ShaderColor2D;
    canvas: HTMLCanvasElement;
    model: any;
    private input: PointsInput;
    initEmber() {

        var that = this;

        this.App = Ember.Application.create();
        this.App.ready = function ()
        {
            that.App.ControllerInstance = that.App.__container__.lookup('controller:Points');
        }
    
        this.App.Router.map(function () {
            this.resource('points', { path: '/' })
        });
        this.App.PointsRoute = Ember.Route.extend({
            model: function () {
                return { pts: [{ x: 0, y: 2 }, { x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: -0.5, y: -0.5 }], scanLinePos: 0, loop: true, isPaused: true, canInputPoints: true };
            }
        });

        this.App.PointsController = Ember.ObjectController.extend({
            needs: ['view:Opengl'],
            test: "hello",
            actions: {
                incrementScanLine: function () {
                    var scanLinePos = this.get('scanLinePos');
                    this.set('scanLinePos', scanLinePos + 1);
                },
                play: function () {
                    this.set('isPaused', false);
                    this.set('canInputPoints', false);
                },
                pause: function () {
                    this.set('isPaused', true);
                },
                reset: function () {
                    that.resetApp();
                },
                opengl_canvas_click: function (pt: Shapes.Vector2) {
                    var pts: Shapes.Vector2[] = this.get('pts');
                    var tt = new Shapes.Vector2(2, 2);
                    pts.pushObject(pt.toPrecision(5));
                    this.propertyDidChange('pts');
                },
                apply_dimensions: function () {
                    this.set("canvasX", this.form_X);
                    this.set("canvasY", this.form_Y);
                    
                    setTimeout(function () {
                        that.gl.viewport(0, 0, that.canvas.width, that.canvas.height);
                        that.draw();
                    }, 500);
                }



            },
            canvasX: 600,
            canvasY: 300,
            form_X: 600,
            form_Y: 300
            

        });
        
        this.App.PointsView = Ember.View.extend({
            classNames: ['main_view'],
            didInsertElement: function () {
                //Ember.run.next(that,that.InitScreen);
            }
        })

        this.App.OpenglView = Ember.View.extend({
            templateName: 'opengl',
            tagName: 'div',
            click: function (e: MouseEvent) {
                var x:number = e.offsetX == undefined ? e.layerX : e.offsetX;
                var y:number = e.offsetY == undefined ? e.layerY : e.offsetY;
                var point = glut.convertScreenCoordinatesToNormalized(that.canvas, new Shapes.Vector2(x,y));
                this.get('controller').send('opengl_canvas_click', new Shapes.Vector2(point.x,point.y));

            },
            didInsertElement: function () {
                var canvas = document.getElementsByClassName("opengl_canvas")[0];
             
                that.canvas = <HTMLCanvasElement> canvas;
                that.gl = glut.getWebGLContext(that.canvas, true);
                that.gl.clearColor(0, 0, 0, 1);
                that.gl.clear(that.gl.COLOR_BUFFER_BIT);
                that.shader = new Shaders.ShaderColor2D(that.gl);
                that.shader.shapes = [];
                that.shader.points = this.get('controller.pts');
                that.shader.draw();
                this.set('glContext', that);

                var cont:Ember.ObjectController = this.get('controller');
                cont.addObserver('pts', function () {
                    that.shader.points = cont.get('pts');
                    that.clearScreen();
                    that.shader.draw();
                });
            }
           
           
        });
        

    }
    
    

    InitScreen() {
        var that = this;
        var canvas = document.getElementsByClassName("opengl_canvas")[0];
        this.canvas= <HTMLCanvasElement> canvas;
        var gl = glut.getWebGLContext(this.canvas, true);
        this.gl = gl;
        
        if (!gl) {
            return;
        }
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.shader = new Shaders.ShaderColor2D(gl);
        this.shader.shapes = [];
        this.shader.points = [new Shapes.Vector2(0.5, 0.5), new Shapes.Vector2(0, 0)];
        this.shader.draw();
        /*
        that.canvas.onresize=function() {
            that.gl.viewport(0, 0, that.canvas.width, that.canvas.height);
            that.clearScreen();
            that.shader.draw();
        };*/



        /*
        //wiring app  add points on click
        this.canvas.addEventListener('click', function (event) {
            var cont = that.App.__container__.lookup('controller:points');
            if (cont.get('canInputPoints')) {
                //Get point convert to opengl coordinates, add it to shader
                var point = new Shapes.Vector2(event.offsetX, event.offsetY);
                var pt = glut.convertScreenCoordinatesToNormalized(this.canvas, point);

                var ptsTable = cont.get('pts');
                ptsTable.push(pt);
                cont.set('pts', ptsTable);

                that.shader.points.push(pt);
                that.clearScreen();
                that.shader.draw();
            }
        });
*/
        
    }

    clearScreen() {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.flush();
    }

    draw() {
        this.clearScreen();
        this.shader.draw();
    }

    resetApp() {
        this.shader.points = [];
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    }
    




}