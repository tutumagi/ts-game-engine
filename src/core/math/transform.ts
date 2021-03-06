import { Matrix4x4 } from "./matrix4x4";
import { Vector3 } from "./vector3";

export class Transform {
    public position: Vector3 = Vector3.ZERO.copy();

    public rotation: Vector3 = Vector3.ZERO.copy();

    public scale: Vector3 = Vector3.IDENTIFY.copy();

    constructor() {}

    public copyFrom(transform: Transform) {
        this.position.copyFrom(transform.position);
        this.rotation.copyFrom(transform.rotation);
        this.scale.copyFrom(transform.scale);
    }

    public getTransformMatrix(): Matrix4x4 {
        const translation = Matrix4x4.translation(this.position);
        const rotation = Matrix4x4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
        const scale = Matrix4x4.scale(this.scale);

        // Translation x Rotation x Scale
        return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
    }

    public setFromJSON(json: any) {
        if (json.position !== undefined) {
            this.position.setFromJSON(json.position);
        }
        if (json.rotation !== undefined) {
            this.rotation.setFromJSON(json.rotation);
        }
        if (json.scale !== undefined) {
            this.scale.setFromJSON(json.scale);
        }
    }
}
