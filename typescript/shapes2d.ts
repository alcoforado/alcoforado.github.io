
import la = require("linearalgebra");


var precision = function (x: number, p: number):number {
    return parseFloat(x.toPrecision(p));
}

export class Vector2 {
    x: number;
    y: number;
    toArray() { return [this.x, this.y]; }

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    toVec2():la.Vec2 {
        return new la.Vec2([this.x, this.y]);
    }

    neg(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }
    plus(p:Vector2): Vector2 {
        return new Vector2(this.x + p.x, this.y + p.y);
    }
    minus(p: Vector2): Vector2 {
        return new Vector2(this.x - p.x, this.y - p.y);
    }

    toPrecision(p: number):Vector2 {
        return new Vector2(precision(this.x, p), precision(this.y, p));
    }

    scale(c: number): Vector2 {
        return new Vector2(this.x * c, this.y * c);
    } 
} 


export class Vector3 {
    x: number;
    y: number;
    z: number;
    toArray() { return [this.x, this.y, this.z]; }
}

export class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    toArray() { return [this.x, this.y, this.z, this.w]; }

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}



//The colors renders
export interface ColorRender {
    getColor(i:number):Vector4;
}

export class CyclicColorArray implements ColorRender {
    colors: Array<Vector4>

    constructor(cls: Array<Vector4>) {
        this.colors = cls;
    }

    getColor(i: number):Vector4 {
        return this.colors[i%this.colors.length]
    }
}


export class Shape2D {
    topology:ITopology2D;
    colorizer:ColorRender;

    constructor(top: ITopology2D, colorizer: ColorRender) {
        this.topology = top;
        this.colorizer = colorizer;
    }


    vertices():number[] {
        return this.topology.vertices();
    }
    indices():number[] {
        return this.topology.indices();
    }
    colors(): number[]{
        var size = this.topology.n_vertices();
        var result:number[] = [];
        for (var i = 0; i < size; i++) {
            var color: Vector4 = this.colorizer.getColor(i);
            result.push(color.x, color.y, color.z, color.w);
        }
        return result;
    }
    topology_type() {
        return this.topology.topology_type();
    }
}


//Shapes
export enum TopologyType { INDEXED_TRIANGLES, LINES }

export interface ITopology2D {
    vertices()
    indices()
    n_vertices(): number
    topology_type():TopologyType
}


export class Line2D implements ITopology2D {
    p1: la.Vec2;
    p2: la.Vec2;

    constructor(p1: la.Vec2, p2: la.Vec2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    indices() {
        throw "not Implemented"
    }

    topology_type() {
        return TopologyType.LINES
    }

    n_vertices() {
        return 2;
    }

    vertices() {
        return [
            this.p1[0],
            this.p1[1],
            this.p2[0],
            this.p2[1]
        ];
    }


}


export class Rect2D implements ITopology2D{

    p1: la.Vec2;
    p2: la.Vec2;
    constructor(p1: la.Vec2, p2: la.Vec2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    topology_type() { return TopologyType.INDEXED_TRIANGLES; }

    static createRectFromPoint(barycenter: la.Vec2, width: number, length: number):Rect2D {
        return new Rect2D(new la.Vec2([barycenter[0] - width / 2.0, barycenter[1] - length / 2.0]),
                          new la.Vec2([barycenter[0] + width / 2.0, barycenter[1] + length / 2.0]));
    }

    n_vertices() {
        return 4;
    }

    area(): number {
        return this.width() * this.height();
    }

    width(): number {
        return this.p2[0] - this.p1[0];
    }

    height(): number {
        return this.p2[1] - this.p1[1];
    }


    vertices() {
        return [
            this.p1[0], this.p1[1],
            this.p2[0], this.p1[1],
            this.p2[0], this.p2[1],
            this.p1[0], this.p2[1]];
    }
    indices() {
        return [
            0, 1, 3,
            1, 2, 3
        ]
    }

    canContain(rect:Rect2D): boolean {
        return this.width() >= rect.width() && this.height() >= rect.height();
    }


}

