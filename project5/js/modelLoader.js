/**
 * ModelLoader class to handle loading glb models
 */
class ModelLoader {
    /**
     * Create a model loader
     * @param {BABYLON.Scene} scene - The scene to load models into
     */
    constructor(scene) {
        this.scene = scene;
        this.assetsManager = new BABYLON.AssetsManager(scene);
    }

    /**
     * Load a GLB model
     * @param {string} modelPath - Path to the GLB model
     * @param {string} modelName - Name for the loaded model
     * @param {function} onSuccess - Callback when model loads successfully
     * @param {function} onError - Callback when model fails to load
     */
    loadGLB(modelPath, modelName, onSuccess, onError) {
        // Create a task to load the model
        const task = this.assetsManager.addMeshTask(modelName, "", "", modelPath);
        
        // On task success
        task.onSuccess = (task) => {
            const meshes = task.loadedMeshes;
            const particleSystems = task.loadedParticleSystems;
            const skeletons = task.loadedSkeletons;
            
            if (onSuccess) {
                onSuccess(meshes, particleSystems, skeletons);
            }
        };
        
        // On task error
        task.onError = (task, message, exception) => {
            console.error(`Failed to load model: ${message}`);
            if (onError) {
                onError(message, exception);
            }
        };
        
        // Start loading
        this.assetsManager.load();
    }
}