import { BufferLayout } from "../mgl/bufferLayout";
import MGL from "../mgl/mgl";
import {MGLBuffer} from "../mgl/mglBuffer"
import { MGLProgram } from "../mgl/mglProgram";
import {ITopology} from "./itopology"
export  default class DrawTree<Render> {
    _allocs:Array<VecAllocation<Render>>=[];
    constructor(private _mgl:MGL,private program:MGLProgram){
        
    }

    addObject(tp:ITopology,rnd:Render) 
    {
        this._allocs.push(new VecAllocation<Render>(tp,rnd));
        

    }

    copmputeTotalMemory() {
        let startVertice=0;
        let startVIndex=0;
        let startIIndex=0;
        this._allocs.forEach(alloc=>{
            alloc.verticeStart=startVIndex;
            alloc.indexStart=startIIndex;
            alloc.nIndicesAllocated=alloc.topology.nIndices();
            alloc.nVerticesAllocated=alloc.topology.nVertices();
            startVIndex+=alloc.topology.nVertices()*3;
            startIIndex+=alloc.topology.nIndices();
        });
        

    }

    serialize(){

    }


};



class VecAllocation<Render> {
    public nIndicesAllocated:number=0;
    public indexStart:number=0;
    public verticeStart:number=0;
    public nVerticesAllocated:number=0;
    constructor(public topology:ITopology,public render:Render)
    {    
    }

}