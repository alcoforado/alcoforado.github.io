/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="shaders.ts" />
define(["require", "exports", "shapes2d", "glutils", "shaders"], function(require, exports, Shapes, glut, Shaders) {
    var Main = (function () {
        function Main() {
        }
        Main.prototype.Init = function () {
            var canvas = document.getElementById("canvas");
            var gl = glut.getWebGLContext(canvas);

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
