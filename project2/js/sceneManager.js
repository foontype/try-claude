// Scene Manager class to handle Babylon.js scene setup and management
class SceneManager {
    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scene = this.createScene();
        this.currentModel = null;
    }
    
    createScene() {
        // Create a basic scene with a camera and lighting
        const scene = new BABYLON.Scene(this.engine);
        
        // Set clear color to a light gray
        scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
        
        // Add an arc rotate camera (allows orbit controls)
        const camera = new BABYLON.ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2.5,
            10,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );
        camera.attachControl(this.canvas, true);
        camera.wheelPrecision = 50;
        camera.lowerRadiusLimit = 0.1;
        camera.upperRadiusLimit = 100;
        
        // Add lighting
        const hemisphericLight = new BABYLON.HemisphericLight(
            'hemisphericLight',
            new BABYLON.Vector3(0, 1, 0),
            scene
        );
        hemisphericLight.intensity = 0.7;
        
        const directionalLight = new BABYLON.DirectionalLight(
            'directionalLight',
            new BABYLON.Vector3(0, -1, 1),
            scene
        );
        directionalLight.intensity = 0.5;
        
        // Add ground for reference
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 20, height: 20 },
            scene
        );
        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.alpha = 0.5;
        ground.material = groundMaterial;
        ground.receiveShadows = true;
        
        // Enable shadows
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        this.shadowGenerator = shadowGenerator;
        
        return scene;
    }
    
    removeCurrentModel() {
        if (this.currentModel) {
            this.scene.removeMesh(this.currentModel, true);
            this.currentModel = null;
        }
    }
    
    setCurrentModel(model) {
        this.removeCurrentModel();
        this.currentModel = model;
        
        if (model) {
            // Add model to shadow generator
            if (this.shadowGenerator && model.getChildMeshes) {
                const meshes = model.getChildMeshes();
                for (const mesh of meshes) {
                    this.shadowGenerator.addShadowCaster(mesh);
                }
            }
            
            // Position model at center
            if (model.position) {
                model.position = new BABYLON.Vector3(0, 0, 0);
            }
        }
    }
    
    render() {
        if (this.scene) {
            this.scene.render();
        }
    }
}