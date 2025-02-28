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