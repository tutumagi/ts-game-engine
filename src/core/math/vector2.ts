export class Vector2 {
    constructor(private _x: number, private _y: number) {}

    public static ZERO = new Vector2(0, 0);

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

    public toArray(): number[] {
        return [this._x, this._y];
    }

    public toFloat32Array() {
        return new Float32Array(this.toArray());
    }
}
