/*Rect2D = function(p1,p2,colorsRGB,texturePoints)
{
    if (p1[0] > p2[0] || p1[1] > p2[1])
        throw new Exception("Assert failed")

    return {
        writeTopology : function()
        {
            return [
            p1[0],p1[1],
            p2[0],p1[1],
            p1[0],p2[1],
            p2[0],p1[1],
            p2[0],p2[1],
            p1[0],p2[1]
            ]
        },
        nSize : 6


    }
}*/
function Rect2D(p1, p2, colorsRGB, texturePoints) {
    if (p1[0] > p2[0] || p1[1] > p2[1])
        throw new Exception("Assert failed")
    this.p1 = p1;
    this.p2 = p2;
    this.colorsRGB=colorsRGB
}


Rect2D.prototype.writeTopology = function () {
    var p1 = this.p1;
    var p2 = this.p2;
    return [
    p1[0], p1[1],
    p2[0], p1[1],
    p1[0], p2[1],
    p2[0], p1[1],
    p2[0], p2[1],
    p1[0], p2[1]
    ]
}

Rect2D.prototype.writeVertices = function () {
    var p1 = this.p1;
    var p2 = this.p2;
    return [
    p1[0], p1[1],
    p2[0], p1[1],
    p2[0], p2[1],
    p1[0] ,p2[1]
    ]
}

Rect2D.prototype.writeIndices = function () {
    return [
        0,1,3,
        1,2,3
    ]
}


Rect2D.prototype.writeColors = function () {
    var a = [];
    return this.colorsRGB;
}



function Point(x,y,color)
{
    this.x = x;
    this.y = y;
    if (color != null)
        this.color = color;
}


function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}


function ColorFiller(Color) {
    if (Object.prototype.toString.call(this.color) === '[object Array]') 
        this.color=Color;
    else
    {
        color=[Color];
    }

    
    this.color = Color;

}
ColorFiller.prototype = function Fill(points) {
    for (var i = 0; i < points.length; i++) {
        points[i].color = this.color[i % color.length];
    }
}





function LineStrip() {
    this.points = [];
    

}
LineStrip.prototype.AddPoint(point)
{
    this.points.push(point);
}