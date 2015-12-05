define(["require", "exports", "linearalgebra"], function (require, exports, la) {
    var precision = function (x, p) {
        return parseFloat(x.toPrecision(p));
    };
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.toArray = function () {
            return [this.x, this.y];
        };
        Vector2.prototype.toVec2 = function () {
            return new la.Vec2([this.x, this.y]);
        };
        Vector2.prototype.neg = function () {
            return new Vector2(-this.x, -this.y);
        };
        Vector2.prototype.plus = function (p) {
            return new Vector2(this.x + p.x, this.y + p.y);
        };
        Vector2.prototype.minus = function (p) {
            return new Vector2(this.x - p.x, this.y - p.y);
        };
        Vector2.prototype.toPrecision = function (p) {
            return new Vector2(precision(this.x, p), precision(this.y, p));
        };
        Vector2.prototype.scale = function (c) {
            return new Vector2(this.x * c, this.y * c);
        };
        return Vector2;
    })();
    exports.Vector2 = Vector2;
    var Vector3 = (function () {
        function Vector3() {
        }
        Vector3.prototype.toArray = function () {
            return [this.x, this.y, this.z];
        };
        return Vector3;
    })();
    exports.Vector3 = Vector3;
    var Vector4 = (function () {
        function Vector4(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Vector4.prototype.toArray = function () {
            return [this.x, this.y, this.z, this.w];
        };
        return Vector4;
    })();
    exports.Vector4 = Vector4;
    var CyclicColorArray = (function () {
        function CyclicColorArray(cls) {
            this.colors = cls;
        }
        CyclicColorArray.prototype.getColor = function (i) {
            return this.colors[i % this.colors.length];
        };
        return CyclicColorArray;
    })();
    exports.CyclicColorArray = CyclicColorArray;
    var Shape2D = (function () {
        function Shape2D(top, colorizer) {
            this.topology = top;
            this.colorizer = colorizer;
        }
        Shape2D.prototype.vertices = function () {
            return this.topology.vertices();
        };
        Shape2D.prototype.indices = function () {
            return this.topology.indices();
        };
        Shape2D.prototype.colors = function () {
            var size = this.topology.n_vertices();
            var result = [];
            for (var i = 0; i < size; i++) {
                var color = this.colorizer.getColor(i);
                result.push(color.x, color.y, color.z, color.w);
            }
            return result;
        };
        Shape2D.prototype.topology_type = function () {
            return this.topology.topology_type();
        };
        return Shape2D;
    })();
    exports.Shape2D = Shape2D;
    //Shapes
    (function (TopologyType) {
        TopologyType[TopologyType["INDEXED_TRIANGLES"] = 0] = "INDEXED_TRIANGLES";
        TopologyType[TopologyType["LINES"] = 1] = "LINES";
    })(exports.TopologyType || (exports.TopologyType = {}));
    var TopologyType = exports.TopologyType;
    var Line2D = (function () {
        function Line2D(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
        Line2D.prototype.indices = function () {
            throw "not Implemented";
        };
        Line2D.prototype.topology_type = function () {
            return 1 /* LINES */;
        };
        Line2D.prototype.n_vertices = function () {
            return 2;
        };
        Line2D.prototype.vertices = function () {
            return [
                this.p1[0],
                this.p1[1],
                this.p2[0],
                this.p2[1]
            ];
        };
        return Line2D;
    })();
    exports.Line2D = Line2D;
    var Rect2D = (function () {
        function Rect2D(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
        Rect2D.prototype.topology_type = function () {
            return 0 /* INDEXED_TRIANGLES */;
        };
        Rect2D.createRectFromPoint = function (barycenter, width, length) {
            return new Rect2D(new la.Vec2([barycenter[0] - width / 2.0, barycenter[1] - length / 2.0]), new la.Vec2([barycenter[0] + width / 2.0, barycenter[1] + length / 2.0]));
        };
        Rect2D.prototype.canFit = function (width, height) {
            return this.width() >= width && this.height() >= height;
        };
        Rect2D.prototype.n_vertices = function () {
            return 4;
        };
        Rect2D.prototype.area = function () {
            return this.width() * this.height();
        };
        Rect2D.prototype.width = function () {
            return this.p2[0] - this.p1[0];
        };
        Rect2D.prototype.height = function () {
            return this.p2[1] - this.p1[1];
        };
        Rect2D.prototype.vertices = function () {
            return [
                this.p1[0],
                this.p1[1],
                this.p2[0],
                this.p1[1],
                this.p2[0],
                this.p2[1],
                this.p1[0],
                this.p2[1]
            ];
        };
        Rect2D.prototype.indices = function () {
            return [
                0,
                1,
                3,
                1,
                2,
                3
            ];
        };
        Rect2D.prototype.canContain = function (rect) {
            return this.width() >= rect.width() && this.height() >= rect.height();
        };
        return Rect2D;
    })();
    exports.Rect2D = Rect2D;
});
//# sourceMappingURL=shapes2d.js.map