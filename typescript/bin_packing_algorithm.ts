/// <reference path="./linearalgebra.ts" />

import la = require("linearalgebra");
import shapes2D = require("shapes2d");

class BinPackNode extends shapes2D.Rect2D {
    public parent: BinPackNode;
    public childs: Array<BinPackNode> = [];
    public color: string;
     
    constructor(p1: la.Vec2,p2: la.Vec2, color: string = null)
    {
        super(p1,p2);
        this.color = color;            
        this.childs = [];
        this.parent = null;
        
    } 


    canFit(width: number, height: number): boolean {
        return this.width() >= width && this.height() >= height;
    }

   verticalDecompose(height:number, width:number,color:string) {
       if (!this.canFit(height, width)) {
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
    used_height: number;
    used_width: number;

    ratio(): number {
        return this.used_width / this.used_height;
    }
    deform_factor(): number {
        return Math.abs(this.used_width - this.used_height);
    }
}

class BinPack  {
    root: BinPackNode;
    used_dims: la.Vec2;

    constructor(max_size:number) {
        this.root = new BinPackNode(new la.Vec2([0, 0]), new la.Vec2([max_size, max_size]));
        this.used_dims = new la.Vec2([0, 0]);
    }

    compareBinPackInsertion(node1: BinPackInsertionAnalysis, node2: BinPackInsertionAnalysis):BinPackInsertionAnalysis {
        if (node1 == null)
            return node2;
        if (node2 == null)
            return node1;
        return node1.deform_factor() < node2.deform_factor() ? node1 : node2;
    }

    private findBestCandidateForInsertionBasedOnGlobalShape(node: BinPackNode, width: number, height: number): BinPackInsertionAnalysis {
        if (node.canFit(width, height)) {
            if (node.isFree()) {
                var result = new BinPackInsertionAnalysis();
                result.node = node;
                result.used_width = Math.max(node.p1[0] + width, this.used_dims[0]);
                result.used_height = Math.max(node.p1[1] + height, this.used_dims[1]);
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