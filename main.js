window.addEventListener("load", function() {

    if (navigator.getVRDevices) {
        navigator.getVRDevices().then(vrDeviceCallback);
    } else if (navigator.mozGetVRDevices) {
        navigator.mozGetVRDevices(vrDeviceCallback);
    }
}, false);

function vrDeviceCallback(vrdevs) {

	for (var i = 0; i < vrdevs.length; ++i) {
		if (vrdevs[i] instanceof HMDVRDevice) {
			vrHMD = vrdevs[i];
			break;
		}
	}
	
	for (var i = 0; i < vrdevs.length; ++i) {
		if (vrdevs[i] instanceof PositionSensorVRDevice &&
		vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
			vrHMDSensor = vrdevs[i];
			break;
		}
	}

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
	
    requestAnimationFrame(render);
    mesh.rotation.y += 0.01;
    var state = vrHMDSensor.getState();
    
    // debug
    info.innerHTML = "x: "  + state.orientation.x + " y: " + state.orientation.y + " z: " + state.orientation.z;
    
    camera.quaternion.set(state.orientation.x,
                          state.orientation.y,
                          state.orientation.z,
                          state.orientation.w);
    
    camera.position.z = 5;
    vrrenderer.render(scene, camera);
}

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