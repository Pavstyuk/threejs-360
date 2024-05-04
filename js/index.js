import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let width, height;
const canvasA = document.getElementById('canvas-a');
const canvasB = document.getElementById('canvas-b');

const setSizes = () => {
    if (window.innerWidth > window.innerHeight) {
        width = window.innerWidth / 2;
        height = window.innerHeight;
    } else {
        width = window.innerWidth;
        height = window.innerHeight / 2;
    }
}

setSizes();

window.addEventListener('resize', () => {
    setSizes();
    rendererA.setSize(width, height);
    rendererA.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cameraA.aspect = width / height;
    cameraA.updateProjectionMatrix();
    rendererB.setSize(width, height);
    rendererB.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    cameraB.aspect = width / height;
    cameraB.updateProjectionMatrix();
});

//ROOT BASIC VARIABLES
const colorDark = 0x111122;
const colorBlue = 0x4763ad;
const colorGreen = 0x2DCF9A;
const colorLight = 0xf0f0f7;
const near = 50;
const far = 100;

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.position.set(0, 2, 5);
dirLight.lookAt(0, 0, 0);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize.width = 512;
dirLight2.shadow.mapSize.height = 512;
dirLight2.position.set(0, -2, -5);
dirLight2.lookAt(0, 0, 0);

// CAMERA
const cameraA = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
cameraA.name = "Camera_A";
cameraA.position.set(0, 0, 3);
const cameraB = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
cameraB.name = "Camera_B";

cameraA.add(cameraB);



// SCENE
const sceneA = new THREE.Scene({});
const sceneB = new THREE.Scene({});
sceneA.background = new THREE.Color(colorLight);
sceneB.background = new THREE.Color(colorLight);


// SCENE BACKGROUND

const loader = new THREE.TextureLoader();
const texture = loader.load(
    './images/back.webp',
    () => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        sceneA.background = texture;
    });


// GEOMETRIES 

const geometry = new THREE.BoxGeometry(1, 1, 1);

// MATERIAL

const material = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

// MESH

let cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0)

// RENDERER

const rendererA = new THREE.WebGLRenderer({
    canvas: canvasA,
    antialias: true
});
rendererA.setSize(width, height);
rendererA.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const rendererB = new THREE.WebGLRenderer({
    canvas: canvasB,
    antialias: true
});
rendererB.setSize(width, height);
// rendererB.setViewport(width, 0, width * 2, height);
rendererB.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controlsA = new OrbitControls(cameraA, canvasA);
controlsA.enableDamping = true;
controlsA.enableZoom = true;
controlsA.enablePan = false;
controlsA.target.set(0, 0, 0);
controlsA.update();

const controlsB = new OrbitControls(cameraA, canvasB);
controlsB.enableDamping = true;
controlsB.enableZoom = true;
controlsB.enablePan = false;
controlsB.target.set(0, 0, 0);
controlsB.update();


// STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// ADD TO SCENE
sceneA.add(cameraA);

sceneB.add(ambientLight, dirLight, dirLight2);
sceneB.add(cube);


// ANIMATION LOOP
const clock = new THREE.Clock();
const animation = () => {

    stats.begin();

    controlsA.update();
    rendererA.render(sceneA, cameraA);

    controlsB.update();
    rendererB.render(sceneB, cameraB);

    stats.end();

    rendererA.setAnimationLoop(animation);
    rendererB.setAnimationLoop(animation);
}

animation();