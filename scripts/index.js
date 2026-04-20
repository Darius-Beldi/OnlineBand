import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( {
		canvas,
		alpha: true,
		antialias: true
	} );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Optional: Add damping (smooth inertia)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Optional: Limit how far the user can zoom in/out
controls.minDistance = 2;
controls.maxDistance = 50;

// --- LIGHTING (Crucial for MTL materials) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// --- LOADERS ---
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

// Update these paths to match your actual file location
mtlLoader.load('/AcousticGuitar/guitar.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('/AcousticGuitar/guitar.obj', (root) => {
        scene.add(root);
        // Center the camera on the model if it's too big/small
        root.position.set(0, 0, 0); 
    });
});

camera.position.z = 10; // Back the camera up a bit

// --- ANIMATION ---
function animate() {
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});