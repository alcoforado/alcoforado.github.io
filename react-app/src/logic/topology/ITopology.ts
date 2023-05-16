import { VecStreamFloat,VecStreamInt } from "../vecstream";
import {vec3} from "gl-matrix"
export interface ITopology {
    NVertices():number;
    NIndices():number;
    Serialize(v:VecStreamFloat,i:VecStreamInt):void;
    
}

export class Rectangle implements ITopology {
    _v:any;

    NVertices():number {
        return 4;
    }
    NIndices():number {
        return 3*2;
    }
    
    Serialize(v:VecStreamFloat,i:VecStreamInt):void
    {
        v.push(this._v);
        i.push([0,1,3,1,2,3]);
    }

    
    //points must be in anti clock sequence
    Rectangle(p1:vec3,p2:vec3,p3:vec3,p4:vec3):void
    {
        this._v=new Float32Array(4*3);
        var vs=new VecStreamFloat(this._v,0,4*3);
        vs.push(p1);
        vs.push(p2);
        vs.push(p3);
        vs.push(p4);
    }


}