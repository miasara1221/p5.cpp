let canvas;
let gl;
let timeElement;

let skybox;
let obj;

async function preload() {
    timeElement = document.querySelector("#time");

    twgl.setAttributePrefix("a_");

    let cubemapHref = [
        'assets\\skybox\\right.jpg',  
        'assets\\skybox\\left.jpg',  
        'assets\\skybox\\top.jpg',  
        'assets\\skybox\\bottom.jpg',
        'assets\\skybox\\front.jpg',  
        'assets\\skybox\\back.jpg'
    ];
    skybox = loadSkyBox(cubemapHref);

    // let objHref = 'assets\\teapot.obj';
    let objHref = 'assets\\bunny.obj';
    // let objHref = 'assets\\suzanne.obj';
    // let objHref = 'https://webgl2fundamentals.org/webgl/resources/models/windmill/windmill.obj';  
    // let objHref = 'assets\\skull\\12140_Skull_v3_L2.obj';  
    // let objHref = 'assets\\B2\\B-2_high.obj';
    obj = await loadModel(objHref);
}
