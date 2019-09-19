import { Vector3 } from "./vector3";

export class Matrix4x4 {
    /**
     * index is
     * [0, 1, 2, 3
     *  4, 5, 6, 7
     *  8, 9, 10, 11
     *  12, 13, 14, 15]
     */
    private _data: number[] = [];

    private constructor() {
        // prettier-ignore
        this._data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    public get data(): number[] {
        return this._data;
    }

    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    // https://blog.csdn.net/baozi3026/article/details/7319295
    /**
     * Creates and returns a new orthograhic projection matrix
     * @param left The left extents of the viewport
     * @param right The right extents of the viewport
     * @param bottom The bottom extents of the viewport
     * @param top The top extents of the viewport
     * @param nearClip The near clipping plane
     * @param farClip The far clipping plane
     */
    public static orthographic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        nearClip: number,
        farClip: number,
    ): Matrix4x4 {
        const m = new Matrix4x4();

        const lr: number = 1.0 / (left - right);
        const bt: number = 1.0 / (bottom - top);
        const nf: number = 1.0 / (nearClip - farClip);

        m._data[0] = -2.0 * lr;
        m._data[5] = -2.0 * bt;
        m._data[10] = 2.0 * nf;

        m._data[12] = (left + right) * lr;
        m._data[13] = (top + bottom) * bt;
        m._data[14] = (nearClip + farClip) * nf;

        return m;
    }

    public static translation(position: Vector3): Matrix4x4 {
        const m = new Matrix4x4();
        m._data[12] = position.x;
        m._data[13] = position.y;
        m._data[14] = position.z;

        return m;
    }
}
