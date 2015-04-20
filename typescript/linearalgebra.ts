export class Vec2 {
    data:Float32Array

    constructor(arr: number[]) 
    {
        this.data = new Float32Array(2);
        if (arr != null) {
            this.data[0] = arr[0];
            this.data[1] = arr[1];
        }
    }
    x(): number {
        return this.data[0];
    }

    y(): number {
        return this.data[1];
    }

    toPrecision(p: number): Vec2 {
        var a = [1.0, 1.0];
        return new Vec2([parseFloat(this.data[0].toPrecision(p)), parseFloat(this.data[1].toPrecision(p))]);
    }



    toNumberArray(): number[]{
        return [this.data[0], this.data[1]];
    }

    clone(): Vec2 {
        return new Vec2([this.data[0], this.data[1]]);

    }

    fdec(v:Vec2): Vec2 {
        this.data[0] -= v.data[0];
        this.data[1] -= v.data[1];
        return this;
    }

    finc(v: Vec2): Vec2 {
        this.data[0] += v.data[0];
        this.data[1] += v.data[1];
        return this;
    }

    fvscale(sc: Vec2): Vec2 {
        this.data[0] *= sc.data[0];
        this.data[1] *= sc.data[1];
        return this;

    }

    fvscale_a(sc: number[]): Vec2 {
        this.data[0] *= sc[0];
        this.data[1] *= sc[1];
        return this;

    }

   


}


export class Vec3 {
    data: Float32Array

    constructor(arr: Float32Array=null) {
        this.data = new Float32Array(3);
        if (arr != null) {
            this.data[0] = arr[0];
            this.data[1] = arr[1];
            this.data[2] = arr[2];
        }
    }
}



export class Mat3 {
    data: Float32Array




    constructor(a: Float32Array=null) {
        this.data = new Float32Array(9)
        if (a != null) {
            this.copyFrom(a);

        }

    }

    copyFrom(a: Float32Array) {
        var out = this.data;
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
    }


    clone(m:Mat3) {
        var out = this.data;
        var a = m.data;
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
    }

    get(i: number, j: number): number {
        return this.data[i * 3 + j];
    }
    
    set(i: number, j: number, value: number) {
        this.data[i * 3 + j] = value;
    }

    transpose() {
        var a = this.data;
        var a01 = a[1], a02 = a[2], a12 = a[5];
        a[1] = a[3];
        a[2] = a[6];
        a[3] = a01;
        a[5] = a[7];
        a[6] = a02;
        a[7] = a12;
    }

    toIdentity() {
        var out = this.data;
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
    }

    static Identity() {
        var matrix:Mat3 = new Mat3();
        var out = matrix.data;
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
    }
    
    Invert():Mat3 {
        var matrix:Mat3 = new Mat3();
        var out:Float32Array = matrix.data;
        var a = this.data;

        var a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            // Calculate the determinant
            det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;
        return matrix;
    }

    Adjoint():Mat3 {

        var matrix: Mat3 = new Mat3();
        var out: Float32Array = matrix.data;
        var a = this.data;


        var a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8];

        out[0] = (a11 * a22 - a12 * a21);
        out[1] = (a02 * a21 - a01 * a22);
        out[2] = (a01 * a12 - a02 * a11);
        out[3] = (a12 * a20 - a10 * a22);
        out[4] = (a00 * a22 - a02 * a20);
        out[5] = (a02 * a10 - a00 * a12);
        out[6] = (a10 * a21 - a11 * a20);
        out[7] = (a01 * a20 - a00 * a21);
        out[8] = (a00 * a11 - a01 * a10);
        return matrix;
    }

    Det():number {
        var a = this.data;
        var a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8];

        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }

    
    Mul(bM: Mat3):Mat3 {
        
        var matrix: Mat3 = new Mat3();
        var out = matrix.data;
        var a = this.data;
        var b = bM.data;
        var a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8],

            b00 = b[0], b01 = b[1], b02 = b[2],
            b10 = b[3], b11 = b[4], b12 = b[5],
            b20 = b[6], b21 = b[7], b22 = b[8];

        out[0] = b00 * a00 + b01 * a10 + b02 * a20;
        out[1] = b00 * a01 + b01 * a11 + b02 * a21;
        out[2] = b00 * a02 + b01 * a12 + b02 * a22;

        out[3] = b10 * a00 + b11 * a10 + b12 * a20;
        out[4] = b10 * a01 + b11 * a11 + b12 * a21;
        out[5] = b10 * a02 + b11 * a12 + b12 * a22;

        out[6] = b20 * a00 + b21 * a10 + b22 * a20;
        out[7] = b20 * a01 + b21 * a11 + b22 * a21;
        out[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return matrix;
    }

    MulV(v: Vec3): Vec3 {

        var matrix: Mat3 = new Mat3();
        var out = matrix.data;
        var v0 = v[0], v1 = v[1], v2 = v[2];

        var a = this.data;

        v[0] = a[0] * v0 + a[1] * v1 + a[2] * v2;
        v[1] = a[3] * v0 + a[4] * v1 + a[5] * v2;
        v[2] = a[6] * v0 + a[7] * v1 + a[8] * v2;

        return v;
    }
 


};

