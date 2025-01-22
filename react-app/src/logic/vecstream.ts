import {vec2,vec3,vec4} from 'gl-matrix'

export class VecStreamFloat {
    _streamOffset:number=0;
    _streamOffsetInTheElement:number=0
    /**
     * 
     * @param owner The javascript native array for which this stream writes and reads from
     * @param startIndex The index of the float array to start the stream.
     * @param element_size_in_floats An element is a sequence of floats contiguous in the array  
     * @param stride_in_floats Number of floats to jump in order to go the next element 
     * @param number_of_elements How many elements this stream can store, if not provided then number of elements will be calculated from the owner array size.
     * 
     * Example for StartIndex=1, Element Size =3, Stride=2
     *                     |StartIndex=1|   
     * owner Array: |Float0|Float1      |Float2|Float3|Float4|Float5|Float6|Float7|Float8| 
     *                     |-----Element 1 -----------|--Stride-----|-----Element 2------|
     */
    constructor(private owner:Float32Array,private startIndex:number,private element_size_in_floats:number,private stride_in_floats:number,private number_of_elements:number)
    {
        this._streamOffset=startIndex;

        if (this.startIndex+(element_size_in_floats+stride_in_floats)*number_of_elements-stride_in_floats > owner.length)
        {
            throw Error("VecStreamFloat doesn't fit in the owner array");
        }
    }

    getStartIndex() { return this.startIndex; }
    getElementSizeInFloats() {return this.element_size_in_floats}
    getNumberOfElements() {return this.number_of_elements}
    getBuffer() {return this.owner}
    nFloats():number {
        return this.number_of_elements*this.element_size_in_floats;
    }

    push(v:number[]|Float32Array)
    {
        if (Math.floor((this.owner.length-this._streamOffset+this.stride_in_floats)/(this.element_size_in_floats+this.stride_in_floats))*this.element_size_in_floats < v.length)
            throw Error("VecStreamFloat is not big enough");

        for (var i=0;i<v.length;i++)
        {
            if (this._streamOffsetInTheElement++<this.element_size_in_floats)
            {
                this.owner[this._streamOffset++]=v[i]

            }
            else 
            {
                this._streamOffset+=this.stride_in_floats;
                this.owner[this._streamOffset++]=v[i]
                this._streamOffsetInTheElement=1;
            }
        }
        if (this._streamOffsetInTheElement!==this.element_size_in_floats)
        {
            throw new Error("Error vector to add into the stream is not a multiple of " + this.element_size_in_floats);
        }
    }

    pushVec2(v:vec2[]) {
        if (this.element_size_in_floats!==2)
        {
            throw new Error("Invalid size for structure")
        }

        var i=0,j=0;
        this.pushf((index)=>{
            var result = v[i][j]
            if (j===1) {
                j=0;
                i++;
            }
            else 
                j++;
            return result;
        },v.length*2);
    }

    pushVec3(v:vec3[]) {
        if (this.element_size_in_floats!==3)
        {
            throw new Error("Invalid size for structure")
        }

        var i=0,j=0;
        this.pushf((index)=>{
            var result = v[i][j]
            if (j===2) {
                j=0;
                i++;
            }
            else 
                j++;
            return result;
        },v.length*3);
    }

    pushVec4(v:vec4[]) {
        if (this.element_size_in_floats!==4)
        {
            throw new Error("Invalid size for structure")
        }

        var i=0,j=0;
        this.pushf((index)=>{
            var result = v[i][j]
            if (j===3) {
                j=0;
                i++;
            }
            else 
                j++;
            return result;
        },v.length*4);
    }
    



    pushf(fmap:(index:number)=>number,size:number)
    {
        if (Math.floor((this.owner.length-this._streamOffset+this.stride_in_floats)/(this.element_size_in_floats+this.stride_in_floats))*this.element_size_in_floats < size)
            throw Error("VecStreamFloat is not big enough");

        for (var i=0;i<size;i++)
        {
            if (this._streamOffsetInTheElement++<this.element_size_in_floats)
            {
                this.owner[this._streamOffset++]=fmap(i)

            }
            else 
            {
                this._streamOffset+=this.stride_in_floats;
                this.owner[this._streamOffset++]=fmap(i)
                this._streamOffsetInTheElement=1;
            }
        }
        if (this._streamOffsetInTheElement!==this.element_size_in_floats)
        {
            throw new Error("Error vector to add into the stream is not a multiple of " + this.element_size_in_floats);
        }
    }
 }

 export class Vec3StreamFloat extends VecStreamFloat {
    
    constructor(owner:Float32Array,startIndex:number,stride_in_floats:number,number_of_elements:number)
    
    {
        super(owner,startIndex,3,stride_in_floats,number_of_elements);
    }
 }

 export class Vec4StreamFloat extends VecStreamFloat {
    
    constructor(owner:Float32Array,startIndex:number,stride_in_floats:number,number_of_elements:number)
    
    {
        super(owner,startIndex,4,stride_in_floats,number_of_elements);
    }
 }

 export class Vec2StreamFloat extends VecStreamFloat {
    
    constructor(owner:Float32Array,startIndex:number,stride_in_floats:number,number_of_elements:number)
    
    {
        super(owner,startIndex,2,stride_in_floats,number_of_elements);
    }
 }




export class VecStreamIndex {
    streamOffset:number=0
    constructor(private owner:Uint32Array,private _startIndex:number,private _size:number,private displacement:number)
    {
        this.streamOffset=_startIndex;
    }

    get(i:number):number
    {   
        return this.owner[i+this._startIndex]
    }
    set(i:number,value:number):void
    {
        if (i>=this._size)
            throw new Error("Error index out of range");
         this.owner[i+this._startIndex]=value+this.displacement;
    }
    size(){return this._size;}
    startIndex() {return this._startIndex}

    push(v:number[])
    {
        for (var i=0;i<v.length;i++)
        {
            this.owner[this.streamOffset++]=v[i]+this.displacement;
        }
    }
}

