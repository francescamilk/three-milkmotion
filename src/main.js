import * as THREE from 'three';
import GUI from 'lil-gui';

// Debugger init
const gui    = new GUI();
const props = {
    materialColor: '#6a6496'
};

gui
    .addColor(props, 'materialColor')
    .name('Material color')
    .onChange(() => {
        material.color.set(props.materialColor);
    });

// toggle gui visibility
gui.hide();
window.addEventListener('keydown', (e) => {
    if(e.key === 'h')
        gui.show(gui._hidden);
});

// Canvas
const canvas = document.querySelector('canvas#webgl');

// Scene
const scene = new THREE.Scene();

// Textures & Materials
const textureLoader   = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({ 
    color: props.materialColor,
    gradientMap: gradientTexture
});

// Meshes
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);

const cone  = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
);

const knot  = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

scene.add(torus, cone, knot);
const meshes = [ torus, cone, knot ];

// position objects
const objectsDistance = 4;

torus.position.x = 2;
torus.position.y = -objectsDistance * 0;

cone.position.x  = - 2;
cone.position.y  = -objectsDistance * 1;

knot.position.x  = 2;
knot.position.y  = -objectsDistance * 2;

// Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

// &plug debugger
gui
    .add(directionalLight, 'intensity')
    .min(0).max(5).step(0.001)    
    .name('Directional lights intensity');

gui
    .add(directionalLight.position, 'x')
    .min(-5).max(5).step(0.001)
    .name('Directional lights x');

gui
    .add(directionalLight.position, 'y')
    .min(-5).max(5).step(0.001)
    .name('Directional lights y');

gui
    .add(directionalLight.position, 'z')
    .min(-5).max(5).step(0.001)
    .name('Directional lights z');

// Window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// handle resize
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

// Camera &Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearAlpha(0);

// Scroll motion
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Parallax motion
const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (e) => {
    // stabilise values in -0.5 - 0.5 ranges
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
});

// Animate
const clock    = new THREE.Clock();
const animLoop = () => {
    const elapsedTime = clock.getElapsedTime();

    // rotate meshes
    meshes.forEach((mesh) => {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.12;
    });

    // scroll motion on camera
    // formula to match viewport scroll to next object in camera
    camera.position.y = -scrollY / sizes.height * objectsDistance;

    // parralax motion on camera group
    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    cameraGroup.position.x = parallaxX;
    cameraGroup.position.y = parallaxY;

    // call again on the next frame
    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
}

animLoop();