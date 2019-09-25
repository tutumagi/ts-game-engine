import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";

export class Vertex {
    public position: Vector3 = Vector3.ZERO.copy();
    public texCoords: Vector2 = new Vector2(0, 0);

    public constructor(x: number = 0, y: number = 0, z: number = 0, tu: number = 0, tv: number = 0) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.texCoords.x = tu;
        this.texCoords.y = tv;
    }

    public toArray(): number[] {
        return [].concat(...this.position.toArray()).concat(...this.texCoords.toArray());
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }
}
