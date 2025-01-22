import {ITopology2D} from '../topology/2d/itopology2d';
import { ISerializeContext, IShape,IDrawContext } from './ishape';
import {vec4} from 'gl-matrix'
import MGL from '../mgl/mgl'
import {ShaderType} from '../shaders/shader-factory'
export class Shape2DVertexColor implements IShape  {
     
    constructor(mgl:MGL,private _mesh:ITopology2D,private _rgba:vec4[])
    {
       if (_rgba.length!==_mesh.nVertices())
       {
            throw new Error('color vertices dimension mismatch');
       }
       mgl.register(ShaderType.VERTICE_COLOR_2D,this)

    }

    nVertices():number {return this._mesh.nVertices()}
    nIndices():number {return this._mesh.nIndices()}
    vertexDim():number{return 2;};
    serialize(ctx:ISerializeContext):void
    {
        this._mesh.serialize(ctx.vAttributes['position'],ctx.indices);
        ctx.vAttributes['vColor'].pushVec4(this._rgba);

    }
    draw(ctx:IDrawContext)
    {
        ctx.DrawIndexedTriangles();
    }

}