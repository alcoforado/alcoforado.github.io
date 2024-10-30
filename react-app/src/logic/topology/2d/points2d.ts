import { VecStreamFloat,VecStreamIndex } from "../../vecstream";
import {vec2,vec3} from "gl-matrix"
import {IDrawContext, ISerializeContext,IShape} from "../../shaders/ishape"

export class Points2D implements IShape {
    _v:any;

    nVertices():number {
        return this._v.length/2.0;
    }
    nIndices():number {
        return 0;
    }

    vertexDim():number {return 2;}
    
    serialize(ctx:ISerializeContext):void
    {
        ctx.vAttributes["position"].push(this._v);
    }

    
    
    constructor(v:vec2[],rgbn:vec3[])
    {
        this._v=new Float32Array(v.length*2);
        var k=0;
        for(var i=0;i<v.length;i++) {
            this._v[k++]=v[i][0];
            this._v[k++]=v[i][1];
        }

    }

    draw(ctx: IDrawContext): void {
        
        ctx.DrawPoints()
    }
    



}