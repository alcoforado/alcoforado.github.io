define(["require", "exports"], function(require, exports) {
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

        Vector2.prototype.toPrecision = function (p) {
            return new Vector2(precision(this.x, p), precision(this.y, p));
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
        function Vector4() {
        }
        Vector4.prototype.toArray = function () {
            return [this.x, this.y, this.z, this.w];
        };
        return Vector4;
    })();
    exports.Vector4 = Vector4;

    

    var CyclicColorArray = (function () {
        function CyclicColorArray() {
        }
        CyclicColorArray.prototype.getColor = function (i) {
            return this.colors[i % this.colors.length];
        };
        return CyclicColorArray;
    })();
    exports.CyclicColorArray = CyclicColorArray;

    

    var Rect2D = (function () {
        function Rect2D(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
        Rect2D.CreateRectFromPoint = function (barycenter, width, length) {
            return new Rect2D(new Vector2(barycenter.x - width / 2.0, barycenter.y - length / 2.0), new Vector2(barycenter.x + width / 2.0, barycenter.y + length / 2.0));
        };

        Rect2D.prototype.vertices = function () {
            return [
                this.p1[0], this.p1[1],
                this.p2[0], this.p1[1],
                this.p2[0], this.p2[1],
                this.p1[0], this.p2[1]];
        };
        Rect2D.prototype.indices = function () {
            return [
                0, 1, 3,
                1, 2, 3
            ];
        };
        return Rect2D;
    })();
    exports.Rect2D = Rect2D;
});
//# sourceMappingURL=shapes2d.js.map
