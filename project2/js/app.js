// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const sceneManager = new SceneManager(engine, canvas);
    const modelLoader = new ModelLoader(sceneManager);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        engine.resize();
    });
    
    // Handle file input
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            modelLoader.loadModel(url, file.name);
        }
    });
    
    // Handle sample model button
    const loadSampleBtn = document.getElementById('loadSample');
    loadSampleBtn.addEventListener('click', () => {
        // Load a sample GLB file from a CDN
        const sampleUrl = 'https://models.babylonjs.com/BoomBox.glb';
        modelLoader.loadModel(sampleUrl, 'BoomBox.glb');
    });
    
    // Start the render loop
    engine.runRenderLoop(() => {
        sceneManager.render();
    });
});