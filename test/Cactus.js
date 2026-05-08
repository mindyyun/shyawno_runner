// Cactus represents a single obstacle sprite (now a "matt" human-figure sprite).
// The class name is kept as "Cactus" so no imports elsewhere need changing.
export default class Cactus {
  constructor(ctx, x, y, width, height, image) {
    this.ctx    = ctx;
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    this.image  = image;
  }

  // Scroll leftward at a speed proportional to the current game speed
  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // Axis-aligned bounding-box collision with a forgiveness factor (adjustBy)
  // so the boxes are slightly smaller than the visible sprites, keeping
  // collisions fair-feeling for the player.
  collideWith(sprite) {
    const adjustBy = 0.3;   // >1 means smaller boxes, more forgiveness
    if (
      sprite.x < this.x + this.width  / adjustBy &&
      sprite.x + sprite.width  / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.height + sprite.y / adjustBy > this.y
    ) {
      return true;
    }
    return false;
  }
}
