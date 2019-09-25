import { AssetManager } from "../assetManager";
import { IAsset } from "../IAsset";
import { IAssetLoader } from "../IAssetLoader";

export class JSONAsset implements IAsset {
    public name: string;
    public data: any;

    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
    }
}

export class JSONAssetLoader implements IAssetLoader {
    public supportedExtensions: string[] = ["json"];
    public loadAsset(assetName: string) {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", assetName);

        request.addEventListener("load", this.onJSONLoaded.bind(this, assetName, request));

        request.send();
    }

    private onJSONLoaded(assetName: string, request: XMLHttpRequest) {
        console.log(`onJSONLoaded: asset name ${assetName} request `, request);

        if (request.readyState == request.DONE) {
            const json = JSON.parse(request.responseText);
            const asset = new JSONAsset(assetName, json);
            AssetManager.onAssetLoaded(asset);
        }
    }
}
