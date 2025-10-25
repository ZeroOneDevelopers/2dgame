export class JumpController {
  constructor(player, config) {
    this.player = player;
    this.config = config;
    this.remainingJumps = config.maxJumps;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.timeSinceJumpPressed = Infinity;
  }

  update(delta) {
    if (this.player.body.blocked.down) {
      this.remainingJumps = this.config.maxJumps;
      this.coyoteTimer = this.config.coyoteTime;
    } else {
      this.coyoteTimer -= delta;
    }

    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= delta;
    }

    this.timeSinceJumpPressed += delta;
  }

  requestJump() {
    this.jumpBufferTimer = this.config.jumpBufferTime;
    this.timeSinceJumpPressed = 0;
  }

  canJump() {
    const hasJumps = this.remainingJumps > 0;
    const withinCoyote = this.coyoteTimer > 0;
    const onGround = this.player.body.blocked.down;
    const usingAirJump = this.remainingJumps < this.config.maxJumps;
    const buffered = this.jumpBufferTimer > 0;
    return hasJumps && (onGround || withinCoyote || usingAirJump) && buffered;
  }

  performJump() {
    this.player.setVelocityY(
      this.remainingJumps === this.config.maxJumps
        ? this.config.jumpVelocity
        : this.config.doubleJumpVelocity
    );
    this.remainingJumps -= 1;
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
  }

  cancelJump() {
    if (this.player.body.velocity.y < this.config.jumpVelocity / 2) {
      this.player.setVelocityY(this.config.jumpVelocity / 2);
    }
  }
}
