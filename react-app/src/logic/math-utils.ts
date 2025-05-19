export default class MathUtils {

    static isPowerOf2(n:number):boolean
    {
        if (n===Math.round(n))
            return (n&(n-1))===0
        else
            return false;
    }
}