/// <reference path="shaders.ts" />
/// <reference path="shapes2d.ts" />

import shapes = require("shapes2d");

export class VoronoiPoint extends shapes.Vector2 {
    active: boolean;
    aboveScanLine: boolean;
    index: number;
    constructor(index: number,  x: number, y: number) {
        super(x, y);
        this.active = false;
        this.aboveScanLine = false;
        this.index = index;
    }

    beachLine(x: number, ly: number): number {
        return ((x - this.x) * (x - this.x) / (this.y - ly) + (this.y + ly)) / 2.0
    }
}

export class BeachLinePoints extends shapes.Vector2 {
    constructor(x: number, y: number, public voronoiPointOwner: number) {
        super(x, y);
    }



}


export class Edge {
    constructor(public origin: shapes.Vector2,public pI: shapes.Vector2, public i: number, public j: number, public exists: boolean) { }
}



export class Voronoi {
    vPoints: VoronoiPoint[] = [];
    bPoints: BeachLinePoints[] = []; //beach points
    iEdges: Edge[] = [];
    cY: number;
    tol: number;
    bExistIntersectionPointInTheCanvas: boolean;


    findEdge(i: number, j: number): Edge {
        for (var k = 0; k < this.iEdges.length;k++) {
            var ed: Edge = this.iEdges[k];
            if (ed.i == i && ed.j == j)
                return ed;
        }
        return null;
    }

    constructor(pts: shapes.Vector2[], public x1: number, public x2: number, public dx: number, public yMin: number, public yMax: number, public dy: number) {
        this.x1 = x1;
        this.x2 = x2;
        this.dx = dx;
        this.yMin = yMin;
        this.yMax = yMax;
        this.dy = dy;
        this.tol = Math.min(dx,dy) / 4.0;
        this.vPoints = [];
        this.cY = yMax + dy / 2.0;
        var i = 0;

        //Initialize the voronoi points.
        for (var i = 0; i < pts.length;i++) {
            var pt = pts[i];
            this.vPoints.push(new VoronoiPoint(i, pt.x, pt.y));
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

    isVoronoiCompleted() {
        return this.cY < this.yMin && !this.bExistIntersectionPointInTheCanvas;
    }
    
    iterate(): void {
        this.bExistIntersectionPointInTheCanvas = false;
        var iCurr: number = -1;
        this.cY -= this.dy;
        
        for (var iX = 0; iX < this.bPoints.length; iX++) {
            
            var bP    = this.bPoints[iX];
            var iCurr = this.bPoints[iX].voronoiPointOwner;
            var ymin  = Number.MAX_VALUE;
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
                    var ed = this.findEdge(bPp.voronoiPointOwner, bP.voronoiPointOwner)
                    if (ed == null)
                        this.iEdges.push(new Edge(new shapes.Vector2(bP.x, bP.y), new shapes.Vector2(bP.x, bP.y), bPp.voronoiPointOwner, bP.voronoiPointOwner, true));

                    if (ed != null) {
                        ed.pI.y = bP.y;
                        ed.pI.x = bP.x;
                    }
                }

            }

/*            if (bP.voronoiPointOwner != iCurr) {
                var ed = this.findEdge(bP.voronoiPointOwner, iCurr)
                if (ed != null) {
                    ed.pI.y = bP.y;
                    ed.pI.x = bP.x;
                }
                bP.voronoiPointOwner = iCurr;
            }
*/
        }
        //Check for voronoiPoints emerging from the horizon  (scan line)
        for (var i = 0; i < this.vPoints.length; i++) {
            var vPt = this.vPoints[i];
            if (!vPt.aboveScanLine && vPt.y > this.cY ) {
                vPt.aboveScanLine = true;

                //find the X
                var iX = Math.floor((vPt.x+1) / this.dx);
                var bPt = this.bPoints[iX];
                if (bPt.y != Number.MAX_VALUE) {
                    this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), bPt.voronoiPointOwner, vPt.index, true));
                    this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), vPt.index, bPt.voronoiPointOwner, true));
                }
            }
        }


    }
}