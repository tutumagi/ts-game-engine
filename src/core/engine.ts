import { TestZone } from "../game/testZone";
import { AssetManager } from "./assets/assetManager";
import { gl, GLUtilities } from "./gl/gl";
import { Shader } from "./gl/shader";
import { loadShaders } from "./gl/shader/baseShaders";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/messageBus";
import { ZoneManager } from "./world/zoneManager";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _projection: Matrix4x4;

    /**
     * Create a new Engine
     */
    public constructor() {}

    /**
     * Engine Start
     */
    public start() {
        AssetManager.initialize();

        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 0, 1);

        this._shader = loadShaders();
        this._shader.use();

        ZoneManager.changeZoneByZone(new TestZone());

        this.resize();
        this.loop(0);
    }

    /**
     * resize
     */
    public resize() {
        if (this._canvas !== undefined) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            /*
                    1
            ┌───────┬───────┐
            │               │
            ├ ─ ─ ─ ┼ ─ ─ ─ ┤
          -1│    0,0        │1
            └───────┴───────┘
                   -1
            */
            // canvas size change, so the projection matrix and the viewport should be update
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -1.0, 100.0);

            /**
             * gl.viewport告诉WebGL如何将裁剪空间（-1 到 +1）中的点转换到像素空间， 也就是画布内。
             * 当你第一次创建WebGL上下文的时候WebGL会设置视域大小和画布大小匹配，
             * 但是在那之后就需要你自己设置。当你改变画布大小就需要告诉WebGL新的视域设置。
             */
            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    private loop(delta: number) {
        MessageBus.update(delta);

        /**
         * GLbitfield https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
         * https://stackoverflow.com/questions/55507383/confusion-about-the-variable-of-gl-color-buffer-bit
         *
         * gl.clear tell the device what kind should be cleared if you do something use `clearxxx`
         */
        gl.clear(gl.COLOR_BUFFER_BIT);

        const projectionPosition = this._shader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

        ZoneManager.update(delta);
        ZoneManager.render(this._shader);

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }
}
