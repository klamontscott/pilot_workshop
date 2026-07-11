const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.55;
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.width = 60;
    this.height = 137;

    this.image = spritStandRight
    this.frames = 0
    this.frameDirection = 1
    this.frameTick = 0
    this.sprites = {
      stand: {
        right: spritStandRight,
        left: spritStandLeft,
        frameCount: 48,
        frameDelay: 20,
        width: 70,
        height: 150
      },
      run: {
        right: spritRunRight,
        left: spritRunLeft,
        frameCount: 30,
        frameDelay: 4,
        width: 145,
        height: 140
      }
    }
    this.currentSprite = this.sprites.stand.right
    this.currentFrameCount = 48
    this.currentFrameDelay = 20
    this.currentWidth = this.sprites.stand.width
    this.currentHeight = this.sprites.stand.height
  }
  draw() {
    const frameWidth = this.currentSprite.width / this.currentFrameCount;
    let frameIndex = this.frames;
    if (this.currentSprite === this.sprites.run.left) {
      frameIndex = this.currentFrameCount - 1 - this.frames;
    }
    c.drawImage(
      this.currentSprite,
      frameWidth * frameIndex,
      0,
      frameWidth,
      this.currentSprite.height,
      this.position.x,
      this.position.y,
      this.currentWidth,
      this.currentHeight
    );
  }
  update() {
    this.frameTick++
    if (this.frameTick % this.currentFrameDelay === 0) {
      this.frames++
      if (this.frames >= this.currentFrameCount - 1) {
        this.frames = 0
      }
    }
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    this.draw();

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
  }
}

class Platform {
  constructor({ x, y, image, inverted, floating }) {
    this.position = {
      x,
      y
    };

    this.image = image;
    this.width = image.width * 1.0;
    this.height = image.height * 0.5;
    this.inverted = inverted || false;
    this.floating = floating || false;
  }

  draw() {
    const drawHeight = (this.inverted || this.floating) ? this.height * 2 : canvas.height - this.position.y;
    if (this.inverted) {
      c.save();
      c.filter = 'invert(1)';
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        drawHeight
      );
      c.restore();
    } else {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        drawHeight
      );
    }
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    const scale = 0.25;
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width * scale,
      this.image.height * scale
    );
  }
}

const platformImage = new Image();
const backgroundImage = new Image();
const hillsImage = new Image();
const spritStandRight = new Image();
const spritStandLeft = new Image();
const spritRunRight = new Image();
const spritRunLeft = new Image();
platformImage.src =
  "https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/platform.png";
backgroundImage.src =
  "https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/background2.png";
hillsImage.src =
  "https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/hills2.png";
spritStandRight.src =
 "https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/spritStandRight.png";
spritStandLeft.src = "https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/spritStandLeft.png";
spritRunRight.src =
"https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/spritRunRight3.png";
spritRunLeft.src =
"https://cdn.jsdelivr.net/gh/klamontscott/mariojsgame@main/spritRunLeft3.png";

const confetti = [];
const confettiColors = ["#f48c06", "#e85d04", "#ffd700", "#ff6b6b", "#51cf66", "#339af0", "#fff"];

function spawnConfetti() {
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 - 50,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 3,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      gravity: 0.15 + Math.random() * 0.1,
      alpha: 1
    });
  }
}

function updateAndDrawConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    const p = confetti[i];
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.rotation += p.rotSpeed;
    if (p.y > canvas.height + 20) {
      p.alpha -= 0.02;
    }
    if (p.alpha <= 0) {
      confetti.splice(i, 1);
      continue;
    }
    c.save();
    c.globalAlpha = p.alpha;
    c.translate(p.x, p.y);
    c.rotate(p.rotation);
    c.fillStyle = p.color;
    c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    c.restore();
  }
}

class Flagpole {
  constructor({ x, y }) {
    this.position = { x, y };
    this.poleHeight = 250;
    this.poleWidth = 8;
    this.flagWidth = 70;
    this.flagHeight = 50;
    this.flagWave = 0;
  }

