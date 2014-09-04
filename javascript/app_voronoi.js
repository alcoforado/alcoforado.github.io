/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="defines/handlebars.d.ts" />
/// <reference path="defines/ember.d.ts" />
/// <reference path="shaders.ts" />
define(["require", "exports", "shapes2d", "shaders", "glutils", "ember"], function(require, exports, Shapes, Shaders, glut, Ember) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.initEmber = function () {
            this.App = Ember.Application.create();
            this.App.Router.map(function () {
                this.resource('points', { path: '/' });
            });
            this.App.PointsRoute = Ember.Route.extend({
                model: { msg: "Hello World" }
            });
        };

        Main.prototype.InitScreen = function () {
            var canvas = document.getElementById("canvas");
            var gl = glut.getWebGLContext(canvas, true);

            if (!gl) {
                return;
            }
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            var shader = new Shaders.ShaderColor2D(gl);
            shader.shapes = [];
            shader.points = [new Shapes.Vector2(0.5, 0.5), new Shapes.Vector2(0, 0)];
            shader.draw();
        };
        return Main;
    })();
    exports.Main = Main;
});
//# sourceMappingURL=app_voronoi.js.map
