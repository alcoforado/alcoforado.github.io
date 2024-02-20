export class BufferLayout {
    public attributes:Array<BufferLayoutItem>=[];
    private _totalBytes:number=0;
    public add(shaderVarName:string,sizeInFloats:number):BufferLayout 
    {
        if (this.attributes.findIndex((value)=>value.ShaderVariableName==shaderVarName)>=0)
        {
            throw Error(`Field ${shaderVarName} already exists`);
        }
        this.attributes.push(new BufferLayoutItem(shaderVarName,sizeInFloats));
    
        return this;
    }

    

    
   
};



class BufferLayoutItem {
    public ProgramIndexLocation:number=-1;
    constructor(public ShaderVariableName:string,public SizeInFloat:number){}
}