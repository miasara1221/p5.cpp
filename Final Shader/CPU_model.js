let meshProgramInfo;
let parts;

async function loadModel(objHref) {
    meshProgramInfo = twgl.createProgramInfo(gl, [vs, fs]);

    let response = await fetch(objHref);
    let text = await response.text();
    obj2 = parseOBJ(text);
    let baseHref = new URL(objHref, window.location.href);
    let matTexts = await Promise.all(obj2.materialLibs.map(async filename => {
    let matHref = new URL(filename, baseHref).href;
    let response = await fetch(matHref);
    return await response.text();
    }));
    let materials = parseMTL(matTexts.join('\n'));
    let textures = {
    defaultWhite: twgl.createTexture(gl, {src: [255, 255, 255, 255]}),
    defaultNormal: twgl.createTexture(gl, {src: [127, 127, 255, 0]}),
    };
    for (let material of Object.values(materials)) {
    Object.entries(material)
        .filter(([key]) => key.endsWith('Map'))
        .forEach(([key, filename]) => {
        let texture = textures[filename];
        if (!texture) {
            let textureHref = new URL(filename, baseHref).href;
            texture = twgl.createTexture(gl, {src: textureHref, flipY: true});
            textures[filename] = texture;
        }
        material[key] = texture;
        });
    }
    Object.values(materials).forEach(m => {
    m.shininess = 25;
    m.specular = [3, 2, 1];
    });
    let defaultMaterial = {
    diffuse: [1, 1, 1],
    diffuseMap: textures.defaultWhite,
    normalMap: textures.defaultNormal,
    ambient: [0, 0, 0],
    specular: [1, 1, 1],
    specularMap: textures.defaultWhite,
    shininess: 400,
    opacity: 1,
    };
    parts = obj2.geometries.map(({material, data}) => {
        if (data.color) {
            if (data.position.length === data.color.length) {
            data.color = { numComponents: 3, data: data.color };
            }
        } else {
            data.color = { value: [1, 1, 1, 1] };
        }
        if (data.texcoord && data.normal) {
            data.tangent = generateTangents(data.position, data.texcoord);
        } else {
            data.tangent = { value: [1, 0, 0] };
        }
        if (!data.texcoord) {
            data.texcoord = { value: [0, 0] };
        }
        if (!data.normal) {
            data.normal = { value: [0, 0, 1] };
        }
        let bufferInfo = twgl.createBufferInfoFromArrays(gl, data);
        let vao = twgl.createVAOFromBufferInfo(gl, meshProgramInfo, bufferInfo);
        return {
            material: {
            ...defaultMaterial,
            ...materials[material],
            },
            bufferInfo,
            vao,
        };
    });

    return obj2;
}

function getExtents(positions) {
    let min = positions.slice(0, 3);
    let max = positions.slice(0, 3);
    for (let i = 3; i < positions.length; i += 3) {
        for (let j = 0; j < 3; ++j) {
        let v = positions[i + j];
        min[j] = Math.min(v, min[j]);
        max[j] = Math.max(v, max[j]);
        }
    }
    return {min, max};
}
  
function getGeometriesExtents(geometries) {
    return geometries.reduce(({min, max}, {data}) => {
        let minMax = getExtents(data.position);
        return {
        min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
        max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
        };
    }, {
        min: Array(3).fill(Number.POSITIVE_INFINITY),
        max: Array(3).fill(Number.NEGATIVE_INFINITY),
    });
}
  
function model(obj) {
    let extents = getGeometriesExtents(obj.geometries);
    let range = m4.subtractVectors(extents.max, extents.min);
    // amount to move the object so its center is at the origin
    let objOffset = m4.scaleVector(
        m4.addVectors(
        extents.min,
        m4.scaleVector(range, 0.5)),
        -1);
    
    // draw the bunny
    gl.depthFunc(gl.LESS);  // use the default depth test

    // compute the world matrix once since all parts
    // are at the same space.
    // let u_world = m4.xRotation(degToRad(-90));//skull
    let u_world = m4.yRotation(degToRad(0));//bunny
    u_world = m4.translate(u_world, ...objOffset);

    for (let {bufferInfo, vao, material} of parts) {
    // set the attributes for this part.
    gl.bindVertexArray(vao);
    // calls gl.uniform
    twgl.setUniforms(meshProgramInfo, {
        u_world,
    }, material);
    // calls gl.drawArrays or gl.drawElements
    twgl.drawBufferInfo(gl, bufferInfo);
    }
}