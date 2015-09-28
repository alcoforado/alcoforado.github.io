/// <reference path="./linearalgebra.ts" />
/// <reference path="./defines/jquery.d.ts" />
import la = require("linearalgebra");
import shapes2D = require("shapes2d");
import $ = require("jquery");
export class Rect {
    constructor(public width: number, public height: number, public color: la.Vec3) { }
}

class BinPackNode extends shapes2D.Rect2D {
    public parent: BinPackNode;
    public childs: Array<BinPackNode> = [];
    public color: la.Vec3;
     
    constructor(p1: la.Vec2,p2: la.Vec2, color: la.Vec3 = null)
    {
        super(p1,p2);
        this.color = color;            
        this.childs = [];
        this.parent = null;
        
    } 


    canFit(width: number, height: number): boolean {
        return this.width() >= width && this.height() >= height;
    }

   verticalDecompose(width:number, height:number,color:la.Vec3) {
       if (!this.canFit(width,height)) {
           throw "Invalid Decompose, Cannot Fit"
       }
       if (this.childs.length != 0)
           throw "BinPackNode already decomposed"

       var tr = new BinPackNode(this.p1, new la.Vec2([this.p1[0] + width, this.p1[1] + height]),color);

       var tl = new BinPackNode(new la.Vec2([tr.p2[0], tr.p1[1]]), new la.Vec2([tr.p2[0] + this.width() - tr.width(), tr.p1[1] + height]));

       //bottom rectangle
       var bP1 = new la.Vec2([this.p1[0], this.p1[1] + height]);
       var td = new BinPackNode(bP1, bP1.add(new la.Vec2([this.width(), this.height() - height])));


       this.addChild(tr);
       this.addChild(tl);
       this.addChild(td);
   }

   addChild(b: BinPackNode) {
       if (b.parent != null)
           throw "Node already has a parent";
       b.parent = this;
       this.childs.push(b);
   }

   isChildless(): boolean {
       return this.childs.length == 0;
   }

   isFree(): boolean {
       return this.color == null && this.isChildless();
   }

}

class BinPackInsertionAnalysis {
    node: BinPackNode;
    total_used_height: number;
    total_used_width: number;
    need_to_expand_region_limit: boolean;
    needed_width: number;
    needed_height: number;

    ratio(): number {
        return this.total_used_width / this.total_used_height;
    }
    deform_factor(): number {
        return Math.abs(this.total_used_width - this.total_used_height);
    }
}

export class BinPack  {
    root: BinPackNode;
    used_dims: la.Vec2;


    constructor(lst: Array<Rect>) {
        var max_size = this.getSizeUpperBound(lst);
        this.root = new BinPackNode(new la.Vec2([0, 0]), new la.Vec2([max_size, max_size]));
        this.used_dims = new la.Vec2([0, 0]);

        lst = lst.sort((r1: Rect, r2: Rect):number => {
            return Math.max(r2.height, r2.width) - Math.max(r1.height, r1.width) 
        });

        for (var i = 0; i < lst.length; i++) {
            var rect = lst[i];
            var analytic = this.findBestCandidateForInsertionBasedOnGlobalShape(this.root, rect.width, rect.height);
            if (analytic == null)
                throw "Can't insert rectangle " + rect.width + "x" + rect.height + ", no space available";
            else {
                analytic.node.verticalDecompose(rect.width, rect.height, rect.color);
                this.used_dims[0] = Math.max(analytic.total_used_width,  this.used_dims[0]);
                this.used_dims[1] = Math.max(analytic.total_used_height, this.used_dims[1]);
            }
                    
        }
    }

    public toDom(container: HTMLElement) {
        var rootDiv = $('<div></div>').addClass("bin-pack-root")
            .css("width", this.used_dims[0] + "px")
            .css("height", this.used_dims[1] + "px");
        $(container).append(rootDiv);

        var f = function (node: BinPackNode) {
            if (node.isChildless()) {
                if (node.isFree())
                    return;
                else
                    rootDiv.append(
                        $('<div></div>').addClass("bin-pack-node")
                            .css("width", node.width() + "px")
                            .css("height", node.height() + "px")
                            .css("background-color", node.color.toRGB())
                            .css("left", node.p1[0] + "px")
                            .css("top", node.p1[1] + "px")

                        );
            }
            else {
                f(node.childs[0]);
                f(node.childs[1]);
                f(node.childs[2]);
            }
        };
        
        f(this.root);
    }


    private getSizeUpperBound(lst: Array<Rect>): number {
        var width = 0;
        var height = 0;
        lst.forEach((elem:Rect)=> {
            width += elem.width;
            height += elem.height;
        });
        return width < height ? height : width;
    }

    public AreaUsagePercentage():number {
        var fillArea = 0;
        var f = function (node: BinPackNode)
        {
            
            if (node.isChildless() && !node.isFree()) {
                fillArea += node.area();
            }
            else if (!node.isChildless()) {
                f(node.childs[0]);
                f(node.childs[1]);
                f(node.childs[2]);
            }
        }
        f(this.root);
        return fillArea / (this.used_dims[0] * this.used_dims[1]) * 100.0;
    }


    private sumArea(lst: Array<Rect>): number {
        var area = 0;
        lst.forEach((elem: Rect) => {
            area += elem.width*elem.height;
        });
        return area;
    }

    private compareBinPackInsertion(result1: BinPackInsertionAnalysis, result2: BinPackInsertionAnalysis):BinPackInsertionAnalysis {
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

    }

    private findBestCandidateForInsertionBasedOnGlobalShape(node: BinPackNode, width: number, height: number): BinPackInsertionAnalysis {
        if (node.canFit(width, height)) {
            if (node.isFree()) {
                var result = new BinPackInsertionAnalysis();
                result.node = node;
                result.total_used_width = Math.max(node.p1[0] + width, this.used_dims[0]);
                result.total_used_height = Math.max(node.p1[1] + height, this.used_dims[1]);
                result.needed_height = height;
                result.needed_width = width;
                result.need_to_expand_region_limit = (node.p1[0] + width > this.used_dims[0] || node.p1[1] + height > this.used_dims[1])
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
    }

    

    

}