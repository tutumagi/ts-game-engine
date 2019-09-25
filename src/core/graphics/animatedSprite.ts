import { Vector2 } from "../math/vector2";
import { Color } from "./color";
import { Sprite } from "./sprite";

export class AnimatedSprite extends Sprite {
    private _currentFrameIdx: number = 0;

    /** frame time in millisecond */
    private _frameTime: number = 333;
    private _frameUVs: Vector2[] = [];

    public constructor(
        name: string,
        textureName: string,
        tint: Color,
        width: number = 1,
        height: number = 1,
        private _frameWidth: number = 10,
        private _frameHeight: number = 10,
        private _frameCount: number = 1,
        private _frameSequence: number[] = [],
    ) {
        super(name, textureName, tint, width, height);
    }

    /** Performs laoding routines on this sprite */
    public load() {
        super.load();
    }

    public update(delta: number) {
        super.update(delta);
    }
}
