import { setup, clearPressedKeys, isKeyDown, isKeyPressed } from "./input";
import { Player } from "./player";

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

    walls.forEach(function(wall) {
        if (checkCollision(player, wall)) {
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
    context.fillStyle = "#333333";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw player
    player.draw(context, sprites);
    
    // Draw environment
    context.fillStyle = "#000000";
    walls.forEach(function(wall) {
        context.fillRect(wall.x - wall.width / 2, 
                         wall.y - wall.height / 2, 
                         wall.width, 
                         wall.height);
    });
}

function checkCollision(circle, rectangle) {
    const nearestX = Math.max(Math.min(rectangle.x + rectangle.width / 2, circle.x), rectangle.x - rectangle.width / 2);
    const nearestY = Math.max(Math.min(rectangle.y + rectangle.height / 2, circle.y), rectangle.y - rectangle.height / 2);

    return Math.sqrt(Math.pow(circle.x - nearestX, 2) + Math.pow(circle.y - nearestY, 2)) < circle.radius;
}

tick(0);
