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


