//let teapot;
let bunny;
//let suzanne;

function preload() {
  //teapot = loadModel('assets/teapot.obj');
  bunny = loadModel('assets/bunny.obj');
  //suzanne = loadModel('assets/suzanne.obj');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
}

function draw() {
  background(200, 200, 200);

  camera(0, 0, 300, 0, 0, 0, 0, 1, 0);

  ambientLight(50, 50, 50);
  pointLight(255, 255, 255, 200, 200, 200);
  specularColor(255, 255, 255);

  const S = new Matrix4();
  const R = new Matrix4();
  const T = new Matrix4();
  const scale = new Vector3(50, 50, 50);
  const angle = radians(frameCount);
  const pos = new Vector3(2, 0, 0);
  S._ij = [
    [ scale.x,      0,            0,            0 ],
    [ 0,            scale.y,      0,            0 ],
    [ 0,            0,            scale.z,      0 ],
    [ 0,            0,            0,            1 ]
  ];
  R._ij = [
    [ cos(angle),   -sin(angle),  0,            0 ],
    [ sin(angle),   cos(angle),   0,            0 ],
    [ 0,            0,            1,            0 ],
    [ 0,            0,            0,            1 ]
  ];
  T._ij = [
    [ 1,            0,            0,            0 ],
    [ 0,            1,            0,            0 ],
    [ 0,            0,            1,            0 ],
    [ pos.x,        pos.y,        pos.z,        1 ]
  ];
  const TM = T.mult(R.mult(S));

  applyMatrix(TM._[0][0], TM._[0][1], TM._[0][2], TM._[0][3],
              TM._[1][0], TM._[1][1], TM._[1][2], TM._[1][3],
              TM._[2][0], TM._[2][1], TM._[2][2], TM._[2][3],
              TM._[3][0], TM._[3][1], TM._[3][2], TM._[3][3]);
  {
    shininess(20);
    specularMaterial(255, 255, 255);
    //model(teapot);
    model(bunny);
    //model(suzanne);

    shininess(50);
    specularMaterial(255, 0, 0);
    sphere(0.1);
  }
}
