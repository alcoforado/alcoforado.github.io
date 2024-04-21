import { VecStreamFloat,VecStreamInt } from "../../vecstream";
import {vec3,vec2} from "gl-matrix"
import {IDrawContext, ITopology} from "../../shaders/itopology"

export class Rectangle implements ITopology {
    _v:any;

    nVertices():number {
        return 4;
    }
    nIndices():number {
        return 3*2;
    }

    vertexDim():number {return 2;}
    
    serialize(v:VecStreamFloat,i:VecStreamInt):void
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

    draw(ctx: IDrawContext): void {
        ctx.DrawIndexedTriangles()
    }
    



}