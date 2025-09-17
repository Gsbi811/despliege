const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración jugador
const paddleHeight = 15, paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Configuración pelota
let ballRadius = 8;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;

// Configuración bloques
const rowCount = 5;
const colCount = 10;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 35;
let bricks = [];

for (let c = 0; c < colCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Vidas y puntuación
let score = 0;
let lives = 3;

// Controles
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "ArrowLeft") leftPressed = false;
}

// Colisiones con bloques
function collisionDetection() {
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 10;
          if (score === rowCount * colCount * 10) {
            alert("¡Ganaste! Puntuación: " + score);
            document.location.reload();
          }
        }
      }
    }
  }
}

// Dibujar bloques (ahora sin colores, todos blancos)
function drawBricks() {
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.strokeStyle = "white"; // solo borde blanco
        ctx.strokeRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Puntuación: " + score, 20, 30);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Vidas: " + lives, canvas.width - 100, 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Rebotes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius - paddleHeight - 10) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      lives--;
      if (!lives) {
        alert("Game Over. Puntuación: " + score);
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 4;
        dy = -4;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx;
  y += dy;

  // Movimiento del jugador
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
  else if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;

  requestAnimationFrame(draw);
}

draw();
