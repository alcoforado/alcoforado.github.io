/// <reference path="webgl.d.ts" />
/// <reference path="../shapes2d.ts" />

// Licensed under a BSD license. See ../license.html for license

// These funcitions are meant solely to help unclutter the tutorials.
// They are not meant as production type functions.

interface Vector2 {
    x: number;
    y: number;
}


interface GLUT {
    loadShader(gl: any, source: string, type: number);
    createProgram(gl, shaders: Array<number>): number;
    getWebGLContext(canvas: HTMLElement, debug: boolean): WebGLRenderingContext;
    convertScreenCoordinatesToNormalized(canvas: HTMLCanvasElement, pt:Vector2): any;
}


declare module "glutils"
{
    export = glut;
}
declare var glut: GLUT;

