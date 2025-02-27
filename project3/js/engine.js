/**
 * Engine class to handle the BabylonJS engine initialization
 */
class Engine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        
        // Handle browser resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    /**
     * Get the BabylonJS engine instance
     * @returns {BABYLON.Engine}
     */
    getEngine() {
        return this.engine;
    }

    /**
     * Get the canvas element
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Run the render loop
     * @param {BABYLON.Scene} scene - The scene to render
     */
    runRenderLoop(scene) {
        this.engine.runRenderLoop(() => {
            scene.render();
        });
    }
}