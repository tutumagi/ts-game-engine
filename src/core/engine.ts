import { gl, GLUtilities } from "./gl/gl";
import { GLBuffer } from "./gl/glBuffer";
import { Shader } from "./gl/shader";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _buffer: GLBuffer;

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
        this.createBuffer();

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
            gl.viewport(0, 0, this._canvas.width, this._canvas.height);
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

        this._buffer.bind(false);
        this._buffer.draw();

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }

    private createBuffer() {
        const vertexs = [0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5];

        this._buffer = new GLBuffer(3);

        this._buffer.pushBackData(vertexs);

        const positionLocation = this._shader.getAttributeLocation(`a_position`);
        this._buffer.addAttributeLocation({
            location: positionLocation,
            size: 3,
            offset: 0,
        });
        this._buffer.upload();
        this._buffer.unbind();
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
        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
        `;

        this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
    }
}
