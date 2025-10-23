import MGL from './mgl'
import MathUtils from '../math-utils'

enum TEXTURE_MAG_FILTER {
    LINEAR="LINEAR",
    NEAREST="NEAREST"
}


enum TEXTURE_MIN_FILTER {
    LINEAR="LINEAR",
    NEAREST="NEAREST",
    NEAREST_MIPMAP_NEAREST="NEAREST_MIPMAP_NEAREST",
    LINEAR_MIPMAP_NEAREST="LINEAR_MIPMAP_NEAREST",
    NEAREST_MIPMAP_LINEAR="NEAREST_MIPMAP_LINEAR",
    LINEAR_MIPMAP_LINEAR="LINEAR_MIPMAP_LINEAR"
}

enum TEXTURE_WRAP {
    REPEAT="REPEAT",
    CLAMP_TO_EDGE="CLAMP_TO_EDGE",
    MIRRORED_REPEAT="MIRRORED_REPEAT"
}

export interface TextureParameters {
    TEXTURE_MAG_FILTER:TEXTURE_MAG_FILTER;
    TEXTURE_MIN_FILTER:TEXTURE_MIN_FILTER;
    TEXTURE_WRAP:TEXTURE_WRAP;
}




export  class MGLTexture {
    handle: WebGLTexture | null;
    canHaveMipMap:boolean=false;
    constructor(private mgl:MGL,url:URL)
    {
        let handle=this.handle=mgl.gl().createTexture();
        let image=new Image();
        let gl = mgl.gl();
        image.src=url.toString();
        
        mgl.waitFor(new Promise<void|string>((resolve,reject)=>{
            image.addEventListener('load', ()=>{
                gl.bindTexture(gl.TEXTURE_2D,handle);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image)
                this.canHaveMipMap=MathUtils.isPowerOf2(image.width) &&  MathUtils.isPowerOf2(image.height)
                if (this.canHaveMipMap){
                    gl.generateMipmap(gl.TEXTURE_2D)
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
    
                resolve();
            })
            image.addEventListener('error',()=>{
                reject();
                throw Error(`Could not load Image url ${url}`)
            })
        }))

    }

    

    
}