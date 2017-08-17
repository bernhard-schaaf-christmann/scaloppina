window.onload=main;

var IMU = {
  absolute: NaN,
  alpha: NaN,
  beta: NaN,
  gamma: NaN,
  acceleration: {x: NaN, y:NaN, z:NaN},
  accelerationIncludingGravity: {x: NaN, y:NaN, z:NaN},
  interval: NaN,
  rotationRate: NaN,
  motion_event: null,
  orientation_event: null,
  abs_accel: NaN,
  gps: {watchID: null, position: {}, error: false}
}

function calc() {
  var ddx = IMU.accelerationIncludingGravity.x;
  var ddy = IMU.accelerationIncludingGravity.y;
  var ddz = IMU.accelerationIncludingGravity.z;
  IMU.abs_accel = Math.sqrt(ddx*ddx+ddy*ddy+ddz*ddz);
}

function render() {
  var elem = document.getElementById("aText");
  var s = "";
  s += "absolute: "+IMU.absolute+"<br />";
  s += "alpha: "+IMU.alpha+"<br />";
  s += "beta: "+IMU.beta+"<br />";
  s += "gamma: "+IMU.gamma+"<br />";
  s += "acceleration.x: "+IMU.acceleration.x+"<br />";
  s += "acceleration.y: "+IMU.acceleration.y+"<br />";
  s += "acceleration.z: "+IMU.acceleration.z+"<br />";
  s += "accelerationRaw.x: "+IMU.accelerationIncludingGravity.x+"<br />";
  s += "accelerationRaw.y: "+IMU.accelerationIncludingGravity.y+"<br />";
  s += "accelerationRaw.z: "+IMU.accelerationIncludingGravity.z+"<br />";
  s += "abs_accel: "+IMU.abs_accel+"<br />";
  s += "interval: "+IMU.interval+"<br />";
  s += "rotationRate.alpha: "+IMU.rotationRate.alpha+"<br />";
  s += "rotationRate.beta: "+IMU.rotationRate.beta+"<br />";
  s += "rotationRate.gamma: "+IMU.rotationRate.gamma+"<br />";
  s += "gps.position.longitude (WE): "+IMU.gps.position.longitude+"<br />";
  s += "gps.position.latitude (NS): "+IMU.gps.position.latitude+"<br />";
  s += "gps.position.altitude (m): "+IMU.gps.position.altitude+"<br />";
  s += "gps.error: "+IMU.gps.error+"<br />";

  elem.innerHTML = s;
}

function prepareListeners() {
	window.addEventListener("deviceorientation", handleOrientation, true);
	window.addEventListener('devicemotion',  handleMotion, true);
	IMU.gps.watchID = navigator.geolocation.watchPosition(handleGPSsuccess);
}

function handleOrientation(event) {
  IMU.absolute = event.absolute;
  IMU.alpha    = event.alpha;
  IMU.beta     = event.beta;
  IMU.gamma    = event.gamma;

  render();
}

function handleMotion(event) {
  IMU.acceleration = event.acceleration;
  IMU.accelerationIncludingGravity = event.accelerationIncludingGravity;
  IMU.interval = event.interval;
  IMU.rotationRate = event.rotationRate;

  calc();

  render();
}

function handleGPSsuccess(position) {
  IMU.gps.error = false;
  IMU.gps.position.latitude  = position.coords.latitude;
  IMU.gps.position.longitude = position.coords.longitude;
  IMU.gps.position.altitude = position.coords.altitude;
  render();
}

function handleGPSerror() {
  IMU.gps.error = true;
  render();
}

function main() {
	render("Ein Test.");
	prepareListeners();
}

