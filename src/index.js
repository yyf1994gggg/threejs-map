import * as THREE from 'three';
import { MapControls } from "three/examples/jsm/controls/OrbitControls.js";
import guangdong_geojson from './assets/geojson/gd.geojson';
import guangzhou_geojson from './assets/geojson/guangzhou.geojson';
import GeoHelper from './bin/geo-helper';
import { createLineMesh } from './bin/Model';


let GuangdongHelper = new GeoHelper(guangdong_geojson);
const mesh = createLineMesh(GuangdongHelper.pixels , 'skyblue');


const DOM = document.getElementById('webgl');

let W = DOM.offsetWidth;
let H = DOM.offsetHeight;


const BG = {};
const MAIN = {};

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(W, H);
//renderer.autoClear = false;
DOM.appendChild(renderer.domElement);

BG.scene = new THREE.Scene();
BG.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10505500 );
BG.camera.position.set(0, 0, 80);
BG.camera.lookAt(BG.scene.position);

MAIN.scene = new THREE.Scene();
MAIN.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10505500);
MAIN.camera.position.set(0, 0, 80000);
MAIN.camera.lookAt(MAIN.scene.position);
MAIN.controls  = new MapControls(MAIN.camera, renderer.domElement);

MAIN.controls.minDistance = 1;
MAIN.controls.zoomSpeed = 1.0;
MAIN.controls.target.set(0, 0, -0);



MAIN.scene.add(new THREE.AxesHelper(200));

 
MAIN.scene.add(mesh);




function render() {
  renderer.render(MAIN.scene, MAIN.camera);
  MAIN.controls.update();

  requestAnimationFrame(() => render());
}
render();



console.log(guangdong_geojson ,guangzhou_geojson );
