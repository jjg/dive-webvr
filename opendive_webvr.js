HMDVRDevice = function(){
	this.hardwareUnitId = 666;
	this.getEyeTranslation = function(eye){
		var eye_translation = {x:0,y:0.1,z:0};
		return eye_translation;
	};
	this.getRecommendedEyeFieldOfView = function(eye){
		var fov = {upDegrees:30,downDegrees:30,leftDegrees:30,rightDegrees:30};
		return fov;
	};
};

PositionSensorVRDevice = function(){
	
	this.hardwareUnitId = 666;
	this.state = {};
	this.state.orientation = {};
	this.state.orientation.x = 0;
	this.state.orientation.y = 0;
	this.state.orientation.z = 0;
	this.state.orientation.w = 0;
	
	// configure the sensors
	var alpha_offset = null;
	var beta_offset = null;
	var gamma_offset = null;
	
	// start listening for orientation events
	window.addEventListener('deviceorientation', devOrientationHandler, false);
	
	var self = this;
	
	// update orientation state
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
			
			self.state.orientation.x = rad_gamma - (rad_gamma * 2);
			self.state.orientation.y = rad_alpha;
			self.state.orientation.z = 0;	// todo: read this from the sensor (hard-coded for now)
			self.state.orientation.w = 1;	// todo: read this from the sensor (hard-coded for now)
			
		} else {
			
			// zero-out the initial positions
			alpha_offset = eventData.alpha;
			beta_offset = eventData.beta;
			gamma_offset = eventData.gamma;
		}
	}
	
	this.getState = function(){
		return this.state;
	};
};

// simulate native VR support for OpenDive
navigator.mozGetVRDevices = function(vrDeviceCallback){
	
	var Dive_HMD = new HMDVRDevice();
	var Dive_Sensor = new PositionSensorVRDevice();
	var VRDevices = [];
	VRDevices.push(Dive_HMD);
	VRDevices.push(Dive_Sensor);

	vrDeviceCallback(VRDevices);
};