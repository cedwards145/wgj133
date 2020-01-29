import { setup, clearPressedKeys, isKeyDown, isKeyPressed } from "./input";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { checkCircleRectangleCollision } from "./physics";

const WIDTH = 1280;
const HEIGHT = 720;

const GROUND_TAG = "GROUND";
const WALL_TAG = "WALL";

setup();

const canvas = document.getElementById("game");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const context = canvas.getContext("2d");

const sprites = new Image();
// Run game start once resources have loaded
sprites.onload = function() {
    tick(0);
}
sprites.src = "./sprites.png";

const player = new Player(WIDTH / 2, HEIGHT / 2);

/* Temporary stuff, move elsewhere */
const enemies = [];
enemies.push(new Enemy(800, 680));

function getEnemies() {
    return enemies;
}

let screenShakeStrength = 0;
let screenShakeDuration = 0;
let screenShakeProgress = 0;
function shakeScreen(strength, duration) {
    screenShakeStrength = strength;
    screenShakeDuration = duration;
    screenShakeProgress = 0;
}
/* Temp stuff */

const walls = [
    { x: 0, y: HEIGHT / 2, width: 30, height: HEIGHT, tag: WALL_TAG },
    { x: WIDTH, y: HEIGHT / 2, width: 30, height: HEIGHT, tag: WALL_TAG },
    { x: WIDTH / 2, y: HEIGHT, width: WIDTH, height: 30, tag: GROUND_TAG }
];

function tick(timestamp) {
    update();
    draw();
    window.requestAnimationFrame(tick);
}

function update() {
    player.update();

    enemies.forEach(function(enemy) {
        enemy.update();
    });

    walls.forEach(function(wall) {
        if (checkCircleRectangleCollision(player, wall)) {
            if (wall.tag === GROUND_TAG) {
                player.collideWithGround(wall);
            }
            else if (wall.tag === WALL_TAG) {
                player.collideWithWall(wall);
            }
        }
    });

    clearPressedKeys();
}

function draw() {
    if (screenShakeStrength > 0) {
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (screenShakeProgress < screenShakeDuration) {
            context.translate(Math.round(((Math.random() * 2) - 1) * screenShakeStrength), 
                              Math.round(((Math.random() * 2) - 1) * screenShakeStrength));
        }
        else {
            screenShakeStrength = 0;
        }

        screenShakeProgress++;
    }
    context.fillStyle = "#333333";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw player
    player.draw(context, sprites);

    enemies.forEach(function(enemy) {
        enemy.draw(context, sprites);
    });
    
    // Draw environment
    context.fillStyle = "#000000";
    walls.forEach(function(wall) {
        context.fillRect(wall.x - wall.width / 2, 
                         wall.y - wall.height / 2, 
                         wall.width, 
                         wall.height);
    });
}

tick(0);

export { getEnemies, shakeScreen };