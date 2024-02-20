import { VecStreamFloat,VecStreamInt } from "../vecstream";
import {vec3} from "gl-matrix"
export interface ITopology {
    NVertices():number;
    NIndices():number;
    Serialize(v:VecStreamFloat,i:VecStreamInt):void;
    VertexDim():number;
}