 /// <reference path="defines/require.d.ts" />
/// <reference path="defines/jasmine.d.ts" />

import LA = require("linearalgebra")

describe("Float comparison with tolerance", function () {
    it("Two exact numbers should be considered equal", function () {
        LA.gl_tol=0.00001
        expect(LA.gl_equal(1.0, 1.0)).toBe(true);
    })
    it("Two slightly different numbers should be considered equal", function () {
        LA.gl_tol = 0.001
        expect(LA.gl_equal(1.0, 1.0001)).toBe(true);
    })
    it("Two not close enough numbers should be considered different", function () {
        LA.gl_tol = 0.001
        expect(LA.gl_equal(1.0, 1.01)).toBe(false);
    })

});
    
    


describe("Segment 2D", function () {
    var s1 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([1.0, 1.0]));
    var s2 = new LA.Segment2D(new LA.Vec2([0.0, 2]), new LA.Vec2([1.0, 3]));
    var s3 = new LA.Segment2D(new LA.Vec2([2.0, 2.0]), new LA.Vec2([5.0, 5.0]));
    var s4 = new LA.Segment2D(new LA.Vec2([2.0, 0]), new LA.Vec2([1.5, 0.5]));
   

    it("Prolongation Interception of parallel lines should return no intersection points", function () {
        var result = s1.FindProlongationIntersection(s2);
        expect(result.Type).toBe(LA.SegmentIntersection.NO_POINT)
    });

    it("Prolongation Interception of colinear segments should return intersection in all points", function () {
        var result = s1.FindProlongationIntersection(s3);
        expect(result.Type).toBe(LA.SegmentIntersection.ALL_POINTS)
    });

    it("Prolongation Interception of no parallel segments should return intersection in one point", function () {
        var result = s1.FindProlongationIntersection(s4);
        expect(result.Type).toBe(LA.SegmentIntersection.ONE_POINT)
        expect(result.Point.x()).toBeCloseTo(1.0,5)

    });

    it("Midpoint should return the segment midpoint ", function () {
        var s = new LA.Segment2D(new LA.Vec2([2.0, 3.0]), new LA.Vec2([5, 7]));

        var v = s.midpoint();

        expect(v[0]).toBeCloseTo(3.5, 8);
        expect(v[1]).toBeCloseTo(5, 8);


    });


    it("Find Mediatrix of the unit vector e1 should have correct answer", function () {
        var e1 = new LA.Segment2D(new LA.Vec2([0.0, 0.0]), new LA.Vec2([1,0]));

        var r1 = e1.FindMediatrix();

        expect(r1.firstPoint()[0]).toBeCloseTo(0.5, 8);
        expect(r1.firstPoint()[1]).toBeCloseTo(0.5, 8);



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

    it("Scale Of Vectors Should Scale Vectors", function () {
        var v1 = new LA.Vec2([1, 5]);

        v1.fsscale(3);

        expect(v1[0]).toBe(3);
        expect(v1[1]).toBe(15);


    });



})

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

        var isqrt2 = 1.0/Math.sqrt(2);
        var e1 = new LA.Vec3([1, 0, 0]);
        var e2 = new LA.Vec3([0, 1, 0]);
        var _e2 = new LA.Vec3([0, -1, 0]);
        var _e1 = new LA.Vec3([-1, 0, 0]);

        var x1 = new LA.Vec3([isqrt2, isqrt2, 0]);
        var x2 = new LA.Vec3([-isqrt2,isqrt2, 0]);
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




});