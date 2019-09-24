import { SpriteComponent } from "../core/components/SpriteComponent";
import { Shader } from "../core/gl/shader";
import { SimObject } from "../core/world/simObject";
import { Zone } from "../core/world/zone";

export class TestZone extends Zone {
    private _spriteObject: SimObject;

    constructor() {
        super(0, "TEST_ZONE", "the test zone");

        this._spriteObject = new SimObject(1, "sprite");
        this._spriteObject.transform.position.x = 600;
        this._spriteObject.transform.position.y = 600;

        // this._spriteObject.transform.scale.x = 3;

        this._spriteObject.transform.rotation.z = (45 * Math.PI) / 180;

        this._spriteObject.addComponent(new SpriteComponent("sprite", "dist/assets/textures/sloth.jpeg"));

        this.scene.addObject(this._spriteObject);
    }

    public load() {
        this._spriteObject.load();

        super.load();
    }

    public update(delta: number) {
        this._spriteObject.transform.rotation.z += (1 * Math.PI) / 180;

        this._spriteObject.update(delta);

        super.update(delta);
    }

    public render(shader: Shader) {
        this._spriteObject.render(shader);

        super.render(shader);
    }
}
