import { gl, GLUtilities } from "./gl/gl";
import { Shader } from "./gl/shader";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;

    /**
     * Create a new Engine
     */
    public constructor() {}

    /**
     * Engine Start
     */
    public start() {
        this._canvas = GLUtilities.initialize();

        gl.clearColor(1, 0, 0, 1);

        this.loadShaders();
        this._shader.use();

        this.loop();
    }

    /**
     * resize
     */
    public resize() {
        if (this._canvas !== undefined) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
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
        this._shader.use();

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }

    private loadShaders() {
        // glsl
        const vertexShaderSource = `
        attribute vec3 a_position;
        void main() {
            gl_Position = vec4(a_position, 1.0);
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0);
        }
        `;

        this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
    }
}
