import MGL from "./mgl";

enum  MGLBufferType {ARRAY_BUFFER,ELEMENT_ARRAY_BUFFER};



export class MGLBuffer {
    private id:WebGLBuffer;

    constructor(private mgl:MGL,private bufferType:MGLBuffer.BufferType) {
        let _id:WebGLBuffer|null=mgl.gl().createBuffer()
        if (!_id)
            throw new Error("OpenGL buffer could not be allocated")
        this.id=_id;
    }

    setAsActive():void{
        let gl=this.mgl.gl();
        let glType = this.bufferType == MGLBuffer.BufferType.ARRAY_BUFFER ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER;
        this.mgl.gl().bindBuffer(glType,this.id);
    }
   
}

export namespace MGLBuffer
{
    export enum BufferType
    {
        ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER
    }
}
