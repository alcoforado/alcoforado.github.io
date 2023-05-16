export default class MGL {
    _gl:WebGLRenderingContext|null;
    constructor(canvas:HTMLCanvasElement|null)
    {
        
        this._gl=canvas?.getContext('webgl') ?? null
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

    setProgram(urlVerticeShader:URL,urlFragmentShader:URL):Promise<WebGLProgram>
    {
        var fShader:string;
        var vShader:string="";
        var fShader:string="";
        var p1 = fetch(urlVerticeShader).then(response=>response.text())
        var p2 = fetch(urlFragmentShader).then(response=>response.text())
        
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
            return program;
        })
    }

    
}