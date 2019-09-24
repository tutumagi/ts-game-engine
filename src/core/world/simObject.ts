import { Transform } from "stream";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Scene } from "./scene";

export class SimObject {
    private _id: number;
    private _children: SimObject[] = [];
    private _parent: SimObject;
    private _isLoaded: boolean = false;
    private _scene?: Scene;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    public name: string;

    public transform: Transform = new Transform();

    public constructor(id: number, name: string, scene?: Scene) {
        this._id = id;
        this.name = name;

        this._scene = scene;
    }

    public get id(): number {
        return this._id;
    }

    public get parent(): SimObject {
        return this._parent;
    }

    public get worldMatrix(): Matrix4x4 {
        return this._worldMatrix;
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public addChild(child: SimObject) {
        child._parent = this;
        this._children.push(child);

        this.onAdded(this._scene);
    }

    public removeChild(child: SimObject) {
        const index = this._children.indexOf(child);
        if (index !== -1) {
            child._parent = null;
            this._children.splice(index, 1);
        }
    }

    public getObjectByName(name: string): SimObject | null {
        if (this.name === name) {
            return this;
        }
        for (const child of this._children) {
            const result = child.getObjectByName(name);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    public load() {
        this._isLoaded = true;
        this._children.forEach((c) => {
            c.load();
        });
    }

    public update(delta: number) {
        this._children.forEach((c) => {
            c.update(delta);
        });
    }

    public render(shader: Shader) {
        this._children.forEach((c) => {
            c.render(shader);
        });
    }

    protected onAdded(scene: Scene) {
        this._scene = scene;
    }
}
