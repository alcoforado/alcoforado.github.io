/// <reference path="shaders.ts" />
/// <reference path="shapes2d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "shapes2d", "linearalgebra", "alghorithms"], function (require, exports, shapes, la, alghorithms) {
    var VoronoiPoint = (function (_super) {
        __extends(VoronoiPoint, _super);
        function VoronoiPoint(index, x, y) {
            _super.call(this, x, y);
            this.active = false;
            this.aboveScanLine = false;
            this.index = index;
        }
        VoronoiPoint.prototype.beachLine = function (x, ly) {
            return ((x - this.x) * (x - this.x) / (this.y - ly) + (this.y + ly)) / 2.0;
        };
        return VoronoiPoint;
    })(shapes.Vector2);
    exports.VoronoiPoint = VoronoiPoint;
    var BeachLinePoints = (function (_super) {
        __extends(BeachLinePoints, _super);
        function BeachLinePoints(x, y, voronoiPointOwner) {
            _super.call(this, [x, y]);
            this.voronoiPointOwner = voronoiPointOwner;
        }
        return BeachLinePoints;
    })(la.Vec2);
    exports.BeachLinePoints = BeachLinePoints;
    var BeachIntersection = (function () {
        function BeachIntersection(pt, lVPI, rVPI, state) {
            this.pt = pt;
            this.lVPI = lVPI;
            this.rVPI = rVPI;
            this.state = state;
        }
        BeachIntersection.prototype.hasCommonVoronoiPoint = function (pt) {
            return (this.lVPI == pt.rVPI || this.lVPI == pt.lVPI || this.rVPI == pt.rVPI || this.rVPI == pt.lVPI);
        };
        BeachIntersection.IsActive = 1;
        BeachIntersection.IsCompleted = 2;
        BeachIntersection.IsStopped = 3;
        return BeachIntersection;
    })();
    exports.BeachIntersection = BeachIntersection;
    var Edge = (function () {
        function Edge(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
        Edge.prototype.setPointByProximity = function (p) {
            var ddo = p.sub(this.p1.pt).absNorm();
            var ddp = p.sub(this.p2.pt).absNorm();
            if (ddo > ddp) {
                this.p2.pt[0] = p[0];
                this.p2.pt[1] = p[1];
            }
            else {
                this.p1.pt[0] = p[0];
                this.p1.pt[1] = p[1];
            }
        };
        Edge.prototype.toSegment2D = function () {
            return new la.Segment2D(this.p1.pt, this.p2.pt);
        };
        return Edge;
    })();
    exports.Edge = Edge;
    var Voronoi = (function () {
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
        function Voronoi(pts, x1, x2, dx, yMin, yMax, dy) {
            this.x1 = x1;
            this.x2 = x2;
            this.dx = dx;
            this.yMin = yMin;
            this.yMax = yMax;
            this.dy = dy;
            this.vPoints = [];
            this.bPoints = []; //beach points
            this.iEdges = [];
            this.bJoints = [];
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
            for (var i = 0; i < pts.length; i++) {
                var pt = pts[i];
                this.vPoints.push(new VoronoiPoint(i, pt.x, pt.y));
            }
            //sort by x component
            this.vPoints.sort(function (a, b) {
                return a.x - b.x;
            });
            for (var i = 0; i < this.vPoints.length; i++) {
                this.vPoints[i].index = i;
            }
            for (var x = x1 + dx / 2; x < x2 + this.tol; x += dx)
                this.bPoints.push(new BeachLinePoints(x, Number.MAX_VALUE, -1));
        }
        Voronoi.prototype.findIntersection = function (leftVoronoiIndex, rightVoronoiIndex) {
            for (var k = 0; k < this.bJoints.length; k++) {
                var bp = this.bJoints[k];
                if (bp.lVPI == leftVoronoiIndex && bp.rVPI == rightVoronoiIndex)
                    return bp;
            }
            return null;
        };
        Voronoi.prototype.addJoint = function (bj) {
            this.bJoints.push(bj);
            /*alghorithms.insertSort(this.bJoints, bj, function (e1: any, e2: any): boolean {
                return e1.pt[0] < e2.pt[0];
            });*/
        };
        Voronoi.prototype.setActiveJointsAsStopped = function () {
            for (var k = 0; k < this.bJoints.length; k++) {
                if (this.bJoints[k].state == BeachIntersection.IsActive)
                    this.bJoints[k].state = BeachIntersection.IsStopped;
            }
        };
        Voronoi.prototype.getJointsWithState = function (state) {
            var array = [];
            for (var k = 0; k < this.bJoints.length; k++) {
                if (this.bJoints[k].state == state) {
                    array.addObject(this.bJoints[k]);
                }
            }
            return array;
        };
        Voronoi.prototype.connectJoints = function (j1, j2) {
            if (la.gl_equal(j1.pt.abs_dist(j2.pt), 0))
                ;
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
        };
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
        Voronoi.prototype.isPointOutOfScreen = function (p) {
            return;
            Math.abs(p[0] - this.x1) < this.dx || Math.abs(this.x2 - p[0]) < this.dx || p[1] <= this.yMin;
        };
        Voronoi.prototype.isVoronoiCompleted = function () {
            return this.cY < this.yMin && !this.bExistIntersectionPointInTheCanvas;
        };
        Voronoi.prototype.iterate = function () {
            this.bExistIntersectionPointInTheCanvas = false;
            var iCurr = -1;
            this.cY -= this.dy;
            var orphans = [];
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
                        var beachJoint = this.findIntersection(bPp.voronoiPointOwner, bP.voronoiPointOwner);
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
            var connectedJoints = [];
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
            orphans.forEach(function (orphan) {
                var closestJoint = alghorithms.minElem(connectedJoints, function (elem) {
                    return elem.pt.abs_dist(orphan.pt);
                });
                that.iEdges.push(new Edge(orphan, closestJoint));
            });
        };
        return Voronoi;
    })();
    exports.Voronoi = Voronoi;
});
//# sourceMappingURL=voronoi.js.map