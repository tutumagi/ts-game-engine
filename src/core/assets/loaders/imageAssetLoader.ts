import { AssetManager } from "../assetManager";
import { IAsset } from "../IAsset";
import { IAssetLoader } from "../IAssetLoader";

export class ImageAsset implements IAsset {
    public readonly name: string;
    public readonly data: HTMLImageElement;

    public get width(): number {
        return this.data.width;
    }

    public get height(): number {
        return this.data.height;
    }

    public constructor(name: string, data: HTMLImageElement) {
        this.name = name;
        this.data = data;
    }
}

export class ImageAssetLoader implements IAssetLoader {
    public get supportedExtensions(): string[] {
        return ["png", "gif", "jpg"];
    }

    // @ts-ignore
    public loadAsset(assetName: string): IAsset {
        const image: HTMLImageElement = new Image();

        image.onload = this.onImageLoaded.bind(this, assetName, image);
        image.src = assetName;
    }

    private onImageLoaded(assetName: string, image: HTMLImageElement) {
        console.log(`onImageLoaded: assetName/image `, assetName, image);

        const asset = new ImageAsset(assetName, image);
        AssetManager.onAssetLoaded(asset);
    }
}
