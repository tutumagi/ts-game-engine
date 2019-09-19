import { Message } from "../message/message";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { ImageAssetLoader } from "./loaders/imageAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED";

export class AssetManager {
    private static _loaders: IAssetLoader[] = [];
    private static _loadAssets: { [name: string]: IAsset } = {};

    private constructor() {}

    public static initialize() {
        AssetManager.registerLoader(new ImageAssetLoader());
    }

    public static registerLoader(loader: IAssetLoader) {
        AssetManager._loaders.push(loader);
    }

    public static onAssetLoaded(asset: IAsset) {
        AssetManager._loadAssets[asset.name] = asset;
        Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
    }

    public static loadAsset(assetName: string) {
        const extension = assetName
            .split(".")
            .pop()
            .toLowerCase();
        for (const loader of AssetManager._loaders) {
            if (loader.supportedExtensions.indexOf(extension) !== -1) {
                loader.loadAsset(assetName);
                return;
            }
        }

        console.warn(
            ` Unable to load asset with extension ${extension}, because there is no loader associated with it`,
        );
    }

    public static isAssetLoaded(assetName: string) {
        return AssetManager._loaders[assetName] !== undefined;
    }

    public static getAsset(assetName: string): IAsset {
        if (AssetManager._loadAssets[assetName] !== undefined) {
            return AssetManager._loadAssets[assetName];
        } else {
            AssetManager.loadAsset(assetName);
        }

        return undefined;
    }
}
