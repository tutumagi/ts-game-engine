import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { JSONAsset } from "../assets/loaders/jsonAssetLoader";
import { Shader } from "../gl/shader";
import { Message } from "../message/message";
import { Zone } from "./zone";

export class ZoneManager {
    private static _globalZoneID: number = -1;
    // private static _zones: { [id: number]: Zone } = {};
    private static _registerZones: { [id: number]: string } = {};
    private static _activeZone: Zone;

    private static _inst: ZoneManager;

    private constructor() {}

    public static initialize() {
        ZoneManager._inst = new ZoneManager();

        // TEMPORARY
        ZoneManager._registerZones[0] = "dist/assets/zones/testZone.json";
    }

    // public static createZone(name: string, description: string): number {
    //     ZoneManager._globalZoneID++;
    //     const zone = new Zone(ZoneManager._globalZoneID, name, description);

    //     this._zones[ZoneManager._globalZoneID] = zone;

    //     return ZoneManager._globalZoneID;
    // }

    public static changeZoneById(id: number) {
        if (ZoneManager._activeZone !== undefined) {
            ZoneManager._activeZone.onDeactived();
            ZoneManager._activeZone.unload();
        }

        if (ZoneManager._registerZones[id] !== undefined) {
            if (AssetManager.isAssetLoaded(ZoneManager._registerZones[id])) {
                const asset = AssetManager.getAsset(ZoneManager._registerZones[id]);

                ZoneManager.loadZone(asset);
            } else {
                Message.subscribe(
                    MESSAGE_ASSET_LOADER_ASSET_LOADED + ZoneManager._registerZones[id],
                    ZoneManager._inst.onMessage.bind(ZoneManager._inst),
                );
            }
        }
    }

    private onMessage(message: Message) {
        if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) != -1) {
            ZoneManager.loadZone(message.context as JSONAsset);
        }
    }

    private static loadZone(asset: JSONAsset) {
        if (asset !== undefined) {
            const zoneData = asset.data;
            let zoneId: number;
            let zoneName: string;
            let zoneDescription: string;
            if (zoneData.id === undefined || zoneData.description === undefined || zoneData.name === undefined) {
                throw new Error("zone file format exception: Zone id is not present");
            } else {
                zoneId = zoneData.id;
                zoneName = zoneData.name;
                zoneDescription = zoneData.description;
            }

            ZoneManager._activeZone = new Zone(zoneId, zoneName, zoneDescription);
            ZoneManager._activeZone.initialize(zoneData);
            ZoneManager._activeZone.load();
            ZoneManager._activeZone.onActived();
        }
    }

    // public static changeZoneByZone(zone: Zone) {
    //     if (ZoneManager._activeZone !== undefined) {
    //         ZoneManager._activeZone.onDeactived();
    //     }

    //     if (ZoneManager._registerZones[zone.id] !== undefined) {
    //         ZoneManager._activeZone = ZoneManager._registerZones[zone.id];
    //         ZoneManager._activeZone.load();
    //         ZoneManager._activeZone.onActived();
    //     } else {
    //         ZoneManager._activeZone = zone;
    //         ZoneManager._activeZone.load();
    //         ZoneManager._activeZone.onActived();
    //     }
    // }

    // public static getZoneById(id: number): Zone | undefined {
    //     return ZoneManager._registerZones[id];
    // }

    public static update(delta: number) {
        if (ZoneManager._activeZone !== undefined) {
            ZoneManager._activeZone.update(delta);
        }
    }

    public static render(shader: Shader) {
        if (ZoneManager._activeZone !== undefined) {
            ZoneManager._activeZone.render(shader);
        }
    }
}
