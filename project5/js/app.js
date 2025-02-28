/**
 * Main application entry point
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the engine
    const engine = new Engine('renderCanvas');
    
    // Create a scene manager
    const sceneManager = new SceneManager(engine.getEngine());
    const scene = sceneManager.getScene();
    
    // Create model loader
    const modelLoader = new ModelLoader(scene);
    
    // Create object factory
    const objectFactory = new ObjectFactory(scene, modelLoader);
    
    // For demonstration purposes, we'll create objects after a timeout
    // In a real application, this might be triggered by user interaction
    setTimeout(() => {
        // Create a player
        objectFactory.createPlayer('player1', {
            modelPath: 'models/player.glb',
            position: new BABYLON.Vector3(0, 0, 0),
            speed: 2.00,
            scale: 0.01, // Scale the model to small size
            animations: {
                walkAnimation: "Walk", // Animation to play when moving normally
                runAnimation: "Run",   // Animation to play when dashing (shift + movement)
                idleAnimation: "Survey" // Animation to play when idle
            },
            animationSpeeds: {
                idle: 1.0,    // Normal speed for idle animation
                walk: 1.0,    // Normal speed for walking animation
                run: 1.5      // Faster speed for running animation
            },
            blendingSpeed: 0.03 // Animation transition blending time in seconds
        }, (player) => {
            console.log('Player created');
            
            // Store player reference in a global variable for debug access
            window.player = player;
            
            // Set the camera to follow the player (3rd person view)
            sceneManager.setPlayerForCamera(player);
            
            // Make player cast shadows
            player.castShadows(sceneManager);
        });
        
        // Create some scene objects
        objectFactory.createSceneObject('cube1', {
            position: new BABYLON.Vector3(5, 0, 0)
        }, (object) => {
            console.log('Cube created at position (5, 0, 0)');
            // Enable collision detection for the cube with wireframe visualization
            object.setupCollider(true); // true to show wireframe
            // Make cube cast shadows
            object.castShadows(sceneManager);
            // Store reference to the cube
            window.cube1 = object;
        });
        
        objectFactory.createSceneObject('cube2', {
            position: new BABYLON.Vector3(-5, 0, 0)
        }, (object) => {
            console.log('Cube created at position (-5, 0, 0)');
            // Enable collision detection for the cube with wireframe visualization
            object.setupCollider(true); // true to show wireframe
            // Make cube cast shadows
            object.castShadows(sceneManager);
            // Store reference to the cube
            window.cube2 = object;
        });
        
        objectFactory.createSceneObject('cube3', {
            position: new BABYLON.Vector3(0, 0, 5)
        }, (object) => {
            console.log('Cube created at position (0, 0, 5)');
            // Enable collision detection for the cube with wireframe visualization
            object.setupCollider(true); // true to show wireframe
            // Make cube cast shadows
            object.castShadows(sceneManager);
            // Store reference to the cube
            window.cube3 = object;
        });
    }, 1000);
    
    // Run the render loop
    engine.runRenderLoop(scene);
});