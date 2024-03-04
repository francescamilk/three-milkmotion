import * as THREE from 'three';
import GUI from 'lil-gui';

// Debugger init
const gui    = new GUI();
const params = {
    materialColor: '#ffeded'
};
gui.addColor(params, 'materialColor');

// toggle gui controls
window.addEventListener('keydown', (e) => {
    if(e.key === 'h')
        gui.show(gui._hidden);
});

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
const scene = new THREE.Scene();

// Objects    REF(test cube)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
scene.add(cube);

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

scene.add(mesh1, mesh2, mesh3);

// Window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // update sizes
    sizes.width  = window.innerWidth;
    sizes.height = window.innerHeight;

    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// renderer.setClearAlpha(0);

// Animate
// const clock    = new THREE.Clock();
const animLoop = () => {
    // const elapsedTime = clock.getElapsedTime();
    // call again on the next frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
}

animLoop();