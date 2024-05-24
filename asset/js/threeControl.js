// 로드기준 main.js폴더기준
import * as THREE from './node_modules/three/build/three.module.js'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

import {RenderPass} from './node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {EffectComposer} from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import {UnrealBloomPass} from './node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {OutputPass} from './node_modules/three/examples/jsm/postprocessing/OutputPass.js'
import {ShaderPass} from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js'

import getStarfield from './starField.js'

import {debugFnc,globeSpeed,zoomCheck,disVal,bloomVal} from './debug.js'
debugFnc()
// --------------------------------기본 설정--------------------------------

// 씬
const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.set(0,0,10);


// 렌더러
const renderer = new THREE.WebGLRenderer({antialias:true});
// renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 카메라 컨트롤
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = zoomCheck;
controls.update();




// 조명
const light = new THREE.DirectionalLight(0xffffff,1);
// const light = new THREE.AmbientLight(0xffffff,1);

light.position.set(-2, 0.5, 1.2);
scene.add(light);


// --------------------------------후처리--------------------------------
const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer);
composer.addPass(renderScene)

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);



const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), //해상도
    1.0,  //효과의 강도
    1.2,  //블룸의 범위
    0.1,  //??? b
);

composer.addPass(bloomPass)
    
bloomComposer.renderToScreen = false;



// --------------------------------텍스쳐--------------------------------

// 텍스쳐로드(로드지점 html기준)
const earthMap = new THREE.TextureLoader().load('./asset/img/earth.jpg') //지구 텍스쳐
const bumpMap = new THREE.TextureLoader().load('./asset/img/earthbump.jpg') //범프맵 텍스쳐
const normalMap = new THREE.TextureLoader().load('./asset/img/earth_normal.jpg') //노말맵 텍스쳐
const displacementMap = new THREE.TextureLoader().load('./asset/img/earth_displacement.jpg') //디스플레이스먼트 텍스쳐
const cloudMap = new THREE.TextureLoader().load('./asset/img/earthcloudmap.jpg') //구름 텍스쳐
const LightEarthMap = new THREE.TextureLoader().load('./asset/img/light-earth-map.jpg') //지구 야경 텍스쳐
const textureGrass = new THREE.TextureLoader().load('./asset/img/earth-green-texture.png') //지구 녹화 텍스쳐
const spaceBackground = new THREE.TextureLoader().load('./asset/img/background-space.jpg') //배경 우주 텍스쳐

// 텍스쳐 변수 배열 선언
let textureArry = [
    earthMap,
    bumpMap,
    normalMap,
    displacementMap,
    cloudMap,
    LightEarthMap,
    textureGrass,
    spaceBackground,
]

// 텍스쳐 SRGBColorSpace 자동 적용
let i = 0;
for(i = 0; i < textureArry.length; i++){
    textureArry[i].colorSpace = THREE.SRGBColorSpace;
}


// --------------------------------3d오브젝트--------------------------------

// 배경이미지

const stars = getStarfield()
scene.add(stars)
// spaceBackground.mapping = THREE.EquirectangularReflectionMapping;
// scene.background = spaceBackground

// 그룹화
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.5 * Math.PI / 180; //지구본 기울기



// 도나쓰
const donutGeometry = new THREE.TorusGeometry(
    5.78,   //반경
    0.012, //두께
    2,  //가로디테일
    100  //세로디테일
);
const donutMaterial = new THREE.MeshBasicMaterial({
    color:0x0000ff,
    transparent:true,
    opacity:0.4,
})
let donutRed = 30;
let donutGreen = 25;
let donutBlue = 30;
// donutMaterial.color.setRGB(0, 0, 50);
donutMaterial.color.setRGB(donutRed, donutGreen, 0);
const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial)

function  donutCamera(){ // 도나쓰 카메라 방향으로 전환
    let camPos = camera.position
    // console.log("x:"+Math.floor(camPos.x)+" y:"+Math.floor(camPos.y)+" z:"+Math.floor(camPos.z))
    donutMesh.lookAt(camPos.x,camPos.y,camPos.z)
}
scene.add(donutMesh)


// 반응형 사이즈 조절
var mql = window.matchMedia("screen and (max-width: 768px)");
if (mql.matches) {
	camera.position.set(0,0,13);
    donutGeometry.scale(0.94,0.94,1); 
}

// 지구본
const sphereGeometry01 = new THREE.IcosahedronGeometry(5,12);

const sphereMaterial01 = new THREE.MeshStandardMaterial({
    map : earthMap,
    bumpMap : bumpMap,
    normalMap : normalMap,
    displacementMap: displacementMap,
    // displacementScale :0.25,
})
sphereMaterial01.displacementScale = disVal;

sphereMaterial01.normalScale.set(0.5,0.5);
const sphere01 = new THREE.Mesh(sphereGeometry01, sphereMaterial01);
earthGroup.add(sphere01);


// 지구본 표면 녹화
const greenMaterial = new THREE.MeshStandardMaterial({
    map:textureGrass,
    bumpMap : bumpMap,
    normalMap : normalMap,
    transparent:true,
    opacity:0,
})
greenMaterial.normalScale.set(0.5,0.5);
const greenMesh = new THREE.Mesh(sphereGeometry01,greenMaterial);
earthGroup.add(greenMesh);



// 지구본 야경 텍스쳐
const lightMaterial = new THREE.MeshBasicMaterial({
    map:LightEarthMap,
    blending: THREE.AdditiveBlending,
    transparent:true,
    opacity:0.5,
})
const lightMesh = new THREE.Mesh(sphereGeometry01,lightMaterial)
earthGroup.add(lightMesh);



// 지구본 구름
const cloudMaterial = new THREE.MeshStandardMaterial({
    map:cloudMap,
    blending:THREE.AdditiveBlending ,
    transparent:true,
    opacity:0.7,
})
const cloudMesh = new THREE.Mesh(sphereGeometry01, cloudMaterial)
cloudMesh.scale.setScalar(1.009)
earthGroup.add(cloudMesh);


// 그룹 씬 추가
scene.add(earthGroup);


// --------------------------------시각화--------------------------------

// 조명시각화
// const lightHelper = new THREE.DirectionalLightHelper(light,5);
// scene.add(lightHelper);

// 박스 시각화
const object = new THREE.Mesh(sphereGeometry01,sphereMaterial01);
const objectHelper = new THREE.BoxHelper(object,0xffffff);
// scene.add(objectHelper);

// xyz축 시각화
const axesHelper = new THREE.AxesHelper( 50 );
// scene.add( axesHelper );


// --------------------------------최종 렌더링--------------------------------
// 최종렌더링
$(".sc-debug").on('propertychange change paste input', function(){
    controls.enableZoom = zoomCheck;
    bloomPass.strength = bloomVal;
    sphereMaterial01.displacementScale = disVal;
})
function animate(){
    sphere01.rotation.y +=0.0001*globeSpeed;
    lightMesh.rotation.y +=0.0001*globeSpeed;
    cloudMesh.rotation.y +=0.00015*globeSpeed;
    greenMesh.rotation.y +=0.0001*globeSpeed;

    donutCamera()//도나쓰 오브젝트의 방향

    requestAnimationFrame(animate);
    // renderer.render(scene,camera);
    composer.render();
}
animate();


// 반응형처리
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // temp
    bloomComposer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onWindowResize);



export {greenMaterial,donutMaterial,donutRed,donutGreen,donutBlue}