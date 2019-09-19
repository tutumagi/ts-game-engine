import { gl, GLUtilities } from "./gl/gl";
import { GLBuffer } from "./gl/glBuffer";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _projection: Matrix4x4;

    private _sprite: Sprite;

    /**
     * Create a new Engine
     */
    public constructor() {}

    /**
     * Engine Start
     */
    public start() {
        this._canvas = GLUtilities.initialize();

        gl.clearColor(0, 0, 0, 1);

        this.loadShaders();
        this._shader.use();

        // load
        this._projection = Matrix4x4.orthographic(
            -this._canvas.width / 2,
            this._canvas.width / 2,
            -this._canvas.height / 2,
            this._canvas.height / 2,
            -1.0,
            100.0,
        );

        // load sprite
        this._sprite = new Sprite("test");
        this._sprite.load();

        this.resize();
        this.loop();
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
            gl.viewport(0, 0, 1, 1);
        }
    }

    private loop() {
        /**
         * GLbitfield https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
         * https://stackoverflow.com/questions/55507383/confusion-about-the-variable-of-gl-color-buffer-bit
         *
         * gl.clear tell the device what kind should be cleared if you do something use `clearxxx`
         */
        gl.clear(gl.COLOR_BUFFER_BIT);

        // set uniform
        const colorPosition: WebGLUniformLocation = this._shader.getUniformLocation("u_color");
        // set uniform var the special value
        gl.uniform4f(colorPosition, 1, 1, 0, 1);

        const projectionPosition = this._shader.getUniformLocation("u_projection");
        gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

        // const modelLocation = this._shader.getUniformLocation("u_model");
        // gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));

        this._sprite.draw();

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }

    private loadShaders() {
        // glsl
        const vertexShaderSource = `
        attribute vec3 a_position;

        uniform mat4 u_projection;
        // uniform mat4 u_model;

        void main() {
            // gl_Position = u_projection * u_model * vec4(a_position, 1.0);
            gl_Position = u_projection * vec4(a_position, 1.0);
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
        `;

        this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
    }
}
