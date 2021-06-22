class SkyBox {
    constructor(cubemap) {
        this.texture = twgl.createTexture(gl, {
            target: gl.TEXTURE_CUBE_MAP,
            src: cubemap,
            min: gl.LINEAR_MIPMAP_LINEAR,
            });
        this.skyboxProgramInfo = twgl.createProgramInfo(
            gl, [skyboxVertexShaderSource, skyboxFragmentShaderSource]);
        this.quadBufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);
        this.quadVAO = twgl.createVAOFromBufferInfo(gl, this.skyboxProgramInfo, this.quadBufferInfo);
        this.cameraMatrix = null;
        this.projectionMatrix = null;
    };
}

function loadSkyBox(cubemap) {
    return new SkyBox(cubemap);
}

function skyBox(sb) {
    // var our quad pass the depth test at 1.0
    gl.depthFunc(gl.LEQUAL);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(sb.cameraMatrix);

    // We only care about direction so remove the translation
    var viewDirectionMatrix = m4.copy(viewMatrix);
    viewDirectionMatrix[12] = 0;
    viewDirectionMatrix[13] = 0;
    viewDirectionMatrix[14] = 0;

    var viewDirectionProjectionMatrix = m4.multiply(
        sb.projectionMatrix, viewDirectionMatrix);
    var viewDirectionProjectionInverseMatrix =
        m4.inverse(viewDirectionProjectionMatrix);
    gl.useProgram(sb.skyboxProgramInfo.program);
    gl.bindVertexArray(sb.quadVAO);
    twgl.setUniforms(sb.skyboxProgramInfo, {
      u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
      u_skybox: sb.texture,
    });
    twgl.drawBufferInfo(gl, sb.quadBufferInfo);
}