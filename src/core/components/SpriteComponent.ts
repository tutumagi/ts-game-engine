import { Shader } from "../gl/shader";
import { Color } from "../graphics/color";
import { Sprite } from "../graphics/sprite";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class SpriteComponentData implements IComponentData {
    public name: string;
    public materialName: string;
    public width: number;
    public height: number;

    public setFromJSON(json: any) {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.materialName !== undefined) {
            this.materialName = json.materialName;
        }

        if (json.width !== undefined) {
            this.width = Number(json.width);
        }

        if (json.height !== undefined) {
            this.height = Number(json.height);
        }
    }
}

export class SpriteComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return "sprite";
    }

    public buildFromJSON(json: any): IComponent {
        const data = new SpriteComponentData();
        data.setFromJSON(json);

        return new SpriteComponent(data);
    }
}

export class SpriteComponent extends BaseComponent {
    private _sprite: Sprite;
    private _width: number;
    private _height: number;

    public constructor(data: SpriteComponentData) {
        super(data);

        this._width = data.width;
        this._height = data.height;
        // "dist/assets/textures/sloth.jpeg"
        this._sprite = new Sprite(
            data.name,
            data.materialName,
            new Color(255, 255, 255, 255),
            this._width,
            this._height,
        );
    }

    public load() {
        // load sprite
        this._sprite.load();
    }

    public unload(): void {}

    public update(delta: number): void {
        this._sprite.update(delta);
    }
    public render(shader: Shader): void {
        this._sprite.draw(shader, this.owner.worldMatrix);
    }
}

// ComponentManager.registerBuilder(new SpriteComponentBuilder());
