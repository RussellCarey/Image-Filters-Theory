var imgIn;

// Sum up to one for brightness..
var matrix = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1],
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
    image(imgIn, 0, 0);
    image(sharpFilter(imgIn), imgIn.width + 20, 1);
    noLoop();
}

function sharpFilter(img) {
    var imgOut = createImage(img.width, img.height);
    // Matrix size
    var matrixSize = matrix.length;

    imgOut.loadPixels();
    img.loadPixels();

    for(var x=0; x<img.width; x++) {
        for(var y=0; y<img.height; y++) {
            //
            var index = (y*img.width + x) * 4;

            // Convolution function
            var con = convolution(x, y, matrix, matrixSize, imgIn);

            imgOut.pixels[index + 0] = con[0];
            imgOut.pixels[index + 1] = con[1];
            imgOut.pixels[index + 2] = con[2];
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