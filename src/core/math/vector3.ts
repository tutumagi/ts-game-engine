export class Vector3 {
    constructor(private _x: number = 0, private _y: number = 0, private _z: number = 0) {}

    public static ZERO = new Vector3(0, 0, 0);
    public static IDENTIFY = new Vector3(1, 1, 1);

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

    public toFloat32Array() {
        return new Float32Array(this.toArray());
    }

    public copyFrom(other: Vector3) {
        this._x = other.x;
        this._y = other.y;
        this._z = other.z;
    }

    public copy(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    public setFromJSON(json: any) {
        if (json.x !== undefined) {
            this._x = parseFloat(json.x);
        }
        if (json.y !== undefined) {
            this._y = parseFloat(json.y);
        }
        if (json.z !== undefined) {
            this._z = parseFloat(json.z);
        }
    }
}
