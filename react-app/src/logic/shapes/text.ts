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
        let topLineNDCY= this.ulNDC[1]
        let cursorNDCX=this.ulNDC[0];
        let cTY=1.0/fontInfo.common._scaleH;
        let cTX=1.0/fontInfo.common._scaleW;
        

        for (var il=0,indexOff=0;il<this.text.length;il++,indexOff+=4)
        {
           if (!fontInfo.chars.char[il])
              continue; 
          let charCode = this.text.charCodeAt(il);

          let ch=fontInfo.chars.char[charCode];
          let topChar=topLineNDCY+ch._yoffset*cY;
          let x0=cursorNDCX;
          let x1=x0+ch._width*cX;
          let y1= topLineNDCY-ch._yoffset*cY;
          let y0= y1-ch._height*cY;
          //texture coords
          let u0=ch._x*cTX; //left texture quad
          let u1=u0+ch._width*cTX; //right texture quad
          let v1=ch._y*cTY;  //top texture
          let v0=v1+ch._height*cTY //bottom texture

          ctx.vAttributes["position"].pushVec2([[x0,y0],[x1,y0],[x1,y1],[x0,y1]]); 
          ctx.vAttributes["texture"].pushVec2([[u0,v0],[u1,v0],[u1,v1],[u0,v1]])
          ctx.indices.push([0+indexOff,1+indexOff,2+indexOff,
                            0+indexOff,2+indexOff,3+indexOff]);

          //advance cursor 
          cursorNDCX+=(ch._xoffset+ch._xadvance)*cX;

        }
        let nVertices=this.nVertices();
       // ctx.vAttributes['vColor'].pushVec4(this._rgba);

    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}