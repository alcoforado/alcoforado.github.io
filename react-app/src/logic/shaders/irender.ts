import { VecStreamFloat } from "../vecstream";


export interface  IRender {
    serialize(ctx:RenderContext):void;
};


export class RenderContext {
    
    constructor(public vAttributes:{[key:string]:VecStreamFloat}){};
    
    
}