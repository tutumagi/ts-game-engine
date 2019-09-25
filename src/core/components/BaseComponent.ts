import { Shader } from "../gl/shader";
import { SimObject } from "../world/simObject";
import { IComponent } from "./IComponent";
import { IComponentData } from "./IComponentData";

export abstract class BaseComponent implements IComponent {
    public name: string;
    protected _owner: SimObject;
    protected _data: IComponentData;

    public constructor(data: IComponentData) {
        this._data = data;
        this.name = data.name;
    }

    public setOwner(owner: SimObject) {
        this._owner = owner;
    }

    public get owner() {
        return this._owner;
    }

    public abstract load(): void;

    public abstract unload(): void;

    public abstract update(delta: number): void;

    public abstract render(shader: Shader): void;
}
