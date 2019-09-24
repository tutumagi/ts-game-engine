import { Shader } from "../gl/shader";
import { Scene } from "./scene";

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
}
