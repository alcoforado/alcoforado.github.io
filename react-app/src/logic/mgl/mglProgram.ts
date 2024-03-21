import MGL from "./mgl";
import {BindingManager,IBindingContext} from "./bindingManager";
type ConfigFunction = (_context:IBindingContext) => void;
export class MGLProgram {
    private _configs:{(_context:IBindingContext):void}  []=[];
    private program:WebGLProgram|null=null;
    private linked:boolean=false;
    private _bindingManager:BindingManager;
    
    
    constructor(private mgl:MGL, verticeShader:string,fragmentShader:string ) {
        this._bindingManager = new BindingManager(mgl);
        var p1=mgl.createProgram(verticeShader,fragmentShader).then(pg=>{
            this.program=pg;
            this.linked=true;  
            this._bindingManager.assignSlots(pg);
            this._configs.forEach(f=>{
                f(this._bindingManager)
            })
        });
        mgl.waitFor(p1);
        
    }
    
    
    config(c:ConfigFunction){
        if (this.linked) //program linked, execture right away
        {
            c(this._bindingManager);
        }
        else 
            this._configs.push(c);
    }

    

}