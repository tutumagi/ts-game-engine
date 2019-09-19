export class Vector3 {
    constructor(private _x: number, private _y: number, private _z: number) {}

    public static ZERO = new Vector3(0, 0, 0);

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
    }

    public get z(): number {
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
    }

    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }
}
