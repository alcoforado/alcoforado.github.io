import MGL from "./mgl";
import Plot3D from '../../pages/Plots3d';




class MGLBuffer {
    private id:WebGLBuffer;

    protected constructor(protected mgl:MGL,private glType:number) {
        let _id:WebGLBuffer|null=mgl.gl().createBuffer()
        if (!_id)
            throw new Error("OpenGL buffer could not be allocated")
        this.id=_id;
    }

    setAsActive():void
    {
        let gl=this.mgl.gl();
        //let glType = this.bufferType == MGLBuffer.BufferType.ARRAY_BUFFER ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER;
        this.mgl.gl().bindBuffer(this.glType,this.id);
    }

    getAllocatedSize(){
        this.setAsActive();
        let gl=this.mgl.gl();
        return gl.getBufferParameter(this.glType,gl.BUFFER_SIZE)
    }

    
}
namespace MGLBuffer
{
    export enum BufferType
    {
        ARRAY_BUFFER,
        ELEMENT_ARRAY_BUFFER
    }
}


export class VertexMGLBuffer extends MGLBuffer {
    load(vV:Float32Array) {
        this.setAsActive();
        let gl=this.mgl.gl();
        gl.bufferData(gl.ARRAY_BUFFER,vV,gl.STATIC_DRAW);
    }



    constructor(mgl:MGL) 
    {
        super(mgl,mgl.gl().ARRAY_BUFFER)
    }
}

export class IndexMGLBuffer extends MGLBuffer {
    load(vI: Uint32Array) {
        this.setAsActive();
        let gl=this.mgl.gl();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,vI,gl.STATIC_DRAW);
    }
    constructor(mgl:MGL) 
    {
        super(mgl,mgl.gl().ELEMENT_ARRAY_BUFFER)
    }
}

