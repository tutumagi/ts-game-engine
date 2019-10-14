import { InputManager, Keys } from "../input/inputManager";
import { SimObject } from "../world/simObject";
import { BaseBehaviour } from "./BaseBehaviour";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviourData } from "./IBehaviourData";

export class KeyboardMovementBehaviourData implements IBehaviourData {
    public name: string;
    public speed: number = 0.1;
    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error("Name must be defined in behavior data");
        }
        this.name = json.name;

        if (json.speed !== undefined) {
            this.speed = Number(json.speed);
        }
    }
}

export class KeyboardMovementBehaviourBuilder implements IBehaviourBuilder {
    public get type(): string {
        return "keyboardMovement";
    }
    public buildFromJSON(json: any): KeyboardMovementBehaviour {
        const data = new KeyboardMovementBehaviourData();
        data.setFromJSON(json);
        return new KeyboardMovementBehaviour(data);
    }
}

export class KeyboardMovementBehaviour extends BaseBehaviour {
    public speed: number = 0.1;

    public constructor(data: KeyboardMovementBehaviourData) {
        super(data);

        this.speed = data.speed;
    }
    public update(delta: number): void {
        if (InputManager.isKeyDown(Keys.LEFT)) {
            this._owner.transform.position.x -= this.speed;
        }
        if (InputManager.isKeyDown(Keys.RIGHT)) {
            this._owner.transform.position.x += this.speed;
        }
        if (InputManager.isKeyDown(Keys.UP)) {
            this._owner.transform.position.y -= this.speed;
        }
        if (InputManager.isKeyDown(Keys.DOWN)) {
            this._owner.transform.position.y += this.speed;
        }
    }
    public apply(userData: any): void {}
}
