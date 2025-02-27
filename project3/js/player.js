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
        
        // Animation names
        this.walkAnimationName = "Walk";
        this.idleAnimationName = "Survey";
        this.currentAnimationName = "";
        this.currentAnimation = null;
        
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
        
        // Forward movement
        if (this.inputMap["w"] || this.inputMap["ArrowUp"]) {
            this.moveForward();
            this.isMoving = true;
        }
        
        // Backward movement
        if (this.inputMap["s"] || this.inputMap["ArrowDown"]) {
            this.moveBackward();
            this.isMoving = true;
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
        
        const forward = new BABYLON.Vector3(
            Math.sin(this.rootMesh.rotation.y) * this.speed,
            0,
            Math.cos(this.rootMesh.rotation.y) * this.speed
        );
        
        this.position.addInPlace(forward);
        this.updatePosition();
    }
    
    /**
     * Move the player backward
     */
    moveBackward() {
        if (!this.rootMesh) return;
        
        const backward = new BABYLON.Vector3(
            -Math.sin(this.rootMesh.rotation.y) * this.speed,
            0,
            -Math.cos(this.rootMesh.rotation.y) * this.speed
        );
        
        this.position.addInPlace(backward);
        this.updatePosition();
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
        
        // Switch between idle and walk animations based on movement
        if (this.isMoving) {
            // Play walk animation if not already playing
            if (!this.currentAnimation || this.currentAnimationName !== this.walkAnimationName) {
                // Stop current animation if any
                if (this.currentAnimation) {
                    this.currentAnimation.stop();
                }
                
                this.currentAnimationName = this.walkAnimationName;
                
                // Find the animation group
                const walkAnimation = this._findAnimationGroup(this.walkAnimationName);
                if (walkAnimation) {
                    // Play the walk animation
                    walkAnimation.start(true); // loop = true
                    this.currentAnimation = walkAnimation;
                    console.log(`Playing animation: ${this.walkAnimationName}`);
                } else {
                    console.log(`Animation not found: ${this.walkAnimationName}`);
                }
            }
        } else {
            // Play idle animation if not already playing
            if (!this.currentAnimation || this.currentAnimationName !== this.idleAnimationName) {
                // Stop current animation if any
                if (this.currentAnimation) {
                    this.currentAnimation.stop();
                }
                
                this.currentAnimationName = this.idleAnimationName;
                
                // Find the animation group
                const idleAnimation = this._findAnimationGroup(this.idleAnimationName);
                if (idleAnimation) {
                    // Play the idle animation
                    idleAnimation.start(true); // loop = true
                    this.currentAnimation = idleAnimation;
                    console.log(`Playing animation: ${this.idleAnimationName}`);
                } else {
                    console.log(`Animation not found: ${this.idleAnimationName}`);
                }
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
}