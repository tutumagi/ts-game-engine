import { SpriteComponent } from "../core/components/SpriteComponent";
import { Shader } from "../core/gl/shader";
import { SimObject } from "../core/world/simObject";
import { Zone } from "../core/world/zone";

export class TestZone extends Zone {
    private _parentObject: SimObject;

    private _spriteObject: SimObject;

    constructor() {
        super(0, "TEST_ZONE", "the test zone");

        // this._parentObject = new SimObject(0, "sprite");
        // this._parentObject.transform.position.x = 100;
        // this._parentObject.transform.position.y = 100;

        // this._parentObject.addComponent(new SpriteComponent("sprite", "dist/assets/textures/sloth.jpeg"));

        // this._spriteObject = new SimObject(1, "sprite");
        // this._spriteObject.transform.position.x = 60;
        // this._spriteObject.transform.position.y = 100;

        // this._spriteObject.addComponent(new SpriteComponent("sprite", "dist/assets/textures/sloth.jpeg"));

        // this._parentObject.addChild(this._spriteObject);

        // this.scene.addObject(this._parentObject);
    }

    public load() {
        this._spriteObject.load();

        super.load();
    }

    public update(delta: number) {
        // this._parentObject.transform.rotation.z += (1 * Math.PI) / 180;
        // this._spriteObject.transform.rotation.z += (1 * Math.PI) / 180;
        // super.update(delta);
    }

    public render(shader: Shader) {
        // this._spriteObject.render(shader);
        // super.render(shader);
    }
}
