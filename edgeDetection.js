let imgIn;

const matrixX = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
]

const matrixY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
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
    image(edgeDetectionFilter(imgIn), imgIn.width + 20, 1);
    noLoop();
}

function edgeDetectionFilter(img) {
    const imgOut = createImage(img.width, img.height);
    const matrixSize = matrixX.length;

    imgOut.loadPixels();
    img.loadPixels();

    for(var x=0; x<img.width; x++) {
        for(var y=0; y<img.height; y++) {
            var index = (y*img.width + x) * 4;

            // Two calls for X and Y direction.
            let cX =  convolution(x, y, matrixX, matrixSize, img);
            let cY =  convolution(x, y, matrixY, matrixSize, img);

            // 1 + 2 + 1 * 255 = 1020 // Max val of the con function
            cX = map(abs(cX[0]), 0, 1020, 0, 255);
            cY = map(abs(cY[0]), 0, 1020, 0, 255);

            const combine = cX + cY;

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

    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;

    const offset = floor(matrixSize / 2);

    // Loop over the litte window - loops over all the pixels.
    // Offset cetners mask around the point.
    for(var i = 0; i < matrixSize; i++) {
        for(var j = 0; j < matrixSize; j++) {
            const xLoc = x + i - offset;
            const yLoc = y + j - offset;

            let index = (img.width * yLoc + xLoc) * 4;
            
            // Check it is actually inside the pixels.
            index = constrain(index, 0, img.pixels.length - 1);

            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }

    return [totalRed, totalGreen, totalBlue];
}