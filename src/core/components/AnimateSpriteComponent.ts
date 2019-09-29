import { Shader } from "../gl/shader";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { Color } from "../graphics/color";
import { Sprite } from "../graphics/sprite";
import { BaseComponent } from "./BaseComponent";
import { ComponentManager } from "./ComponentManager";
import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponentData } from "./IComponentData";

export class AnimateSpriteComponentData implements IComponentData {
    public name: string;
    public materialName: string;
    public width: number;
    public height: number;
    public frameWidth: number;
    public frameHeight: number;
    public frameCount: number;
    public frameSequence: number[];
    public frameTime: number;

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

        if (json.frameWidth !== undefined) {
            this.frameWidth = Number(json.frameWidth);
        }
        if (json.frameHeight !== undefined) {
            this.frameHeight = Number(json.frameHeight);
        }
        if (json.frameCount !== undefined) {
            this.frameCount = Number(json.frameCount);
        }
        if (json.frameSequence !== undefined) {
            this.frameSequence = json.frameSequence;
        }
        if (json.frameTime !== undefined) {
            this.frameTime = json.frameTime;
        }
    }
}

export class AnimateSpriteComponentBuilder implements IComponentBuilder {
    public get type(): string {
        return "animateSprite";
    }

    public buildFromJSON(json: any): IComponent {
        const data = new AnimateSpriteComponentData();
        data.setFromJSON(json);

        return new AnimateSpriteComponent(data);
    }
}

export class AnimateSpriteComponent extends BaseComponent {
    private _sprite: AnimatedSprite;
    private _width: number;
    private _height: number;

    public constructor(data: AnimateSpriteComponentData) {
        super(data);

        this._width = data.width;
        this._height = data.height;
        // "dist/assets/textures/sloth.jpeg"
        this._sprite = new AnimatedSprite(
            data.name,
            data.materialName,
            new Color(255, 255, 255, 255),
            this._width,
            this._height,
            data.frameWidth,
            data.frameHeight,
            data.frameCount,
            data.frameSequence,
            data.frameTime,
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
