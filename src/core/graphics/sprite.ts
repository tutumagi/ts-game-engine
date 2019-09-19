import { GLBuffer } from "../gl/glBuffer";
import { Vector3 } from "../math/vector3";

export class Sprite {
    private _buffer: GLBuffer;

    public constructor(
        private _name: string,
        private _width: number = 200,
        private _height: number = 160,
        private _position: Vector3 = Vector3.ZERO,
    ) {}

    public get position() {
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
        const vertexs = [0, 0, 0,
                         0, this._height, 0,
                         this._width, this._height, 0,

                         this._width, this._height, 0,
                         this._width, 0, 0,
                         0, 0, 0];

        this._buffer = new GLBuffer(3);

        this._buffer.pushBackData(vertexs);

        // the postion localtion is zero in every shader, so we hard code the loacation here
        const positionLocation = 0;
        this._buffer.addAttributeLocation({
            location: positionLocation,
            size: 3,
            offset: 0,
        });
        this._buffer.upload();
        this._buffer.unbind();
    }

    public update(time: number) {}

    public draw() {
        if (this._buffer) {
            this._buffer.bind(false);
            this._buffer.draw();
        }
    }
}
