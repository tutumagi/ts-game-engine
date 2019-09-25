import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";

export class ComponentManager {
    private static _registerBuilders: { [type: string]: IComponentBuilder } = {};

    public static registerBuilder(builer: IComponentBuilder) {
        ComponentManager._registerBuilders[builer.type] = builer;
    }

    public static extractComponent(json: any): IComponent {
        if (json.type !== undefined) {
            if (ComponentManager._registerBuilders[json.type] !== undefined) {
                return ComponentManager._registerBuilders[json.type].buildFromJSON(json);
            }

            throw new Error(
                `Component manager error - type is missing or builder is not register for this type ${json.type}`,
            );
        }
    }
}
