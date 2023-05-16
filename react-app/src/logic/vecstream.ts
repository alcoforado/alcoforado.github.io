export class VecStreamFloat {
    streamOffset:number=0
    constructor(private owner:Float32Array,private startIndex:number,private size:number)
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

    push(v:number[]|Float32Array)
    {
        for (var i=0;i<v.length;i++)
        {
            this.owner[this.streamOffset++]=v[i]
        }
    }
    pushF(v:Float32Array)
    {
        for (var i=0;i<v.length;i++)
        {
            this.owner[this.streamOffset++]=v[i]
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

