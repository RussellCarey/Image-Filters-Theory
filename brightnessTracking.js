var video;
var threshold = 200;
var thresholdSlider;

function setup() {
    createCanvas(540, 480);
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.hide();
    noStroke();

    thresholdSlider = createSlider(0, 255, 200);
    thresholdSlider.position(20, 20)
}

function draw() {
    background(0);
    image(video, 0 , 0);

    video.loadPixels();

    var brightest = 0;
    var sumX = 0;
    var sumY = 0;
    var avgX = 0;
    var avgY = 0;
    var posCount = 0;

    threshold = thresholdSlider.value();

    for(var x = 0; x < video.width; x++) {
        for(var y=0; y <video.height; y++) {
            var index = (x + (y * video.width)) * 4;

            var r = video.pixels[index + 0]
            var g = video.pixels[index + 1]
            var b = video.pixels[index + 2]

            bright = (r + b + g) / 3;

            if(bright > threshold) {
                brightest = bright;
                sumX += x;
                sumY += y;
                posCount ++;
            }
        }
    }

    if(posCount > 0) {
        avgX = sumX / posCount;
        avgY = sumY / posCount;
    }

    fill(200, 0, 0);
    strokeWeight(4);
    stroke(0);
    ellipse(avgX, avgY, 16, 16);
}