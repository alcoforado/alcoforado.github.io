var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "linearalgebra", "shapes2d", "jquery"], function (require, exports, la, shapes2D, $) {
    var Rect = (function () {
        function Rect(width, height, color) {
            this.width = width;
            this.height = height;
            this.color = color;
        }
        return Rect;
    })();
    exports.Rect = Rect;
    var BinPackNode = (function (_super) {
        __extends(BinPackNode, _super);
        function BinPackNode(p1, p2, color) {
            if (color === void 0) { color = null; }
            _super.call(this, p1, p2);
            this.childs = [];
            this.color = color;
            this.childs = [];
            this.parent = null;
        }
        BinPackNode.prototype.verticalDecompose = function (width, height, color) {
            if (!this.canFit(width, height)) {
                throw "Invalid Decompose, Cannot Fit";
            }
            if (this.childs.length != 0)
                throw "BinPackNode already decomposed";
            var tr = new BinPackNode(this.p1, new la.Vec2([this.p1[0] + width, this.p1[1] + height]), color);
            var tl = new BinPackNode(new la.Vec2([tr.p2[0], tr.p1[1]]), new la.Vec2([tr.p2[0] + this.width() - tr.width(), tr.p1[1] + height]));
            //bottom rectangle
            var bP1 = new la.Vec2([this.p1[0], this.p1[1] + height]);
            var td = new BinPackNode(bP1, bP1.add(new la.Vec2([this.width(), this.height() - height])));
            this.addChild(tr);
            this.addChild(tl);
            this.addChild(td);
        };
        BinPackNode.prototype.horizontalDecompose = function (width, height, color) {
            if (!this.canFit(width, height)) {
                throw "Invalid Decompose, Cannot Fit";
            }
            if (this.childs.length != 0)
                throw "BinPackNode already decomposed";
            var tl = new BinPackNode(this.p1, new la.Vec2([this.p1[0] + width, this.p1[1] + height]), color);
            var td = new BinPackNode(new la.Vec2([this.p1[0], this.p1[1] + height]), new la.Vec2([this.p1[0] + width, this.p2[1]]));
            var tr = new BinPackNode(new la.Vec2([this.p1[0] + width, this.p1[1]]), this.p2);
            this.addChild(tl);
            this.addChild(tr);
            this.addChild(td);
        };
        BinPackNode.prototype.horizontalDecomposeRemainingRegions = function (width, height) {
            if (!this.canFit(width, height)) {
                throw "Invalid Decompose, Cannot Fit";
            }
            if (this.childs.length != 0)
                throw "BinPackNode already decomposed";
            return [new shapes2D.Rect2D(new la.Vec2([this.p1[0], this.p1[1] + height]), new la.Vec2([this.p1[0] + width, this.p2[1]])), new shapes2D.Rect2D(new la.Vec2([this.p1[0] + width, this.p1[1]]), this.p2)];
        };
        BinPackNode.prototype.verticalDecomposeRemainingRegions = function (width, height) {
            if (!this.canFit(width, height)) {
                throw "Invalid Decompose, Cannot Fit";
            }
            if (this.childs.length != 0)
                throw "BinPackNode already decomposed";
            var tr = new shapes2D.Rect2D(this.p1, new la.Vec2([this.p1[0] + width, this.p1[1] + height]));
            var tl = new shapes2D.Rect2D(new la.Vec2([tr.p2[0], tr.p1[1]]), new la.Vec2([tr.p2[0] + this.width() - tr.width(), tr.p1[1] + height]));
            //bottom rectangle
            var bP1 = new la.Vec2([this.p1[0], this.p1[1] + height]);
            var td = new shapes2D.Rect2D(bP1, bP1.add(new la.Vec2([this.width(), this.height() - height])));
            return [tl, td];
        };
        BinPackNode.prototype.addChild = function (b) {
            if (b.parent != null)
                throw "Node already has a parent";
            b.parent = this;
            this.childs.push(b);
        };
        BinPackNode.prototype.isChildless = function () {
            return this.childs.length == 0;
        };
        BinPackNode.prototype.isFree = function () {
            return this.color == null && this.isChildless();
        };
        return BinPackNode;
    })(shapes2D.Rect2D);
    var BinPackInsertionAnalysis = (function () {
        function BinPackInsertionAnalysis() {
        }
        BinPackInsertionAnalysis.prototype.ratio = function () {
            return this.total_used_width / this.total_used_height;
        };
        BinPackInsertionAnalysis.prototype.deform_factor = function () {
            return Math.abs(this.total_used_width - this.total_used_height);
        };
        return BinPackInsertionAnalysis;
    })();
    var BinPack = (function () {
        function BinPack(lst) {
            this.max_size = 2 * this.getSizeUpperBound(lst);
            this.root = new BinPackNode(new la.Vec2([0, 0]), new la.Vec2([this.max_size, this.max_size]));
            this.used_dims = new la.Vec2([0, 0]);
            lst = lst.sort(function (r1, r2) {
                return r2.height - r1.height; //Math.max(r2.height, r2.width) - Math.max(r1.height, r1.width) 
            });
            for (var i = 0; i < lst.length; i++) {
                var rect = lst[i];
                var analytic = this.findBestCandidateForInsertionBasedOnGlobalShape(this.root, rect.width, rect.height);
                if (analytic == null)
                    throw "Can't insert rectangle " + rect.width + "x" + rect.height + ", no space available";
                else {
                    if (analytic.node_to_insert_is_most_bottom)
                        analytic.node.verticalDecompose(rect.width, rect.height, rect.color);
                    else if (analytic.node_to_insert_is_most_right)
                        analytic.node.horizontalDecompose(rect.width, rect.height, rect.color);
                    else {
                        var vh = analytic.node.horizontalDecomposeRemainingRegions(rect.width, rect.height);
                        var vr = analytic.node.verticalDecomposeRemainingRegions(rect.width, rect.height);
                        var regions = [vh[0], vh[1], vr[0], vr[1]];
                        var total = this.HowManyRemainingRectanglesCanFit(lst, i + 1, regions);
                        if (Math.min(total[0], total[1]) > Math.min(total[2], total[3]))
                            analytic.node.horizontalDecompose(rect.width, rect.height, rect.color);
                        else if (Math.min(total[0], total[1]) < Math.min(total[2], total[3]))
                            analytic.node.verticalDecompose(rect.width, rect.height, rect.color);
                        else if (Math.max(total[0], total[1]) > Math.max(total[2], total[3]))
                            analytic.node.horizontalDecompose(rect.width, rect.height, rect.color);
                        else
                            analytic.node.verticalDecompose(rect.width, rect.height, rect.color);
                    }
                    this.used_dims[0] = Math.max(analytic.total_used_width, this.used_dims[0]);
                    this.used_dims[1] = Math.max(analytic.total_used_height, this.used_dims[1]);
                }
            }
        }
        BinPack.prototype.HowManyRemainingRectanglesCanFit = function (lst, start, regions) {
            var result = new Array(regions.length);
            for (var i = 0; i < result.length; i++) {
                result[i] = 0;
            }
            for (var i = start; i < lst.length; i++) {
                for (var j = 0; j < regions.length; j++) {
                    if (regions[j].canFit(lst[i].width, lst[i].height)) {
                        result[j] += 1;
                    }
                }
            }
            return result;
        };
        BinPack.prototype.toDom = function (container) {
            var rootDiv = $('<div></div>').addClass("bin-pack-root").css("width", this.used_dims[0] + "px").css("height", this.used_dims[1] + "px");
            $(container).append(rootDiv);
            var f = function (node) {
                if (node.isChildless()) {
                    if (node.isFree())
                        return;
                    else
                        rootDiv.append($('<div></div>').addClass("bin-pack-node").css("width", node.width() + "px").css("height", node.height() + "px").css("background-color", node.color.toRGB()).css("left", node.p1[0] + "px").css("top", node.p1[1] + "px"));
                }
                else {
                    f(node.childs[0]);
                    f(node.childs[1]);
                    f(node.childs[2]);
                }
            };
            f(this.root);
        };
        BinPack.prototype.getSizeUpperBound = function (lst) {
            var width = 0;
            var height = 0;
            lst.forEach(function (elem) {
                width += elem.width;
                height += elem.height;
            });
            return (width < height ? height : width);
        };
        BinPack.prototype.AreaUsagePercentage = function () {
            var fillArea = 0;
            var f = function (node) {
                if (node.isChildless() && !node.isFree()) {
                    fillArea += node.area();
                }
                else if (!node.isChildless()) {
                    f(node.childs[0]);
                    f(node.childs[1]);
                    f(node.childs[2]);
                }
            };
            f(this.root);
            return fillArea / (this.used_dims[0] * this.used_dims[1]) * 100.0;
        };
        BinPack.prototype.sumArea = function (lst) {
            var area = 0;
            lst.forEach(function (elem) {
                area += elem.width * elem.height;
            });
            return area;
        };
        BinPack.prototype.compareBinPackInsertion = function (result1, result2) {
            if (result1 == null)
                return result2;
            if (result2 == null)
                return result1;
            if (result1.need_to_expand_region_limit && result2.need_to_expand_region_limit)
                return result1.deform_factor() < result2.deform_factor() ? result1 : result2;
            else if (!result1.need_to_expand_region_limit && result2.need_to_expand_region_limit)
                return result1;
            else if (result1.need_to_expand_region_limit && !result2.need_to_expand_region_limit)
                return result2;
            else {
                return result1.node.area() < result2.node.area() ? result1 : result2;
            }
        };
        BinPack.prototype.findBestCandidateForInsertionBasedOnGlobalShape = function (node, width, height) {
            if (node.canFit(width, height)) {
                if (node.isFree()) {
                    var result = new BinPackInsertionAnalysis();
                    result.node = node;
                    result.total_used_width = Math.max(node.p1[0] + width, this.used_dims[0]);
                    result.total_used_height = Math.max(node.p1[1] + height, this.used_dims[1]);
                    result.needed_height = height;
                    result.needed_width = width;
                    result.need_to_expand_region_limit = (node.p1[0] + width > this.used_dims[0] || node.p1[1] + height > this.used_dims[1]);
                    result.need_to_expand_total_height = node.p1[1] + height > this.used_dims[1];
                    result.need_to_expand_total_width = node.p1[0] + width > this.used_dims[0];
                    result.node_to_insert_is_most_right = node.p2[0] + 1 >= this.max_size;
                    result.node_to_insert_is_most_bottom = node.p2[1] + 1 >= this.max_size;
                    return result;
                }
                if (node.isChildless())
                    return null;
                else {
                    //the number of childs should always be tree, make sure of it just for consistency
                    if (node.childs.length != 3)
                        throw "Node should have three childs";
                    var result1 = this.findBestCandidateForInsertionBasedOnGlobalShape(node.childs[0], width, height);
                    var result2 = this.findBestCandidateForInsertionBasedOnGlobalShape(node.childs[1], width, height);
                    var result3 = this.findBestCandidateForInsertionBasedOnGlobalShape(node.childs[2], width, height);
                    return this.compareBinPackInsertion(this.compareBinPackInsertion(result1, result2), result3);
                }
            }
            else
                return null;
        };
        return BinPack;
    })();
    exports.BinPack = BinPack;
});
//# sourceMappingURL=bin_packing_algorithm.js.map