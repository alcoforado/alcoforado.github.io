/// <reference path="shaders.ts" />
/// <reference path="shapes2d.ts" />

import shapes = require("shapes2d");
import la = require("linearalgebra");
import alghorithms = require("alghorithms");
export class VoronoiPoint extends shapes.Vector2 {
    active: boolean;
    aboveScanLine: boolean;
    index: number;
    constructor(index: number, x: number, y: number) {
        super(x, y);
        this.active = false;
        this.aboveScanLine = false;
        this.index = index;
    }

    beachLine(x: number, ly: number): number {
        return ((x - this.x) * (x - this.x) / (this.y - ly) + (this.y + ly)) / 2.0
    }
}

export class BeachLinePoints extends la.Vec2 {
    constructor(x: number, y: number, public voronoiPointOwner: number) {
        super([x, y]);
    }
}


export class BeachIntersection {

    static IsActive: number = 1;
    static IsCompleted: number = 2;
    static IsStopped: number = 3;

    hasCommonVoronoiPoint(pt: BeachIntersection): boolean {
        return (
            this.lVPI == pt.rVPI ||
            this.lVPI == pt.lVPI ||
            this.rVPI == pt.rVPI ||
            this.rVPI == pt.lVPI);
    }

    constructor(public pt: la.Vec2, public lVPI: number, public rVPI: number, public state: number) {

    }


}


export class Edge {

    constructor(public p1: BeachIntersection, public p2: BeachIntersection) {
    }

    setPointByProximity(p: la.Vec2) {
        var ddo: number = p.sub(this.p1.pt).absNorm();
        var ddp: number = p.sub(this.p2.pt).absNorm();
        if (ddo > ddp) {
            this.p2.pt[0] = p[0];
            this.p2.pt[1] = p[1];
        }
        else {
            this.p1.pt[0] = p[0];
            this.p1.pt[1] = p[1];

        }
    }

    toSegment2D(): la.Segment2D {
        return new la.Segment2D(
            this.p1.pt,
            this.p2.pt);
    }




}




export class Voronoi {
    vPoints: VoronoiPoint[] = [];
    bPoints: BeachLinePoints[] = []; //beach points
    iEdges: Edge[] = [];
    bJoints: BeachIntersection[] = [];
    cY: number;
    tol: number;
    bExistIntersectionPointInTheCanvas: boolean;


    findIntersection(leftVoronoiIndex: number, rightVoronoiIndex: number): BeachIntersection {
        for (var k = 0; k < this.bJoints.length; k++) {
            var bp: BeachIntersection = this.bJoints[k];
            if (bp.lVPI == leftVoronoiIndex && bp.rVPI == rightVoronoiIndex)
                return bp;
        }
        return null;
    }

    addJoint(bj: BeachIntersection) {
        this.bJoints.push(bj);
        /*alghorithms.insertSort(this.bJoints, bj, function (e1: any, e2: any): boolean {
            return e1.pt[0] < e2.pt[0];
        });*/
    }




    setActiveJointsAsStopped() {
        for (var k = 0; k < this.bJoints.length; k++) {
            if (this.bJoints[k].state == BeachIntersection.IsActive)
                this.bJoints[k].state = BeachIntersection.IsStopped;
        }
    }

    getJointsWithState(state: number): BeachIntersection[] {
        var array: BeachIntersection[] = [];
        for (var k = 0; k < this.bJoints.length; k++) {
            if (this.bJoints[k].state == state) {
                array.addObject(this.bJoints[k]);
            }
        }
        return array;
    }

    connectJoints(j1: BeachIntersection, j2: BeachIntersection) {

        if (la.gl_equal(j1.pt.abs_dist(j2.pt), 0));
        {
            var midpoint = j2.pt.midpoint(j1.pt);
            j2.pt = midpoint.clone();
            j1.pt = midpoint.clone();
            return;
        }

        var seg1 = new la.Segment2D(this.vPoints[j1.lVPI].toVec2(), this.vPoints[j1.rVPI].toVec2());
        var mseg1 = seg1.FindMediatrix();

        var seg2 = new la.Segment2D(this.vPoints[j2.lVPI].toVec2(), this.vPoints[j2.rVPI].toVec2());
        var mseg2 = seg2.FindMediatrix();

        var intersection = mseg1.FindProlongationIntersection(mseg2);

        
        if (intersection.Type == la.SegmentIntersection.ONE_POINT) {
            j1.pt = intersection.Point.clone();
            j2.pt = intersection.Point.clone();
        }
        if (intersection.Type == la.SegmentIntersection.ALL_POINTS) {
            var pt = j1.pt.midpoint(j2.pt);
            j1.pt = pt.clone();
            j2.pt = pt.clone();
        }
    }

