import { checkCircleCircleCollision } from "./physics";

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 32;
        this.invulnerable = false;
        this.invulnerableFrames = 16;
        this.invulnerableTimer = 0;
    }

    update() {
        if (this.invulnerable) {
            this.invulnerableTimer++;
            if (this.invulnerableTimer > this.invulnerableFrames) {
                this.invulnerable = false;
            }
        }
    }

    draw(context, sprites) {
        if (this.invulnerable) {
            context.fillStyle = "#FFFFFF";
        }
        else {
            context.fillStyle = "#CCCCCC";
        }
        context.beginPath();
        context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 360);
        context.closePath();
        context.fill();
    }

    checkCollision(attackCollision) {
        if (checkCircleCircleCollision(attackCollision, this) && !this.invulnerable) {
            this.invulnerable = true;
            this.invulnerableTimer = 0;
        }
    }
}

export { Enemy };