import { VecStreamFloat,VecStreamIndex } from "../../vecstream";
import {IDrawContext} from "../../shapes/ishape"
import {vec3} from "gl-matrix"
export interface ITopology2D {
    nVertices():number;
    nIndices():number;
    serialize(v:VecStreamFloat,i:VecStreamIndex):void;
}

