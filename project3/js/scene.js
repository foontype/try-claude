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

        // Create a follow camera for 3rd person view (initial target is set to origin)
        // We'll update this when the player is created
        this.camera = new BABYLON.FollowCamera("followCamera", new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.rotationOffset = 180; // Camera looks in the opposite direction as the target
        this.camera.heightOffset = 2;    // Height above the target
        this.camera.radius = 5;          // Distance from the target
        this.camera.cameraAcceleration = 0.05; // How fast the camera accelerates to follow position
        this.camera.maxCameraSpeed = 10;  // Speed limit for camera movement
        
        // Set as active camera
        this.scene.activeCamera = this.camera;
        
        // Get the canvas from the engine passed to constructor
        const canvas = this.engine.getRenderingCanvas();
        this.camera.attachControl(canvas, true);
        
        // Create ground
        this.createGround();
        
        // Set clear color (background color)
        this.scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.15, 1.0);
    }
    
    /**
     * Create ground for the scene
     */
    createGround() {
        // Create a large ground plane
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: 100,
            height: 100,
            subdivisions: 10
        }, this.scene);
        
        // Position ground slightly below origin to prevent z-fighting with other objects
        ground.position.y = -0.01;
        
        // Create ground material
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.25, 0.2);
        groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        // Add a grid pattern to the ground for better visual reference
        const groundTexture = new BABYLON.GridMaterial("groundGridMaterial", this.scene);
        groundTexture.gridRatio = 1;
        groundTexture.mainColor = new BABYLON.Color3(0.2, 0.25, 0.2);
        groundTexture.lineColor = new BABYLON.Color3(0.4, 0.45, 0.4);
        groundTexture.opacity = 0.8;
        
        // Apply material to ground
        ground.material = groundTexture;
    }

    /**
     * Set the camera target to follow the player
     * @param {SceneObject|Player} player - The player object to follow
     */
    setPlayerForCamera(player) {
        if (!player || !player.rootMesh) return;
        
        // Set target to player's root mesh
        this.camera.lockedTarget = player.rootMesh;
        
        console.log('Camera now following player');
    }

    /**
     * Get the BabylonJS scene instance
     * @returns {BABYLON.Scene}
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * Get the main camera
     * @returns {BABYLON.Camera} The main camera
     */
    getCamera() {
        return this.camera;
    }
}