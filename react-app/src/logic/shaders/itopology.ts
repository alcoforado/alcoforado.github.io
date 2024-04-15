import { VecStreamFloat,VecStreamInt } from "../vecstream";
import {vec3} from "gl-matrix"
export interface ITopology {
    nVertices():number;
    nIndices():number;
    serialize(v:VecStreamFloat,i:VecStreamInt):void;
    vertexDim():number;
    draw(ctx:IDrawContext):void;
}

export interface IDrawContext {
    DrawIndexedTriangles(): void;
    
}