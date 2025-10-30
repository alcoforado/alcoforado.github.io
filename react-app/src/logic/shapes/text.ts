import {ITopology2D} from '../topology/2d/itopology2d';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import MGL from '../mgl/mgl'
import {vec3,vec2} from "gl-matrix"
import {ShaderType} from '../shaders/shader-factory'
import {MGLTexture} from '../mgl/mglTexture'
import {XMLParser} from 'fast-xml-parser'



export interface IFontInfo {
  info: Info
  common: Common
  pages: Pages
  chars: Chars
}

export interface Info {
  _face: string
  _size: number
  _bold: number
  _italic: number
  _charset: string
  _unicode: number
  _stretchH: number
  _smooth: number
  _aa: number
  _padding: string
  _spacing: string
}

export interface Common {
  _lineHeight: number
  _base: number
  _scaleW: number
  _scaleH: number
  _pages: number
  _packed: number
}

export interface Pages {
  page: Page
}

export interface Page {
  _id: number
  _file: string
}

export interface Chars {
  char: Char[]
  _count: number
}

export interface Char {
  _id: number
  _x: number
  _y: number
  _width: number
  _height: number
  _xoffset: number
  _yoffset: number
  _xadvance: number
  _page: number
  _chnl: number
}



export class BitmapFont {
    _fontTexture:MGLTexture;
    _fontInfo:IFontInfo|null=null;
    constructor(mgl:MGL,fontFile:string)
    {
        this._fontTexture=new MGLTexture(mgl,new URL(fontFile+".png",window.location.origin));
        mgl.loadFile(fontFile+".xml",(data:string)=>{
            let parser=new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix : "_",
                allowBooleanAttributes: true,
                parseAttributeValue:true,
            });
            this._fontInfo=parser.parse(data).font;
        })
    }
    getInfo():IFontInfo {
      if (this._fontInfo)
        return this._fontInfo;
      throw Error("Font Info not loaded yet")
    }
}

export class Text implements IShape  {
    private _nLetters:number;
    constructor(private mgl:MGL, private ulNDC:vec2,private text:string, private font:BitmapFont)
    {
       mgl.register(ShaderType.TEXTURE_2D,this)
       this._nLetters=this.computeNLetters(text);
       text=text || '';
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
        let fontInfo=this.font.getInfo();
        let cY=2.0/this.mgl.getScreenHeight(); //NDC per pixel in Height
        let cX=2.0/this.mgl.getScreenWidth();  //NDC per pixel in Width
        let lineHeight=this.font.getInfo().common._lineHeight*cY;
        let lineBase = this.font.getInfo().common._base*cY;
        let topLineY= this.ulNDC[1]
        let cursorStart=this.ulNDC[0];

        for (var il=0;il<this.text.length;il++)
        {
           if (!fontInfo.chars.char[il])
              continue; 
          let c=fontInfo.chars.char[il];
          
          this.font.getInfo()
            let letter=this.text.charCodeAt(il);
            let lineHeightNDC=this.font._fontInfo



        }
        let nVertices=this.nVertices();
       // ctx.vAttributes['vColor'].pushVec4(this._rgba);

    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}