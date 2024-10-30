import { VecStreamFloat,VecStreamIndex } from "../vecstream";
import {IDrawContext} from "./ishape"
import {vec3} from "gl-matrix"
export interface ITopology {
    nVertices():number;
    nIndices():number;
    serialize(v:VecStreamFloat,i:VecStreamIndex):void;
    vertexDim():number;
    draw(ctx:IDrawContext):void;
}

