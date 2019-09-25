import { gl } from "../gl/gl";
import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/vector3";
import { Color } from "./color";
import { Material } from "./material";
import { MaterialManager } from "./materialManager";
import { Vertex } from "./vertex";

export class Sprite {
    protected _buffer: GLBuffer;
    protected _material: Material;
    protected _vertices: Vertex[];

    public constructor(
        protected _name: string,
        textureName: string,
        private _tint: Color,
        protected _width: number = 1,
        protected _height: number = 1,
    ) {
        this._material = MaterialManager.getMaterial(_name, textureName, _tint);
    }

    public destroy() {
        this._buffer.destroy();
        MaterialManager.releaseMaterial(this._name);
    }

    public get name(): string {
        return this._name;
    }

    public load() {
        // one triangle
        // const vertexs = [0, 0, 0,
        //                  0, 0.5, 0,
        //                  0.5, 0.5, 0.5];

        // two triangle = one rect
        // prettier-ignore
        // const vertexs = [
        //                  // xyz,  uv
        //                  0, 0, 0,                       0,      0,
        //                  0, this._height, 0,            0,      1.0,
        //                  this._width, this._height, 0,  1.0,    1.0,

        //                  this._width, this._height, 0,  1.0,    1.0,
        //                  this._width, 0, 0,             1.0,    0,
        //                  0, 0, 0,                       0,      0,
        //                 ];
        // prettier-ignore

        this._vertices = [
            // xyz, uv
            new Vertex( 0, 0, 0,                           0, 0),
            new Vertex(0, this._height, 0,                 0, 1),
            new Vertex(this._width, this._height, 0,       1, 1),

            new Vertex(this._width, this._height, 0,       1, 1),
            new Vertex(this._width, 0, 0,                  1, 0),
            new Vertex(0, 0, 0,                            0, 0),
        ];

        this._buffer = new GLBuffer();

        // 顶点属性的 相关信息
        const positionAttribute: AttributeInfo = {
            location: 0, // the location of the attribute in shader(glsl)
            offset: 0, // the offset of the attribute data in gl buffer
            size: 3, // the element size of the attribute. 这里的3 表示一个点有三个数据（这里就是 x, y, z）
        };

        // 纹理uv属性的 相关信息
        const texCoordAttribute: AttributeInfo = {
            location: 1,
            offset: 0, // fix the texCoord attribute offset uv顶点的起始位置在第三个（前面是xyz）
            size: 2,
        };

        this._buffer.pushBackData(
            this._vertices.reduce(
                (ret, cur) => {
                    return ret.concat(cur.toArray());
                },
                [] as number[],
            ),
        );

        // the postion localtion is zero in every shader, so we hard code the loacation here
        // const positionLocation = 0;
        this._buffer.addAttributeLocation(positionAttribute);
        this._buffer.addAttributeLocation(texCoordAttribute);
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(time: number) {}

    public draw(shader: Shader, model: Matrix4x4) {
        // this.load();
        // if (this._texture.isLoaded) {
        //     this.load();
        // }

        const modelLocation = shader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

        this._material.draw(shader);

        if (this._buffer) {
            this._buffer.bind(false);
            this._buffer.draw();
        }
    }
}
