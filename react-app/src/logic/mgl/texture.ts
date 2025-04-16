import MGL from './mgl'

export  class Texture {
    handle: WebGLTexture | null;
    constructor(private mgl:MGL,url:URL)
    {
        let handle=this.handle=mgl.gl().createTexture();
        let image=new Image();
        let gl = mgl.gl();
        image.src=url.toString();
        
        mgl.waitFor(new Promise<void>((resolve,reject)=>{
            image.addEventListener('load', ()=>{
                gl.bindTexture(gl.TEXTURE_2D,handle);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image)
                resolve();
            })
            image.addEventListener('error',()=>{
                throw Error(`Could not load Image url ${url}`)
            })
            
        }

    }

    

    
}