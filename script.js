const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const carImeageEast = new Image();
carImeageEast.src = "./src/images/car-image-right.png";
const carImeageWest = new Image();
carImeageWest.src = "./src/images/car-image-left.png";
const carImeageNorth = new Image();
carImeageNorth.src = "./src/images/car-image-up.png";
const carImeageSouth = new Image();
carImeageSouth.src = "./src/images/car-image-down.png";
const invearionCarImeage = new Image();
invearionCarImeage.src = "./src/images/car-inversion.png";

const fireImage = new Image();
fireImage.src = "./src/images/fire.png";

const mutationCarClickCount = 1;

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const diffWidthOneSide = (window.innerWidth - canvas.width) / 2;
const diffHeightOneSide = (window.innerHeight - canvas.height) / 2;

// const player = {
//   x: canvas.width / 2,
//   y: canvas.height / 2,
//   size: 10,
//   speed: 4,
//   color: "#5cf802",
//   radii: 50,
// };

const car = {
  image: carImeageEast,
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: canvas.width * 0.01,
  size: canvas.width * 0.1,
};

const wives = [];

let clickCount = 0;

// Обработка ввода
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

canvas.addEventListener("click", (e) => {
  clickCount++;

  ctx.beginPath();
  ctx.arc(car.x, car.y, car.size / 2, 0, 2 * Math.PI);

  const x = e.clientX - diffWidthOneSide;
  const y = e.clientY - diffHeightOneSide;

  wives.push({ x, y, maxR: 50, currentR: 1 });

  if (clickCount == mutationCarClickCount) {
    if (ctx.isPointInPath(x, y)) {
      car.size += 2;
      scoreElement.innerHTML = car.size;
      update();
    }
    clickCount = 0;
  }

  //to do one change
  // if (car.size = 50) {
  //   car.image = invearionCarImeage;
  // }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

function update() {
  // Движение машинки
  if (keys.ArrowUp && car.y - car.size / 2 > 0) {
    car.y -= car.speed;
    car.image = carImeageNorth;
  } else if (keys.ArrowDown && car.y + car.size / 2 < canvas.height) {
    car.y += car.speed;
    car.image = carImeageSouth;
  } else if (keys.ArrowLeft && car.x - car.size / 2 > 0) {
    car.x -= car.speed;
    car.image = carImeageWest;
  } else if (keys.ArrowRight && car.x + car.size / 2 < canvas.width) {
    car.x += car.speed;
    car.image = carImeageEast;
  } else if (
    keys.ArrowUp ||
    keys.ArrowDown ||
    keys.ArrowLeft ||
    keys.ArrowRight
  ) {
    car.image = fireImage;
  }
}

function draw() {
  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //drow a car
  ctx.drawImage(
    car.image,
    car.x - car.size / 2,
    car.y - car.size / 2,
    car.size,
    car.size
  );

  //drow wives
  if (wives.length) {
    for (let i = wives.length - 1; i >= 0; i--) {
      const wive = wives[i];
      if (wive.currentR > wive.maxR) {
        wives.splice(i, 1);
        break;
      }
      wive.currentR += 2;

      ctx.beginPath();
      ctx.arc(wive.x, wive.y, wive.currentR, 0, 2 * Math.PI);
      ctx.strokeStyle = "#7aec08";
      ctx.stroke();
    }
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
