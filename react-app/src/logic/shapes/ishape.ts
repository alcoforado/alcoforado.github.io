import { VecStreamFloat,VecStreamIndex } from "../vecstream";


export interface  IShape {
    nVertices():number;
    nIndices():number;
    vertexDim():number;


    serialize(ctx:ISerializeContext):void;
    draw(ctx:IDrawContext):void;
};

export interface ISerializeContext {
    vAttributes:{[key:string]:VecStreamFloat},
    indices:VecStreamIndex
}





export interface IDrawContext {
    DrawIndexedTriangles(): void;
    DrawTriangles():void;
    DrawPoints():void;
}
