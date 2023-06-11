export class VecStreamFloat {
    streamOffset:number=0
    constructor(private owner:Float32Array,private startIndex:number,private size:number,private struct_size:number,private struct_offset:number,private elem_size:number)
    {
        this.streamOffset=startIndex*struct_size+struct_offset;
    }

    

    push(v:number[]|Float32Array)
    {
        var j=0;
        for (var i=0;i<v.length;i++)
        {
            if (j++<this.elem_size)
            {
                this.owner[this.streamOffset++]=v[i]
            }
            else 
            {
                j=0;
                this.streamOffset+=this.struct_size-this.elem_size;
            }
        }
    }
    


}


export class VecStreamInt {
    streamOffset:number=0
    constructor(private owner:Int32Array,private startIndex:number,private size:number)
    {
        this.streamOffset=startIndex;
    }

    get(i:number):number
    {   
        return this.owner[i+this.startIndex]
    }
    set(i:number,value:number):void
    {
        if (i>=this.size)
            throw "Error index out of range";
         this.owner[i+this.startIndex]=value;
    }

    push(v:number[])
    {
        for (var i=0;i<v.length;i++)
        {
            this.owner[this.streamOffset++]=v[i]
        }
    }

}

