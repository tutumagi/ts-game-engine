import { gl } from "./gl";

/**
 * Shader is a tiny program uploade to GPU
 *
 * vertex shader  : load -> compile ->  |
 *                                          -> link program -> use program
 * fragment shader : load -> compile -> |
 */
export class Shader {
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: {
        [name: string]: number;
    } = {};
    private _uniforms: {
        [name: string]: WebGLUniformLocation;
    } = {};

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

        this.detectAttributes();
        this.detectUniforms();
    }

    /** The name of the shader */
    public get name(): string {
        return this._name;
    }

    /**
     * use the shader
     */
    public use() {
        gl.useProgram(this._program);
    }

    /**
     * get attribute location by name
     * @param name the attribute name
     */
    public getAttributeLocation(name: string): number {
        if (this._attributes[name] === undefined) {
            throw new Error(`Unable to find attribute named ${name} in shader named ${this._name}`);
        }
        return this._attributes[name];
    }

    /**
     * get uniform location by name
     * @param name the uniform name
     */
    public getUniformLocation(name: string): WebGLUniformLocation {
        if (this._uniforms[name] === undefined) {
            throw new Error(`Unable to find uniform named ${name} in shader named ${this._name}`);
        }
        return this._uniforms[name];
    }

    /**
     * load shader
     * loader -> compile
     * @param source the shader source( glsl )
     * @param shaderType shaderType( vetexShader or fragmentShader)
     */
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

    /**
     * create shader program
     * @param vertexShader the vertex shader
     * @param fragmentShader the fragment shader
     */
    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        // create
        this._program = gl.createProgram();

        // attach
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        // link
        gl.linkProgram(this._program);

        const error = gl.getProgramInfoLog(this._program);
        if (error !== "") {
            throw new Error(`Error create shader program ${this.name} : ${error}`);
        }
    }

    /**
     * get all active attributes and store them by the name -> location
     */
    private detectAttributes() {
        // return all attributes in the shader
        const attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; ++i) {
            const attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!attributeInfo) {
                break;
            }

            this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
        }
    }

    /**
     * get all active uniform and store them by the name -> location
     */
    private detectUniforms() {
        const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            const uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
            if (!uniformInfo) {
                break;
            }
            this._uniforms[uniformInfo.name] = gl.getUniformLocation(this._program, uniformInfo.name);
        }
    }
}

/**
 * [WebGL Fundamentals](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html)
 *
 * 每个顶点调用一次（顶点）着色器，每次调用都需要设置一个特殊的全局变量gl_Position， 该变量的值就是裁减空间坐标值。
 *
 * 顶点着色器需要的数据，可以通过以下三种方式获得。
 * Attributes 属性 (从缓冲中获取的数据)
 * Uniforms 全局变量 (在一次绘制中对所有顶点保持一致值)
 * Textures 纹理 (从像素或纹理元素中获取的数据)
 */
