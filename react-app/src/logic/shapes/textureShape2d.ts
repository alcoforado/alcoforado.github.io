import {ITopology2D} from '../topology/2d/itopology2d';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import MGL from '../mgl/mgl'
import {ShaderType} from '../shaders/shader-factory'
import { MGLTexture } from '../mgl/mglTexture';
export class TextureShape2D implements IShape  {
     
    constructor(mgl:MGL,private _topology:ITopology2D,private _textCoord:number[],private _texture:MGLTexture)
    {
        
       mgl.register(ShaderType.TEXTURE_2D,this)
    }

    nVertices():number {return this._topology.nVertices()}
    nIndices():number {return this._topology.nIndices()}
    vertexDim():number{return 2;};
    serialize(ctx:ISerializeContext,):void
    {
        this._topology.serialize(ctx.vAttributes['position'],ctx.indices);
        ctx.vAttributes['texture'].push(this._textCoord);
    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}