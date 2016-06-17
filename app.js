(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("ball.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
  function Ball(properties) {
    _classCallCheck(this, Ball);

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

  _createClass(Ball, [{
    key: "start",
    value: function start() {
      this.started = true;
    }
  }, {
    key: "play",
    value: function play() {
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
  }, {
    key: "speedUp",
    value: function speedUp() {
      this.speed += 1;
    }
  }, {
    key: "collidedWithPlayer",
    value: function collidedWithPlayer(player, keyUpPressed, keyDownPressed) {
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
  }, {
    key: "collidedWithEnemy",
    value: function collidedWithEnemy(enemy) {
      if (this.haveCollidedWith(enemy)) {
        this.angle = this.randomAngle();

        this.goLeft();
      }
    }
  }, {
    key: "collidedWithState",
    value: function collidedWithState(limit) {
      if (this.haveCollidedWithState(limit)) {
        this.angle = this.angle * -1;
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.x = this.initial_x;
      this.y = this.initial_y;
      this.left = true;
      this.angle = this.randomAngle();
    }
  }, {
    key: "haveCollidedWithState",
    value: function haveCollidedWithState(limit) {
      return this.y - this.radius <= 0 || this.y + this.radius > limit;
    }
  }, {
    key: "haveCollidedWith",
    value: function haveCollidedWith(player) {
      if (this.y >= player.y && this.y <= player.y + player.height) {
        return this.x + this.radius >= player.x && this.x - this.radius <= player.x + player.width;
      }
      return false;
    }
  }, {
    key: "goRight",
    value: function goRight() {
      this.left = false;
    }
  }, {
    key: "goLeft",
    value: function goLeft() {
      this.left = true;
    }
  }, {
    key: "randomAngle",
    value: function randomAngle() {
      return this.randomPositiveAngle() + this.randomNegativeAngle();
    }
  }, {
    key: "randomPositiveAngle",
    value: function randomPositiveAngle() {
      return Math.floor(Math.random() * 10);
    }
  }, {
    key: "randomNegativeAngle",
    value: function randomNegativeAngle() {
      return 0 - Math.floor(Math.random() * 10);
    }
  }]);

  return Ball;
}();

exports.default = Ball;
});

require.register("game.js", function(exports, require, module) {
'use strict';

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _ball = require('./ball');

var _ball2 = _interopRequireDefault(_ball);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById("pong"),
    context = canvas.getContext("2d"),
    keyUpPressed = false,
    keyDownPressed = false,
    gameRunning = true,
    loopingInterval,
    player,
    enemy,
    ball;

function keyDown(e) {
  if (e.keyCode == 38) {
    keyUpPressed = true;
  } else if (e.keyCode == 40) {
    keyDownPressed = true;
  }
}

function keyUp(e) {
  if (e.keyCode == 38) {
    keyUpPressed = false;
  } else if (e.keyCode == 40) {
    keyDownPressed = false;
  }
}

function fullscreen() {
  var el = document.getElementById('pong');

  if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  } else {
    el.mozRequestFullScreen();
  }
}

function resetGame(message) {
  clearInterval(loopingInterval);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(message, canvas.width / 2 - 120, canvas.height / 2);
  setTimeout(init, 3000);
}

function init() {
  canvas.addEventListener("click", fullscreen);
  document.addEventListener('keyup', keyUp, false);
  document.addEventListener('keydown', keyDown, false);

  player = new _player2.default({
    x: 0,
    y: (canvas.height - 90) / 2,
    width: 30,
    height: 90,
    speed: 15
  });

  enemy = new _player2.default({
    x: canvas.width - 30,
    y: (canvas.height - 90) / 2,
    width: 30,
    height: 90
  });

  ball = new _ball2.default({
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
    if (player.y < canvas.height - player.height) {
      player.goDown();
    }
  }

  context.font = "42pt Helvetica";
  context.fillStyle = "#000000";
  context.fillText(player.points + " " + enemy.points, canvas.width / 2 - 39, 50);

  if (player.points >= 9) {
    resetGame('You won!');
  } else if (enemy.points >= 9) {
    resetGame('You lost!');
  }
}

init();
});

require.register("initialize.js", function(exports, require, module) {
'use strict';

require('./game');

document.addEventListener('DOMContentLoaded', function () {
  console.log('Initialized app');
});
});

require.register("player.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player(properties) {
    _classCallCheck(this, Player);

    this.x = properties.x;
    this.y = properties.y;
    this.width = properties.width;
    this.height = properties.height;
    this.speed = properties.speed || 4;
    this.points = 0;
  }

  _createClass(Player, [{
    key: "goUp",
    value: function goUp() {
      this.y -= this.speed;
    }
  }, {
    key: "goDown",
    value: function goDown() {
      this.y += this.speed;
    }
  }, {
    key: "goal",
    value: function goal() {
      this.points += 1;
    }
  }, {
    key: "speedUp",
    value: function speedUp() {
      this.speed += 1;
    }
  }, {
    key: "follow",
    value: function follow(target) {
      if (target.y < this.y) {
        this.goUp();
      } else if (target.y > this.y + this.height) {
        this.goDown();
      }
    }
  }]);

  return Player;
}();

exports.default = Player;
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map