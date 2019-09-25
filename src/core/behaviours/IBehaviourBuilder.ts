import { IBehaviour } from "./IBehaviour";

export interface IBehaviourBuilder {
    readonly type: string;

    buildFromJSON(json: any): IBehaviour;
}
