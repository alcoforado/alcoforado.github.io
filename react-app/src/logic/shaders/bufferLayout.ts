export class BufferLayout {
    private _v:Array<BufferLayoutItem>=[];
    private _totalBytes:number=0;
    public addMember(shaderVarName:string,fieldType:LayoutFieldType):BufferLayout 
    {
        if (this._v.findIndex((value)=>value.ShaderVariableName==shaderVarName))
        {
            throw `Field ${shaderVarName} already exists`;
        }
        this._v.push({
            ShaderVariableName:shaderVarName,
            FieldType:fieldType,
            StructOffsetInBytes:0
        });
        this.updateOffsets();
        return this;
    }
    private updateOffsets() {
        let acum=0;
        this._v.forEach((v)=>{
            v.StructOffsetInBytes=acum;
            acum+=this.sizeInBytes(v.FieldType)
        })
        this._totalBytes=acum;
    }
    private sizeInBytes(fieldType:LayoutFieldType) {
        switch(fieldType)
        {
            case "VEC3":
                return 3*4;
            default:
                return 3*4;
        }
    }
};

export enum  LayoutFieldType {
    VEC3="VEC3"
}


class BufferLayoutItem {
    public StructOffsetInBytes:number=0;
    constructor(public ShaderVariableName:string,public FieldType:LayoutFieldType){}
}