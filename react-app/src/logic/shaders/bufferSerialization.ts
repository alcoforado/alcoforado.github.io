import { BufferLayout } from "./bufferLayout";

export class BufferSerialization<Top,Render> {
    _allocs:Array<VecAllocation<Top,Render>>=[];
    constructor(private bufferLayout:BufferLayout){}

    addObject(tp:Top,rnd:Render) 
    {
        this._allocs.push(new VecAllocation<Top,Render>(tp,rnd));
    }




};



class VecAllocation<Top,Render> {
    public nIndicesAllocated:number=0;
    public indexStart:number=0;
    public verticeStart:number=0;
    public nVerticesAllocated:number=0;
    constructor(private tp:Top,private rnd:Render)
    {    
    }

}