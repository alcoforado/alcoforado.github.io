import {IShader} from '../shaders/ishader'
import {ShaderType,ShaderFactory} from '../shaders/shader-factory'
import {IShape} from '../shapes/ishape'
export default class MGL {
    getScreenWidth() {
      return this._gl?.canvas.width!;
    }
    getScreenHeight() {
      return this._gl?.canvas.height!;
    }
    _gl:WebGLRenderingContext|null;
    private _shaders:{[key:number]:IShader}={}
    _initPromises:Array<Promise<any>>=[];
    constructor(canvas:HTMLCanvasElement|null)
    {
        this._gl=canvas?.getContext('webgl2') ?? null
        if (this._gl==null)
            throw new Error("WebGL not supported by the browser. Please update your browser to the latest version");
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
        var str=this.gl().getShaderInfoLog(shader);
        throw new Error(`Error compiling shader ${source}: ${str}`);
        //this.gl().deleteShader(shader);

    }

    loadShader(tp:ShaderType)
    {
        if (this._shaders[tp])
            return;
        this._shaders[tp]=ShaderFactory(this,tp);
    }

    getShader(tp:ShaderType)
    {
        return this._shaders[tp];
    }

    register(tp:ShaderType,sh:IShape)
    {
        this.getShader(tp).addShape(sh);
    }

    draw() {
        for (let key in this._shaders)
        {
            this._shaders[key].draw();
        }
    }

    loadFile(file:string,callbackFn:(a:string)=>void) {
        let p=  new  Promise<string>((resolve,reject)=>{
            fetch(file).then((response)=>{
                if (response.ok)
                {
                    response.text()
                    .then(data=>{
                        callbackFn(data);
                        resolve(data)
                    })
                    .catch(()=> 
                    { 
                        console.log(`corrupted data while accessing ${file}`);
                        reject();
                    })
                }
                else {
                    console.log(`Could not load file ${file}: ${response}`)
                    reject();
                }
            })
        })
        this.waitFor(p)
    }

    gl():WebGLRenderingContext
    {
        if (this._gl)
            return this._gl!;
        throw "WebContext GL is invalid"
    }

    createProgram(urlVerticeShader:string,urlFragmentShader:string):Promise<WebGLProgram>
    {
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

    waitFor(p:Promise<any>)
    {
        this._initPromises.push(p);
    }

    waitInitialization(callback:()=>void)
    {
        
        Promise
        .all(this._initPromises)
        .then(callback)
    }

    
}