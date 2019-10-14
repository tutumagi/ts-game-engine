import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";

export class BehaviourManager {
    private constructor() {}

    private static _registerBehaviourBuilders: { [type: string]: IBehaviourBuilder } = {};

    public static registerBuilder(builder: IBehaviourBuilder) {
        this._registerBehaviourBuilders[builder.type] = builder;
    }

    // 这里如果让我来写，可能就写成了 工厂模式了
    // 根据不同的 json 的 type 类型，生成不同的 behavior 实体
    // 这里的 data - builder - behavior 将 数据转为实体 中间又加入了一层（builder），好处是职责更单一了，behavior 只用关注需要实现的细节
    // 而不用关注 数据是如何转为该实体的
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
