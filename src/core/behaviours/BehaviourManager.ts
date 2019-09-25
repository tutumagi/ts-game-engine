import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";

export class BehaviourManager {
    private constructor() {}

    private static _registerBehaviourBuilders: { [type: string]: IBehaviourBuilder } = {};

    public static registerBuilder(builder: IBehaviourBuilder) {
        this._registerBehaviourBuilders[builder.type] = builder;
    }

    public static extractBehaviour(json: any): IBehaviour {
        if (json.type !== undefined) {
            if (BehaviourManager._registerBehaviourBuilders[json.type] !== undefined) {
                return BehaviourManager._registerBehaviourBuilders[json.type].buildFromJSON(json);
            }
            throw new Error(
                `Behaviour manager error - type is missing or builder is not register for this type ${json.type}`,
            );
        }
    }
}
