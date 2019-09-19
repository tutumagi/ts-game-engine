import { gl } from "../gl/gl";
import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Vector3 } from "../math/vector3";
import { Texture } from "./texture";
import { TextureManager } from "./textureManager";

export class Sprite {
    private _buffer: GLBuffer;
    private _texture: Texture;

    public constructor(
        private _name: string,
        textureName: string,
        private _width: number = 200,
        private _height: number = 160,
        private _position: Vector3 = Vector3.ZERO,
    ) {
        this._texture = TextureManager.getTexture(textureName);
    }

    public destroy() {
        this._buffer.destroy();
        TextureManager.releaseTexture(this._texture.name);
    }

    public get name(): string {
        return this._name;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position(value: Vector3) {
        this._position = value;
    }

    public load() {
        // one triangle
        // const vertexs = [0, 0, 0,
        //                  0, 0.5, 0,
        //                  0.5, 0.5, 0.5];

        // two triangle = one rect
        // prettier-ignore
        const vertexs = [
                         // xyz,  uv
                         0, 0, 0,                       0,      0,
                         0, this._height, 0,            0,      1.0,
                         this._width, this._height, 0,  1.0,    1.0,

                         this._width, this._height, 0,  1.0,    1.0,
                         this._width, 0, 0,             1.0,    0,
                         0, 0, 0,                       0,      0,
                        ];

        this._buffer = new GLBuffer(3);

        const positionAttribute: AttributeInfo = {
            location: 0,
            offset: 0,
            size: 3,
        };

        const texCoordAttribute: AttributeInfo = {
            location: 1,
            offset: 3,
            size: 2,
        };

        this._buffer.pushBackData(vertexs);

        // the postion localtion is zero in every shader, so we hard code the loacation here
        // const positionLocation = 0;
        this._buffer.addAttributeLocation(positionAttribute);
        this._buffer.addAttributeLocation(texCoordAttribute);
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(time: number) {}

    public draw(shader: Shader) {
        // if (this._texture.isLoaded) {
        //     this.load();
        // }
        this._texture.activeAndBind(0);
        const diffuseLocation = shader.getUniformLocation("u_diffuse");
        gl.uniform1i(diffuseLocation, 0);

        if (this._buffer) {
            this._buffer.bind(false);
            this._buffer.draw();
        }
    }
}
