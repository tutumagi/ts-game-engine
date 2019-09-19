import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/loaders/imageAssetLoader";
import { gl } from "../gl/gl";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";

const LEVEL: number = 0;
const BORDER: number = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

export class Texture implements IMessageHandler {
    private _name: string;
    private _handle: WebGLTexture;
    private _isLoaded: boolean = false;

    private _width: number;
    private _height: number;

    public constructor(name: string, width: number = 1, height: number = 1) {
        this._name = name;
        this._width = width;
        this._height = height;

        this._handle = gl.createTexture();

        // Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);

        this.bind();

        // 将图像上传到纹理
        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

        const asset = AssetManager.getAsset(this._name);
        if (asset !== undefined) {
            this.loadTextureFromAsset(asset as ImageAsset);
        } else {
            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);
        }
    }

    public destroy() {
        gl.deleteTexture(this._handle);
    }

    public get name(): string {
        return this._name;
    }

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public activeAndBind(textureUnit: number = 0) {
        // https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-image-processing.html
        // WebGL有一个纹理单元队列，每个sampler全局变量的值对应着一个纹理单元，
        // 它会从对应的单元寻找纹理数据，你可以将纹理设置到你想用的纹理单元
        // 为了将纹理设置在不同的单元你可以调用gl.activeTexture， 绑定纹理到哪个单元
        // 所有支持WebGL的环境，在片断着色器中至少有8个纹理单元，顶点着色器中可以是0个。
        // 所以如果你使用超过8个纹理单元就应该调用gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) 查看单元个数，
        // 或者调用gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) 查看顶点着色器中可以用几个纹理单元。
        // 超过 99% 的机器在顶点着色器中至少有4个纹理单元。
        gl.activeTexture(gl.TEXTURE0 + textureUnit);

        this.bind();
    }

    public bind() {
        gl.bindTexture(gl.TEXTURE_2D, this._handle);
    }

    public unbind() {
        gl.bindTexture(gl.TEXTURE_2D, undefined);
    }

    public onMessage(message: Message): void {
        if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
            if (message.context) {
                this.loadTextureFromAsset(message.context as ImageAsset);
            }
        }
    }

    private loadTextureFromAsset(asset: ImageAsset) {
        this._width = asset.width;
        this._height = asset.height;

        this.bind();

        // 将图像上传到纹理
        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);

        if (this.isPowerOf2()) {
            // gen mipmap
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // donot gen a mipmap & clamping wrapping to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this._isLoaded = true;
    }

    private isPowerOf2(): boolean {
        return this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this._height);
    }

    private isValuePowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }
}
