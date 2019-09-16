import { gl } from "./gl";

/**
 * Shader is a tiny program uploade to GPU
 *
 * vertex shader
 *
 * fragment shader
 */
export class Shader {
    private _name: string;
    private _program: WebGLProgram;

    /**
     * Create a new shader
     * @param name The name of shader
     * @param vertextSource the source of the vertex shader
     * @param fragmentSource the source of the fragment shader
     */
    constructor(name: string, vertextSource: string, fragmentSource: string) {
        this._name = name;

        const vertexShader = this.loadShader(vertextSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

        this.createProgram(vertexShader, fragmentShader);
    }

    /** The name of the shader */
    public get name(): string {
        return this._name;
    }

    public use() {
        gl.useProgram(this._program);
    }

    private loadShader(source: string, shaderType: number): WebGLShader {
        const shader: WebGLShader = gl.createShader(shaderType);
        // load shader program
        gl.shaderSource(shader, source);

        // compile shader
        gl.compileShader(shader);

        const error = gl.getShaderInfoLog(shader);
        if (error !== "") {
            throw new Error(`Error compiling shader ${this.name} : ${error}`);
        }

        // return shader
        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);

        const error = gl.getProgramInfoLog(this._program);
        if (error !== "") {
            throw new Error(`Error create shader program ${this.name} : ${error}`);
        }
    }
}
