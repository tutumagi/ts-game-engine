import { BaseComponent } from "../components/BaseComponent";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Transform } from "../math/transform";
import { Scene } from "./scene";

export class SimObject {
    private _id: number;
    private _children: SimObject[] = [];
    private _parent: SimObject;
    private _isLoaded: boolean = false;
    private _scene?: Scene;

    private _localMatrix: Matrix4x4 = Matrix4x4.identity();
    // depence this._parent
    private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

    private _components: { [name: string]: BaseComponent } = {};

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
            child._parent = undefined;
            this._children.splice(index, 1);
        }
    }

    public getObjectByName(name: string): SimObject | undefined {
        if (this.name === name) {
            return this;
        }
        for (const child of this._children) {
            const result = child.getObjectByName(name);
            if (result !== undefined) {
                return result;
            }
        }

        return undefined;
    }

    public addComponent(component: BaseComponent) {
        component.setOwner(this);
        this._components[component.name] = component;
    }

    public getComponent<T extends BaseComponent>(cls: typeof BaseComponent): T | undefined {
        let ret: T;
        Object.values(this._components).some((v) => {
            if (v instanceof cls) {
                ret = v as T;
                return true;
            }
        });

        return ret;
    }

    public load() {
        if (this._isLoaded) {
            return;
        }
        this._isLoaded = true;

        Object.values(this._components).forEach((c) => {
            c.load();
        });
        this._children.forEach((c) => {
            c.load();
        });
    }

    public unload() {
        this._isLoaded = false;

        Object.values(this._components).forEach((c) => {
            c.unload();
        });
        this._children.forEach((c) => {
            c.unload();
        });
    }

    public update(delta: number) {
        this._localMatrix = this.transform.getTransformMatrix();
        this.updateWorldMatrix(this._parent !== undefined ? this._parent._worldMatrix : undefined);

        Object.values(this._components).forEach((c) => {
            c.update(delta);
        });
        this._children.forEach((c) => {
            c.update(delta);
        });
    }

    public render(shader: Shader) {
        Object.values(this._components).forEach((c) => {
            c.render(shader);
        });
        this._children.forEach((c) => {
            c.render(shader);
        });
    }

    protected onAdded(scene: Scene) {
        this._scene = scene;
    }

    private updateWorldMatrix(parentWorldMatrix: Matrix4x4) {
        if (parentWorldMatrix !== undefined) {
            this._worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
        } else {
            this._worldMatrix.copyFrom(this._localMatrix);
        }
    }
}
