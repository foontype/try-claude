/**
 * SceneObject class representing an object in the scene
 */
class SceneObject {
    /**
     * Create a new scene object
     * @param {string} id - Unique identifier for the object
     * @param {BABYLON.Scene} scene - The scene this object belongs to
     * @param {Array<BABYLON.AbstractMesh>} meshes - Meshes that make up this object
     * @param {Array<BABYLON.Skeleton>} skeletons - Skeletons for object animation
     */
    constructor(id, scene, meshes, skeletons) {
        this.id = id;
        this.scene = scene;
        this.meshes = meshes;
        this.skeletons = skeletons;
        this.rootMesh = this.findRootMesh();
        
        // Initialize object position
        this.position = new BABYLON.Vector3(0, 0, 0);
        this.updatePosition();
    }
    
    /**
     * Find the root mesh for the object
     * @returns {BABYLON.AbstractMesh} Root mesh
     */
    findRootMesh() {
        if (!this.meshes || this.meshes.length === 0) {
            return null;
        }
        
        // Try to find a mesh that has a skeleton attached
        for (const mesh of this.meshes) {
            if (mesh.skeleton) {
                return mesh;
            }
        }
        
        // If no mesh with skeleton is found, return the first mesh
        return this.meshes[0];
    }
    
    /**
     * Set the object's position
     * @param {BABYLON.Vector3} position - New position
     */
    setPosition(position) {
        this.position = position;
        this.updatePosition();
    }
    
    /**
     * Update the object's position by moving all meshes
     */
    updatePosition() {
        if (!this.rootMesh) return;
        
        // Move the root mesh to the desired position
        this.rootMesh.position = this.position;
    }
    
    /**
     * Enable collision detection for this object
     * @param {boolean} showWireframe - Whether to show the collision box with wireframe
     */
    setupCollider(showWireframe = false) {
        if (!this.rootMesh) return;
        
        // Enable collision detection
        this.rootMesh.checkCollisions = true;
        
        // Create a visible collider if requested
        if (showWireframe) {
            // Get the bounding info of the mesh
            const boundingInfo = this.rootMesh.getBoundingInfo();
            const min = boundingInfo.boundingBox.minimum;
            const max = boundingInfo.boundingBox.maximum;
            
            // Create a box that matches the bounding box
            const wireBox = BABYLON.MeshBuilder.CreateBox(`${this.id}_collider_visual`, {
                width: max.x - min.x,
                height: max.y - min.y,
                depth: max.z - min.z
            }, this.scene);
            
            // Position the box at the center of the bounding box
            wireBox.position = this.rootMesh.position.clone();
            
            // Make it a child of the root mesh so it follows its movement
            wireBox.parent = this.rootMesh;
            
            // Create a wireframe material
            const wireMaterial = new BABYLON.StandardMaterial(`${this.id}_collider_material`, this.scene);
            wireMaterial.wireframe = true;
            wireMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0); // Green wireframe
            wireMaterial.alpha = 0.5; // Semi-transparent
            
            // Apply the material to the box
            wireBox.material = wireMaterial;
            
            // Ensure the wireframe doesn't interfere with other operations
            wireBox.isPickable = false;
            wireBox.checkCollisions = false;
            
            // Store reference to the visual collider
            this.colliderVisual = wireBox;
        }
        
        console.log(`Collisions enabled for ${this.id}`);
    }
    
    /**
     * Make this object cast shadows
     * @param {SceneManager} sceneManager - The scene manager instance
     */
    castShadows(sceneManager) {
        if (!this.rootMesh || !sceneManager) return;
        
        // Make all meshes cast shadows
        for (const mesh of this.meshes) {
            sceneManager.addShadowCaster(mesh);
        }
        
        console.log(`${this.id} is now casting shadows`);
    }
    
    /**
     * Play an animation on the object
     * @param {string} animationName - Name of the animation to play
     * @param {boolean} loop - Whether to loop the animation
     * @param {number} speedRatio - Animation speed ratio
     */
    playAnimation(animationName, loop = true, speedRatio = 1.0) {
        if (!this.skeletons || this.skeletons.length === 0) return;
        
        const skeleton = this.skeletons[0];
        const animatable = this.scene.beginAnimation(skeleton, 0, 100, loop, speedRatio);
        return animatable;
    }
    
    /**
     * Remove the object from the scene
     */
    dispose() {
        if (this.meshes) {
            this.meshes.forEach(mesh => {
                mesh.dispose();
            });
        }
    }
}