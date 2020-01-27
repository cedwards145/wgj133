import { setup, clearPressedKeys, isKeyDown } from "./input";

const WIDTH = 1280;
const HEIGHT = 720;

setup();

const canvas = document.getElementById("game");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const context = canvas.getContext("2d");

const player = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    width: 30,
    height: 30
};

const walls = [
    { x: 0, y: HEIGHT / 2, width: 30, height: HEIGHT },
    { x: WIDTH, y: HEIGHT / 2, width: 30, height: HEIGHT },
    { x: WIDTH / 2, y: HEIGHT, width: WIDTH, height: 30 }
]

function update(timestamp) {
    context.fillStyle = "#333333";
    context.fillRect(0, 0, 1280, 720);

    context.fillStyle = "#FFFFFF";
    context.fillRect(player.x - player.width / 2, 
                     player.y - player.height / 2, 
                     player.width, 
                     player.height);
    
    if (isKeyDown(68)) {
        player.x += 8;
    }
    else if (isKeyDown(65)) {
        player.x -= 8;
    }

    context.fillStyle = "#000000";
    walls.forEach(function(wall) {
        context.fillRect(wall.x - wall.width / 2, 
                         wall.y - wall.height / 2, 
                         wall.width, 
                         wall.height);
    });

    clearPressedKeys();
    window.requestAnimationFrame(update);
}

update(0);
