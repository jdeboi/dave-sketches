let imgs = [];
let currentImgIndex = 1;
let tempImg;
let pgraphics;
let frameGraphics;
let timer1 = { lastUpdate: 0, dt: 200 };
let timer2 = { lastUpdate: 0, dt: 200 };
let frames = [];

const frameLocs = [
  [100, 100, 100, 200],
  [200, 200, 200, 400],
  [300, 500, 500, 200],
  [700, 250, 300, 600],
];

function preload() {
  for (let i = 0; i < 4; i++) {
    imgs[i] = loadImage(`images/office_${i}.jpeg`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pgraphics = createGraphics(windowWidth, windowHeight);

  // resize images
  let factor = 0.3;
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].resize(imgs[i].width * factor, imgs[i].height * factor);
  }

  // paintbrush
  tempImg = createImage(imgs[0].width, imgs[0].height);
  image(imgs[0], 0, 0);

  frameGraphics = createGraphics(windowWidth, windowHeight);
  frameGraphics.clear();
}

function draw() {
  randomRects();
  // paintBrush();

  displayFrameRate();
}

function randomRects() {
  timer1.dt = 100;
  timer2.dt = 2000;
  background(255);
  image(imgs[0], 0, 0);
  if (getTimerUpdate(timer1)) {
    newRandomFrame();
  }
  if (getTimerUpdate(timer2)) {
    nextImage();
  }
  image(frameGraphics, 0, 0);

  if (frames && frames.length > 0) frames[frames.length - 1].displayFrame(100);
}

function paintBrush() {
  timer1.dt = 10;
  if (getTimerUpdate(timer1)) {
    if (pgraphics && tempImg) {
      drawMask();
      setCurrentImgCopy();
      tempImg.mask(pgraphics);
    }
  }
  image(tempImg, 0, 0);
}

function getTimerUpdate(timer) {
  if (millis() - timer.lastUpdate > timer.dt) {
    timer.lastUpdate = millis();
    return true;
  }
  return false;
}

function newDefinedFrame() {
  // let frame = new RFrame(x, y, w, h, currentImgIndex);
}

function newRandomFrame() {
  // nextImage();
  let w = random(100, 500);
  let h = random(50, 500);
  // let w = map(noise(5, millis() / 1000), 0, 1, 100, 500);
  // let h = map(noise(1, millis() / 1000 + 300), 0, 1, 50, 500);

  let x = constrain(mouseX - w / 2, 0, windowWidth - w);
  let y = constrain(mouseY - h / 2, 0, windowHeight - h);
  let frame = new RFrame(x, y, w, h, currentImgIndex);

  frames.push(frame);

  frameGraphics.erase(50);
  frameGraphics.rect(0, 0, windowWidth, windowHeight);
  frameGraphics.noErase();

  frame.displayImg(frameGraphics);
  // frame.displayFrame(frameGraphics);
}

function mouseMovedOG(timer) {
  if (millis() - timer.lastUpdate > 200) {
    for (const frame of frames) {
      if (frame.isOver()) {
        lastUpdate = millis();
        frames.push();
      }
    }
  }
}

function drawMask() {
  if (pgraphics) {
    pgraphics.clear();
    pgraphics.fill("white");
    pgraphics.ellipse(mouseX, mouseY, 100);
  }
}

function drawSemiMask(alphaVal) {
  if (pgraphics) {
    pgraphics.clear();
    pgraphics.background(0, alphaVal);
  }
}
function keyPressed() {
  if (key == "a") {
    nextImage();
  }
}

function nextImage() {
  currentImgIndex++;
  if (currentImgIndex >= imgs.length) {
    currentImgIndex = 1;
  }
}
function getCurrentImg() {
  return imgs[currentImgIndex];
}

function setCurrentImgCopy() {
  const currentImg = imgs[currentImgIndex];

  // tempImg.loadPixels();
  tempImg.copy(
    currentImg,
    0,
    0,
    currentImg.width,
    currentImg.height,
    0,
    0,
    currentImg.width,
    currentImg.height
  );
  // tempImg.updatePixels();
}

class RFrame {
  constructor(x, y, w, h, imgIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.imgIndex = imgIndex;
    this.count = 0;
  }

  displayMask(alpha, pg) {
    pg.fill(alpha);
    pg.rect(this.x, this.y, this.w, this.h);
  }

  displayFrame(alphaV = 0, offsetX = 0, offsetY = 0) {
    noFill();
    strokeWeight(2);
    stroke(alphaV);
    rect(this.x + offsetX, this.y + offsetY, this.w, this.h);
  }

  // displayFrame(pg, offsetX = 0, offsetY = 0) {
  //   pg.noFill();
  //   pg.strokeWeight(2);
  //   pg.stroke(0);
  //   pg.rect(this.x + offsetX, this.y + offsetY, this.w, this.h);
  // }

  displayImg(pg, offsetX = 0, offsetY = 0) {
    const img = imgs[this.imgIndex];
    pg.image(
      img,
      this.x + offsetX,
      this.y + offsetY,
      this.w,
      this.h,
      this.x + offsetX,
      this.y + offsetY,
      this.w,
      this.h
    ); // Copy a portion of the image
  }

  isOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  incrementCount() {
    count++;
    if (count > 3) count = 3;
  }

  displayCount(pg) {
    let offset = 20;
    for (let i = 0; this.count; i++) {
      this.displayImg(pg, offset * i, offset * i);
    }
  }
}

function displayFrameRate() {
  fill(0);
  text(round(frameRate()), 20, 20);
}
