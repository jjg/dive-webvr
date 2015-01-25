var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color:0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z=5;

// config vr renderer
var vrHMD = {};
vrHMD.getEyeTranslation = function(eye){
	var eye_translation = {x:0,y:0,z:0};
	return eye_translation;
};
vrHMD.getRecommendedEyeFieldOfView = function(eye){
	var fov = {upDegrees:30,downDegrees:30,leftDegrees:30,rightDegrees:30};
	return fov;
};
vrrenderer = new THREE.VRRenderer(renderer, vrHMD);

window.addEventListener('deviceorientation', devOrientationHandler, false);

function render(){
  requestAnimationFrame(render);
  //cube.rotation.x += 0.1;
  //cube.rotation.y += 0.1;
  //renderer.render(scene, camera);
  vrrenderer.render(scene, camera);
}
render();

function devOrientationHandler(eventData){

  camera.rotation.x = eventData.gamma / 10;
  camera.rotation.y = eventData.alpha / 10;
  //alpha.value = eventData.alpha; // x (yaw)
  //beta.value = eventData.beta; // roll (z?)
  //gamma.value = eventData.gamma; // y (pitch)
}
