
/*
var canvas = document.getElementById("canvas");
var gl = glUtils.getWebGLContext(canvas);
if (!gl) {
    return;
}
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
         
shader = new ShaderColor2D(gl);
shader.shapes = [];

shader.points=[new Point(0,0),new Point(0,0.5)]

shader.draw()
var input=PointSelect(canvas);
input.onAddPoint = function()
{
    shader.shapes = [];

               
    /*shader.shapes.push(new Rect2D([-0.33, -0.33], [0.27, 0.27],
    [0, 0, 0, 1,
     1, 0, 0, 1,
     1, 1, 0, 1,
     0, 1, 0, 1]));
    shader.shapes=input.screenPointsAsNormalizedSquares(2, [1, 0, 1, 1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.draw();
}
        
        */