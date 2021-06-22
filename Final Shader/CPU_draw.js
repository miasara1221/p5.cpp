let then = 0;

let timeFactor = 1;
let sign = -1;

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function draw(time) {
  let zNear;
  let zFar;
  let cameraPosition;
  let cameraTarget = [0, 0, 0];
  let radius;
  let up = [0, 1, 0];

  time *= 0.001;  // convert to seconds
  let now = time;
  let deltaTime = now - then;
  then = now;

  if (timeFactor > 1) {
    sign = -1;
  }
  if (timeFactor < -1) {
    sign = +1;
  }
  timeFactor += sign * deltaTime * 0.05;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0, 0, 0, 1);

  let extents = getGeometriesExtents(obj.geometries);
  let range = m4.subtractVectors(extents.max, extents.min);

  radius = m4.length(range) * 0.5;
  cameraPosition = m4.addVectors(cameraTarget, [
  0,
  1,
  radius,
  ]);

  zNear = radius / 100;
  zFar = radius * 3;

  let fieldOfViewRadians = degToRad(60);
  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  let projection = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  let camera = m4.lookAt(cameraPosition, cameraTarget, up);

  let view = m4.inverse(camera);

  // camera going in circle 2 units from origin looking at origin
  // let cameraPosition = [Math.cos(time * .1) * 2, 0, Math.sin(time * .1) * 2];
  // cameraPosition = [Math.cos(time * .1) * 40, 0, Math.sin(time * .1) * 40];//skull
  cameraPosition = [Math.cos(time * .1) * 3, 0, Math.sin(time * .1) * 3];//bunny
  // cameraPosition = [Math.cos(time * .1) * 3, 0.5, Math.sin(time * .1) * 3];//B2

  // draw the obj
  gl.useProgram(meshProgramInfo.program);
  let sharedUniforms = {
    u_lightDirection: m4.normalize([-1, 3, -5]),//B-2
    u_view: view,
    u_projection: projection,
    u_viewWorldPosition: cameraPosition,

    u_texture: skybox.texture,
    u_time: timeFactor,
  };
  twgl.setUniforms(meshProgramInfo, sharedUniforms); // calls gl.uniform
  model(obj);

  // draw the skybox
  skybox.projectionMatrix = projection;
  skybox.cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up);
  skyBox(skybox);

  // update FPS
  let fps = 1 / deltaTime;
  timeElement.textContent = fps.toFixed(0);

  requestAnimationFrame(draw);
}
