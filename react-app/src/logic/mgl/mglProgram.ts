import MGL from "./mgl";
import {BindingManager} from "./bindingManager";
export class MGLProgram {
   
    private program:WebGLProgram|null=null;
    private linked:boolean=false;
    public BindingManager:BindingManager;
    constructor(private mgl:MGL, verticeShader:string,fragmentShader:string ) {
        this.BindingManager=new BindingManager(this.mgl); 
        var p1=mgl.createProgram(verticeShader,fragmentShader).then(pg=>{
            this.program=pg;
            this.linked=true;  
        });
        mgl.waitFor(p1);
        
    }

    isLinked():Boolean {return this.linked}


}