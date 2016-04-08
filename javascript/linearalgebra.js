define(["require", "exports"], function (require, exports) {
    var Vec2 = (function () {
        function Vec2(arr) {
            if (arr === void 0) { arr = null; }
            if (arr != null) {
                this[0] = arr[0];
                this[1] = arr[1];
            }
        }
        Vec2.prototype.x = function () {
            return this[0];
        };
        Vec2.prototype.y = function () {
            return this[1];
        };
        Vec2.prototype.toPrecision = function (p) {
            var a = [1.0, 1.0];
            return new Vec2([parseFloat(this[0].toPrecision(p)), parseFloat(this[1].toPrecision(p))]);
        };
        Vec2.prototype.toVec3 = function (extraComponentValue) {
            return new Vec3([this[0], this[1], extraComponentValue]);
        };
        Vec2.prototype.toNumberArray = function () {
            return [this[0], this[1]];
        };
        Vec2.prototype.clone = function () {
            return new Vec2([this[0], this[1]]);
        };
        Vec2.prototype.fdec = function (v) {
            this[0] -= v[0];
            this[1] -= v[1];
            return this;
        };
        Vec2.prototype.finc = function (v) {
            this[0] += v[0];
            this[1] += v[1];
            return this;
        };
        Vec2.prototype.fvscale = function (sc) {
            this[0] *= sc[0];
            this[1] *= sc[1];
            return this;
        };
        Vec2.prototype.add = function (x) {
            var result = new Vec2();
            result[0] = this[0] + x[0];
            result[1] = this[1] + x[1];
            return result;
        };
        Vec2.prototype.sub = function (x) {
            var result = new Vec2();
            result[0] = this[0] - x[0];
            result[1] = this[1] - x[1];
            return result;
        };
        Vec2.prototype.a_equal = function (x) {
            return gl_equal(x[0], this[0]) && gl_equal(x[1], this[1]);
        };
        Vec2.prototype.fvscale_a = function (sc) {
            this[0] *= sc[0];
            this[1] *= sc[1];
            return this;
        };
        Vec2.prototype.fsscale = function (s) {
            this[0] *= s;
            this[1] *= s;
            return this;
        };
        Vec2.prototype.absNorm = function () {
            return Math.abs(this[0]) + Math.abs(this[1]);
        };
        Vec2.prototype.abs_dist = function (v) {
            return Math.abs(this[0] - v[0]) + Math.abs(this[1] - v[1]);
        };
        Vec2.prototype.midpoint = function (v) {
            return new Vec2([(v[0] + this[0]) / 2.0, (v[1] + this[1]) / 2.0]);
        };
        return Vec2;
    })();
    exports.Vec2 = Vec2;
    function ToRad(degree) {
        return degree * Math.PI / 180.0;
    }
    exports.ToRad = ToRad;
    var Vec3 = (function () {
        function Vec3(arr) {
            if (arr === void 0) { arr = null; }
            if (arr != null) {
                this[0] = arr[0];
                this[1] = arr[1];
                this[2] = arr[2];
            }
            else {
                this[0] = 0.0;
                this[1] = 0.0;
                this[2] = 0.0;
            }
        }
        Vec3.prototype.toRGB = function () {
            return "rgb(" + this[0] + "," + this[1] + "," + this[2] + ")";
        };
        Vec3.prototype.clone = function () {
            return new Vec3([this[0], this[1], this[2]]);
        };
        Vec3.prototype.dot_product = function (v) {
            return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
        };
        Vec3.prototype.norm = function () {
            var v = this;
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        };
        Vec3.prototype.norm2 = function () {
            var v = this;
            return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
        };
        Vec3.prototype.diff = function (v) {
            var result = new Vec3();
            result[0] = this[0] - v[0];
            result[1] = this[1] - v[1];
            result[2] = this[2] - v[2];
            return result;
        };
        Vec3.prototype.toVec2 = function (coordinate1, coordinate2) {
            return new Vec2([this[coordinate1], this[coordinate2]]);
        };
        Vec3.prototype.xy = function () {
            return new Vec2([this[0], this[1]]);
        };
        Vec3.prototype.sub = function (x) {
            var result = new Vec3();
            result[0] = this[0] - x[0];
            result[1] = this[1] - x[1];
            result[2] = this[2] - x[2];
            return result;
        };
        return Vec3;
    })();
    exports.Vec3 = Vec3;
    var Mat3 = (function () {
        function Mat3(a) {
            if (a === void 0) { a = null; }
            this.data = new Float32Array(9);
            if (a != null) {
                this.copyFrom(a);
            }
        }
        Mat3.prototype.copyFrom = function (a) {
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
        };
        Mat3.prototype.clone = function (m) {
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
        };
        Mat3.prototype.get = function (i, j) {
            return this.data[i * 3 + j];
        };
        Mat3.prototype.set = function (i, j, value) {
            this.data[i * 3 + j] = value;
        };
        Mat3.prototype.transpose = function () {
            var a = this.data;
            var a01 = a[1], a02 = a[2], a12 = a[5];
            a[1] = a[3];
            a[2] = a[6];
            a[3] = a01;
            a[5] = a[7];
            a[6] = a02;
            a[7] = a12;
        };
        Mat3.prototype.toIdentity = function () {
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
        };
        Mat3.Identity = function () {
            var matrix = new Mat3();
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
        };
        Mat3.prototype.Invert = function () {
            var matrix = new Mat3();
            var out = matrix.data;
            var a = this.data;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, 
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
        };
        Mat3.prototype.Adjoint = function () {
            var matrix = new Mat3();
            var out = matrix.data;
            var a = this.data;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
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
        };
        Mat3.prototype.Det = function () {
            var a = this.data;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        };
        Mat3.prototype.Mul = function (bM) {
            var matrix = new Mat3();
            var out = matrix.data;
            var a = this.data;
            var b = bM.data;
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
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
        };
        Mat3.prototype.TransformV = function (v) {
            var matrix = new Mat3();
            var out = matrix.data;
            var v0 = v[0], v1 = v[1], v2 = v[2];
            var a = this.data;
            v[0] = a[0] * v0 + a[1] * v1 + a[2] * v2;
            v[1] = a[3] * v0 + a[4] * v1 + a[5] * v2;
            v[2] = a[6] * v0 + a[7] * v1 + a[8] * v2;
        };
        Mat3.prototype.MulV = function (v) {
            var matrix = new Mat3();
            var out = matrix.data;
            var v0 = v[0], v1 = v[1], v2 = v[2];
            var result = new Vec3();
            var a = this.data;
            result[0] = a[0] * v0 + a[1] * v1 + a[2] * v2;
            result[1] = a[3] * v0 + a[4] * v1 + a[5] * v2;
            result[2] = a[6] * v0 + a[7] * v1 + a[8] * v2;
            return result;
        };
        Mat3.prototype.RotateXY = function (rad) {
            var out = this.data;
            out[0] = Math.cos(rad);
            out[1] = -Math.sin(rad);
            out[2] = 0;
            out[3] = Math.sin(rad);
            out[4] = Math.cos(rad);
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
        };
        return Mat3;
    })();
    exports.Mat3 = Mat3;
    ;
    exports.gl_tol = 0.0000001;
    function gl_equal(a, b) {
        return Math.abs(a - b) < exports.gl_tol;
    }
    exports.gl_equal = gl_equal;
    var SegmentIntersection = (function () {
        function SegmentIntersection(Point, Type) {
            this.Point = Point;
            this.Type = Type;
        }
        SegmentIntersection.ONE_POINT = "ONE_POINT";
        SegmentIntersection.NO_POINT = "NO_POINT";
        SegmentIntersection.ALL_POINTS = "ALL_POINTS";
        return SegmentIntersection;
    })();
    exports.SegmentIntersection = SegmentIntersection;
    var Segment2D = (function () {
        function Segment2D(a, b) {
            if (a[0] < b[0]) {
                this.a = a.toNumberArray();
                this.b = b.toNumberArray();
            }
            else {
                this.a = b.toNumberArray();
                this.b = a.toNumberArray();
            }
            if (gl_equal(a[0], b[0]) && gl_equal(a[1], b[1]))
                throw "Invalid Segment";
        }
        Segment2D.prototype.A = function () {
            return new Vec2(this.a);
        };
        Segment2D.prototype.B = function () {
            return new Vec2(this.b);
        };
        Segment2D.prototype.GetTg = function () {
            var a = this.a;
            var b = this.b;
            if (gl_equal(a[0], b[0]))
                return Infinity;
            else
                return (b[1] - a[1]) / (b[0] - a[0]);
        };
        Segment2D.prototype.midpoint = function () {
            var a = this.a;
            var b = this.b;
            return new Vec2([(a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0]);
        };
        /*
        (y-a1)/(x-a0) = (b1-a1)/(b0-a0)
        y = (x-a0)*(b1-a1)/(b0-a0) + a1
         
        */
        Segment2D.prototype.GetFunctionInX = function () {
            var b = this.b;
            var a = this.a;
            if (gl_equal(b[0], a[0]))
                return null;
            else {
                var m = (b[1] - a[1]) / (b[0] - a[0]);
                var a1 = a[1];
                var a0 = a[0];
                return function (x) {
                    return (x - a0) * m + a1;
                };
            }
        };
        /*
        (x-a0)*m+a1 = (x-a0')*m'+a1'
        xm -a0m + a1 = xm'-a0'm' + a1'
        x(m-m') = a0m-a0'm' +a1'-
        
        */
        Segment2D.prototype.FindProlongationIntersection = function (s) {
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
                if (gl_equal(a[0], _a[0]) && gl_equal(a[1], _a[1]) || gl_equal((a[1] - _a[1]) / (a[0] - _a[0]), m))
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
        };
        Segment2D.prototype.FindMediatrix = function () {
            var vA = new Vec2(this.a);
            var vB = new Vec2(this.b);
            var vD = vB.fdec(vA).fsscale(0.5).toVec3(0.0);
            var M = new Mat3();
            M.RotateXY(ToRad(90));
            var vS = M.MulV(vD).xy();
            var vM = this.midpoint();
            return new Segment2D(vM.add(vS), vM.sub(vS));
        };
        return Segment2D;
    })();
    exports.Segment2D = Segment2D;
    var Interval = (function () {
        function Interval(a, b) {
            this.a = a;
            this.b = b;
            this.a = (b < a) ? b : a;
            this.b = (b < a) ? a : b;
        }
        Interval.prototype.size = function () {
            return this.b - this.a;
        };
        Interval.prototype.RandomSample = function () {
            var sample = Math.random();
            return this.a + this.size() * sample;
        };
        Interval.prototype.RandomIntegerSample = function () {
            var d = this.RandomSample();
            return Number(d.toFixed(0));
        };
        return Interval;
    })();
    exports.Interval = Interval;
    var GLScreenMapping = (function () {
        function GLScreenMapping(origin, dims, invertY) {
            this.origin = new Vec2(origin);
            this.dims = dims;
            this.invertY = invertY ? -1.0 : 1.0;
            this.scale = [dims[0] / 2.0, this.invertY * dims[1] / 2.0];
            this.scale_inv = [2.0 / dims[0], this.invertY * 2.0 / dims[1]];
        }
        //Xd = S*(Xo-Odo) where 
        //S = [dim[0]/2    0   ]
        //    [  0     dim[1]/2]
        GLScreenMapping.prototype.MapToScreen = function (vin) {
            var v = vin.clone();
            v.fdec(this.origin).fvscale_a(this.scale);
            return v;
        };
        GLScreenMapping.prototype.MapToGL = function (vin) {
            var v = new Vec2([vin[0], vin[1]]);
            v.fvscale_a(this.scale_inv).finc(this.origin);
            return v;
        };
        GLScreenMapping.prototype.GetMapToGLTransform = function () {
            return new Mat3(new Float32Array([this.scale_inv[0], 0, this.origin.x(), 0, this.scale_inv[1], this.origin.y(), 0, 0, 1]));
        };
        GLScreenMapping.prototype.GetScreenRect = function () {
            return [
                this.MapToScreen(new Vec2([-1, -1])),
                this.MapToScreen(new Vec2([1, 1]))
            ];
        };
        return GLScreenMapping;
    })();
    exports.GLScreenMapping = GLScreenMapping;
});
//# sourceMappingURL=linearalgebra.js.map