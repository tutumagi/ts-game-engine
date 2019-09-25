import { Vector3 } from "../math/vector3";
import { BaseBehaviour } from "./BaseBehaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class RotationBehaviourData implements IBehaviourData {
    public name: string;

    public rotation: Vector3 = Vector3.ZERO.copy();

    public setFromJSON(json: any): void {
        if (json.name == undefined) {
            throw new Error(`Name must be defined in behaviour data`);
        }

        this.name = json.name;

        if (json.rotation !== undefined) {
            this.rotation.setFromJSON(json.rotation);
        }
    }
}

export class RotationBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "rotation";
    }

    public buildFromJSON(json: any): RotationBehaviour {
        const data = new RotationBehaviourData();
        data.setFromJSON(json);

        return new RotationBehaviour(data);
    }
}

export class RotationBehaviour extends BaseBehaviour {
    private _rotation: Vector3;

    public constructor(data: RotationBehaviourData) {
        super(data);

        this._rotation = data.rotation;
    }

    public update(delta: number): void {
        this._owner.transform.rotation = this._owner.transform.rotation.add(this._rotation);
    }

    public apply(userData: any): void {}
}
