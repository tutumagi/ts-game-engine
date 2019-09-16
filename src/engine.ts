/// <reference path="gl.ts"/>

import { gl, GLUtilities } from "./gl";

/**
 * The main game engine class
 */
export class Engine {
    private _canvas: HTMLCanvasElement;

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

        this.loop();
    }

    private loop() {
        /**
         * GLbitfield https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
         * https://stackoverflow.com/questions/55507383/confusion-about-the-variable-of-gl-color-buffer-bit
         */
        gl.clear(gl.COLOR_BUFFER_BIT);
        // console.log(`loop`);
        requestAnimationFrame(this.loop.bind(this));
    }
}
