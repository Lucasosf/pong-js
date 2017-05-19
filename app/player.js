export default class Player {
  constructor(properties) {
    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width;
    this.height = properties.height;
    this.speed = properties.speed || 4;
    this.points = 0;
  }

  goUp() {
    this.y -= this.speed;
  }

  goDown() {
    this.y += this.speed;
  }

  goal() {
    this.points += 1;
  }

  speedUp() {
    this.speed += 1;
  }

  follow(target) {
    if (target.y < this.y) {
      this.goUp();
    } else if (target.y > (this.y + this.height)) {
      this.goDown();
    }
  }
};
