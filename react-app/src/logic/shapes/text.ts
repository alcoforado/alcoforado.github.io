import {ITopology2D} from '../topology/2d/itopology2d';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import MGL from '../mgl/mgl'
import {vec3,vec2} from "gl-matrix"
import {ShaderType} from '../shaders/shader-factory'
import {MGLTexture} from '../mgl/mglTexture'
import {XMLParser} from 'fast-xml-parser'

export class Font {
    _fontTexture:MGLTexture;
    _fontInfo:any;
    constructor(mgl:MGL,fontFile:string)
    {
        this._fontTexture=new MGLTexture(mgl,new URL(fontFile+".png"));
        mgl.loadFile(fontFile+".xml",(data:string)=>{
            let parser=new XMLParser();
            this._fontInfo=parser.parse(data);
        })
    }
}

export class Text implements IShape  {
    private _nLetters:number;
    constructor(private mgl:MGL, private bl:vec2,private text:string, private font:Font)
    {
       mgl.register(ShaderType.TEXTURE_2D,this)
       this._nLetters=this.computeNLetters(text);
    }
    computeNLetters(text:string){
        var result:number=0;
        for (var i=0;i<text.length;i++)
        {
             if (text[i]!=' ' && text[i]!='\t' && text[i]!='\n' && text[i]!='\r')
             {
                result++;
             }
        }
        return result;
    }
    
    nVertices():number{return this._nLetters*4;}
    nIndices():number {return 0;}
    vertexDim():number{return 2;}
    serialize(ctx:ISerializeContext):void
    {
        for (var il=0;il<this._nLetters;il++)
        {
            var letter=this.text[il];
          //  this.mgl.PixelLengthToViewPort();

        }
        let nVertices=this.nVertices();
       // ctx.vAttributes['vColor'].pushVec4(this._rgba);

    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}