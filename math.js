class Vector4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
}

class Vector3 extends Vector4 {
    constructor(x, y, z) {
        super(x, y, z, 0);
    }
}

class Matrix4 {
    constructor() {
        this._ = [  [ 0,  0,  0,  0 ],
                    [ 0,  0,  0,  0 ],
                    [ 0,  0,  0,  0 ],
                    [ 0,  0,  0,  0 ]];
    }
    /**
     * @param {any[][]} m
     */
    set _ij(m) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this._[i][j] = m[i][j];
            }
        }
    }
    mult(m) {
        const retMatrix = new Matrix4();
        for (let i = 0; i < 4; i++) {
            const rowVector = new Vector4(this._[i][0], this._[i][1], this._[i][2], this._[i][3]);
            for (let j = 0; j < 4; j++) {
                const columnVector = new Vector4(m._[0][j], m._[1][j], m._[2][j], m._[3][j]);
                retMatrix._[i][j] = rowVector.dot(columnVector);
            }
        }
        return retMatrix;
    }
}









  /*
        if (m.w != undefined) {
            return this.multColumnVector(m);
        }
      multColumnVector(v) {
        const v1 = new Vector4(this._[0][0], this._[0][1], this._[0][2], this._[0][3]);
        const v2 = new Vector4(this._[1][0], this._[1][1], this._[1][2], this._[1][3]);
        const v3 = new Vector4(this._[2][0], this._[2][1], this._[2][2], this._[2][3]);
        const v4 = new Vector4(this._[3][0], this._[3][1], this._[3][2], this._[3][3]);
        return new Vector4(v1.dot(v), v2.dot(v), v3.dot(v), v4.dot(v));
    }

  // the 'varying's are shared between both vertex & fragment shaders
  const varying = '#define GL_VERTEX_AND_FRAGMENT_PRECISION_HIGH ' +
  '#ifdef GL_VERTEX_AND_FRAGMENT_PRECISION_HIGH ' +
    'precision highp float;' +
  '#else ' +
    'precision mediump float;' +
  '#endif ' +
  'varying vec2 vPos;';
  
  // the vertex shader is called for each vertex
  const vs =
    varying +
    'attribute vec3 aPosition;' +
    'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';
  
  // the fragment shader is called for each pixel
  const fs =
    varying +
    'uniform vec2 p;' +
    'uniform float r;' +
    'const int I = 500;' +
    'void main() {' +
    '  vec2 c = p + vPos * r, z = c;' +
    '  float n = 0.0;' +
    '  for (int i = I; i > 0; i --) {' +
    '    if(z.x*z.x+z.y*z.y > 4.0) {' +
    '      n = float(i)/float(I);' +
    '      break;' +
    '    }' +
    '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
    '  }' +
    '  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
    '}';
  */
  
  