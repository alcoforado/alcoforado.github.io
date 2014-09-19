
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

    toPrecision(p: number):Vector2 {
        return new Vector2(precision(this.x, p), precision(this.y, p));
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
}



//The colors renders
export interface ColorRender {
    getColor(i:number);
}

export class CyclicColorArray implements ColorRender {
    colors: Array<Vector4>

    getColor(i: number) {
        return this.colors[i%this.colors.length]
    }
}





//Shapes
export interface IShapes2D {
    vertices()
    indices() 
}


export class Rect2D implements IShapes2D{

    p1: Vector2;
    p2: Vector2;
    constructor(p1: Vector2, p2: Vector2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    static CreateRectFromPoint(barycenter: Vector2, width: number, length: number):Rect2D {
        return new Rect2D(new Vector2(barycenter.x - width / 2.0, barycenter.y - length / 2.0),
                          new Vector2(barycenter.x + width / 2.0, barycenter.y + length / 2.0));
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
}

