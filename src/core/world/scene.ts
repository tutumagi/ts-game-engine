import { Shader } from "../gl/shader";
import { SimObject } from "./simObject";

export class Scene {
    private _root: SimObject;

    public constructor() {
        this._root = new SimObject(0, "__ROOT__", this);
    }

    public get root(): SimObject {
        return this._root;
    }

    public get isLoaded(): boolean {
        return this._root.isLoaded;
    }

    public addObject(object: SimObject) {
        this._root.addChild(object);
    }

    public getObjectByName(name: string): SimObject | null {
        return this._root.getObjectByName(name);
    }

    public load() {
        this._root.load();
    }

    public unload() {
        this._root.unload();
    }

    public update(delta: number) {
        this._root.update(delta);
    }

    public render(shader: Shader) {
        this._root.render(shader);
    }
}

/** ## Node
 *
 *  SimObject
 *          - Id
 *          - Name
 *          + Transform
 *                  - Position
 *                  - Rotation
 *                  - Scale
 *          - Children ( SimObjects )
 *          - Parent
 *          - Scene
 *          - Components
 *
 *  Zone ( level )
 *          - Id
 *          - Name
 *          - Description
 *          - Scene
 *              - SimObjects ...
 *
 *  ZoneManager
 *
 *
 *
 *  Zone States
 *  uninitialized
 *  loading
 *  updating
 */
