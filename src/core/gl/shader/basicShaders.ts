import { Shader } from "../shader";

function loadVertexShader() {
    // tslint:disable-next-line: max-line-length
    // https://stackoverflow.com/questions/17537879/in-webgl-what-are-the-differences-between-an-attribute-a-uniform-and-a-varying
    // attribute vs uniform vs varying
    /**
     * 在GLSL中为什么变量的前缀都是 a_, u_ 或 v_ ？
     * 那只是一个命名约定，不是强制要求的。 但是对我来说可以轻松通过名字知道值从哪里来，
     *  a_ 代表属性，值从缓冲中提供；
     *  u_ 代表全局变量，直接对着色器设置；
     *  v_ 代表可变量，是从顶点着色器的顶点中插值来出来的。
     *  查看WebGL工作原理获取更多相关信息。
     */
    // glsl
    return `
    attribute vec3 a_position;
    attribute vec2 a_texCoord;

    uniform mat4 u_projection;
    uniform mat4 u_model;

    varying vec2 v_texCoord;

    void main() {
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
        v_texCoord = a_texCoord;
        // gl_Position = u_projection * vec4(a_position, 1.0);
    }
    `;
}

function loadFragmentShader() {
    return `
    // mediump 表示 medium precision 中等精度
    precision mediump float;

    uniform vec4 u_tint;
    // 纹理
    uniform sampler2D u_diffuse;
    // 从顶点着色器传入的纹理坐标
    varying vec2 v_texCoord;

    void main() {
        // 在纹理上寻找对应的颜色值
        gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
        // gl_FragColor = u_tint;
    }
    `;
}

export function loadShaders() {
    const vertexShaderSource = loadVertexShader();
    const fragmentShaderSource = loadFragmentShader();

    return new Shader("basic", vertexShaderSource, fragmentShaderSource);
}