  draw() {
    this.flagWave += 0.05;

    // pole shadow
    c.fillStyle = "rgba(0,0,0,0.2)";
    c.fillRect(this.position.x + 2, this.position.y - this.poleHeight + 2, this.poleWidth, this.poleHeight);

    // pole
    const poleGrad = c.createLinearGradient(this.position.x, 0, this.position.x + this.poleWidth, 0);
    poleGrad.addColorStop(0, "#c0c0c0");
    poleGrad.addColorStop(0.5, "#ffffff");
    poleGrad.addColorStop(1, "#a0a0a0");
    c.fillStyle = poleGrad;
    c.fillRect(this.position.x, this.position.y - this.poleHeight, this.poleWidth, this.poleHeight);

    // ball on top
    c.beginPath();
    c.arc(this.position.x + this.poleWidth / 2, this.position.y - this.poleHeight, 8, 0, Math.PI * 2);
    c.fillStyle = "#ffd700";
    c.fill();
    c.strokeStyle = "#b8960c";
    c.lineWidth = 1.5;
    c.stroke();

    // flag (waving)
    const wave = Math.sin(this.flagWave) * 4;
    const wave2 = Math.sin(this.flagWave + 1) * 3;
    c.beginPath();
    c.moveTo(this.position.x + this.poleWidth, this.position.y - this.poleHeight + 10);
    c.quadraticCurveTo(
      this.position.x + this.poleWidth + this.flagWidth / 2,
      this.position.y - this.poleHeight + 10 + wave,
      this.position.x + this.poleWidth + this.flagWidth,
      this.position.y - this.poleHeight + 15 + wave2
    );
    c.lineTo(this.position.x + this.poleWidth + this.flagWidth, this.position.y - this.poleHeight + 15 + this.flagHeight + wave2);
    c.quadraticCurveTo(
      this.position.x + this.poleWidth + this.flagWidth / 2,
      this.position.y - this.poleHeight + 10 + this.flagHeight + wave,
      this.position.x + this.poleWidth,
      this.position.y - this.poleHeight + 10 + this.flagHeight
    );
    c.closePath();
    const flagGrad = c.createLinearGradient(
      this.position.x + this.poleWidth, this.position.y - this.poleHeight,
      this.position.x + this.poleWidth + this.flagWidth, this.position.y - this.poleHeight + this.flagHeight
    );
    flagGrad.addColorStop(0, "#f48c06");
    flagGrad.addColorStop(1, "#e85d04");
    c.fillStyle = flagGrad;
    c.fill();

    // checkmark on flag
    const checkX = this.position.x + this.poleWidth + this.flagWidth / 2 - 8;
    const checkY = this.position.y - this.poleHeight + 10 + this.flagHeight / 2 + wave * 0.5;
    c.beginPath();
    c.moveTo(checkX - 4, checkY);
    c.lineTo(checkX, checkY + 6);
    c.lineTo(checkX + 10, checkY - 6);
    c.strokeStyle = "white";
    c.lineWidth = 3;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();

    // base
    c.fillStyle = "#555";
    c.fillRect(this.position.x - 8, this.position.y - 6, this.poleWidth + 16, 6);
    c.fillStyle = "#777";
    c.fillRect(this.position.x - 5, this.position.y - 3, this.poleWidth + 10, 3);
  }

  drawStar(cx, cy, spikes, outerR, innerR) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    c.beginPath();
    c.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      c.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      c.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    c.closePath();
    c.fillStyle = "#ffd700";
    c.fill();
  }
}

let player;
let platforms;
let genericObjects;
let flagpole;
let gameOver = false;
let gameWin = false;

function init() {
  player = new Player();
  platforms = [
    new Platform({ x: -1, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width - 1,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width * 2 - 2, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width * 3 + 200,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width * 4, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width * 5,
      y: 435,
      image: platformImage
    }),
    //higher platform
    new Platform({
      x: platformImage.width * 5,
      y: 225,
      image: platformImage,
      floating: true
    }),
    new Platform({
      x: platformImage.width * 6 + 200,
      y: 435,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 7,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width * 8, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 9, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 10, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 11, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 12, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 13, y: 435, image: platformImage }),
    new Platform({ x: platformImage.width * 14, y: 435, image: platformImage }),
  ];
  genericObjects = [
    new GenericObject({ x: 0, y: 123, image: hillsImage }),
    new GenericObject({ x: hillsImage.width * 0.25, y: 123, image: hillsImage })
  ];
  flagpole = new Flagpole({ x: platformImage.width * 14 + 200, y: 435 });
  scrollOffset = 0;
  gameOver = false;
  gameWin = false;
}

