var imgIn;

var matrixX = [
    [-1. -2. -1],
    [0, 0, 0],
    [1, 2, 1],
]

var matrixY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
]

function preload() {
    imgIn = loadImage("assets/photo.png")
}

function setup() {
    background(255)
    createCanvas(imgIn.width * 2 + 20, imgIn.height);
    pixelDensity(1);
}

function draw() {
    imgIn.filter(GRAY);
    image(imgIn, 0, 0);
    image(blurFilter(imgIn), imgIn.width + 20, 1);
    noLoop();
}

function blurFilter(img) {
    var imgOut = createImage(img.width, img.height);
    // Matrix size
    var matrixSize = matrixX.length;

    imgOut.loadPixels();
    img.loadPixels();

    for(var x=0; x<img.width; x++) {
        for(var y=0; y<img.height; y++) {
            var index = (y*img.width + x) * 4;

            // Two calls for X and Y direction.
            var cX =  convolution(x, y, matrixX, matrixSize, imgIn);
            var cY =  convolution(x, y, matrixY, matrixSize, imgIn);

            // 1 + 2 + 1 * 255 = 1020 // Max val of the con function
            cX = map(abs(cX[0]), 0, 1020, 0, 255);
            cY = map(abs(cX[0]), 0, 1020, 0, 255);

            var combine = cX + cY;

            imgOut.pixels[index + 0] = combine;
            imgOut.pixels[index + 1] = combine;
            imgOut.pixels[index + 2] = combine;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

// We return an array (3) for rgb.
function convolution(x, y, matrix, matrixSize, img) {

    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;

    var offset = floor(matrixSize / 2);

    // Loop over the litte window - loops over all the pixels.
    // Offset cetners mask around the point.
    for(var i = 0; i < matrixSize; i++) {
        for(var j = 0; j < matrixSize; j++) {
            var xLoc = x + i - offset;
            var yLoc = y + j - offset;

            var index = (img.width * yLoc + xLoc) * 4;
            
            // Check it is actually inside the pixels.
            index = constrain(index, 0, img.pixels.length - 1);

            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }

    return [totalRed, totalGreen, totalBlue];
}