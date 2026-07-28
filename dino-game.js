// Dino Game - Chrome Offline Style
// Complete implementation with smooth gameplay

class DinoGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameContainer = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('dinoHighScore')) || 0;
        this.gameSpeed = 6;
        this.gravity = 0.6;
        this.jumpForce = -12;
        
        // Dino properties
        this.dino = {
            x: 50,
            y: 0,
            width: 44,
            height: 47,
            velocityY: 0,
            isJumping: false,
            isDucking: false,
            frame: 0,
            frameTimer: 0
        };
        
        // Obstacles
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.minObstacleGap = 60;
        this.maxObstacleGap = 140;
        
        // Clouds
        this.clouds = [];
        this.cloudTimer = 0;
        
        // Ground
        this.groundY = 0;
        this.groundOffset = 0;
        
        // Animation
        this.animationId = null;
        this.lastTime = 0;
        
        // Touch controls
        this.touchStartY = 0;
        this.touchStartTime = 0;
    }
    
    init() {
        this.createGameButton();
        this.createGameContainer();
        this.setupEventListeners();
    }
    
    createGameButton() {
        const button = document.createElement('button');
        button.id = 'dino-game-btn';
        button.innerHTML = '🦖';
        button.title = 'Play Dino Game';
        document.body.appendChild(button);
        
        const style = document.createElement('style');
        style.textContent = `
            #dino-game-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 3px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 28px;
                cursor: pointer;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                animation: pulse 2s ease-in-out infinite;
            }
            
            #dino-game-btn:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            #dino-game-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            
            #dino-game-container.active {
                display: flex;
            }
            
            .game-wrapper {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            
            #dino-canvas {
                display: block;
                background: linear-gradient(180deg, #f7f7f7 0%, #ffffff 100%);
                border-radius: 10px;
            }
            
            .game-ui {
                position: absolute;
                top: 20px;
                right: 20px;
                font-family: 'Courier New', monospace;
                font-size: 20px;
                color: #535353;
                text-align: right;
            }
            
            .high-score {
                font-size: 14px;
                color: #acacac;
                margin-top: 5px;
            }
            
            .game-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .game-message h2 {
                font-size: 32px;
                color: #535353;
                margin-bottom: 10px;
            }
            
            .game-message p {
                font-size: 16px;
                color: #757575;
            }
            
            .close-btn {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            
            .controls-hint {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                text-align: center;
            }
            
            .controls-hint span {
                display: inline-block;
                margin: 0 10px;
                padding: 5px 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);
        
        button.addEventListener('click', () => this.toggleGame());
    }
    
    createGameContainer() {
        const container = document.createElement('div');
        container.id = 'dino-game-container';
        container.innerHTML = `
            <button class="close-btn" id="dino-close-btn">&times;</button>
            <div class="game-wrapper">
                <canvas id="dino-canvas" width="800" height="300"></canvas>
                <div class="game-ui">
                    <div id="score-display">00000</div>
                    <div class="high-score">HI ${this.formatScore(this.highScore)}</div>
                </div>
                <div class="game-message" id="game-message">
                    <h2>DINO GAME</h2>
                    <p>Press SPACE or TAP to start</p>
                </div>
            </div>
            <div class="controls-hint">
                <span>SPACE / ↑ to Jump</span>
                <span>↓ to Duck</span>
                <span>TAP on mobile</span>
            </div>
        `;
        document.body.appendChild(container);
        
        this.gameContainer = container;
        this.canvas = document.getElementById('dino-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.groundY = this.canvas.height - 30;
        
        document.getElementById('dino-close-btn').addEventListener('click', () => this.toggleGame());
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Prevent scrolling when playing
        document.addEventListener('touchmove', (e) => {
            if (this.isPlaying && this.gameContainer.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    toggleGame() {
        this.gameContainer.classList.toggle('active');
        
        if (this.gameContainer.classList.contains('active')) {
            this.resetGame();
            this.draw();
        } else {
            this.stopGame();
        }
    }
    
    handleKeyDown(e) {
        if (!this.gameContainer.classList.contains('active')) return;
        
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (!this.isPlaying && !this.gameOver) {
                this.startGame();
            } else if (this.gameOver) {
                this.resetGame();
                this.startGame();
            } else {
                this.jump();
            }
        }
        
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (this.isPlaying) {
                this.duck(true);
            }
        }
        
        if (e.code === 'KeyP') {
            e.preventDefault();
            this.togglePause();
        }
    }
    
    handleKeyUp(e) {
        if (e.code === 'ArrowDown') {
            this.duck(false);
        }
    }
    
    handleTouchStart(e) {
        if (!this.gameContainer.classList.contains('active')) return;
        e.preventDefault();
        
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
        
        if (!this.isPlaying && !this.gameOver) {
            this.startGame();
        } else if (this.gameOver) {
            this.resetGame();
            this.startGame();
        } else {
            this.jump();
        }
    }
    
    handleTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = this.touchStartY - touchEndY;
        
        // Swipe down to duck
        if (swipeDistance < -50 && touchDuration < 300) {
            this.duck(true);
            setTimeout(() => this.duck(false), 500);
        }
    }
    
    jump() {
        if (!this.dino.isJumping && !this.dino.isDucking) {
            this.dino.velocityY = this.jumpForce;
            this.dino.isJumping = true;
        }
    }
    
    duck(isDucking) {
        this.dino.isDucking = isDucking;
        if (isDucking) {
            this.dino.height = 30;
            this.dino.width = 55;
        } else {
            this.dino.height = 47;
            this.dino.width = 44;
        }
    }
    
    togglePause() {
        if (this.gameOver) return;
        this.isPaused = !this.isPaused;
        
        const message = document.getElementById('game-message');
        if (this.isPaused) {
            message.innerHTML = '<h2>PAUSED</h2><p>Press P to resume</p>';
            message.style.display = 'block';
            cancelAnimationFrame(this.animationId);
        } else {
            message.style.display = 'none';
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    startGame() {
        this.isPlaying = true;
        this.gameOver = false;
        document.getElementById('game-message').style.display = 'none';
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    stopGame() {
        this.isPlaying = false;
        this.isPaused = false;
        cancelAnimationFrame(this.animationId);
    }
    
    resetGame() {
        this.score = 0;
        this.gameSpeed = 6;
        this.obstacles = [];
        this.clouds = [];
        this.obstacleTimer = 0;
        this.gameOver = false;
        this.isPlaying = false;
        this.isPaused = false;
        
        this.dino.y = this.groundY - this.dino.height;
        this.dino.velocityY = 0;
        this.dino.isJumping = false;
        this.dino.isDucking = false;
        
        // Initialize clouds
        for (let i = 0; i < 3; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 30 + Math.random() * 50,
                width: 60 + Math.random() * 40,
                speed: 0.5 + Math.random() * 0.5
            });
        }
        
        this.updateScoreDisplay();
    }
    
    spawnObstacle() {
        const type = Math.random() > 0.5 ? 'small' : 'large';
        const obstacle = {
            x: this.canvas.width,
            y: this.groundY - (type === 'small' ? 35 : 50),
            width: type === 'small' ? 25 : 40,
            height: type === 'small' ? 35 : 50,
            type: type,
            passed: false
        };
        
        this.obstacles.push(obstacle);
    }
    
    spawnCloud() {
        this.clouds.push({
            x: this.canvas.width,
            y: 30 + Math.random() * 50,
            width: 60 + Math.random() * 40,
            speed: 0.5 + Math.random() * 0.5
        });
    }
    
    update(deltaTime) {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        // Update score
        this.score += 0.1;
        this.updateScoreDisplay();
        
        // Increase speed gradually
        if (Math.floor(this.score) % 100 === 0 && this.score > 0) {
            this.gameSpeed = Math.min(15, 6 + Math.floor(this.score / 100) * 0.5);
        }
        
        // Update dino
        this.dino.velocityY += this.gravity;
        this.dino.y += this.dino.velocityY;
        
        if (this.dino.y >= this.groundY - this.dino.height) {
            this.dino.y = this.groundY - this.dino.height;
            this.dino.velocityY = 0;
            this.dino.isJumping = false;
        }
        
        // Update dino animation frame
        this.dino.frameTimer += deltaTime;
        if (this.dino.frameTimer > 100) {
            this.dino.frame = (this.dino.frame + 1) % 2;
            this.dino.frameTimer = 0;
        }
        
        // Spawn obstacles
        this.obstacleTimer++;
        const currentGap = this.minObstacleGap + Math.random() * (this.maxObstacleGap - this.minObstacleGap);
        if (this.obstacleTimer > currentGap * (6 / this.gameSpeed)) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
        }
        
        // Spawn clouds
        this.cloudTimer++;
        if (this.cloudTimer > 200) {
            if (Math.random() > 0.7) {
                this.spawnCloud();
            }
            this.cloudTimer = 0;
        }
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
        
        // Update clouds
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            this.clouds[i].x -= this.clouds[i].speed;
            
            if (this.clouds[i].x + this.clouds[i].width < 0) {
                this.clouds.splice(i, 1);
            }
        }
        
        // Update ground
        this.groundOffset += this.gameSpeed;
        if (this.groundOffset > 20) {
            this.groundOffset = 0;
        }
        
        // Check collision
        this.checkCollision();
    }
    
    checkCollision() {
        const dinoHitbox = {
            x: this.dino.x + 5,
            y: this.dino.y + 5,
            width: this.dino.width - 10,
            height: this.dino.height - 10
        };
        
        for (const obstacle of this.obstacles) {
            const obsHitbox = {
                x: obstacle.x + 2,
                y: obstacle.y + 2,
                width: obstacle.width - 4,
                height: obstacle.height - 4
            };
            
            if (this.isColliding(dinoHitbox, obsHitbox)) {
                this.handleGameOver();
                return;
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('dinoHighScore', this.highScore);
        }
        
        const message = document.getElementById('game-message');
        message.innerHTML = `
            <h2>GAME OVER</h2>
            <p>Score: ${Math.floor(this.score)}</p>
            <p>Press SPACE or TAP to restart</p>
        `;
        message.style.display = 'block';
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#f7f7f7');
        gradient.addColorStop(1, '#ffffff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw ground
        this.drawGround();
        
        // Draw obstacles
        this.drawObstacles();
        
        // Draw dino
        this.drawDino();
    }
    
    drawDino() {
        this.ctx.save();
        
        const x = this.dino.x;
        const y = this.dino.y;
        const w = this.dino.width;
        const h = this.dino.height;
        
        // Body color
        this.ctx.fillStyle = '#535353';
        
        if (this.dino.isDucking) {
            // Ducking dino
            this.ctx.fillRect(x, y, w, h);
            // Head
            this.ctx.fillRect(x + w - 15, y - 5, 20, 15);
            // Eye
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(x + w - 10, y - 2, 4, 4);
        } else {
            // Standing/running dino
            // Body
            this.ctx.fillRect(x + 10, y + 15, 20, 20);
            // Neck
            this.ctx.fillRect(x + 15, y, 12, 20);
            // Head
            this.ctx.fillRect(x + 12, y - 5, 22, 15);
            // Snout
            this.ctx.fillRect(x + 28, y, 12, 10);
            // Eye
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(x + 25, y - 2, 5, 5);
            // Tail
            this.ctx.fillRect(x - 5, y + 18, 15, 8);
            
            // Legs (animated)
            this.ctx.fillStyle = '#535353';
            if (this.dino.isJumping) {
                // Both legs up when jumping
                this.ctx.fillRect(x + 12, y + 35, 6, 8);
                this.ctx.fillRect(x + 22, y + 35, 6, 8);
            } else if (this.dino.frame === 0) {
                // Left leg forward
                this.ctx.fillRect(x + 12, y + 35, 6, 12);
                this.ctx.fillRect(x + 22, y + 35, 6, 8);
            } else {
                // Right leg forward
                this.ctx.fillRect(x + 12, y + 35, 6, 8);
                this.ctx.fillRect(x + 22, y + 35, 6, 12);
            }
        }
        
        this.ctx.restore();
    }
    
    drawObstacles() {
        this.ctx.fillStyle = '#535353';
        
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'small') {
                // Small cactus
                this.ctx.fillRect(obstacle.x + 8, obstacle.y, 9, obstacle.height);
                this.ctx.fillRect(obstacle.x, obstacle.y + 10, 8, 6);
                this.ctx.fillRect(obstacle.x + 17, obstacle.y + 5, 8, 6);
            } else {
                // Large cactus
                this.ctx.fillRect(obstacle.x + 15, obstacle.y, 10, obstacle.height);
                this.ctx.fillRect(obstacle.x, obstacle.y + 15, 15, 8);
                this.ctx.fillRect(obstacle.x + 25, obstacle.y + 10, 15, 8);
                this.ctx.fillRect(obstacle.x + 5, obstacle.y + 25, 8, 10);
                this.ctx.fillRect(obstacle.x + 27, obstacle.y + 20, 8, 10);
            }
        }
    }
    
    drawClouds() {
        this.ctx.fillStyle = '#dcdcdc';
        
        for (const cloud of this.clouds) {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 15, cloud.y - 5, 18, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 30, cloud.y, 15, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 45, cloud.y + 5, 12, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawGround() {
        this.ctx.strokeStyle = '#535353';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        this.ctx.lineTo(this.canvas.width, this.groundY);
        this.ctx.stroke();
        
        // Ground dots
        this.ctx.fillStyle = '#535353';
        for (let i = 0; i < this.canvas.width; i += 20) {
            const x = (i - this.groundOffset) % this.canvas.width;
            if (x < 0) continue;
            this.ctx.fillRect(x, this.groundY + 10 + Math.random() * 10, 2, 2);
        }
    }
    
    updateScoreDisplay() {
        const scoreEl = document.getElementById('score-display');
        const highScoreEl = document.querySelector('.high-score');
        
        scoreEl.textContent = this.formatScore(Math.floor(this.score));
        highScoreEl.textContent = `HI ${this.formatScore(this.highScore)}`;
    }
    
    formatScore(score) {
        return score.toString().padStart(5, '0');
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DinoGame();
    game.init();
});
