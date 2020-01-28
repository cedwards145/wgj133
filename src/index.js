import { setup, clearPressedKeys, isKeyDown, isKeyPressed } from "./input";

const WIDTH = 1280;
const HEIGHT = 720;

const GRAVITY_ACCELERATION = 1;
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

const player = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    radius: 15,
    velocity: 0,
    state: "walking"
};

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
    if (isKeyPressed(32)) {
        player.velocity = -20;
        player.state = "walking";
    }

    if (player.state === "walking") {
        if (isKeyDown(68)) {
            player.x += 6;
        }
        else if (isKeyDown(65)) {
            player.x -= 6;
        }

        // Gravity
        player.velocity += GRAVITY_ACCELERATION;
        player.y += player.velocity;
    }
    else if (player.state === "climbing") {
        if (isKeyDown(87)) {
            player.y -= 4;
        }
        else if (isKeyDown(83)) {
            player.y += 4;
        }
    }

    walls.forEach(function(wall) {
        if (checkCollision(player, wall)) {
            if (wall.tag === GROUND_TAG) {
                player.velocity = 0;
                player.y = (wall.y - (wall.height / 2)) - player.radius;
                if (player.state === "climbing") {
                    player.state = "walking";
                }
            }
            else if (wall.tag === WALL_TAG) {
                if (player.x > wall.x) {
                    player.x = wall.x + wall.width / 2 + player.radius;
                }
                else {
                    player.x = wall.x - wall.width / 2 - player.radius;
                }
                player.state = "climbing";
            }
        }
    });

    clearPressedKeys();
}

function draw() {
    context.fillStyle = "#333333";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw player
    context.fillStyle = "#FFFFFF";
    context.fillRect(player.x - player.radius, 
                     player.y - player.radius, 
                     player.radius * 2, 
                     player.radius * 2);
    
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
