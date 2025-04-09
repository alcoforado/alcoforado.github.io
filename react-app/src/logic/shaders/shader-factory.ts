import {Shader2d} from  './shader2d'
import MGL from '../mgl/mgl'
import { IShader } from './ishader';
import {Shader2dTexture} from './shader2dTexture';
export enum ShaderType {
    VERTICE_COLOR_2D=0,
    TEXTURE_2D=1
}

export  function ShaderFactory(mgl:MGL,shaderId:ShaderType):IShader
{
         if (shaderId===ShaderType.VERTICE_COLOR_2D)
        {
            return new Shader2d(mgl);
        }
        else if (shaderId===ShaderType.TEXTURE_2D)
        {
            return new Shader2dTexture(mgl)
        }
        throw new Error('Shader Type not registered');
 }






