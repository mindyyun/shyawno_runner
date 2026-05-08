// Ground renders a seamlessly looping ground strip (ground.png, 2400×24).
// Two copies are drawn back-to-back; when the first copy scrolls fully off the
// left edge, both reset so the illusion of endless ground continues.
export default class Ground {
  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx        = ctx;
    this.canvas     = ctx.canvas;
    this.width      = width;
    this.height     = height;
    this.speed      = speed;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    // Sit at the very bottom of the canvas
    this.y = this.canvas.height - this.height;

    this.groundImage     = new Image();
    this.groundImage.src = "images/ground.png"; // unchanged from original
  }

  // Scroll the ground leftward each frame
  update(gameSpeed, frameTimeDelta) {
    this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
  }

  draw() {
    // Draw two tiles side-by-side for seamless looping
    this.ctx.drawImage(this.groundImage, this.x,              this.y, this.width, this.height);
    this.ctx.drawImage(this.groundImage, this.x + this.width, this.y, this.width, this.height);

    // Once the first tile is fully off-screen, reset to start position
    if (this.x < -this.width) {
      this.x = 0;
    }
  }

  // Reset ground position (called on game reset)
  reset() {
    this.x = 0;
  }
}
