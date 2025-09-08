import {ITopology2D} from '../topology/2d/itopology2d';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import MGL from '../mgl/mgl'
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
     
    constructor(private mgl:MGL, private text:string, private font:Font)
    {
       mgl.register(ShaderType.TEXTURE_2D,this)
       
    }

    nVertices():number{return this.text.length*4;}
    nIndices():number {return 0;}
    vertexDim():number{return 2;}
    serialize(ctx:ISerializeContext):void
    {
        
       // ctx.vAttributes['vColor'].pushVec4(this._rgba);

    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}