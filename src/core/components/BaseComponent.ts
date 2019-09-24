import { Shader } from "../gl/shader";
import { SimObject } from "../world/simObject";

export abstract class BaseComponent {
    public name: string;
    protected _owner: SimObject;

    public setOwner(owner: SimObject) {
        this._owner = owner;
    }
    public abstract load(): void;

    public abstract unload(): void;

    public abstract update(delta: number): void;

    public abstract render(shader: Shader): void;
}
