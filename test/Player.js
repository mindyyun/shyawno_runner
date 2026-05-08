export default class Player {
  // Walk animation cycles every 200 ms (matches original dino cadence)
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer   = this.WALK_ANIMATION_TIMER;
  dinoRunImages        = []; // holds shyawn.png and shyawn_run2.png

  jumpPressed    = false;
  jumpInProgress = false;
  falling        = false;
  JUMP_SPEED = 0.7;
  GRAVITY    = 0.3;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx    = ctx;
    this.canvas = ctx.canvas;
    this.width  = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio    = scaleRatio;

    // Starting X position (left edge, matching original offset)
    this.x = 10 * scaleRatio;
    // Sit on the ground (bottom of canvas minus sprite height minus tiny gap)
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    // ── Shyawn sprites ──────────────────────────────────────────────────────
    // still.png  — idle / in-air pose  (replaces standing_still.png)
    this.standingStillImage     = new Image();
    this.standingStillImage.src = "images/still.png";
    this.image = this.standingStillImage;

    // shyawn.png      — run frame 1: right leg back, left leg forward
    // shyawn_run2.png — run frame 2: legs swapped (walking animation)
    const runImg1 = new Image();
    runImg1.src   = "images/shyawn.png";

    const runImg2 = new Image();
    runImg2.src   = "images/shyawn_run2.png";

    this.dinoRunImages.push(runImg1);
    this.dinoRunImages.push(runImg2);

    // ── Input listeners ─────────────────────────────────────────────────────
    // Remove any stale listeners left over from a previous Player instance
    // (setScreen() recreates Player on resize, so duplicates can accumulate)
    window.removeEventListener("keydown",    this.keydown);
    window.removeEventListener("keyup",      this.keyup);
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend",   this.touchend);

    window.addEventListener("keydown",    this.keydown);
    window.addEventListener("keyup",      this.keyup);
    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend",   this.touchend);
  }

  // ── Touch controls ─────────────────────────────────────────────────────────
  touchstart = () => { this.jumpPressed = true;  };
  touchend   = () => { this.jumpPressed = false; };

  // ── Keyboard controls ──────────────────────────────────────────────────────
  keydown = (event) => { if (event.code === "Space") this.jumpPressed = true;  };
  keyup   = (event) => { if (event.code === "Space") this.jumpPressed = false; };

  // ── Per-frame update ───────────────────────────────────────────────────────
  update(gameSpeed, frameTimeDelta) {
    // Animate legs while on the ground
    this.run(gameSpeed, frameTimeDelta);

    // While airborne, show the static idle pose
    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(frameTimeDelta);
  }

  // ── Jump physics ───────────────────────────────────────────────────────────
  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      // Rise phase: keep going up while above minJumpHeight,
      // or above maxJumpHeight only while button is held
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true; // reached max height → start falling
      }
    } else {
      // Fall phase: apply gravity until back on the ground
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        // Clamp to ground — prevent sinking below the surface
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        // Landed
        this.falling        = false;
        this.jumpInProgress = false;
      }
    }
  }

  // ── Running animation ──────────────────────────────────────────────────────
  run(gameSpeed, frameTimeDelta) {
    // Decrement timer; when it expires, flip to the other frame
    if (this.walkAnimationTimer <= 0) {
      this.image =
        this.image === this.dinoRunImages[0]
          ? this.dinoRunImages[1]
          : this.dinoRunImages[0];
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    // Timer ticks faster as game speed increases (so legs pump faster)
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
