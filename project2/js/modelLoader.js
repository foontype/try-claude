// Model Loader class to handle loading glTF/GLB files
class ModelLoader {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.loadingStatus = document.createElement('div');
        this.loadingStatus.style.position = 'absolute';
        this.loadingStatus.style.bottom = '10px';
        this.loadingStatus.style.left = '10px';
        this.loadingStatus.style.background = 'rgba(0,0,0,0.7)';
        this.loadingStatus.style.color = 'white';
        this.loadingStatus.style.padding = '10px';
        this.loadingStatus.style.borderRadius = '5px';
        this.loadingStatus.style.display = 'none';
        document.body.appendChild(this.loadingStatus);
    }
    
    loadModel(url, filename) {
        // Show loading status
        this.loadingStatus.textContent = `Loading ${filename}...`;
        this.loadingStatus.style.display = 'block';
        
        // Remove current model if exists
        this.sceneManager.removeCurrentModel();
        
        // Determine if the file is GLB or GLTF based on extension
        const isGLB = filename.toLowerCase().endsWith('.glb');
        
        // Use the appropriate loader
        BABYLON.SceneLoader.ImportMesh(
            '',
            url,
            '',
            this.scene,
            (meshes, particleSystems, skeletons, animationGroups) => {
                // Success callback
                this.loadingStatus.style.display = 'none';
                
                if (meshes.length > 0) {
                    // Handle possible transformations
                    const rootMesh = meshes[0];
                    
                    // Scale the model if it's too big or too small
                    this.autoScaleModel(rootMesh, meshes);
                    
                    // Center the model
                    this.centerModel(rootMesh, meshes);
                    
                    // Set as current model
                    this.sceneManager.setCurrentModel(rootMesh);
                    
                    // Auto-play animations if present
                    if (animationGroups && animationGroups.length > 0) {
                        animationGroups[0].play(true);
                    }
                }
            },
            (evt) => {
                // Progress callback
                const loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
                this.loadingStatus.textContent = `Loading ${filename}: ${loadedPercent}%`;
            },
            (error) => {
                // Error callback
                this.loadingStatus.textContent = `Error loading model: ${error.message || error}`;
                setTimeout(() => {
                    this.loadingStatus.style.display = 'none';
                }, 3000);
                console.error('Error loading model:', error);
            },
            isGLB ? '.glb' : '.gltf'
        );
    }
    
    autoScaleModel(rootMesh, meshes) {
        // Calculate bounding box of all meshes
        let boundingInfo = this.calculateBoundingInfo(meshes);
        if (!boundingInfo) return;
        
        // Get the longest dimension
        const size = boundingInfo.boundingBox.maximumWorld.subtract(
            boundingInfo.boundingBox.minimumWorld
        );
        const maxDimension = Math.max(size.x, size.y, size.z);
        
        // Target size (adjust as needed)
        const targetSize = 5;
        
        // Calculate scale factor
        if (maxDimension > 0) {
            const scaleFactor = targetSize / maxDimension;
            rootMesh.scaling.scaleInPlace(scaleFactor);
        }
    }
    
    centerModel(rootMesh, meshes) {
        // Recalculate bounding info after scaling
        let boundingInfo = this.calculateBoundingInfo(meshes);
        if (!boundingInfo) return;
        
        // Get the center of the bounding box
        const center = boundingInfo.boundingBox.centerWorld;
        
        // Calculate offset to place the model on the ground
        const minY = boundingInfo.boundingBox.minimumWorld.y;
        const height = boundingInfo.boundingBox.maximumWorld.y - minY;
        
        // Apply offset to position the model's bottom at y=0
        rootMesh.position = new BABYLON.Vector3(
            -center.x,
            -minY,
            -center.z
        );
    }
    
    calculateBoundingInfo(meshes) {
        let min = null;
        let max = null;
        
        // Find meshes with geometry (not empty containers)
        const geometricMeshes = meshes.filter(mesh => mesh.getBoundingInfo !== undefined && mesh.isEnabled());
        
        if (geometricMeshes.length === 0) {
            return null;
        }
        
        // Initialize with the first mesh's bounds
        for (const mesh of geometricMeshes) {
            const boundingInfo = mesh.getBoundingInfo();
            const boundingBox = boundingInfo.boundingBox;
            
            // Transform the bounding box to world space
            const worldMatrix = mesh.getWorldMatrix();
            const worldMin = BABYLON.Vector3.TransformCoordinates(boundingBox.minimum, worldMatrix);
            const worldMax = BABYLON.Vector3.TransformCoordinates(boundingBox.maximum, worldMatrix);
            
            if (min === null) {
                min = worldMin.clone();
                max = worldMax.clone();
            } else {
                min = BABYLON.Vector3.Minimize(min, worldMin);
                max = BABYLON.Vector3.Maximize(max, worldMax);
            }
        }
        
        // Create a new bounding info
        const boundingBox = new BABYLON.BoundingBox(min, max);
        return new BABYLON.BoundingInfo(min, max);
    }
}