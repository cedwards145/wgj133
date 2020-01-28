import { isKeyPressed, isKeyDown } from "./input";

const GRAVITY_ACCELERATION = 1;
const FRAMES_PER_ANIMATION_FRAME = 8;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.velocity = 0;

        this.runSpeed = 4;
        this.climbSpeed = 4;

        this.state = "walking";
        
        this.idleAnimation = [0];
        this.runAnimation = [1, 2, 3, 0];
        this.jumpAnimation = [0];
        
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
            if (isKeyDown(68)) {
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

        this.frame = (this.frame + 1) % (this.animation.length * FRAMES_PER_ANIMATION_FRAME);
    }

    setAnimation(newAnimation) {
        if (this.animation !== newAnimation) {
            this.frame = 0;
        }
        this.animation = newAnimation;
    }

    draw(context, sprites) {
        const animationFrame = this.animation[Math.floor(this.frame / FRAMES_PER_ANIMATION_FRAME)];
        console.log(animationFrame);
        context.drawImage(sprites, animationFrame * 64, 0, 64, 64, 
                          this.x - 32, this.y - 32, 64, 64);
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