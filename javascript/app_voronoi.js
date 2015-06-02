/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="defines/handlebars.d.ts" />
/// <reference path="defines/ember.d.ts" />
/// <reference path="shaders.ts" />
/// <reference path="voronoi.ts" />
define(["require", "exports", "shapes2d", "shaders", "glutils", "voronoi", "ember", "linearalgebra"], function (require, exports, Shapes, Shaders, glut, Voronoi, Ember, LA) {
    var GLApp = (function () {
        function GLApp() {
        }
        GLApp.prototype.normalizedDX = function () {
            return this.problemDomain.dims[0] / this.canvas.width;
        };
        GLApp.prototype.normalizedDY = function () {
            return this.problemDomain.dims[1] / this.canvas.height;
        };
        GLApp.prototype.setViewport = function (canvas) {
            this.gl.viewport(0, 0, canvas.width, canvas.height);
            this.glTransform = new LA.GLScreenMapping([-1, 1], [canvas.width, canvas.height], true);
            this.problemDomain = new LA.GLScreenMapping([-1, -1], [canvas.width, canvas.height], false);
        };
        GLApp.prototype.InitScreen = function (canvas) {
            this.canvas = canvas;
            var gl = glut.getWebGLContext(this.canvas, true);
            this.gl = gl;
            if (!gl) {
                return;
            }
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            this.shader = new Shaders.ShaderColor2D(gl);
            this.voronoi = null;
            this.setViewport(canvas);
            this.draw();
        };
        GLApp.prototype.clearScreen = function () {
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.flush();
        };
        GLApp.prototype.iterate = function (loop) {
            if (this.voronoi == null) {
                throw "voronoi.iterate: call startVoronoi first";
            }
            if (this.voronoi.isVoronoiCompleted() && loop) {
                this.voronoi = new Voronoi.Voronoi(this.voronoi.vPoints, this.voronoi.x1, this.voronoi.x2, this.normalizedDX(), this.voronoi.yMin, this.voronoi.yMax, this.voronoi.dy);
            }
            if (this.voronoi.isVoronoiCompleted() && !loop)
                return;
            this.voronoi.iterate();
            this.voronoiToPrimitives();
        };
        GLApp.prototype.voronoiToPrimitives = function () {
            this.shader.lines = [];
            var cl = new Shapes.CyclicColorArray([new Shapes.Vector4(1, 1, 1, 1)]);
            var clRed = new Shapes.CyclicColorArray([new Shapes.Vector4(1, 0, 0, 1)]);
            var transform = this.problemDomain;
            //Draw scan line
            var rect = transform.GetScreenRect();
            this.shader.addShape(new Shapes.Line2D(transform.MapToGL([rect[0][0], this.voronoi.cY]), transform.MapToGL([rect[1][0], this.voronoi.cY])), cl);
            var v2 = [];
            this.voronoi.bPoints.forEach(function (elem) {
                v2.push(transform.MapToGL(elem));
            });
            this.shader.points = v2;
            for (var i = 0; i < this.voronoi.iEdges.length; i++) {
                var iEdge = this.voronoi.iEdges[i];
                var line = new Shapes.Line2D(transform.MapToGL(iEdge.p1.pt), transform.MapToGL(iEdge.p2.pt));
                this.shader.addShape(line, clRed);
            }
        };
        GLApp.prototype.draw = function () {
            this.clearScreen();
            this.shader.draw();
        };
        GLApp.prototype.resetApp = function () {
            this.shader.points = [];
            this.shader.shapes = [];
            this.shader.lines = [];
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.voronoi = null;
        };
        GLApp.prototype.startVoronoi = function (pts, dy) {
            var rect = this.problemDomain.GetScreenRect();
            this.voronoi = new Voronoi.Voronoi(pts, rect[0][0], rect[1][0], this.normalizedDX(), rect[0][1], rect[1][1], dy);
        };
        return GLApp;
    })();
    var Main = (function () {
        function Main() {
        }
        Main.prototype.initEmber = function () {
            var that = this;
            this.App = Ember.Application.create();
            this.App.ready = function () {
                that.App.ControllerInstance = that.App.__container__.lookup('controller:Points');
            };
            this.App.Router.map(function () {
                this.resource('points', { path: '/' });
            });
            this.App.PointsRoute = Ember.Route.extend({
                model: function () {
                    return [{ pts: [], scanLinePos: 1, loop: false, isPaused: true, canInputPoints: true, dyFactor: 1 }];
                }
            });
            this.App.PointsController = Ember.Controller.extend({
                cannotInputPoints: Ember.computed.not('canInputPoints'),
                actions: {
                    init_canvas: function (canvas) {
                        var glApp = new GLApp();
                        glApp.InitScreen(canvas);
                        this.set('glApp', glApp);
                        this.set('canInputPoints', true);
                        this.set('dy', 1);
                        this.set('scanLinePos', glApp.problemDomain.dims[1]);
                        this.set('edges', []);
                        this.updateControllerModel(glApp);
                        //Add observer on list of pts to include such list in the canvas shader.
                        this.addObserver('pts', this, this.ptsChanged);
                        this.addObserver('dyFactor', this, function () {
                            this.set('dy', (1 / this.get('dyFactor')).toFixed(6));
                        });
                    },
                    next: function () {
                        var glApp = this.get('glApp');
                        var loop = this.get('loop');
                        glApp.iterate(loop);
                        glApp.draw();
                        this.updateControllerModel(glApp);
                    },
                    play: function () {
                        if (!(this.get('isPaused') || this.get('canInputPoints')))
                            return;
                        var b2 = this.get('isPaused');
                        var bb = this.get('canInputPoints');
                        var glApp = this.get('glApp');
                        this.set('isPaused', false);
                        if (this.get('canInputPoints')) {
                            this.set('canInputPoints', false);
                            var pts = this.get('pts');
                            var dy = Number(this.get('dy'));
                            glApp.startVoronoi(pts, dy);
                        }
                        var controller = this;
                        var loop = this.get('loop');
                        this.playInterval = setInterval(function () {
                            glApp.iterate(loop);
                            glApp.draw();
                            controller.updateControllerModel(glApp);
                        }, 0);
                    },
                    pause: function () {
                        clearInterval(this.playInterval);
                        this.set('isPaused', true);
                    },
                    reset: function () {
                        var glApp = this.get('glApp');
                        clearInterval(this.playInterval);
                        this.set('canInputPoints', true);
                        this.set('isPaused', true);
                        this.set('pts', []);
                        glApp.resetApp();
                    },
                    restart: function () {
                        var glApp = this.get('glApp');
                        clearInterval(this.playInterval);
                        this.set('canInputPoints', true);
                        this.set('isPaused', true);
                        var shapes = glApp.shader.shapes;
                        glApp.resetApp();
                        glApp.shader.shapes = shapes;
                        this.send('play');
                    },
                    add_points: function () {
                        var pts = this.get('pts');
                        this.send('reset');
                        this.set('pts', pts);
                    },
                    opengl_canvas_click: function (pt) {
                        if (!this.get('canInputPoints'))
                            return;
                        var pts = this.get('pts');
                        var glApp = this.get('glApp');
                        var p = glApp.problemDomain.MapToScreen(glApp.glTransform.MapToGL(pt.toVec2()));
                        pts.pushObject(new Shapes.Vector2(p[0], p[1]));
                        this.propertyDidChange('pts');
                    },
                    resize_canvas: function () {
                        this.set("canvasX", this.form_X);
                        this.set("canvasY", this.form_Y);
                        var glApp = this.get("glApp");
                        setTimeout(function () {
                            glApp.gl.viewport(0, 0, glApp.canvas.width, glApp.canvas.height);
                            glApp.glTransform = new LA.GLScreenMapping([-1, 1], [this.form_X, this.form_Y], true);
                            glApp.problemDomain = new LA.GLScreenMapping([-1, -1], [this.form_X, this.form_Y], false);
                            glApp.draw();
                        }, 100);
                    }
                },
                updateControllerModel: function () {
                    var glApp = this.get('glApp');
                    if (glApp.voronoi != null) {
                        this.set('scanLinePos', glApp.voronoi.cY.toFixed(4));
                        this.set('dy', glApp.voronoi.dy.toFixed(5));
                    }
                    else {
                        this.set('scanLinePos', glApp.problemDomain.dims[1]);
                        this.set('edges', []);
                    }
                },
                canvasX: 600,
                canvasY: 300,
                form_X: 600,
                form_Y: 300,
                pts: [],
                //Observers Section
                ptsChanged: function () {
                    var glApp = this.get('glApp');
                    var pts = this.get('pts');
                    var dx = new LA.Vec2([2, 2]);
                    glApp.shader.shapes = [];
                    var cl = new Shapes.CyclicColorArray([new Shapes.Vector4(0, 0, 1, 1)]);
                    pts.forEach(function (pt) {
                        var gl_point = pt.toVec2();
                        var rect = new Shapes.Rect2D(glApp.problemDomain.MapToGL(gl_point.sub(dx)), glApp.problemDomain.MapToGL(gl_point.add(dx)));
                        glApp.shader.addShape(rect, cl);
                    });
                    glApp.clearScreen();
                    glApp.shader.draw();
                },
            });
            this.App.PointsView = Ember.View.extend({
                classNames: ['main_view'],
                didInsertElement: function () {
                    //Ember.run.next(that,that.InitScreen);
                }
            });
            this.App.OpenglView = Ember.View.extend({
                templateName: 'opengl',
                tagName: 'div',
                click: function (e) {
                    var x = e.offsetX == undefined ? e.layerX : e.offsetX;
                    var y = e.offsetY == undefined ? e.layerY : e.offsetY;
                    var point = new Shapes.Vector2(x, y);
                    this.get('controller').send('opengl_canvas_click', point);
                },
                didInsertElement: function () {
                    var canvas = document.getElementsByClassName("opengl_canvas")[0];
                    this.canvas = canvas;
                    var cont = this.get('controller');
                    cont.send('init_canvas', canvas);
                }
            });
        };
        return Main;
    })();
    exports.Main = Main;
});
//# sourceMappingURL=app_voronoi.js.map