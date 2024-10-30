import { VecStreamFloat,VecStreamIndex } from "../vecstream";
import {vec3,vec2} from "gl-matrix"
import {ITopology} from "../shaders/itopology"
import { ISerializeContext,IDrawContext } from "../shaders/ishape";
export class Rectangle implements ITopology {
    _v:any;

    nVertices():number {
        return 4;
    }
    nIndices():number {
        return 3*2;
    }

    vertexDim():number {return 2;}
    
    serialize(v:VecStreamFloat,i:VecStreamIndex):void
    {
        v.push(this._v);
        i.push([0,1,2,2,3,0]);
    }

    
    //points must be in anti clock sequence
    constructor(bottomLeft:vec2,width:number,height:number)
    {
        this._v=new Float32Array([
            bottomLeft[0]      ,bottomLeft[1],
            bottomLeft[0]+width,bottomLeft[1],
            bottomLeft[0]+width,bottomLeft[1]+height,
            bottomLeft[0]      ,bottomLeft[1]+height,

            ]) ;
       
    }

    draw(ctx: IDrawContext): void {

        ctx.DrawIndexedTriangles()
    }
    



}