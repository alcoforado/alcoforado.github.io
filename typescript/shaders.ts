/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jquery.d.ts" />
/// <reference path="shapes2d.ts" />
/// <reference path="defines/glutils.d.ts" />
import $ = require("jquery");
import shapes2d = require("shapes2d");
import glut = require("glutils");


export interface AttributeDesc {
    name: string;
    nComponents: number;
    componentType: number;
}

export interface Attribute extends AttributeDesc {
    id: number;

}


export class ArrayBufferContext {
    attributes: Array<Attribute>;
    buffer: WebGLBuffer;
    program: WebGLProgram;

    gl: WebGLRenderingContext;

    elemTotalBytes: number;  //Total size in bytes of every data entry on this buffer

    componentTypeSize(gl_type: number) {
        if (gl_type == this.gl.FLOAT)
            return 4;
        else
            throw "Buffer type " + gl_type + " invalid";
    }

    constructor(gl: WebGLRenderingContext, program: WebGLProgram, attrs: AttributeDesc[]) {
        this.buffer = gl.createBuffer();
        this.program = program;
        this.gl = gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        this.attributes = [];
        this.elemTotalBytes = 0;
        for (var i = 0; i < attrs.length; i++) {
            var desc = attrs[i]
            var id = gl.getAttribLocation(this.program, desc.name)
            gl.enableVertexAttribArray(id);
            this.attributes.push({
                name: desc.name,
                id: id,
                componentType: desc.componentType,
                nComponents: desc.nComponents
            });
            this.elemTotalBytes += this.componentTypeSize(desc.componentType) * desc.nComponents;
        }
    }

    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        for (var attr in this.attributes)
            this.gl.enableVertexAttribArray(attr.id);
    }

    bufferData(data: ArrayBufferView, usage: number) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, usage);
        var off = 0;
        var that = this;
        this.attributes.forEach(attr => {
            that.gl.vertexAttribPointer(attr.id, attr.nComponents, attr.componentType, false, that.elemTotalBytes, off);
            off += that.componentTypeSize(attr.componentType) * attr.nComponents;
        })
    }
    





}   


export class ShaderColor2D {

    program: WebGLProgram

    shapes: Array<shapes2d.IShapes2D>

    points: Array<shapes2d.Vector2>

    buffer: WebGLBuffer
    iBuffer: WebGLBuffer

    pointBuffer: ArrayBufferContext



    gl: WebGLRenderingContext;
    

    constructor(gl: WebGLRenderingContext) {
        var verticeShaderSource = "\
     attribute vec2 a_position;\
     attribute vec4 a_color;\
     varying vec4 f_color;\
    void main() {\
        gl_PointSize=5.0;\
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
        this.buffer      = gl.createBuffer();
        this.iBuffer     = gl.createBuffer();
        this.pointBuffer = new ArrayBufferContext(gl, this.program, 
            [{ name: "a_position", nComponents: 2, componentType: gl.FLOAT },
             { name: "a_color"   , nComponents: 4, componentType: gl.FLOAT }]
            );

    }


    nComponents: number;
    componentType: number;

    draw(): void {
        var gl: WebGLRenderingContext = this.gl;
        gl.useProgram(this.program);
        // look up where the vertex data needs to go.

        /*
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

*/

        var pointsV: number[] = [];
        for (var i = 0; i < this.points.length; i++) {
            pointsV.push(this.points[i].x);
            pointsV.push(this.points[i].y);
            pointsV.push(1.0);
            pointsV.push(1.0);
            pointsV.push(1.0);
            pointsV.push(1.0);
        }

        this.pointBuffer.bind();
        this.pointBuffer.bufferData(new Float32Array(pointsV), gl.DYNAMIC_DRAW); 
        gl.drawArrays(gl.POINTS, 0, this.points.length)
        }
}

