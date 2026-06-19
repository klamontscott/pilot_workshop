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
      this.frames += this.frameDirection
      if (this.frames >= this.currentFrameCount - 1) {
        this.frames = this.currentFrameCount - 1
        this.frameDirection = -1
      } else if (this.frames <= 0) {
        this.frames = 0
        this.frameDirection = 1
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
  constructor({ x, y, image }) {
    this.position = {
      x,
      y
    };

    this.image = image;
    this.width = image.width * 0.5;
    this.height = image.height * 0.5;
  }

  draw() {
    const drawHeight = canvas.height - this.position.y;
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      drawHeight
    );
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

let player;
let platforms;
let genericObjects;
let gameOver = false;
let gameWin = false;

function init() {
  player = new Player();
  platforms = [
    new Platform({ x: -1, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width * 0.5 - 3.5,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width - 4, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width * 1.5 + 200,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width * 2, y: 435, image: platformImage }),
    new Platform({
      x: platformImage.width * 2.5,
      y: 435,
      image: platformImage
    }),
    //higher platform
    new Platform({
      x: platformImage.width * 2.5,
      y: 295,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 200,
      y: 435,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3.5,
      y: 435,
      image: platformImage
    }),
    new Platform({ x: platformImage.width * 4, y: 435, image: platformImage })
  ];
  genericObjects = [new GenericObject({ x: 0, y: 123, image: hillsImage })];
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
  platforms.forEach((platform) => {
    platform.draw();
  });
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
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
    if (keys.right.pressed && scrollOffset < 6002) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 3;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 3;
      });
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
  if (scrollOffset > 6000 && !gameWin) {
    gameWin = true;
    setTimeout(() => {
      init();
    }, 2000);
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
  }
}

init();
animate();

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
