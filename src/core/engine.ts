import { gl, GLUtilities } from "./gl/gl";
import { GLBuffer } from "./gl/glBuffer";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";
import { Vector3 } from "./math/vector3";

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

        // load sprite
        this._sprite = new Sprite("test");
        this._sprite.load();
        this._sprite.position = new Vector3(100, 30, 0);

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

    private loop(time: number) {
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

        const modelLocation = this._shader.getUniformLocation("u_model");
        gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));

        this._sprite.update(time);
        this._sprite.draw();

        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }

    private loadShaders() {
        /**
         * 在GLSL中为什么变量的前缀都是 a_, u_ 或 v_ ？
         * 那只是一个命名约定，不是强制要求的。 但是对我来说可以轻松通过名字知道值从哪里来，
         *  a_ 代表属性，值从缓冲中提供；
         *  u_ 代表全局变量，直接对着色器设置；
         *  v_ 代表可变量，是从顶点着色器的顶点中插值来出来的。
         *  查看WebGL工作原理获取更多相关信息。
         */
        // glsl
        const vertexShaderSource = `
        attribute vec3 a_position;

        uniform mat4 u_projection;
        uniform mat4 u_model;

        void main() {
            gl_Position = u_projection * u_model * vec4(a_position, 1.0);
            // gl_Position = u_projection * vec4(a_position, 1.0);
        }
        `;

        const fragmentShaderSource = `
        // mediump 表示 medium precision 中等精度
        precision mediump float;
        uniform vec4 u_color;

        void main() {
            gl_FragColor = u_color;
        }
        `;

        this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
    }
}
