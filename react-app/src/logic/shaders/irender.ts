import { ISerializeContext } from "./ishape";
import {IDrawContext} from "./ishape"
export interface  IRender {
    serialize(ctx:ISerializeContext):void;
    draw(ctx:IDrawContext):void;
};



