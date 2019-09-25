import { SimObject } from "../world/simObject";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourData } from "./IBehaviourData";

export abstract class BaseBehaviour implements IBehaviour {
    public name: string;

    protected _data: IBehaviourData;
    protected _owner: SimObject;

    public constructor(data: IBehaviourData) {
        this._data = data;
        this.name = data.name;
    }

    public setOwner(owner: SimObject): void {
        this._owner = owner;
    }

    public abstract update(delta: number): void;
    public abstract apply(data: any): void;
}
