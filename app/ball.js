export default class Ball {
  constructor(properties) {
    this.radius = properties.radius;
    this.x = properties.x;
    this.y = properties.y;
    this.speed = properties.speed;
    this.time = properties.time;
    this.left = true;
    this.angle = 0;
    this.started = false;

    this.initial_x = properties.x;
    this.initial_y = properties.y;
  }

  start() {
    this.started = true;
  }

  play() {
    if (this.started) {
      if (this.left) {
        this.x -= this.speed;
        this.y -= this.angle;
      } else {
        this.x += this.speed;
        this.y += this.angle;
      }
    }
  }

  speedUp() {
    this.speed += 1;
  }

  collidedWithPlayer(player, keyUpPressed, keyDownPressed) {
    if (this.haveCollidedWith(player)) {
      if (keyUpPressed) {
        this.angle = this.randomNegativeAngle();
      }

      if (keyDownPressed) {
        this.angle = this.randomPositiveAngle();
      }

      this.goRight();
    }
  }

  collidedWithEnemy(enemy) {
    if (this.haveCollidedWith(enemy)) {
      this.angle = this.randomAngle();

      this.goLeft();
    }
  }

  collidedWithState(limit) {
    if (this.haveCollidedWithState(limit)) {
      this.angle = this.angle * -1;
    }
  }

  reset() {
    this.x = this.initial_x;
    this.y = this.initial_y;
    this.left = true;
    this.angle = this.randomAngle();
  }

  haveCollidedWithState(limit) {
    return (this.y - this.radius <= 0) || (this.y + this.radius > limit);
  }

  haveCollidedWith(player) {
    if (this.y >= player.y && this.y <= (player.y + player.height)) {
      return ((this.x + this.radius) >= player.x) && ((this.x - this.radius) <= (player.x + player.width));
    }
    return false;
  }

  goRight() {
    this.left = false;
  }

  goLeft() {
    this.left = true;
  }

  randomAngle() {
    return this.randomPositiveAngle() + this.randomNegativeAngle();
  }

  randomPositiveAngle() {
    return Math.floor(Math.random() * 10);
  }

  randomNegativeAngle() {
    return 0 - Math.floor(Math.random() * 10);
  }
};
