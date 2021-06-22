async function preload() { }
async function setup() { }

function createCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}
  
function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
  
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                        canvas.height !== displayHeight;
  
    if (needResize) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
  
    return needResize;
}

function init(width, height) {
    canvas = document.querySelector("#canvas");
    canvas.width = width;
    canvas.height = height;

    gl = canvas.getContext("webgl2");
    if (!gl) {
        return false;
    }

    return resizeCanvasToDisplaySize(gl.canvas);
}
