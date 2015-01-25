var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// this is a floor for the scene
var floor_geometry = new THREE.BoxGeometry(100,1,100);
var floor_material = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true});
var floor = new THREE.Mesh(floor_geometry, floor_material);
floor.position.y = -1;
scene.add(floor);

// this is just a cube to decorate the scene
var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z=5;

// config vr renderer
var vrHMD = {};
vrHMD.getEyeTranslation = function(eye){
	var eye_translation = {x:0,y:0.1,z:0};
	return eye_translation;
};
vrHMD.getRecommendedEyeFieldOfView = function(eye){
	var fov = {upDegrees:30,downDegrees:30,leftDegrees:30,rightDegrees:30};
	return fov;
};
vrrenderer = new THREE.VRRenderer(renderer, vrHMD);

function render(){
  requestAnimationFrame(render);
  //cube.rotation.x += 0.1;
  //cube.rotation.y += 0.1;
  //renderer.render(scene, camera);
  vrrenderer.render(scene, camera);
}
render();

// configure the sensors
var alpha_offset = null;
var beta_offset = null;
var gamma_offset = null;

window.addEventListener('deviceorientation', devOrientationHandler, false);

function devOrientationHandler(eventData){
	
	if(alpha_offset){
		
		// trim out initial position
		var adj_alpha = eventData.alpha + ~alpha_offset+1;
		var adj_beta = eventData.beta + ~beta_offset+1;
		var adj_gamma = eventData.gamma + ~gamma_offset+1;
		
		// convert to radians
		var rad_alpha = (adj_alpha * 3.14) / 180;
		var rad_beta = (adj_beta * 3.14) / 180;
		var rad_gamma = (adj_gamma * 3.14) / 180;
		
		camera.rotation.x = rad_gamma - (rad_gamma * 2); // / 10; // up-down
		camera.rotation.y = rad_alpha;  /// 10;	// left-right
		//alpha.value = eventData.alpha; // x (yaw)
		//beta.value = eventData.beta; // roll (z?)
		//gamma.value = eventData.gamma; // y (pitch)
	} else {
		// zero-out the initial positions
		alpha_offset = eventData.alpha;
		beta_offset = eventData.beta;
		gamma_offset = eventData.gamma;
	}
}
