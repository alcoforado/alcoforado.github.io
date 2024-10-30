import { vec3,vec4 } from "gl-matrix";
import { VecStreamFloat } from "../vecstream";
import { ISerializeContext,IDrawContext } from "../shaders/ishape";
import {IRender} from "../shaders/irender"
export class CyclicColorRender implements IRender {
    _v:Float32Array= new Float32Array();
    constructor(colors:Array<vec3>|Array<vec4>)
    {
        if (!colors.length)
            throw new Error("Colors argument cannot be empty")
        this._v= new Float32Array(4*colors.length);
        let i=0;
        let colorsDim=colors[0].length;
        colors.forEach((v)=>{
            this._v[i++]=v[0];
            this._v[i++]=v[1];
            this._v[i++]=v[2];
            this._v[i++]=colorsDim===3 ? 1.0 : v[3]!
        })
    }

    serialize(ctx:ISerializeContext)
    {   
        let a=ctx.vAttributes["vColor"];
        let acum=this._v.length;
        while(acum<=a.nFloats())
        {
            a.push(this._v)
            acum+=this._v.length;
        }
        let tv = new Float32Array(4);
        debugger;
        let k=0;
        for (let i=acum-this._v.length;i<a.nFloats();i+=4)
        {
            tv[0]=this._v[k++];
            tv[1]=this._v[k++];
            tv[2]=this._v[k++];
            tv[3]=this._v[k++];
            a.push(tv);
        }
    }

    draw(ctx: IDrawContext): void {
        return;
    }


};