/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <reference path="shaders.ts" />


import $ = require("jquery");
import Shapes = require("shapes2d");
import glut = require("glutils");
import Shaders = require("shaders");


class Main {

    canvas:HTMLElement;

    Init() {
        var canvas = document.getElementById("canvas");
        var gl = glut.getWebGLContext(canvas);

        alert(glut);
        if (!gl) {
            return;
        }
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        shader = new Shaders.ShaderColor2D(gl);
        shader.shapes = [];
        shader.points = [new Vector2(0, 0), new Vector2(0, 0.5)];
        shader.draw();

    }



}