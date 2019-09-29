import { Vector2 } from "../math/vector2";
import { Color } from "./color";
import { Sprite } from "./sprite";
import { UVInfo } from "./uvInfo";
import { Vertex } from "./vertex";

export class AnimatedSprite extends Sprite {
    private _currentFrameIdx: number = 0;

    private _frameUVs: UVInfo[] = [];

    private _currentTime: number = 0;

    /**
     * create new AnimateSprite
     * @param name the `AnimatedSprite` name
     * @param textureName the texture name/path
     * @param tint the tintcolor
     * @param width the texture width
     * @param height the texture height
     * @param _frameWidth the frame width
     * @param _frameHeight the frame height
     * @param _frameCount the total frame count
     * @param _frameSequence the animation frame index sequence
     * @param _frameTime frame time in millisecond
     */
    public constructor(
        name: string,
        textureName: string,
        tint: Color,
        width: number = 1,
        height: number = 1,
        private _frameWidth: number = 10,
        private _frameHeight: number = 10,
        private _frameCount: number = 1,
        // frame animation index sequence
        private _frameSequence: number[] = [],
        private _frameTime: number = 333,
    ) {
        super(name, textureName, tint, width, height);
    }

    /** Performs laoding routines on this sprite */
    public load() {
        super.load();

        let totalWidth: number = 0;
        let yValue: number = 0;
        // ┌──────────────┬─────────────┬────────────────┬───────────────┬─────────────┐
        // │              │             │                │               │             │
        // │     (0,1)    │    (1,1)    │    (2,1)       │     (3,1)     │    (4,1)    │
        // │              │             │                │               │             │
        // │──────────────┼─────────────┼────────────────┼───────────────┼─────────────│
        // │              │             │                │               │             │
        // │              │             │                │               │             │
        // │    (0,0)     │    (1,0)    │     (2,0)      │     (3,0)     │    (4,0)    │
        // └──────────────┴─────────────┴────────────────┴───────────────┴─────────────┘
        // i is the colume index, yValue is the row index
        for (let i = 0; i < this._frameCount; i++) {
            totalWidth += i * this._frameWidth;
            if (totalWidth > this._width) {
                yValue++;
                totalWidth = 0;
            }

            const u = (i * this._frameWidth) / this._width;
            const v = (yValue * this._frameHeight) / this._height;
            const min: Vector2 = new Vector2(u, v);

            const uMax = (i * this._frameWidth + this._frameWidth) / this._width;
            const vMax = (yValue * this._frameHeight + this._frameHeight) / this._height;

            const max: Vector2 = new Vector2(uMax, vMax);

            this._frameUVs.push(new UVInfo(min, max));
        }

        console.log(`animatesprite `, this._frameUVs);
    }

    public update(delta: number) {
        this._currentTime += delta;
        if (this._currentTime > this._frameTime) {
            this._currentFrameIdx++;
            this._currentTime = 0;

            if (this._currentFrameIdx >= this._frameSequence.length) {
                this._currentFrameIdx = 0;
            }

            console.log(`animate sprite cur frame index:`, this._currentFrameIdx);

            const curFrameUV = this._frameUVs[this._frameSequence[this._currentTime]];
            // prettier-ignore
            this._vertices = [
                        // xyz, uv
                        new Vertex( 0, 0, 0,                                curFrameUV.min.x, curFrameUV.min.y),
                        new Vertex(0, this._frameHeight, 0,                 curFrameUV.min.x, curFrameUV.max.y),
                        new Vertex(this._frameWidth, this._frameHeight, 0,  curFrameUV.max.x, curFrameUV.max.y),

                        new Vertex(this._frameWidth, this._frameHeight, 0,  curFrameUV.max.x, curFrameUV.max.y),
                        new Vertex(this._frameWidth, 0, 0,                  curFrameUV.max.x, curFrameUV.min.y),
                        new Vertex(0, 0, 0,                                 curFrameUV.min.x, curFrameUV.min.y),
                    ];
        }

        super.update(delta);
    }
}
