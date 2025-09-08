//import { IBindingManager } from "../mgl/bindingManager";
import MGL from "../mgl/mgl";
import {VertexMGLBuffer,IndexMGLBuffer} from "../mgl/mglBuffer"
import {IShape,IDrawContext,ISerializeContext} from "../shapes/ishape"
import { VecStreamFloat, VecStreamIndex } from "../vecstream";
import { MGLProgram } from "../mgl/mglProgram";

enum DrawTreeState {EMPTY,ALLOCATED,CHANGED}

export  default class DrawTree {
    _allocs:Array<VecAllocation>=[];
    _buffer:VertexMGLBuffer;
    _elBuffer:IndexMGLBuffer;
    totalVertices:number=0;
    totalIndices: number=0;
    state: DrawTreeState=DrawTreeState.EMPTY;
    vV:Float32Array|null=null;
    vI:Uint32Array|null=null;
    constructor(private _mgl:MGL,private _program:MGLProgram){
        this._buffer=new VertexMGLBuffer(_mgl);
        this._elBuffer=new IndexMGLBuffer(_mgl);
    }

    addObject(sh:IShape) 
    {
        this._allocs.push(new VecAllocation(sh));
        this.state=DrawTreeState.CHANGED;
    }

    private allocateMemory() {
        this.totalVertices=0;
        this.totalIndices=0;
        this._allocs.forEach(alloc=>{
            this.totalVertices+=alloc.shape.nVertices();
            this.totalIndices+=alloc.shape.nIndices()
        });
        var bindingManager=this._program.GetBindingManager();
        var nFloats = this.totalVertices*bindingManager.getVertexDataSizeInFloats();
        if (this.vV ==null || this.vV.length < nFloats)
            this.vV=new Float32Array(nFloats);

        if (this.vI ==null || this.vI.length < this.totalIndices)
            this.vI=new Uint32Array(this.totalIndices);

        var distributor=  this._program.GetBindingManager().getAttributeDataIterator(this.vV);
        let indexStart=0;
        let nElems=0;
        this._allocs.forEach(alloc=>{
            let subArrays=distributor.getChunk(alloc.shape.nVertices());
            let indices= new VecStreamIndex(this.vI!,indexStart,alloc.shape.nIndices(),nElems);
            nElems+=alloc.shape.nVertices();
            alloc.indices=indices;
            alloc.attributes=subArrays;
            indexStart+=alloc.shape.nIndices()
        })
    }

    private serialize(){
        
        this.allocateMemory();
         this._allocs.forEach(alloc=>{
                alloc.shape.serialize(new SerializeContext(alloc.attributes!,alloc.indices!));
         })  
    }

    draw() 
    {
        debugger;
        this._buffer.setAsActive();
        this._elBuffer.setAsActive();
        this._program.setAsActive();
        if (this.state === DrawTreeState.CHANGED)
            {
                this.serialize();
                this._buffer.load(this.vV!);
                this._elBuffer.load(this.vI!)
            }
        this._program.GetBindingManager().setVertexArrayBinding(this.vV!)
        this._allocs.forEach(alloc=>{
            alloc.shape.draw(new DrawContext(this._mgl,alloc));

        })
    }


};



class VecAllocation {
    public indices: VecStreamIndex|null=null;
    public attributes:{[key:string]:VecStreamFloat}|null=null;
    constructor(public shape:IShape)
    {    

    }

}

class DrawContext implements IDrawContext {
    constructor(private mgl:MGL,private alloc:VecAllocation){}
    DrawIndexedTriangles(): void {
        let gl=this.mgl.gl();
        gl.drawElements(gl.TRIANGLES,
            this.alloc.indices!.size(),
            gl.UNSIGNED_INT,
            4*this.alloc.indices!.startIndex()   
        )
    }
    DrawPoints():void {
        let gl=this.mgl.gl();
        let pos=this.alloc.attributes!["position"];
        gl.drawArrays(gl.POINTS,pos.getStartIndex(),pos.getNumberOfElements())
    }
}

export class SerializeContext  implements  ISerializeContext{
    constructor(public vAttributes:{[key:string]:VecStreamFloat},public indices:VecStreamIndex){};
}


