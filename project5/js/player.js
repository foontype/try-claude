/**
 * Player class representing a playable character in the scene
 * Inherits from SceneObject
 */
class Player extends SceneObject {
    /**
     * Create a new player
     * @param {string} id - Unique identifier for the player
     * @param {BABYLON.Scene} scene - The scene this player belongs to
     * @param {Array<BABYLON.AbstractMesh>} meshes - Meshes that make up this player
     * @param {Array<BABYLON.Skeleton>} skeletons - Skeletons for player animation
     */
    constructor(id, scene, meshes, skeletons) {
        super(id, scene, meshes, skeletons);
        
        // Player-specific properties
        this.speed = 0.1;
        this.rotationSpeed = 0.02; // Reduced rotation speed for slower turning
        this.isMoving = false;
        this.isDashing = false;
        this.isMovingBackward = false; // Track if moving backward
        this.dashSpeedMultiplier = 1.5; // Speed multiplier when dashing
        
        // Animation properties
        this.walkAnimationName = "Walk";
        this.runAnimationName = "Run";
        this.idleAnimationName = "Survey";
        this.currentAnimationName = "";
        this.currentAnimation = null;
        
        // Animation speed ratios
        this.idleAnimSpeedRatio = 1.0;
        this.walkAnimSpeedRatio = 1.0;
        this.runAnimSpeedRatio = 1.5; // Faster animation for running
        
        // Animation blending parameters
        this.blendingSpeed = 0.02; // Animation blending time in seconds

        // Enable animation blending for all animations
        this.scene.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        this.scene.animationPropertiesOverride.enableBlending = true;
        this.scene.animationPropertiesOverride.blendingSpeed = this.blendingSpeed;
        this.scene.animationPropertiesOverride.loopMode = 1;
        
        // Enable collision detection for player
        if (this.rootMesh) {
            this.rootMesh.checkCollisions = true;
            
            // Set up collision ellipsoid for the player
            this.rootMesh.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
            this.rootMesh.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
            
            // Visualize the collision ellipsoid (optional)
            // Enable to visualize player collision ellipsoid
            this.showCollisionEllipsoid();
        }
        
        // Set up input handling
        this.setupInputControls();
    }
    
