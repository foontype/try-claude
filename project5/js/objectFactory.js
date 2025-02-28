/**
 * ObjectFactory class for creating different types of scene objects
 */
class ObjectFactory {
    /**
     * Create a new object factory
     * @param {BABYLON.Scene} scene - The scene to create objects in
     * @param {ModelLoader} modelLoader - The model loader instance
     */
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
    }
    
    /**
     * Create a player
     * @param {string} id - Unique identifier for the player
     * @param {Object} options - Options for player creation
     * @param {string} [options.modelPath] - Path to GLB model (optional)
     * @param {BABYLON.Vector3} [options.position] - Initial position (optional)
     * @param {number} [options.speed] - Movement speed (optional)
     * @param {number|BABYLON.Vector3} [options.scale] - Scale factor for the model (optional)
     * @param {Object} [options.animations] - Animation configuration (optional)
     * @param {string} [options.animations.walkAnimation] - Name of walking animation
     * @param {string} [options.animations.runAnimation] - Name of running animation
     * @param {string} [options.animations.idleAnimation] - Name of idle animation
     * @param {Object} [options.animationSpeeds] - Animation speed configuration (optional)
     * @param {number} [options.animationSpeeds.idle] - Speed ratio for idle animation
     * @param {number} [options.animationSpeeds.walk] - Speed ratio for walk animation
     * @param {number} [options.animationSpeeds.run] - Speed ratio for run animation
     * @param {number} [options.blendingSpeed] - Animation blending time in seconds
     * @param {Function} [callback] - Callback function when player is created
     */
    createPlayer(id, options = {}, callback) {
        const defaultOptions = {
            modelPath: null,
            position: new BABYLON.Vector3(0, 0, 0),
            speed: 0.1,
            scale: 1.0,
            animations: {
                walkAnimation: "Walk",
                runAnimation: "Run",
                idleAnimation: "Survey"
            },
            animationSpeeds: {
                idle: 1.0,
                walk: 1.0,
                run: 1.5
            },
            blendingSpeed: 0.03
        };
        
        // Merge default options with provided options
        const config = {...defaultOptions, ...options};
        
        // If a model path is provided, load the model
        if (config.modelPath) {
            this.modelLoader.loadGLB(config.modelPath, `player_${id}`, (meshes, particleSystems, skeletons) => {
                // Create player with loaded model
                const player = new Player(id, this.scene, meshes, skeletons);
                
                // Apply configuration
                player.setPosition(config.position);
                player.setSpeed(config.speed);
                
                // Apply scaling to all meshes
                this._applyScale(meshes, config.scale);

                meshes.forEach(mesh => {
                    this.scene.shadowGenerator.addShadowCaster(mesh, true);
                });

                // Set animation names
                if (config.animations) {
                    if (config.animations.walkAnimation) {
                        player.walkAnimationName = config.animations.walkAnimation;
                    }
                    if (config.animations.runAnimation) {
                        player.runAnimationName = config.animations.runAnimation;
                    }
                    if (config.animations.idleAnimation) {
                        player.idleAnimationName = config.animations.idleAnimation;
                    }
                }
                
                // Set animation speeds
                if (config.animationSpeeds) {
                    if (config.animationSpeeds.idle !== undefined) {
                        player.idleAnimSpeedRatio = config.animationSpeeds.idle;
                    }
                    if (config.animationSpeeds.walk !== undefined) {
                        player.walkAnimSpeedRatio = config.animationSpeeds.walk;
                    }
                    if (config.animationSpeeds.run !== undefined) {
                        player.runAnimSpeedRatio = config.animationSpeeds.run;
                    }
                }
                
                // Set animation blending
                if (config.blendingSpeed !== undefined) {
                    player.setBlendingSpeed(config.blendingSpeed);
                }
                
                // Log available animations if skeletons are present
                if (skeletons && skeletons.length > 0) {
                    console.log(`Available animations for ${id}:`, 
                        skeletons[0].getAnimationRanges().map(range => range.name));
                }
                
                // Call callback with created player
                if (callback) callback(player);
            }, (error, exception) => {
                console.error(`Failed to load player model: ${error}: ${exception}`);
                
                // Create basic player as fallback
                //this._createBasicPlayer(id, config, callback);
            });
        } else {
            // Create basic player without model
            this._createBasicPlayer(id, config, callback);
        }
    }
    
    /**
     * Apply scale to meshes
     * @param {Array<BABYLON.AbstractMesh>} meshes - Meshes to scale
     * @param {number|BABYLON.Vector3} scale - Scale factor
     * @private
     */
    _applyScale(meshes, scale) {
        if (!meshes || meshes.length === 0) return;
        
        // Find root mesh (usually the first one)
        const rootMesh = meshes[0];
        
        // Apply scaling based on type
        if (typeof scale === 'number') {
            // Uniform scaling
            rootMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
        } else if (scale instanceof BABYLON.Vector3) {
            // Non-uniform scaling
            rootMesh.scaling = scale;
        }
    }
    
    /**
     * Create a basic player with primitive geometry
     * @param {string} id - Unique identifier for the player
     * @param {Object} config - Configuration options
     * @param {Function} callback - Callback function when player is created
     * @private
     */
    _createBasicPlayer(id, config, callback) {
        // Create a simple mesh to represent the player
        const playerMesh = BABYLON.MeshBuilder.CreateBox(`player_${id}_mesh`, {width: 1, height: 2, depth: 1}, this.scene);
        
        // Add a material to the player mesh
        const playerMaterial = new BABYLON.StandardMaterial(`player_${id}_material`, this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
        playerMesh.material = playerMaterial;
        
        // Create a small box to indicate front direction
        const directionIndicator = BABYLON.MeshBuilder.CreateBox(`player_${id}_direction`, {width: 0.3, height: 0.3, depth: 0.5}, this.scene);
        directionIndicator.position = new BABYLON.Vector3(0, 0, 0.75);
        directionIndicator.parent = playerMesh;
        
        const directionMaterial = new BABYLON.StandardMaterial(`player_${id}_direction_material`, this.scene);
        directionMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.3, 0.3);
        directionIndicator.material = directionMaterial;
        
        // Apply scaling if specified
        if (config.scale) {
            if (typeof config.scale === 'number') {
                playerMesh.scaling = new BABYLON.Vector3(config.scale, config.scale, config.scale);
            } else if (config.scale instanceof BABYLON.Vector3) {
                playerMesh.scaling = config.scale;
            }
        }
        
        // Create player with the basic meshes
        const player = new Player(id, this.scene, [playerMesh, directionIndicator], []);
        
        // Apply configuration
        player.setPosition(config.position);
        player.setSpeed(config.speed);
        
        // Set animation names from config if specified
        if (config.animations) {
            if (config.animations.walkAnimation) {
                player.walkAnimationName = config.animations.walkAnimation;
            }
            if (config.animations.runAnimation) {
                player.runAnimationName = config.animations.runAnimation;
            }
            if (config.animations.idleAnimation) {
                player.idleAnimationName = config.animations.idleAnimation;
            }
        }
        
        // Set animation speeds
        if (config.animationSpeeds) {
            if (config.animationSpeeds.idle !== undefined) {
                player.idleAnimSpeedRatio = config.animationSpeeds.idle;
            }
            if (config.animationSpeeds.walk !== undefined) {
                player.walkAnimSpeedRatio = config.animationSpeeds.walk;
            }
            if (config.animationSpeeds.run !== undefined) {
                player.runAnimSpeedRatio = config.animationSpeeds.run;
            }
        }
        
        // Set animation blending
        if (config.blendingSpeed !== undefined) {
            player.blendingSpeed = config.blendingSpeed;
        }
        
        // Call callback with created player
        if (callback) callback(player);
    }
    
    /**
     * Create a generic scene object
     * @param {string} id - Unique identifier for the object
     * @param {Object} options - Options for object creation
     * @param {string} [options.modelPath] - Path to GLB model (optional)
     * @param {BABYLON.Vector3} [options.position] - Initial position (optional)
     * @param {number|BABYLON.Vector3} [options.scale] - Scale factor for the model (optional)
     * @param {Function} [callback] - Callback function when object is created
     */
    createSceneObject(id, options = {}, callback) {
        const defaultOptions = {
            modelPath: null,
            position: new BABYLON.Vector3(0, 0, 0),
            scale: 1.0
        };
        
        // Merge default options with provided options
        const config = {...defaultOptions, ...options};
        
        // If a model path is provided, load the model
        if (config.modelPath) {
            this.modelLoader.loadGLB(config.modelPath, `object_${id}`, (meshes, particleSystems, skeletons) => {
                // Create scene object with loaded model
                const sceneObject = new SceneObject(id, this.scene, meshes, skeletons);
                
                // Apply configuration
                sceneObject.setPosition(config.position);
                
                // Apply scaling to all meshes
                this._applyScale(meshes, config.scale);
                
                // Call callback with created object
                if (callback) callback(sceneObject);
            }, (error) => {
                console.error(`Failed to load scene object model: ${error}`);
                
                // Create basic object as fallback
                this._createBasicObject(id, config, callback);
            });
        } else {
            // Create basic object without model
            this._createBasicObject(id, config, callback);
        }
    }
    
    /**
     * Create a basic scene object with primitive geometry
     * @param {string} id - Unique identifier for the object
     * @param {Object} config - Configuration options
     * @param {Function} callback - Callback function when object is created
     * @private
     */
    _createBasicObject(id, config, callback) {
        // Create a simple mesh to represent the object
        const objectMesh = BABYLON.MeshBuilder.CreateBox(`object_${id}_mesh`, {width: 1, height: 1, depth: 1}, this.scene);
        
        // Add a material to the object mesh
        const objectMaterial = new BABYLON.StandardMaterial(`object_${id}_material`, this.scene);
        objectMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        objectMesh.material = objectMaterial;
        
        // Apply scaling if specified
        if (config.scale) {
            if (typeof config.scale === 'number') {
                objectMesh.scaling = new BABYLON.Vector3(config.scale, config.scale, config.scale);
            } else if (config.scale instanceof BABYLON.Vector3) {
                objectMesh.scaling = config.scale;
            }
        }
        
        // Create scene object with the basic mesh
        const sceneObject = new SceneObject(id, this.scene, [objectMesh], []);
        
        // Apply configuration
        sceneObject.setPosition(config.position);
        
        // Call callback with created object
        if (callback) callback(sceneObject);
    }
}