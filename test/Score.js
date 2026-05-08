// Score tracks the current run score and persists the all-time high score
// in localStorage between sessions.
export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore"; // localStorage key

  constructor(ctx, scaleRatio) {
    this.ctx        = ctx;
    this.canvas     = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // Accumulate score proportional to time alive
  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  // Reset current score (called on game restart)
  reset() {
    this.score = 0;
  }

  // Persist a new high score if the current run beats the stored one
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));

    const y        = 20 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font      = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    // Right-align current score; high score sits to the left of it
    const scoreX     = this.canvas.width - 75  * this.scaleRatio;
    const highScoreX = scoreX             - 125 * this.scaleRatio;

    // Zero-pad both values to 6 digits (matches original Chrome dino display)
    const scorePadded     = Math.floor(this.score).toString().padStart(6, "0");
    const highScorePadded = highScore.toString().padStart(6, "0");

    this.ctx.fillText(scorePadded,           scoreX,     y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}