    /**
     * Set up keyboard controls for the player
     */
    setupInputControls() {
        // Create action manager if the scene doesn't have one
        if (!this.scene.actionManager) {
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        }
        
        // Track key states
        this.inputMap = {};
        
        // Register key down actions
        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyDownTrigger,
                (evt) => {
                    this.inputMap[evt.sourceEvent.key] = true;
                }
            )
        );
        
        // Register key up actions
        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyUpTrigger,
                (evt) => {
                    this.inputMap[evt.sourceEvent.key] = false;
                }
            )
        );
        
        // Register before render to update player based on input
        this.scene.registerBeforeRender(() => {
            this.updateFromInput();
        });
    }
    
    /**
     * Update player position and rotation based on input
     */
    updateFromInput() {
        this.isMoving = false;
        this.isMovingBackward = false;
        
        // Check if shift key is pressed for dashing
        this.isDashing = this.inputMap["Shift"];
        
        // Forward movement
        if (this.inputMap["w"] || this.inputMap["ArrowUp"]) {
            this.moveForward();
            this.isMoving = true;
        }
        
        // Backward movement
        if (this.inputMap["s"] || this.inputMap["ArrowDown"]) {
            this.moveBackward();
            this.isMoving = true;
            this.isMovingBackward = true;
        }
        
        // Right rotation (inverted - pressing left key now rotates right)
        if (this.inputMap["a"] || this.inputMap["ArrowLeft"]) {
            this.rotateRight();
        }
        
        // Left rotation (inverted - pressing right key now rotates left)
        if (this.inputMap["d"] || this.inputMap["ArrowRight"]) {
            this.rotateLeft();
        }
        
        // Update animation state based on movement
        this.updateAnimation();
    }
    
    /**
     * Move the player forward
     */
    moveForward() {
        if (!this.rootMesh) return;
        
        // Calculate actual speed based on whether dashing or not
        const actualSpeed = this.isDashing ? this.speed * this.dashSpeedMultiplier : this.speed;
        
        const forward = new BABYLON.Vector3(
            Math.sin(this.rootMesh.rotation.y) * actualSpeed,
            0,
            Math.cos(this.rootMesh.rotation.y) * actualSpeed
        );
        
        // Move with collision detection
        this.rootMesh.moveWithCollisions(forward);
        
        // Update internal position to match mesh position
        this.position = this.rootMesh.position.clone();
    }
    
    /**
     * Move the player backward
     */
    moveBackward() {
        if (!this.rootMesh) return;
        
        // Calculate actual speed based on whether dashing or not
        const actualSpeed = this.isDashing ? this.speed * this.dashSpeedMultiplier : this.speed;
        
        const backward = new BABYLON.Vector3(
            -Math.sin(this.rootMesh.rotation.y) * actualSpeed,
            0,
            -Math.cos(this.rootMesh.rotation.y) * actualSpeed
        );
        
        // Move with collision detection
        this.rootMesh.moveWithCollisions(backward);
        
        // Update internal position to match mesh position
        this.position = this.rootMesh.position.clone();
    }
    
    /**
     * Rotate the player to the left
     */
    rotateLeft() {
        if (!this.rootMesh) return;
        
        this.rootMesh.rotation.y += this.rotationSpeed;
    }
    
    /**
     * Rotate the player to the right
     */
    rotateRight() {
        if (!this.rootMesh) return;
        
        this.rootMesh.rotation.y -= this.rotationSpeed;
    }
    
    /**
     * Update animation based on player state
     */
    updateAnimation() {
        // Check if scene has animation groups
        if (!this.scene.animationGroups || this.scene.animationGroups.length === 0) {
            console.log("No animation groups found in scene");
            return;
        }
        
        // Log available animations if we haven't done it yet
        if (!this._animationsLogged) {
            console.log("Available animations:");
            this.scene.animationGroups.forEach(group => {
                console.log(`- ${group.name}`);
            });
            this._animationsLogged = true;
        }
        
        let targetAnimationName = this.idleAnimationName; // Default to idle
        
        // Determine which animation to play based on movement and dash state
        if (this.isMoving) {
            if (this.isDashing) {
                targetAnimationName = this.runAnimationName; // Run animation when dashing
            } else {
                targetAnimationName = this.walkAnimationName; // Walk animation when moving normally
            }
        }
        
        // Only change animation if needed
        if (!this.currentAnimation || this.currentAnimationName !== targetAnimationName) {
            // Find the animation group
            const targetAnimation = this._findAnimationGroup(targetAnimationName);
            if (targetAnimation) {
                // Determine the appropriate animation speed
                let speedRatio = this.idleAnimSpeedRatio;
                if (targetAnimationName === this.walkAnimationName) {
                    speedRatio = this.walkAnimSpeedRatio;
                } else if (targetAnimationName === this.runAnimationName) {
                    speedRatio = this.runAnimSpeedRatio;
                }
                
                this.scene.animationTimeScale = speedRatio;

                // Start the animation with blending
                if (this.currentAnimation) {
                    this.currentAnimation.stop();
                }
 
                targetAnimation.start(true);
               
                this.currentAnimation = targetAnimation;
                this.currentAnimationName = targetAnimationName;
                
                console.log(`Playing animation: ${targetAnimationName} with blending (${this.blendingSpeed}s)`);
            }
        }
    }
    
    /**
     * Find an animation group by name or partial name match
     * @param {string} animationName - Animation name to find
     * @returns {BABYLON.AnimationGroup|null} Animation group or null if not found
     * @private
     */
    _findAnimationGroup(animationName) {
        if (!this.scene.animationGroups) return null;
        
        // Try exact match first
        let group = this.scene.animationGroups.find(g => g.name === animationName);
        
        // If not found, try case-insensitive match
        if (!group) {
            group = this.scene.animationGroups.find(g => g.name.toLowerCase() === animationName.toLowerCase());
        }
        
        // If still not found, try partial match
        if (!group) {
            group = this.scene.animationGroups.find(g => g.name.toLowerCase().includes(animationName.toLowerCase()));
        }
        
        return group;
    }
    
    /**
     * Set the player's movement speed
     * @param {number} speed - New movement speed
     */
    setSpeed(speed) {
        this.speed = speed;
    }
    
    /**
     * Set the player's rotation speed
     * @param {number} speed - New rotation speed
     */
    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }
    
    /**
     * Set animation blending speed
     * @param {number} blendingSpeed - Blending time in seconds 
     */
    setBlendingSpeed(blendingSpeed) {
        this.blendingSpeed = blendingSpeed;
        this.scene.animationPropertiesOverride.blendingSpeed = this.blendingSpeed;
    }
    
    /**
     * Visualize the player's collision ellipsoid
     */
    showCollisionEllipsoid() {
        if (!this.rootMesh) return;
        
        // Create ellipsoid mesh based on the collision ellipsoid
        const ellipsoid = BABYLON.MeshBuilder.CreateSphere("playerCollisionEllipsoid", {
            diameterX: this.rootMesh.ellipsoid.x * 2,
            diameterY: this.rootMesh.ellipsoid.y * 2,
            diameterZ: this.rootMesh.ellipsoid.z * 2,
            segments: 16
        }, this.scene);
        
        // Position it according to the ellipsoid offset
        ellipsoid.position = this.rootMesh.ellipsoidOffset.clone();
        
        // Make it a child of the root mesh so it follows
        ellipsoid.parent = this.rootMesh;
        
        // Create a wireframe material
        const wireMaterial = new BABYLON.StandardMaterial("collisionEllipsoidMaterial", this.scene);
        wireMaterial.wireframe = true;
        wireMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0); // Red wireframe
        wireMaterial.alpha = 0.3; // Very transparent
        
        // Apply the material
        ellipsoid.material = wireMaterial;
        
        // Ensure the wireframe doesn't interfere with other operations
        ellipsoid.isPickable = false;
        ellipsoid.checkCollisions = false;
        
        // Store reference to the ellipsoid visualization
        this.collisionEllipsoidMesh = ellipsoid;
    }
}