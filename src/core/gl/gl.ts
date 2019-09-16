export let gl: WebGLRenderingContext;

/**
 * Setting up a WebGL rendering context
 */
export class GLUtilities {
    /**
     * Initializes WebGL
     * @param elementId the id of element to search for
     */
    public static initialize(elementId?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;

        if (elementId !== undefined) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if (canvas === undefined) {
                throw new Error("Cannot find a canvas element named: " + elementId);
            }
        } else {
            canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
        }

        gl = canvas.getContext("webgl");
        if (gl === undefined) {
            throw new Error("Unable initialize WebGL");
        }

        return canvas;
    }
}
