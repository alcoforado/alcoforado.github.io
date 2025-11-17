import MGL from "./mgl";
import { BindingManager, IBindingConfiguration, IBindingManager } from './bindingManager';
type ConfigFunction = (configuration:IBindingConfiguration) => void;




export class MGLProgram {
   
    private _configs:ConfigFunction[]=[];
    private program:WebGLProgram|null=null;
    private linked:boolean=false;
    private BindingManager:BindingManager;
    
    
    constructor(private mgl:MGL, verticeShader:string,fragmentShader:string ) {
        this.BindingManager = new BindingManager(mgl);
        var p1=mgl.createProgram(verticeShader,fragmentShader).then(pg=>{
            this.program=pg;
            this.linked=true;  
            this.setAsActive();
            this._configs.forEach(f=>{
                f(this.BindingManager)
            })
            this.BindingManager.assignSlots(pg);
            if (this.BindingManager.onBeforeFirstExecution)
            {
                this.BindingManager.onBeforeFirstExecution(this.mgl);
            }            
        });
        mgl.waitFor(p1);
    }
    
    GetBindingManager():IBindingManager {
        return this.BindingManager;
    }

    setAsActive() {
        if (!this.linked)
            throw Error("Cant set program as active, it was not linked yet")
        this.mgl.gl().useProgram(this.program);
    }
    
    listUniforms() {
        if (!this.linked)
            throw Error("Cant list uniforms, it was not linked yet")
        const numUniforms = this.mgl.gl().getProgramParameter(this.program!, this.mgl.gl().ACTIVE_UNIFORMS);
        var result:WebGLActiveInfo[]=[];
        for (let i = 0; i < numUniforms; ++i) {
            const info = this.mgl.gl().getActiveUniform(this.program!, i);
            if (info)
                result.push(info);
        }
        return result;
    }

    config(c:ConfigFunction){
        if (this.linked) //program linked, execture right away
        {
            c(this.BindingManager);
        }
        else 
            this._configs.push(c);
    }

    

}

