/// <reference path="shaders.ts" />
/// <reference path="shapes2d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "shapes2d"], function (require, exports, shapes) {
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
            _super.call(this, x, y);
            this.voronoiPointOwner = voronoiPointOwner;
        }
        return BeachLinePoints;
    })(shapes.Vector2);
    exports.BeachLinePoints = BeachLinePoints;
    var Edge = (function () {
        function Edge(origin, pI, i, j, exists) {
            this.origin = origin;
            this.pI = pI;
            this.i = i;
            this.j = j;
            this.exists = exists;
        }
        return Edge;
    })();
    exports.Edge = Edge;
    var Voronoi = (function () {
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
            for (var x = x1 + dx / 2; x < x2 + this.tol; x += dx)
                this.bPoints.push(new BeachLinePoints(x, Number.MAX_VALUE, -1));
        }
        Voronoi.prototype.findEdge = function (i, j) {
            for (var k = 0; k < this.iEdges.length; k++) {
                var ed = this.iEdges[k];
                if (ed.i == i && ed.j == j)
                    return ed;
            }
            return null;
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
        Voronoi.prototype.isVoronoiCompleted = function () {
            return this.cY < this.yMin && !this.bExistIntersectionPointInTheCanvas;
        };
        Voronoi.prototype.iterate = function () {
            this.bExistIntersectionPointInTheCanvas = false;
            var iCurr = -1;
            this.cY -= this.dy;
            for (var iX = 0; iX < this.bPoints.length; iX++) {
                var bP = this.bPoints[iX];
                var iCurr = this.bPoints[iX].voronoiPointOwner;
                var ymin = Number.MAX_VALUE;
                for (var i = 0; i < this.vPoints.length; i++) {
                    var vPt = this.vPoints[i];
                    if (vPt.aboveScanLine) {
                        var y = vPt.beachLine(bP.x, this.cY);
                        if (y < ymin) {
                            ymin = y;
                            iCurr = i;
                        }
                    }
                }
                bP.y = ymin;
                bP.voronoiPointOwner = iCurr;
                if (iX != 0) {
                    var bPp = this.bPoints[iX - 1];
                    if (bPp.voronoiPointOwner != bP.voronoiPointOwner) {
                        if (bP.y > this.yMin)
                            this.bExistIntersectionPointInTheCanvas = true;
                        var ed = this.findEdge(bPp.voronoiPointOwner, bP.voronoiPointOwner);
                        if (ed == null)
                            this.iEdges.push(new Edge(new shapes.Vector2(bP.x, bP.y), new shapes.Vector2(bP.x, bP.y), bPp.voronoiPointOwner, bP.voronoiPointOwner, true));
                        if (ed != null) {
                            ed.pI.y = bP.y;
                            ed.pI.x = bP.x;
                        }
                    }
                }
            }
            for (var i = 0; i < this.vPoints.length; i++) {
                var vPt = this.vPoints[i];
                if (!vPt.aboveScanLine && vPt.y > this.cY) {
                    vPt.aboveScanLine = true;
                    //find the X
                    var iX = Math.floor((vPt.x + 1.0) / this.dx);
                    var bPt = this.bPoints[iX];
                    if (bPt.y != Number.MAX_VALUE) {
                        this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), bPt.voronoiPointOwner, vPt.index, true));
                        this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), vPt.index, bPt.voronoiPointOwner, true));
                    }
                }
            }
        };
        return Voronoi;
    })();
    exports.Voronoi = Voronoi;
});
//# sourceMappingURL=voronoi.js.map