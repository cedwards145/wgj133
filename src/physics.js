function checkCircleCircleCollision(circle1, circle2) {
    const distance = distanceBetweenPoints(circle1.x, circle1.y, circle2.x, circle2.y);
    return distance < circle1.radius + circle2.radius;
}

function checkCircleRectangleCollision(circle, rectangle) {
    const nearestX = Math.max(Math.min(rectangle.x + rectangle.width / 2, circle.x), rectangle.x - rectangle.width / 2);
    const nearestY = Math.max(Math.min(rectangle.y + rectangle.height / 2, circle.y), rectangle.y - rectangle.height / 2);

    return distanceBetweenPoints(circle.x, circle.y, nearestX, nearestY) < circle.radius;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export { checkCircleCircleCollision, checkCircleRectangleCollision };