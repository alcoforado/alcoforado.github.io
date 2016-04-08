define(["require", "exports"], function (require, exports) {
    //O(n)
    function insertSort(a, elem, lessThan) {
        a.push(elem);
        for (var k = a.length - 1; k > 0; k--) {
            if (lessThan(elem, a[k - 1])) {
                //swap
                a[k] = a[k - 1];
                a[k - 1] = elem;
            }
        }
    }
    exports.insertSort = insertSort;
    function isSorted(a, elem, lessThan) {
        for (var k = 0; k < a.length - 1; k++) {
            if (lessThan(a[k + 1], a[k]))
                return false;
        }
        return true;
    }
    exports.isSorted = isSorted;
    function minElem(a, measure) {
        var elem;
        var min = Number.MAX_VALUE;
        a.forEach(function (el) {
            var d = measure(el);
            if (d < min) {
                min = d;
                elem = el;
            }
        });
        return elem;
    }
    exports.minElem = minElem;
    function binary_search(a, elem, lessThan) {
        throw "not Implemented";
    }
    exports.binary_search = binary_search;
});
//# sourceMappingURL=alghorithms.js.map