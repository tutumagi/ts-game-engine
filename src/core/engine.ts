import { gl, GLUtilities } from "./gl/gl";
import { Shader } from "./gl/shader";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _buffer: WebGLBuffer;

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
        // this._shader.use();

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }

    private createBuffer() {
        const vertexs = [0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5];

        this._buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexs), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
        gl.disableVertexAttribArray(0);
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
