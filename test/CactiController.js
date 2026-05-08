import Cactus from "./Cactus.js";

// CactiController manages all on-screen obstacles (now "matt" human figures
// instead of cacti, but logic and hitboxes are identical to the original).
export default class CactiController {
  // Interval (ms) between spawning consecutive obstacles
  CACTUS_INTERVAL_MIN = 600;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;
  cacti = []; // active obstacle instances

  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx         = ctx;
    this.canvas      = ctx.canvas;
    this.cactiImages = cactiImages; // [{image, width, height}, ...]
    this.scaleRatio  = scaleRatio;
    this.speed       = speed;

    this.setNextCactusTime();
  }

  // Pick a random spawn delay within the configured range
  setNextCactusTime() {
    this.nextCactusInterval = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Spawn one randomly-chosen obstacle type off the right edge of the canvas
  createCactus() {
    const index      = this.getRandomNumber(0, this.cactiImages.length - 1);
    const cactusImage = this.cactiImages[index];

    // Start just off-screen to the right; sit on the ground line
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImage.height;

    const cactus = new Cactus(
      this.ctx,
      x, y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image
    );

    this.cacti.push(cactus);
  }

  update(gameSpeed, frameTimeDelta) {
    // Countdown to next spawn
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    // Move each obstacle leftward and remove those that have scrolled off-screen
    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });
    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
  }

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

  // Returns true if any obstacle overlaps the given sprite (e.g. the player)
  collideWith(sprite) {
    return this.cacti.some((cactus) => cactus.collideWith(sprite));
  }

  // Clear all obstacles (called on game reset)
  reset() {
    this.cacti = [];
  }
}
