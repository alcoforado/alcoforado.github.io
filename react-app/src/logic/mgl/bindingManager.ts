    import { VecStreamFloat } from '../vecstream';
import MGL from './mgl';

type OnBeforeFirstExecutionHandler=(mgl:MGL)=>void;

export interface IBindingConfiguration {
    addVertexAttribute(shaderVarName:string,sizeInFloats:number):IBindingConfiguration;
    addUniformInt(varName:string):IBindingConfiguration;
    onBeforeFirstExecution:OnBeforeFirstExecutionHandler|null;
    

}

export interface IBindingManager {
    getPositionAttribute():BufferLayoutItem
    getVertexAttribute(shaderVarName:string):BufferLayoutItem;
    getVertexDataSizeInFloats():number; //the number of floats of all the vertex attributes, position included
    forEachAttribute(f: (at: BufferLayoutItem) => void):void; 
    getAttributeDataIterator(v:Float32Array):AttributesArrayDistributor;
    setVertexArrayBinding(v:Float32Array):void;
    

}

export class BufferLayoutItem {
    public ProgramIndexLocation:number=-1;
    constructor(public ShaderVariableName:string,public SizeInFloat:number){}
}

export enum UniformType {INT="integer",TEXTURE="texture"}
class UniformVariable {
    private _currentValue:any;
    public Location:WebGLUniformLocation=-1;

    constructor(public name:string,public Type:UniformType)
    {
        this._currentValue=null;
        
    }


}

export class BindingManager implements IBindingConfiguration, IBindingManager {
    
    
    private  _vertexSize:number=0;
    
    public onBeforeFirstExecution:OnBeforeFirstExecutionHandler|null=null;
    
    constructor(private _mgl:MGL){}

    private attributes:Array<BufferLayoutItem>=[];
    private uniformVariables:Map<string,UniformVariable>=new Map();


    getPositionAttribute() {
        var result= this.attributes.find(x=>x.ShaderVariableName==="position");
        if (!result)
            throw Error("Expect one Vertex Attribute to have a name equal to 'position'");
        return {...result};
    }

    getVertexAttribute(shaderVarName:string)
    {
        var result= this.attributes.find(x=>x.ShaderVariableName===shaderVarName);
        if (!result)
            throw Error("Expect one Vertex Attribute to have a name equal to 'position'");
        return {...result};
    }

        
    addVertexAttribute(shaderVarName:string,sizeInFloats:number):IBindingConfiguration
    {
        if (this.attributes.findIndex((value)=>value.ShaderVariableName==shaderVarName)>=0)
        {
            throw Error(`Field ${shaderVarName} already exists`);
        }
        if (sizeInFloats>4)
            throw Error("Size in floats must be 1 2 3 or 4");
        this.attributes.push(new BufferLayoutItem(shaderVarName,sizeInFloats));
        this._vertexSize+=sizeInFloats;
        return this;
    }

    addUniformInt(varName:string):IBindingConfiguration
    {
        this.uniformVariables.set(varName,new UniformVariable(varName,UniformType.INT));
        return this;
    }

    forEachAttribute(f: (at: BufferLayoutItem) => void) {
        this.attributes.forEach((el)=>{
            let x={...el};
            f(x);
        })
    }

    getVertexDataSizeInFloats() {
        return this._vertexSize;
    }

    assignSlots(pg: WebGLProgram) {
        this.attributes.forEach(attr=>{
            var result=this._mgl.gl().getAttribLocation(pg,attr.ShaderVariableName);
            if (result === this._mgl.gl().INVALID_OPERATION)
            {
                throw Error(`Variable ${attr.ShaderVariableName} not found in program`)
            }
            attr.ProgramIndexLocation=result;
        })
        this.uniformVariables.forEach((uvar,key)=>{
            let location=this._mgl.gl().getUniformLocation(pg,key);
            if (location == null)
            {
                throw Error(`Uniform Variable ${uvar.name} not found in program`)
            }
            uvar.Location=location;
        })
    }

    getAttributeDataIterator(v:Float32Array):AttributesArrayDistributor {
        return new AttributesArrayDistributor(v,this);
    }

    setVertexArrayBinding(v:Float32Array){
        let nElems=v.length/this.getVertexDataSizeInFloats();
        let startIndex=0;
        let gl=this._mgl.gl();
        this.attributes.forEach(attr=>{
            gl.vertexAttribPointer(attr.ProgramIndexLocation,attr.SizeInFloat,gl.FLOAT,false,0,startIndex);
            gl.enableVertexAttribArray(attr.ProgramIndexLocation);
            startIndex+=attr.SizeInFloat*4*nElems;
        })
    }
}

class AttributesArrayDistributor {
    private nElems:number=0;
    private subArrays:{[key:string]:VecStreamFloat}={};
    constructor(private v:Float32Array,private bindingManager:IBindingManager){
        this.nElems=v.length/bindingManager.getVertexDataSizeInFloats();
        let startIndex=0;
        this.bindingManager.forEachAttribute(at=>{
            this.subArrays[at.ShaderVariableName]=new  VecStreamFloat(v,startIndex,at.SizeInFloat,0,0);
            startIndex=startIndex+this.nElems*at.SizeInFloat;
        })
    }

    getChunk(nVertices:number)
    {
        for (var key in this.subArrays)
        {
            let old= this.subArrays[key];
            this.subArrays[key]=new VecStreamFloat(
                old.getBuffer(), //original buffer
                old.getStartIndex()+old.nFloats(), //start index
                old.getElementSizeInFloats(), 
                0, //stride
                 nVertices) //nElems
        }
        return {...this.subArrays};
    }
}