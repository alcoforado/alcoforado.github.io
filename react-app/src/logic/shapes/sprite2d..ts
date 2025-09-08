import {Rectangle} from '../topology/2d/rectangle';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import MGL from '../mgl/mgl'
import { MGLTexture } from '../mgl/mglTexture';
import { TextureShape2D } from './textureShape2D';
import {ShaderType} from '../shaders/shader-factory'
export class Sprite2D extends TextureShape2D  {
     
    constructor(mgl:MGL,private _rect:Rectangle,textCoord:number[],texture:MGLTexture)
    {
        super(mgl,_rect,textCoord,texture);
    }

   
}