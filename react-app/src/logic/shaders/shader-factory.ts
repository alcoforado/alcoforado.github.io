import {Shader2d} from  './shader2d'
import MGL from '../mgl/mgl'
import { IShader } from './ishader';

export enum ShaderType {
    VERTICE_COLOR_2D=0
}

export  function ShaderFactory(mgl:MGL,shaderId:ShaderType):IShader
{
         if (shaderId===ShaderType.VERTICE_COLOR_2D)
        {
            return new Shader2d(mgl);
        }
        throw new Error('Shader Type not registered');
 }






