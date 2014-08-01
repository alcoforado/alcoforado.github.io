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

Voronoi = function (pts, x1, x2, dx) {
    points = [];
    for (var i=0;i<pts.length;i++)
    {
        points.push(new VoronoiPoint(pts.x, pts.y));

    }
    points.sort(function(el1,el2){return ele2.b - ele1.b})

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
            for (var x=this.xfirst;x<this.xend;x+=dx)
            {
                this.selectPts()
            }
        }
    }



}();