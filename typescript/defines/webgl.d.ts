//GL CONTEXT WRAPPER INTERFACE

declare module GL {
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
}