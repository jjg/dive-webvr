// I think types have to be defined globally?

HMDVRDevice = function(){
	this.hardwareUnitId = 666;
	this.getEyeTranslation = function(eye){
		return 0.01;
	};
	this.getRecommendedEyeFieldOfView = function(eye){
		return 60;
	};
};

PositionSensorVRDevice = function(){
	this.hardwareUnitId = 666;
	this.state = {};
	this.state.orientation = {};
	
	this.getState = function(){
		/*
		var state = {};
		state.orientation = {};
		state.orientation.x = 0;
		state.orientation.y = 0;
		state.orientation.z = -81;
		*/
		this.state.orientation.w = 1;

		return this.state;
	};
};

window.addEventListener("load", function() {

	// simulate native VR support for Durovis Dive
	navigator.mozGetVRDevices = function(vrDeviceCallback){
		
		var Dive_HMD = new HMDVRDevice();
		var Dive_Sensor = new PositionSensorVRDevice();

		// dive orientation events
		/*
		// use device motion instead of orientation
		if(window.DeviceMotionEvent){
			window.addEventListener("devicemotion", deviceMotionHandler, false);
		}
		
		function deviceMotionHandler(deviceEvent){
			Dive_Sensor.state.orientation.x = deviceEvent.rotationRate.alpha;
			Dive_Sensor.state.orientation.y = deviceEvent.rotationRate.beta;
			Dive_Sensor.state.orientation.z = deviceEvent.rotationRate.gamma;
		}
		*/
		
		
		if(window.DeviceOrientationEvent){
			window.addEventListener('deviceorientation', devMotionHandler, false);
			console.log("supported");
			status.innerHTML = "DeviceMotion supported";
		} else {
			console.log("not supported");
			status.innerHTML = "DeviceMotion not supported";
		}
		
		function devMotionHandler(eventData){
		
			// this is super-lazy but just for testing
			Dive_Sensor.state.orientation.x = Math.round(eventData.gamma - (eventData.gamma * 2)) / 100;  // inverted
			Dive_Sensor.state.orientation.y = Math.round(eventData.beta) / 100;		// Y in landscape mode
			Dive_Sensor.state.orientation.z = 0;//Math.round(eventData.alpha) / 100;
			Dive_Sensor.state.orientation.w = 0;//Math.round(eventData.alpha) /100;
			
			//alpha.value = Math.round(eventData.alpha);
			//beta.value = Math.round(eventData.beta);
			//gamma.value = Math.round(eventData.gamma);
		}
		
		var VRDevices = [];
		VRDevices.push(Dive_HMD);
		VRDevices.push(Dive_Sensor);

		vrDeviceCallback(VRDevices);
	};

    //if (navigator.getVRDevices) {
    //    navigator.getVRDevices().then(vrDeviceCallback);
    //} else if (navigator.mozGetVRDevices) {
        navigator.mozGetVRDevices(vrDeviceCallback);
    //}
}, false);

function vrDeviceCallback(vrdevs) {

	// until I understand javascript type bullshit, we're hard-wiring this:
	vrHMD = vrdevs[0];
	vrHMDSensor = vrdevs[1];

/*
    for (var i = 0; i < vrdevs.length; ++i) {

		// debug
		console.log(Object.getPrototypeOf(vrdevs[i]));
		console.log(HMDVRDevice.prototype);

		if(Object.getPrototypeOf(vrdevs[i]) === HMDVRDevice.prototype){
			console.log("yes");
		} else {
			console.log("no");
		}

        if (vrdevs[i] instanceof HMDVRDevice) {

			// debug
			console.log("found HMD");

            vrHMD = vrdevs[i];
            break;
        }
    }
    for (var i = 0; i < vrdevs.length; ++i) {
        if (vrdevs[i] instanceof PositionSensorVRDevice &&
            vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
			
			// debug
			console.log("found sensor");

            vrHMDSensor = vrdevs[i];
            break;
        }
    
}
*/
    initScene();
    initRenderer();
    render();
}

function initScene() {
    camera = new THREE.PerspectiveCamera(60, 1280 / 800, 0.001, 10);
    camera.position.z = 2;
    scene = new THREE.Scene();
    var geometry = new THREE.IcosahedronGeometry(1, 1);
    var material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function initRenderer() {
    renderCanvas = document.getElementById("render-canvas");
    renderer = new THREE.WebGLRenderer({
        canvas: renderCanvas,
    });
    renderer.setClearColor(0x555555);
    renderer.setSize(1280, 800, false);
    vrrenderer = new THREE.VRRenderer(renderer, vrHMD);
    
}
function render() {
	requestAnimationFrame( render );
	
	var state = vrHMDSensor.getState();
	
	// debug
	//info.innerHTML = "x: "  + state.orientation.x + " y: " + state.orientation.y + " z: " + state.orientation.z;
	
	camera.quaternion.set(state.orientation.x,
	                  state.orientation.y,
	                  state.orientation.z,
	                  state.orientation.w);
	
	
	info.innerHTML = "x:" + camera.quaternion.x + " y:" + camera.quaternion.y + " z: " + camera.quaternion.z + " w: " + camera.quaternion.w;
	
	//camera.quaternion.set(.1,0,0,1);
	
	renderer.render( scene, camera );
	//vrrenderer.render(scene, camera);
}
/*
function render() {
	
    requestAnimationFrame(render);
    mesh.rotation.y += 0.01;
    var state = vrHMDSensor.getState();
    
    // debug
    info.innerHTML = "x: "  + state.orientation.x + " y: " + state.orientation.y + " z: " + state.orientation.z;
    
    //console.log(state.orientation.x, state.orientation.y, state.orientation.z);
    
    camera.quaternion.set(state.orientation.x,
                          state.orientation.y,
                          state.orientation.z,
                          state.orientation.w);
    
    //camera.position.z = 5;
    vrrenderer.render(scene, camera);
}
*/
/*
window.addEventListener("keypress", function(e) {
    if (e.charCode == 'f'.charCodeAt(0)) {
        if (renderCanvas.mozRequestFullScreen) {
            renderCanvas.mozRequestFullScreen({
                vrDisplay: vrHMD
            });
        } else if (renderCanvas.webkitRequestFullscreen) {
            renderCanvas.webkitRequestFullscreen({
                vrDisplay: vrHMD,
            });
        }
    }
}, false);
*/
//window.onclick=renderCanvas.webkitRequestFullscreen({
//	vrDisplay: vrHMD,
//});