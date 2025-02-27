/**
 * Scene class to handle the BabylonJS scene creation and setup
 */
class Scene {
    /**
     * Create a new scene
     * @param {BABYLON.Engine} engine - BabylonJS engine instance
     */
    constructor(engine) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        this.setupScene();
    }

    /**
     * Set up the basic scene components
     */
    setupScene() {
        // Create a basic light
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        // Create a camera
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        // Get the canvas from the engine passed to constructor
        const canvas = this.engine.getRenderingCanvas();
        camera.attachControl(canvas, true);
        
        // Set clear color (background color)
        this.scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 1.0);
    }

    /**
     * Get the BabylonJS scene instance
     * @returns {BABYLON.Scene}
     */
    getScene() {
        return this.scene;
    }
}