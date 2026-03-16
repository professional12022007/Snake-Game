
        window.onload = function () {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const scoreElement = document.getElementById('score');

            const gridSize = 20;
            const tileCount = 20;

            let score = 0;
            let speed = 100;
            let direction = 'RIGHT';
            let nextDirection = 'RIGHT';
            let snake = [{ x: 10, y: 10 }];
            let food = { x: 5, y: 5 };
            let gameOver = false;

            document.addEventListener('keydown', changeDirection);

            function gameLoop() {
                direction = nextDirection;

                if (checkCollision()) {
                    drawGameOver();
                    return;
                }

                move();
                draw();
                setTimeout(gameLoop, speed);
            }

            function draw() {
                // Clear canvas
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw snake
                ctx.fillStyle = '#00FF00';
                snake.forEach(part => {
                    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
                });

                // Draw food
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            }

            function drawGameOver() {
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#00FF00';
                ctx.font = 'bold 32px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

                ctx.font = '18px Courier New';
                ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 15);
                ctx.fillText('Press any key to restart', canvas.width / 2, canvas.height / 2 + 45);

                gameOver = true;
            }

            function move() {
                const head = { x: snake[0].x, y: snake[0].y };

                if (direction === 'UP') head.y--;
                if (direction === 'DOWN') head.y++;
                if (direction === 'LEFT') head.x--;
                if (direction === 'RIGHT') head.x++;

                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    score++;
                    scoreElement.innerText = score;
                    placeFood();
                } else {
                    snake.pop();
                }
            }

            function changeDirection(e) {
                const key = e.key;

                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) e.preventDefault();

                // If game is over, restart on any key
                if (gameOver) {
                    resetGame();
                    return;
                }

                if (key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
                if (key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
                if (key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
                if (key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
            }

            function checkCollision() {
                const head = snake[0];
                if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) return true;
                }
                return false;
            }

            function placeFood() {
                food.x = Math.floor(Math.random() * tileCount);
                food.y = Math.floor(Math.random() * tileCount);
            }

            function resetGame() {
                score = 0;
                scoreElement.innerText = score;
                snake = [{ x: 10, y: 10 }];
                direction = 'RIGHT';
                nextDirection = 'RIGHT';
                gameOver = false;
                placeFood();
                gameLoop();
            }

            placeFood();
            gameLoop();
        };
