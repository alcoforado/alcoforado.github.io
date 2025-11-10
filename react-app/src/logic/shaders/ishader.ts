import {IShape} from "../shapes/ishape"
import {MGLProgram} from '../mgl/mglProgram'
import  DrawTree  from "./drawTree";
import MGL from "../mgl/mgl";

export class  IShader {
        protected program:MGLProgram;
        protected drawTree:DrawTree;
    
    constructor(mgl:MGL,pdrawTree:DrawTree,pprogram:MGLProgram)
    {
        this.program=pprogram;
        this.drawTree = pdrawTree;
    }

    addShape(sh:IShape):void
    {
        this.drawTree.addObject(sh);
    }

    

    draw():void
    {
        this.drawTree.draw();
    }
};



