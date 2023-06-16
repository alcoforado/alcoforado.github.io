export class VecStreamFloat {
    streamOffset:number=0
    constructor(private owner:Float32Array,private startIndex:number,private size:number,private struct_size:number,private struct_offset:number,private elem_size:number)
    {
        this.streamOffset=startIndex;
    }

    nFloats():number {
        return this.size;
    }

    push(v:number[]|Float32Array)
    {
        if (v.length+this.streamOffset>=this.size)
            throw new Error("Array to insert will overflow the buffer")
        let j=0;
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
        if (j!==0)
        {
            throw new Error("Error vector to add into the stream is not a multiple of " + this.elem_size);
        }
    }
 }

 export class Vec3StreamFloat extends VecStreamFloat {
    
    constructor(owner:Float32Array,startIndex:number,size:number, struct_size:number, struct_offset:number)
    {
        super(owner,startIndex,size,struct_size,struct_offset,3);
    }
 }


 export class Vec4StreamFloat extends VecStreamFloat {
    
    constructor(owner:Float32Array,startIndex:number,size:number, struct_size:number, struct_offset:number)
    {
        super(owner,startIndex,size,struct_size,struct_offset,4);
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

