import { Shader } from "../gl/shader";
import { Zone } from "./zone";

export class ZoneManager {
    private static _globalZoneID: number = -1;
    private static _zones: { [id: number]: Zone } = {};
    private static _activeZone: Zone;

    private constructor() {}

    public static createZone(name: string, description: string): number {
        ZoneManager._globalZoneID++;
        const zone = new Zone(ZoneManager._globalZoneID, name, description);

        this._zones[ZoneManager._globalZoneID] = zone;

        return ZoneManager._globalZoneID;
    }

    public static changeZoneById(id: number) {
        if (ZoneManager._activeZone !== undefined) {
            ZoneManager._activeZone.onDeactived();
        }

        if (ZoneManager._zones[id] !== undefined) {
            ZoneManager._activeZone = ZoneManager._zones[id];
            ZoneManager._activeZone.load();
            ZoneManager._activeZone.onActived();
        }
    }

    public static changeZoneByZone(zone: Zone) {
        if (ZoneManager._activeZone !== undefined) {
            ZoneManager._activeZone.onDeactived();
        }

        if (ZoneManager._zones[zone.id] !== undefined) {
            ZoneManager._activeZone = ZoneManager._zones[zone.id];
            ZoneManager._activeZone.load();
            ZoneManager._activeZone.onActived();
        } else {
            ZoneManager._activeZone = zone;
            ZoneManager._activeZone.load();
            ZoneManager._activeZone.onActived();
        }
    }

    public static getZoneById(id: number): Zone | undefined {
        return ZoneManager._zones[id];
    }

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