    /*
    connectEdges(edge1: Edge, edge2: Edge) {
        var seg1 = new la.Segment2D(this.vPoints[edge1.i].toVec2(), this.vPoints[edge1.j].toVec2());
        var mseg1 = seg1.FindMediatrix();

        var seg2 = new la.Segment2D(this.vPoints[edge2.i].toVec2(), this.vPoints[edge2.j].toVec2());
        var mseg2 = seg2.FindMediatrix();

        var intersection = mseg1.FindProlongationIntersection(mseg2);

        if (intersection.Type != la.SegmentIntersection.ONE_POINT)
            throw "Intersection not found"

        edge1.setPointByProximity(intersection.Point);
        edge2.setPointByProximity(intersection.Point);


    }
    */
    constructor(pts: shapes.Vector2[], public x1: number, public x2: number, public dx: number, public yMin: number, public yMax: number, public dy: number) {
        this.x1 = x1;
        this.x2 = x2;
        this.dx = dx;
        this.yMin = yMin;
        this.yMax = yMax;
        this.dy = dy;
        this.tol = Math.min(dx, dy) / 4.0;
        this.vPoints = [];
        this.cY = yMax + dy / 2.0;
        var i = 0;

        //Initialize the voronoi points.
        for (var i = 0; i < pts.length; i++) {
            var pt = pts[i];
            this.vPoints.push(new VoronoiPoint(i, pt.x, pt.y));
        }
        //sort by x component
        this.vPoints.sort(function (a: VoronoiPoint, b: VoronoiPoint) {
            return a.x - b.x;
        });
        for (var i = 0; i < this.vPoints.length; i++) {
            this.vPoints[i].index = i;
        }

        //Initialized the beach curves points;
        for (var x = x1 + dx / 2; x < x2 + this.tol; x += dx)
            this.bPoints.push(new BeachLinePoints(x, Number.MAX_VALUE, -1));



    }

    /*
        GetActiveVoronoiPointsForScanLine(y:number):VoronoiPoint[] {
            var result: VoronoiPoint[] = [];
            for (var i = 0; i < this.vPoints.length; i++) {
                var vPt = this.vPoints[i];
                if (vPt.y > y) {
                    result.push(vPt);
                    if (!vPt.justAppearedOnHorizon())
                        vPt.justAppearedOnHorizon = true;
                    //Event horizon happened
                    //Create two ed

                }


            }
        }
    */
    isPointOutOfScreen(p: la.Vec2) {
        return
        Math.abs(p[0] - this.x1) < this.dx ||
        Math.abs(this.x2 - p[0]) < this.dx ||
        p[1] <= this.yMin

    }


    isVoronoiCompleted() {
        return this.cY < this.yMin && !this.bExistIntersectionPointInTheCanvas;
    }

    iterate(): void {
        this.bExistIntersectionPointInTheCanvas = false;
        var iCurr: number = -1;
        this.cY -= this.dy;
        var orphans: BeachIntersection[] = [];
        this.setActiveJointsAsStopped();
        for (var iX = 0; iX < this.bPoints.length; iX++) {

            var bP = this.bPoints[iX];
            var iCurr = this.bPoints[iX].voronoiPointOwner;
            var ymin = Number.MAX_VALUE;
            for (var i = 0; i < this.vPoints.length; i++) {
                var vPt = this.vPoints[i];
                if (vPt.aboveScanLine) {
                    var y = vPt.beachLine(bP[0], this.cY);
                    if (y < ymin) {
                        ymin = y;
                        iCurr = i;
                    }
                }
            }
            bP[1] = ymin;
            bP.voronoiPointOwner = iCurr;

            if (iX != 0) {
                var bPp = this.bPoints[iX - 1];
                if (bPp.voronoiPointOwner != bP.voronoiPointOwner) {
                    if (bP[1] > this.yMin)
                        this.bExistIntersectionPointInTheCanvas = true;
                    var beachJoint = this.findIntersection(bPp.voronoiPointOwner, bP.voronoiPointOwner)
                    if (beachJoint == null) {
                        beachJoint = new BeachIntersection(bP, bPp.voronoiPointOwner, bP.voronoiPointOwner, BeachIntersection.IsActive);
                        orphans.push(beachJoint);
                        this.addJoint(beachJoint);
                    }
                    else {
                        beachJoint.pt[0] = bP[0];
                        beachJoint.pt[1] = bP[1];
                        beachJoint.state = BeachIntersection.IsActive;
                    }
                }

            }
        }
        
        //Check for voronoiPoints emerging from the horizon  (scan line)
        for (var i = 0; i < this.vPoints.length; i++) {
            var vPt = this.vPoints[i];
            if (!vPt.aboveScanLine && vPt.y > this.cY) {
                vPt.aboveScanLine = true;

                //find the X
                var iX = Math.floor((vPt.x - this.x1) / this.dx);
                var bPt = this.bPoints[iX];
                if (bPt[1] != Number.MAX_VALUE) {
                    //Create Joint points
                    var vJl = new BeachIntersection(bPt, bPt.voronoiPointOwner, vPt.index, BeachIntersection.IsActive);
                    var vJr = new BeachIntersection(bPt, vPt.index, bPt.voronoiPointOwner, BeachIntersection.IsActive);
                    this.addJoint(vJl);
                    this.addJoint(vJr);
                    //create edge
                    this.iEdges.push(new Edge(vJl, vJr));
                }
            }
        }

        //get stoppped joints 
        var stoppedJoints = this.getJointsWithState(BeachIntersection.IsStopped);

        var connectedJoints: BeachIntersection[] = [];
        //connect stopped joints
        for (var i = 0; i < stoppedJoints.length; i++) {
            var joint1 = stoppedJoints[i];
            for (var k = i + 1; k < stoppedJoints.length; k++) {
                var joint2 = stoppedJoints[k];
                if (joint1.hasCommonVoronoiPoint(joint2)) {
                    this.connectJoints(joint1, joint2);

                }
            }
            joint1.state = BeachIntersection.IsCompleted;
            connectedJoints.push(joint1);
        }
        
        //Check for orphan edges
        var that = this;
        orphans.forEach(function
            (orphan: BeachIntersection) {
            var closestJoint = alghorithms.minElem(connectedJoints, function (elem: BeachIntersection) { return elem.pt.abs_dist(orphan.pt); });
            that.iEdges.push(new Edge(orphan, closestJoint));
        });




}
}