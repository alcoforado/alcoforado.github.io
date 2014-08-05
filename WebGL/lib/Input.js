PointSelect = function(canvas)
{
    var obj = {
        detach: function () {
            canvas.onmousedown = null
        },
        points: [],

        canvas: canvas,


        screenPointsAsNormalizedSquares: function (squareSize, color) {
            var squares = [];
            var colors = [];
            var sqSizeX = 2*squareSize / canvas.width
            var sqSizeY = 2*squareSize / canvas.height
            colors=colors.concat(color, color, color, color);
            for (var i = 0; i < this.points.length; i++) {
                var p = [2.0*this.points[i].x / canvas.width -1.0, 2.0*(canvas.height - this.points[i].y) / canvas.height - 1.0]
                squares.push(new Rect2D([p[0] - sqSizeX, p[1] - sqSizeY],
                                        [p[0] + sqSizeX, p[1] + sqSizeY],
                                        colors)
                            )
            }
            return squares;

        },

        screenPointsAsNormalized: function () {
            var result = [];
            for (var i = 0; i < this.points.length; i++) {
                var p = [2.0 * this.points[i].x / canvas.width - 1.0, 2.0 * (canvas.height - this.points[i].y) / canvas.height - 1.0]
                result.push(new Point(p[0], p[1]))
            }
            return result;

        }


    }

        canvas.addEventListener('click', function(event)
        {
            var point= Object.create(null);
            point.x=event.offsetX;
            point.y=event.offsetY;
            obj.points.push(point);
            obj.onAddPoint();
        })

    return obj;


}