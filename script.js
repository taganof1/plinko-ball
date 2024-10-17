document.addEventListener('DOMContentLoaded', function() {
    const plinkoBoard = document.getElementById('plinko-board');
    const dropBallButton = document.getElementById('drop-ball');
    const boardWidth = plinkoBoard.offsetWidth;
    const boardHeight = plinkoBoard.offsetHeight;

    const pegRadius = 5; // Pegs have a radius of 5px
    const ballRadius = 7.5; // Ball has a radius of 7.5px
    const gravity = 0.5; // Simulated gravity acceleration
    const damping = 0.99; // Reduce horizontal velocity slightly to simulate friction
    let pegs = [];

    // Create pegs on the board
    function createPegs() {
        const rows = 6;
        const cols = 5;
        const spacingX = boardWidth / cols;
        const spacingY = boardHeight / rows;
        
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                let peg = document.createElement('div');
                peg.classList.add('peg');
                let pegX = j * spacingX - spacingX / 2;
                let pegY = i * spacingY - spacingY / 2;
                peg.style.left = `${pegX}px`;
                peg.style.top = `${pegY}px`;
                plinkoBoard.appendChild(peg);
                pegs.push({ x: pegX, y: pegY }); // Store peg coordinates
            }
        }
    }

    // Check for collision between the ball and a peg
    function checkCollision(ball, ballPos) {
        for (let i = 0; i < pegs.length; i++) {
            let peg = pegs[i];
            let distX = ballPos.x - peg.x;
            let distY = ballPos.y - peg.y;
            let distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < pegRadius + ballRadius) {
                return { peg, distX, distY }; // Return the peg and distances for bounce calculation
            }
        }
        return null; // No collision
    }

    // Drop ball with realistic physics
    function dropBall() {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        let ballX = boardWidth / 2 - ballRadius;
        let ballY = 0;
        ball.style.left = `${ballX}px`;
        plinkoBoard.appendChild(ball);

        let velocityY = 1; // Ball falling velocity
        let velocityX = 0; // Ball horizontal velocity

        const interval = setInterval(() => {
            // Gravity accelerates the ball downward
            velocityY += gravity;

            // Check for peg collision and adjust trajectory
            const ballPos = { x: ballX + ballRadius, y: ballY + ballRadius };
            let collision = checkCollision(ball, ballPos);
            if (collision) {
                // Determine bounce direction based on where the ball hit the peg
                if (collision.distX > 0) {
                    velocityX = Math.abs(velocityX) * 0.7; // Bounce to the right
                } else {
                    velocityX = -Math.abs(velocityX) * 0.7; // Bounce to the left
                }

                // Slightly dampen vertical velocity to simulate energy loss
                velocityY *= 0.8;
            }

            // Apply friction to horizontal velocity
            velocityX *= damping;

            // Update ball position
            ballY += velocityY;
            ballX += velocityX;

            // Keep the ball within the board's width
            if (ballX < 0) ballX = 0;
            if (ballX > boardWidth - ballRadius * 2) ballX = boardWidth - ballRadius * 2;

            // Move the ball
            ball.style.top = `${ballY}px`;
            ball.style.left = `${ballX}px`;

            // Stop the ball when it reaches the bottom
            if (ballY > boardHeight - ballRadius * 2) {
                clearInterval(interval);
            }
        }, 20);
    }

    dropBallButton.addEventListener('click', dropBall);
    createPegs();
});
