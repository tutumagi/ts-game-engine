import { Shader } from "../gl/shader";
import { Color } from "../graphics/color";
import { Sprite } from "../graphics/sprite";
import { Vector3 } from "../math/vector3";
import { BaseComponent } from "./BaseComponent";

export class SpriteComponent extends BaseComponent {
    private _sprite: Sprite;

    public constructor(name: string, materialName: string) {
        super();
        // "dist/assets/textures/sloth.jpeg"
        this._sprite = new Sprite(name, materialName, Color.white);
    }

    public load() {
        // load sprite
        this._sprite.load();
        this._sprite.position = new Vector3(100, 30, 0);
    }

    public unload(): void {}

    public update(delta: number): void {
        this._sprite.update(delta);
    }
    public render(shader: Shader): void {
        this._sprite.draw(shader);
    }
}
