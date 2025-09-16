const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Pala
const paddle = {
    width: 100,
    height: 10,
    x: canvas.width/2 - 50,
    y: canvas.height - 30,
    speed: 7,
    dx: 0
};

// Pelota
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 8,
    speed: 4,
    dx: 4,
    dy: -4
};

// Ladrillos
const brick = {
    row: 5,
    col: 8,
    width: 70,
    height: 20,
    padding: 5,
    offsetTop: 30,
    offsetLeft: 10
};
let bricks = [];

for(let r=0; r<brick.row; r++){
    bricks[r] = [];
    for(let c=0; c<brick.col; c++){
        bricks[r][c] = { x: 0, y: 0, status: 1 };
    }
}

// Dibujar pala
function drawPaddle(){
    ctx.fillStyle = 'blue';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Dibujar pelota
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Dibujar ladrillos
function drawBricks(){
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.col; c++){
            if(bricks[r][c].status){
                let brickX = c*(brick.width+brick.padding) + brick.offsetLeft;
                let brickY = r*(brick.height+brick.padding) + brick.offsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.fillStyle = 'red';
                ctx.fillRect(brickX, brickY, brick.width, brick.height);
            }
        }
    }
}

// Movimiento de la pala
function movePaddle(){
    paddle.x += paddle.dx;
    if(paddle.x < 0) paddle.x = 0;
    if(paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

// Movimiento de la pelota
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con paredes
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx *= -1;
    }
    if(ball.y - ball.radius < 0){
        ball.dy *= -1;
    }
    if(ball.y + ball.radius > canvas.height){
        alert("¡Has perdido!");
        document.location.reload();
    }

    // Colisión con la pala
    if(ball.x > paddle.x && ball.x < paddle.x + paddle.width && 
       ball.y + ball.radius > paddle.y){
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
    }

    // Colisión con ladrillos
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.col; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x > b.x && ball.x < b.x + brick.width &&
                   ball.y - ball.radius < b.y + brick.height &&
                   ball.y + ball.radius > b.y){
                    ball.dy *= -1;
                    b.status = 0;
                }
            }
        }
    }
}

// Dibujar todo
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    movePaddle();
    moveBall();
    requestAnimationFrame(draw);
}

// Controles
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') paddle.dx = paddle.speed;
    if(e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
});
document.addEventListener('keyup', e => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') paddle.dx = 0;
});

draw();
