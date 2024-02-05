import MGL from "./mgl";
export class MGLBuffer {
    private id:WebGLBuffer;
    
    constructor(private mgl:MGL) {
        let _id:WebGLBuffer|null=mgl.gl().createBuffer()
        if (!_id)
            throw new Error("OpenGL buffer could not be allocated")
        this.id=_id;
    }
}