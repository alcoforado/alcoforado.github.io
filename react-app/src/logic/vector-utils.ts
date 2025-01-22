import {vec2} from 'gl-matrix';
export  class VectorUtils
{

    static toFloat32Array(v:vec2[]):Float32Array
    {
        let r=new Float32Array(v.length*2);
        var k=0;
        for(var i=0;i<v.length;i++) {
            r[k++]=v[i][0];
            r[k++]=v[i][1];
        }
        return r;
        
    }

    static cyclicArray<T>(v:Array<T>,newLength:number):Array<T>
    {
        let result:Array<T> = new Array<T>(newLength);
        var j=0;
        for (let i=0;i<newLength;i++)
        {
            if (j===v.length)
                j=0;
            result[i]=v[j++];
        }
        return result;
    }

}