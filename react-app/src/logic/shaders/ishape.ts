import { VecStreamFloat } from "../vecstream";


export interface  IShape {
    nVertices():number;
    nIndices():number;
    vertexDim():number;


    serialize(ctx:ISerializeContext):void;
    draw(ctx:IDrawContext):void;
};

export interface ISerializeContext {
    vAttributes:{[key:string]:VecStreamFloat}
}





export interface IDrawContext {
    DrawIndexedTriangles(): void;
    DrawPoints():void;
}
