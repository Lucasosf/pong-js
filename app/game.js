import Player from './player';
import Ball from './ball';

var canvas = document.getElementById("pong"),
    context = canvas.getContext("2d"),
    keyUpPressed = false,
    keyDownPressed= false,
    gameRunning = true,
    loopingInterval,
    player,
    enemy,
    ball;

function keyDown(e) {
  if (e.keyCode == 38) {
    keyUpPressed = true;
  }
  else if (e.keyCode == 40) {
    keyDownPressed = true;
  }
}

function keyUp(e) {
  if (e.keyCode == 38) {
    keyUpPressed = false;
  }
  else if (e.keyCode == 40) {
    keyDownPressed = false;
  }
}

function fullscreen(){
  var el = document.getElementById('pong');

  if(el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  }
  else {
    el.mozRequestFullScreen();
  }
}

function resetGame(message) {
  clearInterval(loopingInterval);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(message, (canvas.width / 2) - 120, (canvas.height / 2));
  setTimeout(init, 3000);
}

function init() {
  canvas.addEventListener("click", fullscreen);
  document.addEventListener('keyup', keyUp, false);
  document.addEventListener('keydown', keyDown, false);

  player = new Player({
    x: 0,
    y: (canvas.height - 90) / 2,
    width: 30,
    height: 90,
    speed: 15
  });

  enemy = new Player({
    x: canvas.width - 30,
    y: (canvas.height - 90) / 2,
    width: 30,
    height: 90
  });

  ball = new Ball({
    radius: 10,
    x: canvas.width / 2,
    y: canvas.height / 2,
    time: 0,
    speed: 8
  });

  ball.start();

  loopingInterval = setInterval(gameLoop, 30);
}

function createLine() {
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = "#000000";
  context.stroke();
  context.closePath();
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(player.x, player.y, player.width, player.height);
  context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  createLine();

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();

  ball.play();
  ball.collidedWithPlayer(player, keyUpPressed, keyDownPressed);
  ball.collidedWithEnemy(enemy);
  ball.collidedWithState(canvas.height);

  enemy.follow(ball);

  if (ball.x < 0) {
    enemy.goal();
    ball.reset();
  }

  if (ball.x > canvas.width) {
    player.goal();
    enemy.speedUp();
    ball.speedUp();
    ball.reset();
  }

  if (keyUpPressed) {
    if (player.y > 0) {
      player.goUp();
    }
  }

  if (keyDownPressed) {
    if (player.y < (canvas.height - player.height)) {
      player.goDown();
    }
  }

  context.font = "42pt Helvetica";
  context.fillStyle = "#000000";
  context.fillText(player.points + " " + enemy.points, (canvas.width / 2) - 39, 50);

  if (player.points >= 9) {
    resetGame('You won!');
  } else if (enemy.points >= 9) {
    resetGame('You lost!');
  }
}

init();
