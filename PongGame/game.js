const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_GAP = 20;

// Ball settings
const BALL_SIZE = 14;
const BALL_SPEED = 5;

// Initial positions
let leftPaddle = {
    x: PADDLE_GAP,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_GAP - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 4
};

let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    speedY: BALL_SPEED * (Math.random() * 2 - 1)
};

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
    const mouseY = e.offsetY;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp paddle inside canvas
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > HEIGHT) leftPaddle.y = HEIGHT - leftPaddle.height;
});

// Draw paddles, ball, and middle line
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw middle dashed line
    ctx.strokeStyle = '#00ff99';
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw left paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

    // Draw right paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff99';
    ctx.fill();
}

// Ball and paddle movement, collisions
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + ball.size > HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.speedY *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.speedX *= -1.05; // Increase ball speed
        // Add some randomness and angle depending on where it hit the paddle
        let collidePoint = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
        collidePoint = collidePoint / (leftPaddle.height / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = ball.speedX > 0 ? 1 : -1;
        ball.speedY = BALL_SPEED * Math.sin(angle);
        ball.speedX = direction * BALL_SPEED * Math.cos(angle);
    }

    // Right paddle collision
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.speedX *= -1.05;
        let collidePoint = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
        collidePoint = collidePoint / (rightPaddle.height / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = ball.speedX > 0 ? 1 : -1;
        ball.speedY = BALL_SPEED * Math.sin(angle);
        ball.speedX = direction * BALL_SPEED * Math.cos(angle);
    }

    // Score or reset if ball goes out
    if (ball.x < 0 || ball.x + ball.size > WIDTH) {
        resetGame();
    }

    // AI for right paddle
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (paddleCenter < ball.y + ball.size / 2 - 10) {
        rightPaddle.y += rightPaddle.speed;
    } else if (paddleCenter > ball.y + ball.size / 2 + 10) {
        rightPaddle.y -= rightPaddle.speed;
    }
    // Clamp
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > HEIGHT) rightPaddle.y = HEIGHT - rightPaddle.height;
}

function resetGame() {
    // Reset ball
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.speedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED * (Math.random() * 2 - 1);
    // Reset right paddle to center
    rightPaddle.y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();