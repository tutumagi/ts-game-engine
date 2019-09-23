import { Color } from "./color";
import { Material } from "./material";

class MaterialReferenceNode {
    public material: Material;
    public referenceCount: number = 1;
    constructor(material: Material) {
        this.material = material;
    }
}

export class MaterialManager {
    private static _materials: { [name: string]: MaterialReferenceNode } = {};
    private constructor() {}
    public static getMaterial(name: string, textureName: string, tint: Color): Material {
        if (MaterialManager._materials[name] === undefined) {
            const material = new Material(name, textureName, tint);
            MaterialManager._materials[name] = new MaterialReferenceNode(material);
        }

        return MaterialManager._materials[name].material;
    }

    public static releaseMaterial(name: string) {
        if (MaterialManager._materials[name] === undefined) {
            console.warn(`cannot release material named(${name}), because it has not loaded. `);
            return;
        }
        MaterialManager._materials[name].referenceCount--;
        if (MaterialManager._materials[name].referenceCount < 1) {
            MaterialManager._materials[name].material.destroy();
            delete MaterialManager._materials[name];
        }
    }
}
