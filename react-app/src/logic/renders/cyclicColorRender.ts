import { vec3 } from "gl-matrix";
import { VecStreamFloat } from "../vecstream";
export class CyclicColorRender {
    _v:Float32Array= new Float32Array();
    constructor(colors:Array<vec3>)
    {
        this._v= new Float32Array(3*colors.length);
        let i=0;
        colors.forEach((v)=>{
            this._v[i++]=v[0];
            this._v[i++]=v[1];
            this._v[i++]=v[2];
        })
    }

    render(a:VecStreamFloat)
    {   
        let acum=this._v.length;
        while(acum<=a.nFloats())
        {
            a.push(this._v)
        }
        let tv = new Float32Array(3);
        let k=0;
        for (let i=acum;i<a.nFloats();i+=3)
        {
            tv[0]=this._v[k++];
            tv[1]=this._v[k++];
            tv[2]=this._v[k++];
            a.push(tv);
        }
    }



};