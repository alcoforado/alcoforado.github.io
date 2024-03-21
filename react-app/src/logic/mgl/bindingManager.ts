import {BufferLayout} from './bufferLayout' 
import MGL from './mgl';

export interface IBindingContext {
    addVertexAttribute(shaderVarName:string,sizeInFloats:number):IBindingContext;

}

export class BindingManager implements IBindingContext {
    
    
    
    
    
    constructor(private _mgl:MGL){}

    VertexAttributes:BufferLayout=new BufferLayout();

    getPositionAttribute() {
        var result= this.VertexAttributes.attributes.find(x=>x.ShaderVariableName==="position");
        if (!result)
            throw Error("Expect one Vertex Attribute to have a name equal to 'position'");
        return result;
    }
    


    addVertexAttribute(shaderVarName:string,sizeInFloats:number):IBindingContext
    {
        this.VertexAttributes.add(shaderVarName,sizeInFloats)
        return this;
    }

    assignSlots(pg: WebGLProgram) {
        this.VertexAttributes.assignSlots(this._mgl,pg);
    }




}