export var gl_tol: number = 0.0000001; 
export function gl_equal(a: number, b: number)
{
    Math.abs(a - b) < gl_tol;
}


export interface RealFunction { (x: number): number }


export class SegmentIntersection {
    static ONE_POINT: string = "ONE_POINT"
    static NO_POINT: string = "NO_POINT"
    static ALL_POINTS: string = "ALL_POINTS"
    
    Point: Vec2
    Type: string
    constructor(Point: Vec2,Type: string) { }

    
}


export class Segment2D {
    private a: number[];
    private b: number[];
    f: (x: number) => number;

    constructor(a: Vec2, b: Vec2) {
        this.a = a.toNumberArray();
        this.b = b.toNumberArray();

        if (gl_equal(a[0], b[0]) && gl_equal(a[1], b[1]))
                throw "Invalid Segment";
           

    }

    GetTg():number {
        var a = this.a;
        var b = this.b;
        if (gl_equal(a[0], b[0]))
            return Infinity;
        else
            return (b[1] - a[1]) / (b[0] - a[0]); 
    }

    midpoint(): Vec2 {
        var a = this.a;
        var b = this.b;
        return new Vec2([(a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0])
    }
    /*
    (y-a1)/(x-a0) = (b1-a1)/(b0-a0)
    y = (x-a0)*(b1-a1)/(b0-a0) + a1
     
    */
    GetFunctionInX(): RealFunction {
        var b = this.b;
        var a = this.a;
        if (gl_equal(b[0], a[0]))
            return null;
        else {
            var m: number = (b[1] - a[1]) / (b[0] - a[0]);
            var a1 = a[1];
            var a0 = a[0];
            return function (x: number) {
                return (x - a0) * m + a1;
            }
        }

    }

    /*
    (x-a0)*m+a1 = (x-a0')*m'+a1'
    xm -a0m + a1 = xm'-a0'm' + a1'
    x(m-m') = a0m-a0'm' +a1'-
    
    */
    FindIntersection(s: Segment2D): SegmentIntersection {
        var b = this.b;
        var a = this.a;
        var _a = s.a;
        var _b = s.b;

        var m = this.GetTg();
        var _m = s.GetTg();

        if (!isFinite(m)) {
            if (!isFinite(_m)) {
                if (gl_equal(a[0], _a[0]))
                    return new SegmentIntersection(null, SegmentIntersection.ALL_POINTS);
                else
                    return new SegmentIntersection(null, SegmentIntersection.NO_POINT);
            }
            else {
                var x = a[0];
                var y = (x - _a[0]) * _m + _a[1];
                return new SegmentIntersection(new Vec2([x, y]), SegmentIntersection.ONE_POINT);
            }
        }
        if (!isFinite(_m)) {
            var x = _a[0];
            var y = (x - a[0]) * m + a[1];
            return new SegmentIntersection(new Vec2([x, y]), SegmentIntersection.ONE_POINT);
        }

        if (gl_equal(m, _m)) {
            if (gl_equal(a[0], _a[0]))
                return new SegmentIntersection(null, SegmentIntersection.ALL_POINTS);
            else
                return new SegmentIntersection(null, SegmentIntersection.NO_POINT);
        }

    /*
    (x-a0)*m+a1 = (x-a0')*m'+a1'
    xm -a0m + a1 = xm'-a0'm' + a1'
    x(m-m') = a0m-a0'm' +a1'-
    */
        var x = (a[0] * m - _a[0] * _m + _a[1] - a[1]) / (m - _m);       

        var y = (x - a[0]) * m + a[1];
        
        return new SegmentIntersection(new Vec2([x, y]), SegmentIntersection.ONE_POINT);


    }

}





export class GLScreenMapping {
    origin: Vec2;
    dims: number[];
    private scale: number[];
    private scale_inv: number[];
    invertY: number;

    constructor(origin: number[], dims: number[], invertY: boolean) {
        this.origin = new Vec2(origin);
        this.dims = dims;
        this.invertY = invertY ? -1.0 : 1.0
        this.scale=[dims[0]/2.0,this.invertY*dims[1]/2.0]
        this.scale_inv = [2.0/dims[0],this.invertY*2.0/dims[1]]
    }

    //Xd = S*(Xo-Odo) where 
    //S = [dim[0]/2    0   ]
    //    [  0     dim[1]/2]
    MapToScreen(vin: Vec2):Vec2 {
        var v = vin.clone();
        v.fdec(this.origin).fvscale_a(this.scale);
        return v;
    }
    //S*Xo-S*Odo=Xd <=>
    //S*Xo = Xd + S*Odo <=>
    //Xo = Inv(S)*Xd + Odo
    //where
    //Inv(S)= [2/dim[0]     0    ]
    //        [0        2/dims[1]]
    MapToGL(vin: Vec2): Vec2 {
        var v = vin.clone();
        v.fvscale_a(this.scale_inv).finc(this.origin);
        return v;
    }


    GetMapToGLTransform(): Mat3 {
        return new Mat3(
            new Float32Array(
                [this.scale_inv[0], 0, this.origin.x(),
                    0, this.scale_inv[1], this.origin.y(),
                    0, 0, 1]
                ));
    }

    

}