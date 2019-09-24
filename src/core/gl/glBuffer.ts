import { throws } from "assert";
import { gl } from "./gl";

export interface AttributeInfo {
    /**
     * The location of this attribute
     */
    location: number;
    /**
     * The size (number of elements) in this attribute (i.e Vector3 = 3)
     */
    size: number;
    /**
     * The number of elements from the beginning of the buffer
     */
    offset: number;
}

/**
 * https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#toc
 */

/**
 * Represent the WebGL buffer
 */
export class GLBuffer {
    private _hasAttributeLocation: boolean = false;

    /** 0 = move forward size * sizeof(type) each iteration to get the next position */
    private _stride: number;
    private _buffer: WebGLBuffer;

    /** the element's type size in the buffer */
    private _typeSize: number;
    /** the orginal data */
    private _data: number[] = [];
    /** the attribute info */
    private _attributes: AttributeInfo[] = [];
    /** the element size in buffer. e.g. a texture vertex data contains x,y,z,u,v , so the elementsize is 5 */
    private _elementSize: number = 0;

    /**
     * Create a new GL Buffer
     * @param _elementSize the size of each element in this buffer
     * @param _dataType  the data type of this buffer. Default: gl.FLOAT
     * @param _targetBufferType this buffer target type. Default: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
     * @param _mode the drawing of this buffer. Default: gl.TRIANGLES
     */
    constructor(
        private _dataType: number = gl.FLOAT,
        private _targetBufferType: number = gl.ARRAY_BUFFER,
        private _mode: number = gl.TRIANGLES,
    ) {
        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;
            default:
                throw new Error(`Unrecognized data type: ${this._dataType}`);
        }

        this._stride = this._elementSize * this._typeSize;
        this._buffer = gl.createBuffer();
    }

    /**
     * Destroy the buffer
     */
    public destroy() {
        gl.deleteBuffer(this._buffer);
    }

    /**
     * bind this buffer
     * @param normalized Indicates if the data should be normalized
     */
    public bind(normalized: boolean = false) {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        if (this._hasAttributeLocation) {
            for (const it of this._attributes) {
                //  var numComponents = 3;  // (x, y, z)
                // var type = gl.FLOAT;    // 32位浮点数据
                // var normalize = false;  // 不标准化
                // var offset = 0;         // 从缓冲起始位置开始获取
                // var stride = 0;         // 到下一个数据跳多少位内存
                //                         // 0 = 使用当前的单位个数和单位长度 （ 3 * Float32Array.BYTES_PER_ELEMENT ）
                // 从缓冲区中 读取数据赋值 给对应shader中 对应location的属性值
                gl.vertexAttribPointer(
                    it.location, //
                    it.size, // 告诉WebGL 每次从缓冲区获取数据时 获取`it.size`的个数 给顶点复制，如果是x,y,z 也就是3个，webgl会默认给 w复制为1
                    this._dataType, // 缓冲区的数据类型
                    normalized,
                    this._stride, // 如果所有的数据都存在一个缓冲区内，则这个值位0，否则在多个缓冲区的话，需要根据情况赋值不同的值
                    it.offset * this._typeSize,
                );
                gl.enableVertexAttribArray(it.location);
            }
        }
    }

    /**
     *  unbinds the buffer
     */
    public unbind() {
        for (const it of this._attributes) {
            gl.disableVertexAttribArray(it.location);
        }
        gl.bindBuffer(this._targetBufferType, undefined);
    }

    /**
     * Add an attribute with the provided AttributeInfo
     * @param info
     */
    public addAttributeLocation(info: AttributeInfo) {
        this._hasAttributeLocation = true;

        info.offset = this._elementSize;
        this._elementSize += info.size;

        this._stride = this._elementSize * this._typeSize;
        this._attributes.push(info);
    }

    /**
     * Adds data to this buffer
     * @param data
     */
    public pushBackData(data: number[]) {
        this._data.push(...data);
    }

    /**
     * Uploads the buffer's data to the GPU
     */
    public upload() {
        gl.bindBuffer(this._targetBufferType, this._buffer);

        let bufferData: ArrayBuffer;
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;
            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;
            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                break;
            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;
            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                break;
            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;
            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                break;
            default:
                throw new Error(`Unrecognized data type: ${this._dataType} when upload in GLBuffer`);
        }

        gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
    }

    /** Draws the buffer */
    public draw() {
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawArrays(this._mode, 0, 0);
        }
    }
}
