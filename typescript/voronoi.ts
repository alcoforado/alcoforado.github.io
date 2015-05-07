/// <reference path="shaders.ts" />
/// <reference path="shapes2d.ts" />

import shapes = require("shapes2d");
import la = require("linearalgebra");
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
    static IsActive: number = 1;
    static IsCompleted: number = 2;
    static IsStopped: number =3

    constructor(public origin: shapes.Vector2, public pI: shapes.Vector2, public i: number, public j: number, public state: number)
    {
        if (i > j) {
            var aux = j;
            j = i;
            i = aux;  
        }
        this.i = i;
        this.j = j;
    }

    setPointByProximity(p: la.Vec2) {
        var ddo: number = p.sub(this.origin.toVec2()).absNorm();
        var ddp: number = p.sub(this.pI.toVec2()).absNorm();
        if (ddo > ddp) {
            this.pI.x = p[0];
            this.pI.y = p[1];
        }
        else {
            this.origin.x = p[0];
            this.origin.y = p[1];

        }
    }

    hasCommonVoronoiPoint(edge: Edge): boolean {
        return (
            this.i == edge.i ||
            this.j == edge.i ||
            this.i == edge.j ||
            this.j == edge.j);
    }

    toSegment2D(): la.Segment2D {
        return new la.Segment2D(
            new la.Vec2([this.origin.x, this.origin.y]),
            new la.Vec2([this.pI.x, this.pI.y]));
    }


    

}




export class Voronoi {
    vPoints: VoronoiPoint[] = [];
    bPoints: BeachLinePoints[] = []; //beach points
    iEdges: Edge[] = [];
    UnlinkedEdges: Edge[] = [];
    cY: number;
    tol: number;
    bExistIntersectionPointInTheCanvas: boolean;


    findEdge(i: number, j: number): Edge {
        if (i > j) {
            var aux = j;
            j = i;
            i = aux;
        }


        for (var k = 0; k < this.iEdges.length;k++) {
            var ed: Edge = this.iEdges[k];
            if (ed.i == i && ed.j == j)
                return ed;
        }
        return null;
    }

    setAllEdgesStateAs(state:number) {
        for (var k = 0; k < this.iEdges.length; k++) {
            this.iEdges[k].state=state
        }
    }

    setActiveEdgesStateAsStopped() {
        for (var k = 0; k < this.iEdges.length; k++) {
            if (this.iEdges[k].state == Edge.IsActive)
                this.iEdges[k].state = Edge.IsStopped;
        }
    }

    getEdgesWithState(state: number):Edge[] {
        var array:Edge[] = [];
        for (var k = 0; k < this.iEdges.length; k++) {
            if (this.iEdges[k].state == state) {
                array.addObject(this.iEdges[k]);
            }
        }
        return array;
    }

    connectEdges(edge1: Edge, edge2: Edge) {
        var seg1 = new la.Segment2D(this.vPoints[edge1.i].toVec2(),this.vPoints[edge1.j].toVec2());
        var mseg1 = seg1.FindMediatrix();

        var seg2 = new la.Segment2D(this.vPoints[edge2.i].toVec2(), this.vPoints[edge2.j].toVec2());
        var mseg2 = seg2.FindMediatrix();

        var intersection = mseg1.FindProlongationIntersection(mseg2);

        if (intersection.Type != la.SegmentIntersection.ONE_POINT)
            throw "Intersection not found"
        
        edge1.pI.x = intersection.Point[0];
        edge1.pI.y = intersection.Point[1];

        edge2.pI.x = intersection.Point[0];
        edge2.pI.y = intersection.Point[1];

        

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
        this.UnlinkedEdges = [];
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
    isPointOutOfScreen(p: la.Vec2) {
        return
        Math.abs(p[0] - this.x1) < this.dx ||
        Math.abs(this.x2 - p[0]) < this.dx ||
        p[1]<= this.yMin

    }


    isVoronoiCompleted() {
        return this.cY < this.yMin && !this.bExistIntersectionPointInTheCanvas;
    }
    
    iterate(): void {
        this.bExistIntersectionPointInTheCanvas = false;
        var iCurr: number = -1;
        this.cY -= this.dy;
        this.setActiveEdgesStateAsStopped();
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
                    if (ed == null) {
                        var edge: Edge = new Edge(new shapes.Vector2(bP.x, bP.y), new shapes.Vector2(bP.x, bP.y), bPp.voronoiPointOwner, bP.voronoiPointOwner, Edge.IsActive);
                        this.iEdges.push(edge);
                        this.UnlinkedEdges.push(edge);
                    }
                    if (ed != null) {
                        ed.state = Edge.IsActive;
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
                var iX = Math.floor((vPt.x +1.0)/ this.dx);
                var bPt = this.bPoints[iX];
                if (bPt.y != Number.MAX_VALUE) {
                    this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), bPt.voronoiPointOwner, vPt.index, Edge.IsActive));
                    this.iEdges.push(new Edge(new shapes.Vector2(bPt.x, bPt.y), new shapes.Vector2(bPt.x, bPt.y), vPt.index, bPt.voronoiPointOwner, Edge.IsActive));
                }
            }
        }
        //Intersect the stopped edges
        var stoppedEdges = this.getEdgesWithState(Edge.IsStopped);
        //Elliminate the stopped edges that reached the boundary.
        for (var i = 0; i < stoppedEdges.length; i++) {
            var edge1 = stoppedEdges[i];
            if (this.isPointOutOfScreen(new la.Vec2([edge1.pI.x, edge1.pI.y]))) {
                edge1.state = Edge.IsCompleted;
                stoppedEdges.removeAt(i, 1);
            }
        }
        /*
        //Now connected stopped edges
        for (var i = 0; i < stoppedEdges.length; i++) {
            var edge1 = stoppedEdges[i];
            for (var k = i+1; k < stoppedEdges.length; k++) {
                var edge2 = stoppedEdges[k];
                if (edge1.hasCommonVoronoiPoint(edge2)) {
                    this.connectEdges(edge1,edge2);
                }
            }
        }
        */


    }
}