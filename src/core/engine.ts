import { AssetManager } from "./assets/assetManager";
import { AudioManager } from "./audio/AudioManager";
import { BehaviourManager } from "./behaviours/BehaviourManager";
import { KeyboardMovementBehaviourBuilder } from "./behaviours/keyboardMovementBehaviour";
import { RotationBehaviour, RotationBehaviourBuilder } from "./behaviours/RotationBehaviour";
import { AnimateSpriteComponentBuilder } from "./components/AnimateSpriteComponent";
import { ComponentManager } from "./components/ComponentManager";
import { SpriteComponent, SpriteComponentBuilder } from "./components/SpriteComponent";
import { gl, GLUtilities } from "./gl/gl";
import { Shader } from "./gl/shader";
import { loadShaders } from "./gl/shader/basicShaders";
import { InputManager, MouseContext } from "./input/inputManager";
import { Matrix4x4 } from "./math/matrix4x4";
import { IMessageHandler } from "./message/IMessageHandler";
import { Message } from "./message/message";
import { MessageBus } from "./message/messageBus";
import { ZoneManager } from "./world/zoneManager";

/**
 * The main game engine class
 */
export class Engine implements IMessageHandler {
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
        InputManager.initialize();
        ZoneManager.initialize();

        Message.subscribe("MOUSE_UP", this);
        Message.subscribe("MOUSE_DOWN", this);

        ComponentManager.registerBuilder(new SpriteComponentBuilder());
        ComponentManager.registerBuilder(new AnimateSpriteComponentBuilder());

        BehaviourManager.registerBuilder(new RotationBehaviourBuilder());
        BehaviourManager.registerBuilder(new KeyboardMovementBehaviourBuilder());

        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 0, 1);
        // 开启 alpha 混合渲染
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this._shader = loadShaders();
        this._shader.use();

        ZoneManager.changeZoneById(0);

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

    public onMessage(message: Message): void {
        if (message.code === "MOUSE_UP") {
            const context = message.context as MouseContext;
            document.title = `POS: [${context.position.x}, ${context.position.y}]`;

            AudioManager.loadSoundFile("flap", "dist/assets/sounds/flap.mp3", false);
            AudioManager.playSound("flap");
        }
    }

    private _now: number = 0;
    private loop(time: number) {
        if (this._now == 0) {
            this._now = time;
        }
        const delta = time - this._now;
        this._now = time;

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
