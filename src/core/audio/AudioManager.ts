export class SoundEffect {
    public assetPath: string;
    private _player: HTMLAudioElement;

    public constructor(assetPath: string, loop: boolean) {
        this.assetPath = assetPath;
        this._player = new Audio(assetPath);
        this._player.loop = loop;
    }

    public get loop(): boolean {
        return this._player.loop;
    }
    public set loop(value: boolean) {
        this._player.loop = value;
    }
    public destroy() {
        this._player = undefined;
    }

    public play() {
        if (!this._player.paused) {
            this.stop();
        }
        this._player.play();
    }

    public pause() {
        this._player.pause();
    }

    public stop() {
        this._player.pause();
        this._player.currentTime = 0;
    }
}

export class AudioManager {
    private static _soundEffects: { [name: string]: SoundEffect } = {};

    public static loadSoundFile(name: string, assetPath: string, loop: boolean): void {
        AudioManager._soundEffects[name] = new SoundEffect(assetPath, loop);
    }

    public static playSound(name: string) {
        if (AudioManager._soundEffects[name] !== undefined) {
            AudioManager._soundEffects[name].play();
        }
    }

    public static pauseSound(name: string) {
        if (AudioManager._soundEffects[name] !== undefined) {
            AudioManager._soundEffects[name].pause();
        }
    }

    public static stopSound(name: string) {
        if (AudioManager._soundEffects[name] !== undefined) {
            AudioManager._soundEffects[name].stop();
        }
    }

    public static pauseAll() {
        Object.values(AudioManager._soundEffects).forEach((sfx) => {
            sfx.pause();
        });
    }
}
