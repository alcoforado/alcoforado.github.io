function VoronoiPoint(a,b)
{
    this.a = a;
    this.b = b;
    this.active = false;


}


function VoronoiEdges() {
    this.edges=[]
}
VoronoiEdges.prototype.Add = function(i, j, x, y)
{
    if (this.Find(i,j) == null)
        this.edges.push({ i: i, j: j, p1: new Point(x,y), p2: new Point(x,y)});

}
VoronoiEdges.prototype.Find = function (pi,pj)
{

    for (var i=0;i<this.edges.length;i++)
    {
        if (this.edges[i].i == pi && this.edges[i].j == pj) 
            return this.edges[i];
    }
    return null;

}












VoronoiPoint.prototype.beachLine = function(x,ly)
{
    return ( (x-this.a)*(x-this.a)/(this.b-ly) + (this.b+ly) )/2.0

}

CreateVoronoi = function (pts, x1, x2, dx, y1, y2,dy) {
    points = [];
    for (var i=0;i<pts.length;i++)
    {
        points.push(new VoronoiPoint(pts[i].x, pts[i].y));

    }
    points.sort(function(el1,el2){return el2.b - el1.b})

    var selectPts = function (ps,ly) {
        for(var i=0;i<ps.length;i++){
            ps[i].active = points[i].b > ly;
        }
    }

    var intersections = [];
    for (var x = x1; x <= x2; x += dx) {
        pt = new Point(0, Number.MAX_VALUE);
        pt.i = -1;
        intersections.push(pt)
    }
    

    return {
        points: points,
        xfirst: x1,
        xend: x2,
        yfirst: y1,
        yend: y2,
        dy: dy,
        dx: dx,
        y: y1,
        edges: [],
        addEdge: function(i, j, x, y)
        {
            if (this.findEdge(i,j) == null)
                this.edges.push({ i: i, j: j, p1: new Point(x,y), p2: new Point(x,y)});

        },
        findEdge: function (pi,pj)
        {

            for (var i=0;i<this.edges.length;i++)
            {
                if (this.edges[i].i == pi && this.edges[i].j == pj) 
                    return this.edges[i];
            }
            return null;

        },
        reinit: function()
        {
            this.y = this.y1;
            for (var i = 0; i < intersections.length; i++) {
                pt = new Point(0, Number.MAX_VALUE);
                pt.i = -1;
                intersections.push(pt)
            }
        },
        intersections: intersections,
        drawBeachLine: function (ly) {
            var intersections = [];
            var result = [];
            selectPts(this.points, ly);
            for (var x = this.xfirst; x <= this.xend; x += this.dx) {
                var min = Number.MAX_VALUE
                for (var i = 0; i < this.points.length; i++) {
                    if (!this.points[i].active)
                        break;
                    var dd = this.points[i].beachLine(x, ly);
                    if (dd < min) {
                        min = dd;
                    }
                }
                result.push(new Point(x, min))
            }
            return result;
        },
        iterate: function () {
            var iP = [];
            var result = [];
            selectPts(this.points, this.y);
            var ix = 0;
            for (var x = this.xfirst; x <= this.xend; x += this.dx) {
                for (var i = 0; i < this.points.length; i++) {
                    if (!this.points[i].active)
                        break;
                    var dd = this.points[i].beachLine(x, this.y);
                    if (dd < this.intersections[ix].y) {
                        this.intersections[ix].x = x;
                        this.intersections[ix].y = dd;
                        this.intersections[ix].i = i;

                    }
                }
                result.push(new Point(x, this.intersections[ix].y))
                ix += 1;
            }
            this.y += dy;
            
            var currP = this.intersections[0].i;
            for (var l = 1; l < this.intersections.length ; l++) {
                if (currP != this.intersections[l].i && currP != -1) {
                    var li = currP;
                    currP = this.intersections[l].i;
                    var lj = this.intersections[l].i;
                    if (li > lj) {
                        var aux = lj;
                        lj = li;
                        li = aux;
                    }
                    var edge = this.findEdge(li, lj);
                    if (edge === null)
                        this.addEdge(li, lj, this.intersections[l].x, this.intersections[l].y);
                    else {
                        edge.p2.x = this.intersections[l].x;
                        edge.p2.y=  this.intersections[l].y;
                    }
                }
            }

            return { beachLinePoints: result, intersectionPoints: iP }

        }



    }



};