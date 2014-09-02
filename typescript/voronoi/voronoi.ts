/// <reference path="../shaders.ts" />
/// <reference path="../shapes2d.ts" />

import shapes = require("shapes2d");

class VoronoiPoint extends shapes.Vector2 {
    active: boolean;
    aboveScanLine: boolean;

    constructor(x: number, y: number) {
        super(x, y);
        this.active = false;
        this.aboveScanLine = false;
    }

    beachLine(x: number, ly: number): number {
        return ((x - this.x) * (x - this.x) / (this.y - ly) + (this.y + ly)) / 2.0
    }

}

class IntersectionPoints {
    constructor(public p1: shapes.Vector2, vPointI:number, vPointJ:number) {


    }

}


class Voronoi {
    vPoints: VoronoiPoint[] = [];
    xPoints: shapes.Vector2[] = [];
    cY: number;
    tol: number;
    constructor(pts: shapes.Vector2[], public x1: number, public x2: number, public dx: number, public y1:number, public y2:number, public dy:number) {
        this.x1 = x1;
        this.x2 = x2;
        this.dx = dx;
        this.y1 = y1;
        this.y2 = y2;
        this.dy = dy;
        this.tol = dx / 4.0;
        this.vPoints = [];
        this.cY = y1;
        for (var pt in pts) {
            this.vPoints.push(new VoronoiPoint(pt.x, pt.y));
        }
        
/*        
        for (var x = x1; x <= xe; x += dx) {
            xPoints.push(new shapes.Vector2());
        }
*/
    }

    iterate(): void {
        this.



        this.cY += this.dy;
        

    }



}


= function (pts, x1, x2, dx) {
    points = [];
    for (var i = 0; i < pts.length; i++) {
        points.push(new VoronoiPoint(pts.x, pts.y));

    }
    points.sort(function (el1, el2) {return ele2.b - ele1.b })

    var selectPts = function (ps, ly) {
        for (var i = 0; i < ps.length; i++) {
            ps[i].active = points[i].b > ly;
        }
    }

    return {
        points: points,
        xfirst: x1,
        xend: x2,
        dx: dx,
        iterate: function (ly) {
            var result = [];
            selectPts(this.points, ly);
            for (var x = this.xfirst; x <= this.xend; x += this.dx) {
                var min = Number.MAX_VALUE
                for (var i = 0; i < this.points.length; i++) {
                    if (!this.points[i].active)
                        break;
                    var dd = this.points[i].beachLine(x, ly);
                    if (dd < min)
                        min = dd;
                }
                result.push(new Point(x, min))
            }
            return result;
        }
    }



} ();