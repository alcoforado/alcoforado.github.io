import {MGLBuffer} from "./mglBuffer"

export default class MGL {
    _gl:WebGLRenderingContext|null;
    constructor(canvas:HTMLCanvasElement|null)
    {
        
        this._gl=canvas?.getContext('webgl2') ?? null
    }
    compileShader(source:string,type:number):WebGLShader
    {
        var shader=this.gl().createShader(type);
        if (!shader)
        {
            throw  `could not create shader`;
        }
        this.gl().shaderSource(shader,source);
        this.gl().compileShader(shader);
        var success = this.gl().getShaderParameter(shader,this.gl().COMPILE_STATUS);
        if (success)
            return shader
        this.gl().deleteShader(shader);
        throw this.gl().getShaderInfoLog(shader)

    }

    gl():WebGLRenderingContext
    {
        if (this._gl)
            return this._gl!;
        throw "WebContext GL is invalid"
    }

    createProgram(urlVerticeShader:string,urlFragmentShader:string):Promise<WebGLProgram>
    {
        var fShader:string="";
        var vShader:string="";
        var fShader:string="";
        var p1 = fetch(urlVerticeShader).then(response=>response.text(), ()=>{throw new Error("Invalid Vertice Shader "+urlVerticeShader)})
        var p2 = fetch(urlFragmentShader).then(response=>response.text(),()=>{throw new Error("Invalid pixel shader "+urlFragmentShader)})
        
        return Promise.all([p1,p2]).then((values:string[])=>{
            var vSource=values[0];
            var fSource=values[1];
            var program = this.gl().createProgram();
            if (program == null)
            {
                throw "could not allocate program";
            }
            this.gl().attachShader(program,this.compileShader(vSource,this.gl().VERTEX_SHADER));
            this.gl().attachShader(program,this.compileShader(fSource,this.gl().FRAGMENT_SHADER));
            this.gl().linkProgram(program);
            this.gl().validateProgram(program);
            if (!this.gl().getProgramParameter(program, this.gl().LINK_STATUS)) {
                const info = this.gl().getProgramInfoLog(program);
                throw `Could not compile WebGL program. \n\n${info}`;
              }
            return program;
        });
    }

    createBuffer():MGLBuffer {
  
        return new MGLBuffer(this);
    }

    
}