import { BaseBehaviour } from "../behaviours/BaseBehaviour";
import { BehaviourManager } from "../behaviours/BehaviourManager";
import { BaseComponent } from "../components/BaseComponent";
import { ComponentManager } from "../components/ComponentManager";
import { Shader } from "../gl/shader";
import { Scene } from "./scene";
import { SimObject } from "./simObject";

export enum ZoneState {
    UNINITIALIZED,
    LOADING,
    UPDATING,
}

export class Zone {
    private _id: number;
    private _name: string;
    private _description: string;
    private _scene: Scene;

    private _globalID: number = -1;

    private _state: ZoneState = ZoneState.UNINITIALIZED;

    public constructor(id: number, name: string, descrption: string) {
        this._id = id;
        this._name = name;
        this._description = descrption;

        this._scene = new Scene();
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public initialize(data: any) {
        if (data.objects === undefined) {
        }

        data.objects.forEach((o) => {
            this._scene.addObject(this.loadSimObject(o));
        });
    }

    public load() {
        this._state = ZoneState.LOADING;

        this._scene.load();

        this._state = ZoneState.UPDATING;
    }

    public unload() {
        // this._scene = ZoneState
        this._state = ZoneState.UNINITIALIZED;

        this._scene.unload();
    }

    public onDeactived() {}

    public onActived() {}

    public update(delta: number) {
        if (this._state === ZoneState.UPDATING) {
            this._scene.update(delta);
        }
    }

    public render(shader: Shader) {
        if (this._state === ZoneState.UPDATING) {
            this._scene.render(shader);
        }
    }

    private loadSimObject(dataSection: any): SimObject {
        let name: string;
        if (dataSection.name !== undefined) {
            name = dataSection.name;
        }

        this._globalID++;
        const simObject = new SimObject(this._globalID, name);

        if (dataSection.transform) {
            simObject.transform.setFromJSON(dataSection.transform);
        }

        if (dataSection.components) {
            dataSection.components.forEach((componentData) => {
                simObject.addComponent(ComponentManager.extractComponent(componentData) as BaseComponent);
            });
        }
        if (dataSection.behavious) {
            dataSection.behavious.forEach((behaviousData) => {
                simObject.addBehaviour(BehaviourManager.extractBehaviour(behaviousData) as BaseBehaviour);
            });
        }

        if (dataSection.children !== undefined) {
            dataSection.children.forEach((o) => {
                simObject.addChild(this.loadSimObject(o));
            });
        }

        return simObject;
    }
}
