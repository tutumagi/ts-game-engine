import { Engine } from "./core/engine";

const engine = new Engine();
// entry
window.onload = () => {
    engine.start();
};

window.onresize = () => {
    engine.resize();
};
