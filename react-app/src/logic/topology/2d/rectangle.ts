import { VecStreamFloat,VecStreamInt } from "../../vecstream";
import {vec3,vec2} from "gl-matrix"
import {ITopology} from "../itopology"

export class Rectangle implements ITopology {
    _v:any;

    NVertices():number {
        return 4;
    }
    NIndices():number {
        return 3*2;
    }

    VertexDim():number {return 2;}
    
    Serialize(v:VecStreamFloat,i:VecStreamInt):void
    {
        v.push(this._v);
        i.push([0,1,3,1,2,3]);
    }

    
    //points must be in anti clock sequence
    constructor(topLeft:vec2,width:number,height:number)
    {
        this._v=new Float32Array([
            topLeft[0]      ,topLeft[1],
            topLeft[0]+width,topLeft[1],
            topLeft[0]+width,topLeft[1]+height,
            topLeft[0]      ,topLeft[1]+height,

            ]) ;
       
    }

    




}