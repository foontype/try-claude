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
        this.rotationSpeed = 0.05;
        this.isMoving = false;
        
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
        
        // Left rotation
        if (this.inputMap["a"] || this.inputMap["ArrowLeft"]) {
            this.rotateLeft();
        }
        
        // Right rotation
        if (this.inputMap["d"] || this.inputMap["ArrowRight"]) {
            this.rotateRight();
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
        // Switch between idle and walk animations based on movement
        if (this.isMoving) {
            // Play walk animation if not already playing
            if (!this.currentAnimation || this.currentAnimationName !== 'walk') {
                this.currentAnimationName = 'walk';
                this.currentAnimation = this.playAnimation('walk');
            }
        } else {
            // Play idle animation if not already playing
            if (!this.currentAnimation || this.currentAnimationName !== 'idle') {
                this.currentAnimationName = 'idle';
                this.currentAnimation = this.playAnimation('idle');
            }
        }
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