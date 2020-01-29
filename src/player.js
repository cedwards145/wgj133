import { isKeyPressed, isKeyDown } from "./input";
import { shakeScreen, getEnemies } from ".";

const GRAVITY_ACCELERATION = 1;
const FRAMES_PER_ANIMATION_FRAME = 8;
const FRAMES_PER_ROW = 8;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 32;
        this.velocity = 0;

        this.runSpeed = 4;
        this.climbSpeed = 4;

        this.state = "walking";
        this.attackEnabled = false;
        this.attackCollisionOffset = {
            x: 22,
            y: 32
        };
        this.attackCollision = {
            x: x,
            y: y,
            radius: 32
        };
        
        this.idleAnimation = [0];
        this.runAnimation = [1, 2, 3, 0];
        this.jumpAnimation = [0];
        this.attackAnimation = [8, 9, 10, 11, 12, 13, 14, 15, 16];
        
        this.frame = 0;
        this.setAnimation(this.idleAnimation);
    }

    update() {
        if (isKeyPressed(32)) {
            this.velocity = -20;
            this.state = "walking";
            this.setAnimation(this.jumpAnimation);
        }
    
        if (this.state === "walking") {
            if (isKeyPressed(69)) {
                this.state = "attacking";
                this.setAnimation(this.attackAnimation);
            }
            else if (isKeyDown(68)) {
                this.x += this.runSpeed;
                this.setAnimation(this.runAnimation);
            }
            else if (isKeyDown(65)) {
                this.x -= this.runSpeed;
                this.setAnimation(this.runAnimation);
            }
            else {
                this.setAnimation(this.idleAnimation);
            }
    
            // Gravity
            this.velocity += GRAVITY_ACCELERATION;
            this.y += this.velocity;
        }
        else if (this.state === "climbing") {
            if (isKeyDown(87)) {
                this.y -= this.climbSpeed;
                this.setAnimation(this.runAnimation);
            }
            else if (isKeyDown(83)) {
                this.y += this.climbSpeed;
                this.setAnimation(this.runAnimation);
            }
        }
        this.attackCollision.x = this.x + this.attackCollisionOffset.x;
        this.attackCollision.y = this.y + this.attackCollisionOffset.y;

        this.frame = (this.frame + 1) % (this.animation.length * FRAMES_PER_ANIMATION_FRAME);

        if (this.state === "attacking") {
            if (this.frame === 0) {
                this.state = "walking";
                this.setAnimation(this.idleAnimation);
            }
            else if (this.frame === 4 * FRAMES_PER_ANIMATION_FRAME) {
                this.attackEnabled = true;
                shakeScreen(2, FRAMES_PER_ANIMATION_FRAME * 2);
            }
            else if (this.frame === 5 * FRAMES_PER_ANIMATION_FRAME) {
                this.attackEnabled = false;
            }
        }

        if (this.attackEnabled) {
            const player = this;
            const enemies = getEnemies();
            enemies.forEach(function(enemy) {
                enemy.checkCollision(player.attackCollision);
            });
        }
    }

    setAnimation(newAnimation) {
        if (this.animation !== newAnimation) {
            this.frame = 0;
        }
        this.animation = newAnimation;
    }

    draw(context, sprites) {
        const animationFrame = this.animation[Math.floor(this.frame / FRAMES_PER_ANIMATION_FRAME)];
        const xOffset = animationFrame % FRAMES_PER_ROW;
        const yOffset = Math.floor(animationFrame / FRAMES_PER_ROW);

        context.drawImage(sprites, xOffset * 64, yOffset * 64, 64, 64, 
                          this.x - 32, this.y - 32, 64, 64);

        /* Debug view to draw collision boxes
        context.fillStyle = "#FF0000";
        context.beginPath();
        context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 360);
        context.closePath();
        context.fill();
        
        if (this.attackEnabled) {
            context.fillStyle = "#FF0000";
            context.beginPath();
            context.ellipse(this.attackCollision.x, this.attackCollision.y, this.attackCollision.radius, this.attackCollision.radius, 0, 0, 360);
            context.closePath();
            context.fill();
        }
        */
    }
    
    collideWithWall(wall) {
        if (this.x > wall.x) {
            this.x = wall.x + wall.width / 2 + this.radius;
        }
        else {
            this.x = wall.x - wall.width / 2 - this.radius;
        }
        this.state = "climbing";
    }

    collideWithGround(ground) {
        this.velocity = 0;
        this.y = (ground.y - (ground.height / 2)) - this.radius;
        if (this.state === "climbing") {
            this.state = "walking";
        }
    }
}

export { Player };