import { BindingManager } from "../mgl/bindingManager";
import { BufferLayout } from "../mgl/bufferLayout";
import MGL from "../mgl/mgl";
import {MGLBuffer} from "../mgl/mglBuffer"
import {ITopology,IDrawContext} from "./itopology"
import {IRender, RenderContext} from "./irender";
import { VecStreamFloat, VecStreamInt } from "../vecstream";
export  default class DrawTree<Render> {
    _allocs:Array<VecAllocation>=[];
    _buffer:MGLBuffer;
    totalVertices:number=0;
    totalIndices: number=0;
    vV:Float32Array|null=null;
    vI:Int32Array|null=null;
    constructor(private _mgl:MGL,private bufferLayout:BufferLayout,private _bindingManager:BindingManager){
        this._buffer=new MGLBuffer(_mgl);
        
    }

    addObject(tp:ITopology,rnd:IRender) 
    {
        this._allocs.push(new VecAllocation(tp,rnd));

    }

    private allocateMemory() {
        this.totalVertices=0;
        this.totalIndices=0;
        this._allocs.forEach(alloc=>{
            this.totalVertices+=alloc.topology.nVertices();
            this.totalIndices+=alloc.topology.nIndices()
        });

        this.vV=new Float32Array(this.totalVertices*this._bindingManager.VertexAttributes.elemSize());
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

    serialize(){
        if (!this.vV)
            this.allocateMemory();

         this._allocs.forEach(alloc=>{
            alloc.topology.serialize(alloc.attributes!["position"],alloc.indices!);
            alloc.render.serialize(new RenderContext(alloc.attributes!));
         })  
    }

    draw() {

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