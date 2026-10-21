const BACKGROUND = "#262626"

game.width = 800
game.height = 800
const ctx = game.getContext('2d')

const maxIterationsMoving = 100, maxIterationsStill = 500
let maxIterations = maxIterationsStill
let LRe = -2, RRe = 1
let LIm = -1.5, RIm = 1.5

const imgData = ctx.createImageData(game.width, game.height);
const data = imgData.data;

function draw() {
    for (let i = 0; i < game.width; i++) {
        for (let j = 0; j < game.height; j++) {
            const pos = ((game.height - 1 - j) * game.width + i) * 4
            const cRe = LRe + (i / game.width) * (RRe - LRe), cIm = LIm + (j / game.height) * (RIm - LIm)

            let t = 0
            let a = 0, b = 0;
            for (; t < maxIterations; t++) {
                const aNew = a*a - b*b + cRe
                const bNew = 2*a*b + cIm
                a = aNew
                b = bNew
                if (a*a + b*b > 4)
                    break
            }

            let col = Math.floor((t / maxIterations) * 255);
            data[pos] = data[pos + 1] = data[pos + 2] = col
            data[pos + 3] = 255
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

const keysDown = new Set();

document.addEventListener('keydown', (event) => {
  keysDown.add(event.key.toLowerCase());
});

document.addEventListener('keyup', (event) => {
  keysDown.delete(event.key.toLowerCase());
});

let isMoving = false

function update() {
    const speed = 0.05, zoomSpeed = 0.03;
    const w = RRe - LRe, h = RIm - LIm;

    isMoving = keysDown.size > 0

    if (keysDown.has('arrowup')) { LIm += speed * h; RIm += speed * h; }
    if (keysDown.has('arrowdown')) { LIm -= speed * h; RIm -= speed * h; }
    if (keysDown.has('arrowleft')) { LRe -= speed * w; RRe -= speed * w; }
    if (keysDown.has('arrowright')) { LRe += speed * w; RRe += speed * w; }

    if (keysDown.has('z')) {
        const cRe = (LRe + RRe) / 2, cIm = (LIm + RIm) / 2;
        const newW = w * (1 - zoomSpeed), newH = h * (1 - zoomSpeed);
        LRe = cRe - newW / 2; RRe = cRe + newW / 2;
        LIm = cIm - newH / 2; RIm = cIm + newH / 2;
    }
    if (keysDown.has('x')) {
        const cRe = (LRe + RRe) / 2, cIm = (LIm + RIm) / 2;
        const newW = w * (1 + zoomSpeed), newH = h * (1 + zoomSpeed);
        LRe = cRe - newW / 2; RRe = cRe + newW / 2;
        LIm = cIm - newH / 2; RIm = cIm + newH / 2;
    }
}

const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

let last = 0;
function frame(now) {
    requestAnimationFrame(frame);

    update();

    const elapsed = now - last;
    if (elapsed < frameInterval) return;
    last = now;

    if (isMoving || maxIterations == maxIterationsMoving) {
        maxIterations = isMoving ? maxIterationsMoving : maxIterationsStill
        draw()
    }
}
draw()
requestAnimationFrame(frame);