import MGL from "./mgl";

export class BufferLayout {
    
    public attributes:Array<BufferLayoutItem>=[];
    public _totalBytes:number=0;
    private _elemSize:number=0;
    public add(shaderVarName:string,sizeInFloats:number,programIndex:number=-1):BufferLayout 
    {
        if (this.attributes.findIndex((value)=>value.ShaderVariableName==shaderVarName)>=0)
        {
            throw Error(`Field ${shaderVarName} already exists`);
        }
        this.attributes.push(new BufferLayoutItem(shaderVarName,sizeInFloats,programIndex));
    
        return this;
    }

    assignSlots(  mgl:MGL ,pg: WebGLProgram) {
        this._elemSize=0;
        this.attributes.forEach(elem=>{
            var result=mgl.gl().getAttribLocation(pg,elem.ShaderVariableName);
            if (result === mgl.gl().INVALID_OPERATION)
            {
                throw Error(`Variable ${elem.ShaderVariableName} not found in program`)
            }
            elem.ProgramIndexLocation=result;
            this._elemSize++;
        })
        
    }
    elemSize() {
        return this._elemSize; 
    }



    
   
};



class BufferLayoutItem {
    public ProgramIndexLocation:number=-1;
    constructor(public ShaderVariableName:string,public SizeInFloat:number,public programIndex:number){}
}