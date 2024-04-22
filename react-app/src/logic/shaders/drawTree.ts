import { BindingManager } from "../mgl/bindingManager";
import { BufferLayout } from "../mgl/bufferLayout";
import MGL from "../mgl/mgl";
import {MGLBuffer} from "../mgl/mglBuffer"
import {ITopology,IDrawContext} from "./itopology"
import {IRender, RenderContext} from "./irender";
import { VecStreamFloat, VecStreamInt } from "../vecstream";

enum DrawTreeState {EMPTY,ALLOCATED,CHANGED}

export  default class DrawTree<Render> {
    _allocs:Array<VecAllocation>=[];
    _buffer:MGLBuffer;
    _elBuffer:MGLBuffer;
    totalVertices:number=0;
    totalIndices: number=0;
    state: DrawTreeState=DrawTreeState.EMPTY;
    vV:Float32Array|null=null;
    vI:Int32Array|null=null;
    constructor(private _mgl:MGL,private bufferLayout:BufferLayout,private _bindingManager:BindingManager){
        this._buffer=new MGLBuffer(_mgl,MGLBuffer.BufferType.ARRAY_BUFFER );
        this._elBuffer=new MGLBuffer(_mgl,MGLBuffer.BufferType.ELEMENT_ARRAY_BUFFER);
    }

    addObject(tp:ITopology,rnd:IRender) 
    {
       
        this._allocs.push(new VecAllocation(tp,rnd));
        this.state=DrawTreeState.CHANGED;
    }

    private allocateMemory() {
        this.totalVertices=0;
        this.totalIndices=0;
        this._allocs.forEach(alloc=>{
            this.totalVertices+=alloc.topology.nVertices();
            this.totalIndices+=alloc.topology.nIndices()
        });

        var nFloats = this.totalVertices*this._bindingManager.VertexAttributes.elemSize();
        if (this.vV ==null || this.vV.length < nFloats)
            this.vV=new Float32Array(nFloats);

        if (this.vI ==null || this.vI.length < this.totalIndices)
            this.vI=new Int32Array(this.totalIndices);

        var distributor=  new AttributesArrayDistributor(this.vV,this._bindingManager.VertexAttributes);
        let indexStart=0;
        this._allocs.forEach(alloc=>{
            let subArrays=distributor.getChunk(alloc.topology.nVertices());
            let indices= new VecStreamInt(this.vI!,indexStart,alloc.topology.nIndices());
            alloc.indices=indices;
            alloc.attributes=subArrays;
            indexStart+=alloc.topology.nIndices()
            
        })

        

    }

    private serialize(){
        
        this.allocateMemory();
         this._allocs.forEach(alloc=>{
            alloc.topology.serialize(alloc.attributes!["position"],alloc.indices!);
            alloc.render.serialize(new RenderContext(alloc.attributes!));
         })  
    }

    draw() 
    {
        this._buffer.setAsActive();
        this._elBuffer.setAsActive();
        if (this.state == DrawTreeState.CHANGED)
        {
            this.serialize();
            this._buffer.load(this.vV);
            this._elBuffer.load(this.vI)
        }


        this._allocs.forEach(alloc=>{
            alloc.topology.draw(new DrawContext(this._mgl,alloc));
        })

    }


};



class VecAllocation {
    public indices: VecStreamInt|null=null;
    public attributes:{[key:string]:VecStreamFloat}|null=null;
    constructor(public topology:ITopology,public render:IRender)
    {    
    }

}

class DrawContext implements IDrawContext {
    constructor(private mgl:MGL,private alloc:VecAllocation){}
    DrawIndexedTriangles(): void {
        let gl=this.mgl.gl();
    }
}

class AttributesArrayDistributor {
    private nElems:number=0;
    private subArrays:{[key:string]:VecStreamFloat}={};
    constructor(private v:Float32Array,private vertexAttributes:BufferLayout){
        this.nElems=v.length/vertexAttributes.elemSize();
        let startIndex=0;
        this.vertexAttributes.attributes.forEach(at=>{
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
        return this.subArrays;
    }

   
    



}