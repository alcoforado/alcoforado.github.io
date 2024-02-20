import {VecStreamFloat} from '../vecstream'

describe("Vector Stream",()=>{
it("Vecstream Element Size 3 stride 0",()=>{
    var v=new Float32Array([
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]);

    var result=new VecStreamFloat(v,0,3,0,3);
    expect(result.nFloats()).toBe(9);
    result.push([1,1,1]);
    result.push([2,2,2]);
    result.push([3,3,3]);
    console.log(JSON.stringify(v))
    expect(v).toEqual(new Float32Array([1,1,1,2,2,2,3,3,3,0,0,0,0,0]))
})

it("Vecstream Element Size 3 stride 1",()=>{
    var v=new Float32Array([
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]);

    var result=new VecStreamFloat(v,0,3,1,3);
    expect(result.nFloats()).toBe(9);
    result.push([1,1,1]);
    result.push([2,2,2]);
    result.push([3,3,3]);
    expect(v).toEqual(new Float32Array([1,1,1,0,2,2,2,0,3,3,3,0,0,0]))
})

it("Vecstream Element Size 3 stride 1 StartIndex 2",()=>{
    var v=new Float32Array([
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]);

    var result=new VecStreamFloat(v,2,3,1,3);
    expect(result.nFloats()).toBe(9);
    result.push([1,2,3]);
    result.push([4,5,6]);
    result.push([7,8,9]);
    expect(v).toEqual(new Float32Array([0,0,1,2,3,0,4,5,6,0,7,8,9,0]))
})

it("Vecstream Element Size 3 stride 0 StartIndex 2",()=>{
    var v=new Float32Array([
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]);

    var result=new VecStreamFloat(v,2,3,0,3);
    expect(result.nFloats()).toBe(9);
    result.push([1,2,3]);
    result.push([4,5,6]);
    result.push([7,8,9]);
    expect(v).toEqual(new Float32Array([0,0,1,2,3,4,5,6,7,8,9,0,0,0]))
})

it("Vecstream Element Size 1 stride 0 StartIndex 2",()=>{
    var v=new Float32Array([
        0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ]);

    var result=new VecStreamFloat(v,2,1,0,9);
    expect(result.nFloats()).toBe(9);
    result.push([1,2,3]);
    result.push([4,5,6]);
    result.push([7,8,9]);
    expect(v).toEqual(new Float32Array([0,0,1,2,3,4,5,6,7,8,9,0,0,0]))
})


})