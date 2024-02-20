import MGL from "./mgl";
import {BindingManager} from "./bindingManager";
export class MGLProgram {
   
    private program:WebGLProgram|null=null;
    private linked:boolean=false;
    public BindingManager=new BindingManager();
    constructor(private mgl:MGL, verticeShader:string,fragmentShader:string ) {
        var p1=mgl.createProgram(verticeShader,fragmentShader).then(pg=>{
            this.program=pg;
            this.linked=true;   
        });
        mgl.waitFor(p1);
        
    }


}