/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
/// <amd-dependency path='text!../Templates/logdetail.html'/>
import $ = require("jquery");
import shapes2d = require("shapes2d");
import glut = require("glutils");


//GL CONTEXT WRAPPER INTERFACE
export interface GLContext {
    VERTEX_SHADER: number;
    FRAGMENT_SHADER: number;
    ARRAY_BUFFER: number;
    ELEMENT_ARRAY_BUFFER: number;
    STATIC_DRAW: number;
    FLOAT: number;
    TRIANGLES: number;
    UNSIGNED_SHORT: number;
    DYNAMIC_DRAW: number;
    POINTS: number;
    useProgram(p: number);
    getAttribLocation(i: number, s: string);
    createBuffer(): number;
    bindBuffer(p1: number, p2: number);
    bufferData(buffer_type: number, vector: any, opt: number);
    enableVertexAttribArray(i: number);
    vertexAttribPointer(i1: number, i2: number, i3: number, bn: boolean, i4: number, i5: number);
    drawElements(drawType: number, ilength: number, dataType: number, off: number);
    drawArrays(drawType: number, off: number, length: number);
}



class ShaderColor2D {

    program: number

    shapes: Array<shapes2d.IShapes2D>

    points: Array<shapes2d.Vector2>

    buffer: number
    iBuffer: number
    pointBuffer: number
    gl: GLContext;


    constructor(gl: GLContext) {
        var verticeShaderSource = "\
     attribute vec2 a_position;\
     attribute vec4 a_color;\
     varying vec4 f_color;\
    void main() {\
        gl_Position = vec4(a_position, 0, 1);\
        f_color=a_color;\
    }";
        var pixelShaderSource = "\
    varying mediump vec4 f_color;\
    void main() {\
    gl_FragColor = f_color;  \
}";
        this.gl = gl;
        var vertexShader = glut.loadShader(gl, verticeShaderSource, gl.VERTEX_SHADER);
        var fragmentShader = glut.loadShader(gl, pixelShaderSource, gl.FRAGMENT_SHADER);
        this.program = glut.createProgram(gl, [vertexShader, fragmentShader]);
        this.buffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();
        this.pointBuffer = gl.createBuffer();
    }

    draw(): void {
        var gl: GLContext = this.gl;
        gl.useProgram(this.program);
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(this.program, "a_position");
        var colorLocation = gl.getAttribLocation(this.program, "a_color")


            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer)


            var vertices = [];
        var indices = [];
        var off = 0;
        for (var i = 0; i < this.shapes.length; i++) {
            var points = this.shapes[i].vertices();
            var colors = this.shapes[i].indices();
            if (points.length / 2 != colors.length / 4)
                throw "Colors must be set for all points";
            var j = 0;
            var k = 0;
            while (j < points.length) {
                vertices.push(points[j++]);
                vertices.push(points[j++]);
                vertices.push(colors[k++]);
                vertices.push(colors[k++]);
                vertices.push(colors[k++]);
                vertices.push(colors[k++]);
            }
            var ind = this.shapes[i].indices();
            for (var l = 0; l < ind.length; l++) {
                ind[l] += off;
            }
            off += points.length / 2;
            indices = indices.concat(ind);

        }


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW)
            gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(colorLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 24, 2 * 4);

        // draw
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);



        var pointsV: number[] = [];
        for (var i = 0; i < this.points.length; i++) {
            pointsV.push(points[i].x);
            pointsV.push(points[i].y);
            pointsV.push(1.0);
            pointsV.push(1.0);
            pointsV.push(1.0);
            pointsV.push(1.0);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsV), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, this.points.length)
        }
}

