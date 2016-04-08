/// <reference path="defines/require.d.ts" />
/// <reference path="defines/jasmine.d.ts" />
define(["require", "exports", "linearalgebra", "alghorithms"], function (require, exports, LA, alghorithms) {
    describe("Javascript language tests", function () {
        it("Numbers are not passed by reference", function () {
            var f = function (a) {
                a = 5;
            };
            var b = 1;
            f(b);
            expect(b).toBe(1);
        });
        it("Access invalid element returns undefined", function () {
            var a = [2, 4, 5];
            expect(a[4]).toBeUndefined();
        });
    });
    describe("alghorithms tests", function () {
        it("Array Insert Sort should work for empty arrays", function () {
            var a = [];
            alghorithms.insertSort(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(a.length).toBe(1);
            expect(a[0]).toBe(1);
        });
        it("Array Insert Sort should work for arrays with one element", function () {
            var a = [2];
            alghorithms.insertSort(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(a.length).toBe(2);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
        });
        it("Array Insert Sort should work for arrays with 3 elements", function () {
            var a = [2, 3];
            alghorithms.insertSort(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(a.length).toBe(3);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
        });
        it("IsSorted Array  should return true for empty arrays", function () {
            var a = [];
            var result = alghorithms.isSorted(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(result).toBe(true);
        });
        it("IsSorted Array  should return true for one element arrays", function () {
            var a = [1];
            var result = alghorithms.isSorted(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(result).toBe(true);
        });
        it("IsSorted Array  should return true for [368]", function () {
            var a = [3, 6, 8];
            var result = alghorithms.isSorted(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(result).toBe(true);
        });
        it("IsSorted Array  should return false for [638]", function () {
            var a = [6, 3, 8];
            var result = alghorithms.isSorted(a, 1, function (e1, e2) {
                return e1 < e2;
            });
            expect(result).toBe(false);
        });
    });
    describe("Float comparison with tolerance", function () {
        it("Two exact numbers should be considered equal", function () {
            LA.gl_tol = 0.00001;
            expect(LA.gl_equal(1.0, 1.0)).toBe(true);
        });
        it("Two slightly different numbers should be considered equal", function () {
            LA.gl_tol = 0.001;
            expect(LA.gl_equal(1.0, 1.0001)).toBe(true);
        });
        it("Two not close enough numbers should be considered different", function () {
            LA.gl_tol = 0.001;
            expect(LA.gl_equal(1.0, 1.01)).toBe(false);
        });
    });
    describe("Segment 2D", function () {
        var s1 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([1.0, 1.0]));
        var s2 = new LA.Segment2D(new LA.Vec2([0.0, 2]), new LA.Vec2([1.0, 3]));
        var s3 = new LA.Segment2D(new LA.Vec2([2.0, 2.0]), new LA.Vec2([5.0, 5.0]));
        var s4 = new LA.Segment2D(new LA.Vec2([2.0, 0]), new LA.Vec2([1.5, 0.5]));
        it("Prolongation Interception of parallel lines should return no intersection points", function () {
            var result = s1.FindProlongationIntersection(s2);
            expect(result.Type).toBe(LA.SegmentIntersection.NO_POINT);
        });
        it("Prolongation Interception of colinear segments should return intersection in all points", function () {
            var result = s1.FindProlongationIntersection(s3);
            expect(result.Type).toBe(LA.SegmentIntersection.ALL_POINTS);
        });
        it("Prolongation Interception of no parallel segments should return intersection in one point", function () {
            var result = s1.FindProlongationIntersection(s4);
            expect(result.Type).toBe(LA.SegmentIntersection.ONE_POINT);
            expect(result.Point.x()).toBeCloseTo(1.0, 5);
        });
        it("Midpoint should return the segment midpoint ", function () {
            var s = new LA.Segment2D(new LA.Vec2([2.0, 3.0]), new LA.Vec2([5, 7]));
            var v = s.midpoint();
            expect(v[0]).toBeCloseTo(3.5, 8);
            expect(v[1]).toBeCloseTo(5, 8);
        });
        it("Find Mediatrix of the unit vector e1 should have correct answer", function () {
            var e1 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([1, 0]));
            var r1 = e1.FindMediatrix();
            expect(r1.A()[0]).toBeCloseTo(0.5, 8);
            expect(r1.A()[1]).toBeCloseTo(-0.5, 8);
            expect(r1.B()[0]).toBeCloseTo(0.5, 8);
            expect(r1.B()[1]).toBeCloseTo(0.5, 8);
        });
        it("Find Mediatrix of the unit vector e2 should have correct answer", function () {
            var e2 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([0, 1]));
            var r1 = e2.FindMediatrix();
            expect(r1.A()[0]).toBeCloseTo(-0.5, 8);
            expect(r1.A()[1]).toBeCloseTo(0.5, 8);
            expect(r1.B()[0]).toBeCloseTo(0.5, 8);
            expect(r1.B()[1]).toBeCloseTo(0.5, 8);
        });
    });
    describe("Vec2", function () {
        it("Sum Of Vectors Should Sum Components", function () {
            var v1 = new LA.Vec2([1, 5]);
            var v2 = new LA.Vec2([3, 2]);
            var v3 = v1.add(v2);
            expect(v3[0]).toBe(4);
            expect(v3[1]).toBe(7);
        });
        it("Subtraction Of Vectors Should Sum Components", function () {
            var v1 = new LA.Vec2([1, 5]);
            var v2 = new LA.Vec2([3, 2]);
            var v3 = v1.sub(v2);
            expect(v3[0]).toBe(-2);
            expect(v3[1]).toBe(3);
        });
        it("Midpoint should return the medium point", function () {
            var v1 = new LA.Vec2([1, 2]);
            var v2 = new LA.Vec2([5, 8]);
            var v3 = v1.midpoint(v2);
            expect(v3[0]).toBeCloseTo(3.0, 7);
            expect(v3[1]).toBeCloseTo(5.0, 7);
        });
        it("Scale Of Vectors Should Scale Vectors", function () {
            var v1 = new LA.Vec2([1, 5]);
            v1.fsscale(3);
            expect(v1[0]).toBe(3);
            expect(v1[1]).toBe(15);
        });
    });
    describe("Matrix", function () {
        var s1 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([1.0, 1.0]));
        var s2 = new LA.Segment2D(new LA.Vec2([0.0, 2]), new LA.Vec2([1.0, 3]));
        var s3 = new LA.Segment2D(new LA.Vec2([2.0, 2.0]), new LA.Vec2([5.0, 5.0]));
        var s4 = new LA.Segment2D(new LA.Vec2([2.0, 0]), new LA.Vec2([1.5, 0.5]));
        it("Matrix Rotation of +90 degrees should create orthogonal vectors", function () {
            var x1 = new LA.Vec3([1, 3, 0]);
            var x2 = new LA.Vec3([-3, 2, 0]);
            var M = new LA.Mat3();
            M.RotateXY(LA.ToRad(90));
            var y1 = M.MulV(x1);
            var y2 = M.MulV(x2);
            expect(y1.dot_product(x1)).toBeCloseTo(0.0, 6);
            expect(y2.dot_product(x2)).toBeCloseTo(0.0, 6);
        });
        it("Matrix Rotation in XY Should preserve Z component", function () {
            var x1 = new LA.Vec3([1, 3, 10]);
            var x2 = new LA.Vec3([-3, 2, 22]);
            var M1 = new LA.Mat3();
            var M2 = new LA.Mat3();
            M1.RotateXY(LA.ToRad(34));
            M2.RotateXY(LA.ToRad(-75));
            var y1 = M1.MulV(x1);
            var y2 = M2.MulV(x2);
            expect(y1[2]).toBeCloseTo(10.0, 8);
            expect(y2[2]).toBeCloseTo(22, 8);
        });
        it("Matrix Rotation in XY Should preserve Norm", function () {
            var x1 = new LA.Vec3([1, 3, 10]);
            var x2 = new LA.Vec3([-3, 2, 22]);
            var M1 = new LA.Mat3();
            var M2 = new LA.Mat3();
            M1.RotateXY(LA.ToRad(34));
            M2.RotateXY(LA.ToRad(-75));
            var y1 = M1.MulV(x1);
            var y2 = M2.MulV(x2);
            expect(y1.norm()).toBeCloseTo(x1.norm(), 7);
            expect(y2.norm()).toBeCloseTo(x2.norm(), 7);
        });
        it("Matrix Rotation in XY Should Rotate 90 Correctly the base vectors", function () {
            var e1 = new LA.Vec3([1, 0, 0]);
            var e2 = new LA.Vec3([0, 1, 0]);
            var _e2 = new LA.Vec3([0, -1, 0]);
            var _e1 = new LA.Vec3([-1, 0, 0]);
            var M1 = new LA.Mat3();
            var M2 = new LA.Mat3();
            M1.RotateXY(LA.ToRad(-90));
            M2.RotateXY(LA.ToRad(+90));
            expect(M1.MulV(e1).diff(_e2).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(_e2).diff(e1).norm()).toBeCloseTo(0, 7);
            expect(M1.MulV(e2).diff(e1).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(e2).diff(_e1).norm()).toBeCloseTo(0, 7);
        });
        it("Matrix Rotation 45 in XY Should Rotate 90 Correctly the base vectors", function () {
            var isqrt2 = 1.0 / Math.sqrt(2);
            var e1 = new LA.Vec3([1, 0, 0]);
            var e2 = new LA.Vec3([0, 1, 0]);
            var _e2 = new LA.Vec3([0, -1, 0]);
            var _e1 = new LA.Vec3([-1, 0, 0]);
            var x1 = new LA.Vec3([isqrt2, isqrt2, 0]);
            var x2 = new LA.Vec3([-isqrt2, isqrt2, 0]);
            var x3 = new LA.Vec3([isqrt2, -isqrt2, 0]);
            var x4 = new LA.Vec3([-isqrt2, -isqrt2, 0]);
            var M1 = new LA.Mat3();
            var M2 = new LA.Mat3();
            M1.RotateXY(LA.ToRad(45));
            M2.RotateXY(LA.ToRad(-45));
            expect(M1.MulV(e1).diff(x1).norm()).toBeCloseTo(0, 7);
            expect(M1.MulV(e2).diff(x2).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(x1).diff(e1).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(x2).diff(e2).norm()).toBeCloseTo(0, 7);
            expect(M1.MulV(x3).diff(e1).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(x3).diff(_e2).norm()).toBeCloseTo(0, 7);
            expect(M1.MulV(x4).diff(_e2).norm()).toBeCloseTo(0, 7);
            expect(M2.MulV(x4).diff(_e1).norm()).toBeCloseTo(0, 7);
        });
        it("Matrix Identity Multiplication should not change a vector", function () {
            var v = new LA.Vec3([1, 2, 3]);
            var M1 = new LA.Mat3();
            M1.toIdentity();
            var r = M1.MulV(v);
            expect(r.sub(v).norm()).toBeCloseTo(0, 7);
        });
    });
    function vec2_equal(v, v2) {
        expect(v[0]).toBeCloseTo(v2[0], 6);
        expect(v[1]).toBeCloseTo(v2[1], 6);
    }
    describe("GL Mapping", function () {
        it("Mapping to Left Bottom Should have correct mapping", function () {
            var map = new LA.GLScreenMapping([-1, -1], [400, 200], false);
            var v1 = map.MapToGL(new LA.Vec2([0, 0]));
            var v2 = map.MapToGL(new LA.Vec2([400, 200]));
            var v3 = map.MapToGL(new LA.Vec2([200, 100]));
            var v4 = map.MapToGL(new LA.Vec2([0, 200]));
            var v5 = map.MapToGL(new LA.Vec2([400, 0]));
            vec2_equal(v1, [-1, -1]);
            vec2_equal(v2, [1, 1]);
            vec2_equal(v3, [0, 0]);
            vec2_equal(v4, [-1, 1]);
            vec2_equal(v5, [1, -1]);
        });
        it("Mapping to Top Bottom with inverted Y direction should have correct mapping", function () {
            var map = new LA.GLScreenMapping([-1, 1], [400, 200], true);
            var v1 = map.MapToGL(new LA.Vec2([0, 0]));
            var v2 = map.MapToGL(new LA.Vec2([400, 200]));
            var v3 = map.MapToGL(new LA.Vec2([200, 100]));
            var v4 = map.MapToGL(new LA.Vec2([0, 200]));
            var v5 = map.MapToGL(new LA.Vec2([400, 0]));
            vec2_equal(v1, [-1, 1]);
            vec2_equal(v2, [1, -1]);
            vec2_equal(v3, [0, 0]);
            vec2_equal(v4, [-1, -1]);
            vec2_equal(v5, [1, 1]);
        });
        it("Mapping and Unmapping should be an Identity operation", function () {
            var map = new LA.GLScreenMapping([-1, -1], [400, 200], false);
            var v1 = map.MapToScreen(map.MapToGL(new LA.Vec2([0, 0])));
            var v2 = map.MapToScreen(map.MapToGL(new LA.Vec2([400, 200])));
            var v3 = map.MapToScreen(map.MapToGL(new LA.Vec2([200, 100])));
            var v4 = map.MapToScreen(map.MapToGL(new LA.Vec2([0, 200])));
            var v5 = map.MapToScreen(map.MapToGL(new LA.Vec2([400, 0])));
            vec2_equal(v1, [0, 0]);
            vec2_equal(v2, [400, 200]);
            vec2_equal(v3, [200, 100]);
            vec2_equal(v4, [0, 200]);
            vec2_equal(v5, [400, 0]);
        });
        it("Mapping and Unmapping with Swipping Y direction should be an Identity operation", function () {
            var map = new LA.GLScreenMapping([-1, -1], [400, 200], true);
            var v1 = map.MapToScreen(map.MapToGL(new LA.Vec2([0, 0])));
            var v2 = map.MapToScreen(map.MapToGL(new LA.Vec2([400, 200])));
            var v3 = map.MapToScreen(map.MapToGL(new LA.Vec2([200, 100])));
            var v4 = map.MapToScreen(map.MapToGL(new LA.Vec2([0, 200])));
            var v5 = map.MapToScreen(map.MapToGL(new LA.Vec2([400, 0])));
            vec2_equal(v1, [0, 0]);
            vec2_equal(v2, [400, 200]);
            vec2_equal(v3, [200, 100]);
            vec2_equal(v4, [0, 200]);
            vec2_equal(v5, [400, 0]);
        });
    });
});
//# sourceMappingURL=specs.js.map