const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};
let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  flagpole.draw();
  player.update();

  if (keys.right.pressed && player.position.x < 500) {
    player.velocity.x = 5;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed && scrollOffset < 8002) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 3;
      });
      flagpole.position.x -= 5;
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 3;
      });
      flagpole.position.x += 5;
    }
  }

  // sprite switching
  if (keys.right.pressed && player.currentSprite !== player.sprites.run.right) {
    player.frames = 0;
    player.currentSprite = player.sprites.run.right;
    player.currentFrameCount = player.sprites.run.frameCount;
    player.currentFrameDelay = player.sprites.run.frameDelay;
    player.currentWidth = player.sprites.run.width;
    player.currentHeight = player.sprites.run.height;
  } else if (keys.left.pressed && player.currentSprite !== player.sprites.run.left) {
    player.frames = 0;
    player.currentSprite = player.sprites.run.left;
    player.currentFrameCount = player.sprites.run.frameCount;
    player.currentFrameDelay = player.sprites.run.frameDelay;
    player.currentWidth = player.sprites.run.width;
    player.currentHeight = player.sprites.run.height;
  } else if (!keys.right.pressed && player.currentSprite === player.sprites.run.right) {
    player.frames = 0;
    player.currentSprite = player.sprites.stand.right;
    player.currentFrameCount = player.sprites.stand.frameCount;
    player.currentFrameDelay = player.sprites.stand.frameDelay;
    player.currentWidth = player.sprites.stand.width;
    player.currentHeight = player.sprites.stand.height;
  } else if (!keys.left.pressed && player.currentSprite === player.sprites.run.left) {
    player.frames = 0;
    player.currentSprite = player.sprites.stand.left;
    player.currentFrameCount = player.sprites.stand.frameCount;
    player.currentFrameDelay = player.sprites.stand.frameDelay;
    player.currentWidth = player.sprites.stand.width;
    player.currentHeight = player.sprites.stand.height;
  }

  //platform colision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
  //win condition
  if (scrollOffset > 8000 && !gameWin) {
    gameWin = true;
    spawnConfetti();
    setTimeout(() => {
      confetti.length = 0;
      init();
    }, 3000);
  }

  if (player.position.y > canvas.height && !gameOver) {
    gameOver = true;
    setTimeout(() => {
      init();
    }, 2000);
  }
  if (gameOver) {
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";
    c.font = "bold 80px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("You Lose", canvas.width / 2, canvas.height / 2);
  }
  if (gameWin) {
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";
    c.font = "bold 80px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
    updateAndDrawConfetti();
  }
}

let gameStarted = false;
let assetsLoaded = false;
const allImages = [platformImage, backgroundImage, hillsImage, spritStandRight, spritStandLeft, spritRunRight, spritRunLeft];
let loadedCount = 0;

function drawLoadingScreen() {
  c.fillStyle = "#000";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "white";
  c.font = "bold 30px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  const dots = ".".repeat(Math.floor(Date.now() / 500) % 4);
  c.fillText("Loading" + dots, canvas.width / 2, canvas.height / 2);
  if (!assetsLoaded) requestAnimationFrame(drawLoadingScreen);
}

function drawStartScreen() {
  c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  c.fillStyle = "rgba(0, 0, 0, 0.5)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "white";
  c.font = "bold 60px sans-serif";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("SPACE RUNNER", canvas.width / 2, canvas.height / 2 - 40);
  c.font = "24px sans-serif";
  const blink = Math.floor(Date.now() / 600) % 2;
  if (blink) c.fillText("Press any key to start", canvas.width / 2, canvas.height / 2 + 40);
  if (!gameStarted) requestAnimationFrame(drawStartScreen);
}

allImages.forEach((img) => {
  if (img.complete) {
    loadedCount++;
  } else {
    img.addEventListener("load", () => {
      loadedCount++;
      if (loadedCount === allImages.length) {
        assetsLoaded = true;
        drawStartScreen();
      }
    });
  }
});

if (loadedCount === allImages.length) {
  assetsLoaded = true;
  drawStartScreen();
} else {
  drawLoadingScreen();
}

function startGame() {
  if (!assetsLoaded || gameStarted) return;
  gameStarted = true;
  init();
  animate();
}

addEventListener("keydown", function startListener(e) {
  if (!gameStarted && assetsLoaded) {
    startGame();
  }
});

addEventListener("keydown", ({ keyCode }) => {
  //console.log(keyCode)
  switch (keyCode) {
    case 37:
    case 65:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 40:
    case 83:
      console.log("down");
      break;
    case 39:
    case 68:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 87:
    case 38:
      console.log("up");
      player.velocity.y -= 15;
      break;
  }
});
addEventListener("keyup", ({ keyCode }) => {
  //console.log(keyCode)
  switch (keyCode) {
    case 37:
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 40:
    case 83:
      console.log("down");
      break;
    case 39:
    case 68:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 87:
    case 38:
      console.log("up");

      break;
  }
});
