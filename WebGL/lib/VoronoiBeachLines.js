function VoronoiPoint(a,b)
{
    this.a = a;
    this.b = b;
    this.active = false;


}

VoronoiPoint.prototype.beachLine = function(x,ly)
{
    return ( (x-this.a)*(x-this.a)/(this.b-ly) + (this.b+ly) )/2.0

}

CreateVoronoi = function (pts, x1, x2, dx) {
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

    return {
        points: points,
        xfirst:x1,
        xend: x2,
        dx: dx,
        iterate: function(ly)
        {
            var result = [];
            selectPts(this.points, ly);
            for (var x=this.xfirst;x<=this.xend;x+=this.dx)
            {
                var min=Number.MAX_VALUE
                for (var i = 0; i < this.points.length;i++)
                {
                    if (!this.points[i].active)
                        break;
                    var dd = this.points[i].beachLine(x, ly);
                    if (dd < min)
                       min = dd;
                }
                result.push(new Point(x,min))
            }
            return result;
        }
    }



};