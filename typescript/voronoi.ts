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
    bPoints: BeachLinePoints[] = [];
    iEdges: Edge[] = [];
    cY: number;
    tol: number;

    findEdge(i: number, j: number): Edge {
        for (var ed in this.iEdges) {
            if (ed.i == i && ed.j == j)
                return ed;
        }
        return null;
    }

    constructor(pts: shapes.Vector2[], public x1: number, public x2: number, public dx: number, public y1: number, public y2: number, public dy: number) {
        this.x1 = x1;
        this.x2 = x2;
        this.dx = dx;
        this.y1 = y1;
        this.y2 = y2;
        this.dy = dy;
        this.tol = dx / 4.0;
        this.vPoints = [];
        this.cY = y1 - dy / 2.0;
        var i = 0;

        //Initialize the voronoi points.
        for (var pt in pts) {
            this.vPoints.push(new VoronoiPoint(i++, pt.x, pt.y));
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
    iterate(): void {
        var iCurr: number = -1;
        for (var iX = 0; iX < this.bPoints.length; iX++) {
            var bP = this.bPoints[iX];
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
            if (bP.voronoiPointOwner != iCurr) {
                var ed = this.findEdge(bP.voronoiPointOwner, iCurr)
                if (ed != null) {
                    ed.pI.y = bP.y;
                    ed.pI.x = bP.x;
                }
                bP.voronoiPointOwner = iCurr;
            }

            //Check for voronoiPoints emerging from the horizon  (scan line)
            for (var i = 0; i < this.vPoints.length; i++) {
                var vPt = this.vPoints[i];
                if (!vPt.aboveScanLine && Math.abs(vPt.y - this.cY) < this.tol) {
                    vPt.aboveScanLine = true;

                    //find the X
                    var iX = Math.floor(vPt.x / this.dx);
                    var bPt = this.bPoints[iX];
                    if (bPt.y != Number.MAX_VALUE) {
                        this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), bPt.voronoiPointOwner, vPt.index, true));
                        this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), vPt.index, bPt.voronoiPointOwner, true));
                    }
                }
            }
            this.cY += this.dy;
        }
    }
}