import { gl } from "../gl/gl";
import { Shader } from "../gl/shader";
import { Color } from "./color";
import { Texture } from "./texture";
import { TextureManager } from "./textureManager";

export class Material {
    private _name: string;
    private _diffuseTextureName: string;

    private _diffuseTexture: Texture;
    private _tint: Color;

    public constructor(name: string, textureName: string, tint: Color) {
        this._name = name;
        this._diffuseTextureName = textureName;
        this._tint = tint;

        this._diffuseTexture = TextureManager.getTexture(textureName);
    }

    public get tint(): Color {
        return this._tint;
    }

    public draw(shader: Shader) {
        if (this._diffuseTexture.isLoaded) {
            const textureUnitIndex = 0;

            this._diffuseTexture.activeAndBind(textureUnitIndex);
            const diffuseLocation = shader.getUniformLocation("u_diffuse");
            gl.uniform1i(diffuseLocation, textureUnitIndex);
        }
    }

    public destroy() {
        TextureManager.releaseTexture(this._diffuseTexture.name);
    }
}
