 
//O(n)
export function insertSort(a:Array<any>,elem:any,lessThan:(e1:any,e2:any)=>boolean) {

    a.push(elem);
    for (var k = a.length - 1; k > 0;k--) {
        if (lessThan(elem, a[k - 1])) {
            //swap
            a[k] = a[k - 1];
            a[k - 1] = elem;
        }
    }
}

export function isSorted(a: Array<any>, elem: any, lessThan: (e1: any, e2: any) => boolean):boolean {
    for (var k = 0; k < a.length - 1; k++) {
        if (lessThan(a[k + 1], a[k]))
            return false;
    }
    return true;

}

export function minElem<T>(a: Array<T>, measure: (e1: T) => number): T {
    var elem: T;
    var min: number = Number.MAX_VALUE;
    a.forEach(function (el:T) {
        var d = measure(el);
        if (d < min) {
            min = d;
            elem = el;
        }
    });
    return elem;
}

export function binary_search(a: Array<any>, elem: any, lessThan: (e1: any, e2: any) => boolean): boolean {


    throw "not Implemented";

}



